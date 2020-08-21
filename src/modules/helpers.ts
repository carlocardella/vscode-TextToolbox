import * as vscode from 'vscode';

function validateEditor() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }
}

export function validateSelection() {
    validateEditor();

    const selections = vscode.window.activeTextEditor?.selections;
    if (!selections) { return; }

    if (selections?.length < 1) {
        vscode.window.showWarningMessage("You must select some text first");
        return;
    }
}

export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

export function selectAllText() {
    vscode.window.activeTextEditor?.document.getText();
}

export function getDocumentText(): String | undefined {
    return vscode.window.activeTextEditor?.document.getText();
}

// used for tests
export async function createTextEditor(): Promise<vscode.TextEditor> {
    const doc = await vscode.workspace.openTextDocument({ language: "plaintext", content: "test document" });
    const editor = await vscode.window.showTextDocument(doc);
    return Promise.resolve(editor);
}

// used for tests
export function createNewEditor(): PromiseLike<vscode.TextEditor> {
    return new Promise((resolve, reject) => {
        vscode.workspace.openTextDocument({ content: "test document", language: "plaintext", preview: false } as any).then(
            (doc) => {
                resolve(vscode.window.showTextDocument(doc));
            },
            (err) => reject(err)
        );
    });
}
