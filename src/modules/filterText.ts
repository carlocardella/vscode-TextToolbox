import { getActiveEditor, getDocumentTextOrSelection, createNewEditor, getSelection, findLinesMatchingRegEx, findLinesMatchingString, linesArrayToLine } from './helpers';
import * as os from "os";
import { window, workspace } from "vscode";


/**
 * Removes empty lines from the active document or selection; optionally removes only duplicate empty lines.
 * This function is called by the TextEditorCommands `RemoveAllEmptyLines` and `RemoveRedundantEmptyLines` and is a wrapper for `removeEmptyLinesInternal`
 * @param {boolean} redundandOnly Remove only duplicate empty lines
 * @async
 */
export async function removeEmptyLines(redundandOnly: boolean) {
    let text = getDocumentTextOrSelection();
    if (!text) {
        return;
    }

    const newText = await removeEmptyLinesInternal(text, redundandOnly);

    let editor = getActiveEditor();
    if (!editor) {
        return;
    }

    let selection = getSelection(editor);
    if (!selection) { return; }
    editor.edit((editBuilder) => {
        editBuilder.replace(selection, newText);
    });
}

/**
 * Removes empty lines from the active document or selection; optionally removes only duplicate empty lines.
 * This function is called by `removeEmptyLines` by Mocha tests
 * @param {string} text
 * @param {boolean} redundandOnly
 * @async
 * @returns {Promise<string>}
 */
export async function removeEmptyLinesInternal(text: string, redundandOnly: boolean): Promise<string> {
    const eol = os.EOL;
    let r;
    let rr: string;
    // /^\n{2,}/gm ==> two or more empty lines
    // /^\n+/gm    ==> any empty line
    redundandOnly ? (r = /^(\n{2,}|^(\r\n){2,})/gm) : (r = /^(\n+|\r\n+)/gm);
    // replace multiple empty lines with a single one, or with nothing
    redundandOnly ? (rr = eol) : (rr = "");

    return Promise.resolve(text.replace(r, rr!));
}

/**
 * Removes duplicate lines from the active selection or document and optionally open the resul in a new editor
 * @param {boolean} openInNewTextEditor Open the resulting text in a new editor
 * @async
 */
export async function removeDuplicateLines(openInNewTextEditor: boolean) {
    let text = getDocumentTextOrSelection();
    const o = os;
    let lines = text?.split(os.EOL);
    if (!lines) { return; }

    const ignoreWhitespaces = workspace.getConfiguration().get("tt.ignoreWhitespaceInLineFilters");
    if (ignoreWhitespaces) {
        for (let i = 0; i < lines.length - 1; i++) {
            lines[i] = lines[i].trim();
        }
    }

    for (const line of lines) {
        while (lines.indexOf(line) !== lines.lastIndexOf(line)) {
            lines.splice(lines.lastIndexOf(line), 1);
        }
    }
    let newText = (await linesArrayToLine(lines)).trim();
    newText = await removeEmptyLinesInternal(newText, false);

    if (openInNewTextEditor) {
        createNewEditor(newText);
        return;
    }

    const editor = getActiveEditor();
    let selection = getSelection(editor!);

    editor!.edit(editBuilder => {
        editBuilder.replace(selection!, newText);
    });
}

/**
 * Filter the active Selection or Document based on user's input, either regexp (default) or simple string.
 *   - `regexp` behaves like a normal regual expression, returns the result of the RegExp match.
 *   - `string` returns all lines containing the search string, exactly how is typed.
 * The default search string type (regexp or string) can be configured using `tt.filtersUseRegularExpressions`
 * Default: regexp
 * @param {boolean} openInNewTextEditor
 * @async
 */
export async function filterLinesUsingRegExpOrString(openInNewTextEditor?: boolean) {
    let searchString = await window.showInputBox({ ignoreFocusOut: true, placeHolder: "Regular Expression or String to match" });
    if (!searchString) { return; }

    let text;
    if (workspace.getConfiguration().get("tt.filtersUseRegularExpressions")) {
        text = findLinesMatchingRegEx(searchString)!;
    }
    else {
        text = findLinesMatchingString(searchString);
    }

    text!.length > 0 ? createNewEditor(await linesArrayToLine(text!)) : window.showInformationMessage("No match found");
}
