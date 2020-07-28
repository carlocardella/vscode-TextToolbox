import { window, Range } from 'vscode';
import * as cc from 'change-case';
import * as vscode from 'vscode';
// import { ThemeIcon, TextEditor, TextDocument, language } from '../../.vscode-test/vscode-1.47.3/resources/app/out/vs/vscode';

function validateEditor() {
    const editor = window.activeTextEditor;
    if (!editor) { return; }
}

export function validateSelection() {
    validateEditor();

    const selections = window.activeTextEditor?.selections;
    if (!selections) { return; }

    if (selections?.length < 1) {
        window.showWarningMessage("You must select some text first");
        return;
    }
}

export function getSelection() {
    return window.activeTextEditor?.selections;
}

export function showMessage(message: string) {
    window.showInformationMessage(message);
}

export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

export function promiseCreateNewEditor(): Promise<vscode.TextEditor> {
    return new Promise(() => {
        vscode.workspace.openTextDocument({ content: "test document", language: "" }).then((doc) => {
            vscode.window.showTextDocument(doc, { preview: false });
        });
    });
}

// export function createNewEditor() {
//     return vscode.workspace.openTextDocument({ content: "test document", language: "" }).then((doc) => {
//         vscode.window.showTextDocument(doc, { preview: false });
//     });
// }

// export async function createNewEditor() {
//     const doc = await vscode.workspace.openTextDocument({ content: "test document", language: "" });
//     vscode.window.showTextDocument(doc, { preview: false });
// }

export function createTextEditor() {
    return vscode.workspace.openTextDocument({
        language: "plaintext"
    })
        .then(doc => vscode.window.showTextDocument(doc))
        .then(editor => {
            let editBuilder = (textEdit: { insert: (arg0: vscode.Position, arg1: string) => void; }) => {
                textEdit.insert(new vscode.Position(0, 0), "topolino pluto basettoni");
            };

            return editor.edit(editBuilder, {
                undoStopBefore: true,
                undoStopAfter: false
            })
                .then(() => editor);
        });
}

export function getFullDocumentRange(editor: vscode.TextEditor): vscode.Selection {
    if (editor.document.lineCount > 0) {
        let lineCount = editor.document.lineCount;
        return new vscode.Selection(0, 0, lineCount, editor.document.lineAt(lineCount - 1).text.length);
    }

    return new vscode.Selection(0, 0, 0, 0);
}