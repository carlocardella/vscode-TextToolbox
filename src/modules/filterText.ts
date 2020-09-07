import { getDocumentText, getActiveEditor, selectAllText, getDocumentTextOrSelection, createNewEditor, sleep, getActiveSelection, getSelectionOrFullDocument, findLinesMatchingRegEx, findLinesMatchingString } from './helpers';
import * as os from "os";
import { window, workspace } from "vscode";

export async function removeEmptyLines(redundandOnly: boolean) {
    let text = getDocumentText();
    if (!text) {
        return;
    }

    const newText = await removeEmptyLinesInternal(text, redundandOnly);

    let editor = getActiveEditor();
    if (!editor) {
        return;
    }

    selectAllText().then(() => {
        let selection = editor?.selection;
        if (!selection) {
            return;
        }
        editor?.edit((editBuilder) => {
            editBuilder.replace(selection!, newText);
        });
    });
}

async function removeEmptyLinesInternal(text: string, redundandOnly: boolean): Promise<string> {
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
    let newText = lines.join(o.EOL).trim(); // TODO: convertArrayToText
    newText = await removeEmptyLinesInternal(newText, false);

    if (openInNewTextEditor) {
        createNewEditor(newText);
        return;
    }

    const editor = getActiveEditor();
    let selection = getSelectionOrFullDocument(editor!);

    editor!.edit(editBuilder => {
        editBuilder.replace(selection!, newText);
    });
}

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

    // TODO: convertArrayToText
    text!.length > 0 ? createNewEditor(text!.join(os.EOL).toString()) : window.showInformationMessage("No match found");
}
