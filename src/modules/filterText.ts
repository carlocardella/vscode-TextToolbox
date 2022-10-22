import { getActiveEditor, getDocumentTextOrSelection, createNewEditor, getSelection, linesToLine, getLinesFromString, getTextFromSelection } from "./helpers";
import * as os from "os";
import { window, workspace } from "vscode";

/**
 * Removes empty lines from the active document or selection; optionally removes only duplicate empty lines.
 * This function is called by the TextEditorCommands `RemoveAllEmptyLines` and `RemoveRedundantEmptyLines` and is a wrapper for `removeEmptyLinesInternal`
 * @param {boolean} redundantOnly Remove only duplicate empty lines
 * @async
 */
export async function removeEmptyLines(redundantOnly: boolean) {
    let text = getDocumentTextOrSelection();
    if (!text) {
        return;
    }

    const newText = await removeEmptyLinesInternal(text, redundantOnly);

    let editor = getActiveEditor();
    if (!editor) {
        return;
    }

    let selection = getSelection(editor);
    if (!selection) {
        return;
    }
    editor.edit((editBuilder) => {
        editBuilder.replace(selection, newText);
    });
}

/**
 * Removes empty lines from the active document or selection; optionally removes only duplicate empty lines.
 * This function is called by `removeEmptyLines` by Mocha tests
 * @param {string} text The text to remove empty lines from
 * @param {boolean} redundantOnly Removes only duplicate empty lines, or all
 * @async
 * @returns {Promise<string>}
 */
export async function removeEmptyLinesInternal(text: string, redundantOnly: boolean): Promise<string> {
    const eol = os.EOL;
    let r;
    let rr: string;
    // /^\n{2,}/gm ==> two or more empty lines
    // /^\n+/gm    ==> any empty line
    redundantOnly ? (r = /^(\n{2,}|^(\r\n){2,})/gm) : (r = /^(\n+|\r\n+)/gm);
    // replace multiple empty lines with a single one, or with nothing
    redundantOnly ? (rr = eol) : (rr = "");

    return Promise.resolve(text.replace(r, rr!));
}

/**
 * Removes duplicate lines from the active selection or document and optionally open the result in a new editor
 * @param {boolean} openInNewTextEditor Open the resulting text in a new editor
 * @async
 */
export async function removeDuplicateLines(openInNewTextEditor: boolean) {
    let text = getDocumentTextOrSelection();
    const o = os;
    let lines = text?.split(os.EOL);
    if (!lines) {
        return;
    }

    const ignoreWhitespaces = workspace.getConfiguration().get("TextToolbox.ignoreWhitespaceInLineFilters");
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
    let newText = (await linesToLine(lines)).trim();
    newText = await removeEmptyLinesInternal(newText, false);

    if (openInNewTextEditor) {
        createNewEditor(newText);
        return;
    }

    const editor = getActiveEditor();
    let selection = getSelection(editor!);

    editor!.edit((editBuilder) => {
        editBuilder.replace(selection!, newText);
    });
}

/**
 * Filter the active Selection or Document based on user's input, either regexp (default) or simple string.
 *   - `regexp` behaves like a normal regular expression, returns the result of the RegExp match.
 *   - `string` returns all lines containing    the search string, exactly how is typed.
 * The default search string type (regexp or string) can be configured using `TextToolbox.filtersUseRegularExpressions`
 * Default: regexp
 * @param {boolean} openInNewTextEditor
 * @async
 */
export async function filterLinesUsingRegExpOrString(openInNewTextEditor?: boolean) {
    let searchString = await window.showInputBox({ ignoreFocusOut: true, placeHolder: "Regular Expression or String to match" });
    if (!searchString) {
        return;
    }

    let text;
    if (workspace.getConfiguration().get("TextToolbox.filtersUseRegularExpressions")) {
        text = findLinesMatchingRegEx(searchString)!;
    } else {
        text = await findLinesMatchingString(searchString);
    }

    text!.length > 0 ? createNewEditor(await linesToLine(text!)) : window.showInformationMessage("No match found");
}

/**
 * Searches the current Selection and returns all RegExp matches
 * @param {string | undefined} searchString
 * @returns {string[] | undefined}
 */
export function findLinesMatchingRegEx(searchString: string | undefined): string[] | undefined {
    if (!searchString) {
        return;
    }

    let text: string | any = [];

    const regExpFlags = searchString.match("(?!.*/).*")![0] || undefined;
    const regExpString = searchString.match("(?<=/)(.*?)(?=/)")![0];
    const regExp = new RegExp(regExpString, regExpFlags);

    let match;
    if (!regExpFlags || regExpFlags?.indexOf("g") < 0) {
        match = regExp.exec(getDocumentTextOrSelection()!);
        if (match) {
            text.push(match[0]);
        }
    } else if (regExpFlags || regExpFlags.indexOf("g") >= 0) {
        while ((match = regExp.exec(getDocumentTextOrSelection()!))) {
            text.push(match[0]);
        }
    }

    return text;
}

/**
 * Searches the current Selection and returns all lines containing [searchString]
 * @param {string} searchString The string to search for and match
 * @returns {Promise<string[] | undefined>}
 * @async
 */
export async function findLinesMatchingString(searchString: string): Promise<string[] | undefined> {
    if (!searchString) {
        return;
    }
    let text: string[] | undefined = [];

    text = await getLinesFromString(getDocumentTextOrSelection()!);
    if (!text) {
        return;
    }
    text = text.filter((line) => line.indexOf(searchString) >= 0);

    return Promise.resolve(text);
}

/**
 * Opens the current selection(s) in a new Editor
 * @return {Promise<boolean>}
 * @async
 */
export async function openSelectionInNewEditor(): Promise<boolean> {
    const editor = getActiveEditor();
    if (!editor) {
        return Promise.reject("No active editor found");
    }

    if (editor.selection.isEmpty) {
        return false;
    }

    let selections = editor.selections;
    let text: string[] = [];
    selections.forEach((s) => {
        text.push(getTextFromSelection(editor, s)! + os.EOL);
    });

    await createNewEditor(text!.join(os.EOL));
    return Promise.resolve(true);
}
