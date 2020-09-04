import { getDocumentText, getActiveEditor, selectAllText, getDocumentTextOrSelection, createNewEditor, sleep, getActiveSelection, getSelectionOrFullDocument } from './helpers';
import * as os from "os";
import { window } from "vscode";
import * as vscode from 'vscode';

export async function removeEmptyLines(redundandOnly: boolean) {
    let text = getDocumentText();
    if (!text) {
        return;
    }

    let o = os;
    let r;
    let rr: string;
    // /^\n{2,}/gm ==> two or more empty lines
    // /^\n+/gm    ==> any empty line
    redundandOnly ? (r = /^(\n{2,}|^(\r\n){2,})/gm) : (r = /^(\n+|\r\n+)/gm);
    // replace multiple empty lines with a single one, or with nothing
    redundandOnly ? (rr = o.EOL) : (rr = "");

    const newText = text.replace(r, rr!);

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

export async function removeDuplicateLines(resultInNewEditor: boolean) {
    let text = getDocumentTextOrSelection();
    const o = os;
    let lines = text?.split(os.EOL);
    if (!lines) { return; }

    for (const line of lines) {
        while (lines.indexOf(line) !== lines.lastIndexOf(line)) {
            lines.splice(lines.lastIndexOf(line), 1);
        }
    }
    const newText = lines.join(o.EOL).replace(o.EOL, "");

    if (resultInNewEditor) {
        createNewEditor(newText);
        return;
    }

    const editor = getActiveEditor();
    let selection = getSelectionOrFullDocument(editor!);

    editor!.edit(editBuilder => {
        editBuilder.replace(selection!, newText);
    });
}