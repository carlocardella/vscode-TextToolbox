import { v4 } from "node-uuid";
import * as Helpers from './helpers';
import * as vscode from 'vscode';

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
    let guid = v4();
    let op = insertText(guid);

    if (op) {
        return Promise.resolve(true);
    } else {
        return Promise.resolve(false);
    }
}