import * as Helpers from './helpers';
import * as vscode from 'vscode';
import * as guid from 'guid';

function insertText(text: string): Promise<boolean> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return Promise.reject(false); }

    const position = vscode.window.activeTextEditor?.selection.active;
    if (!position) { return Promise.reject(false); }

    editor.edit(editBuilder => {
        editBuilder.insert(position, text);
    });

    return Promise.resolve(true);
}

export function insertGUID(): Promise<boolean> {
    let newGuid = guid.raw();
    let op = insertText(newGuid);

    if (op) {
        return Promise.resolve(true);
    } else {
        return Promise.resolve(false);
    }
}