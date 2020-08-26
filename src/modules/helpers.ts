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

export function selectAllText(): Thenable<unknown> {
    return vscode.commands.executeCommand('editor.action.selectAll');
}

export function getDocumentText(): String | undefined {
    return vscode.window.activeTextEditor?.document.getText();
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

// used for tests
export function createNewEmptyEditor(): PromiseLike<vscode.TextEditor> {
    return new Promise((resolve, reject) => {
        vscode.workspace.openTextDocument({ language: "plaintext", preview: false } as any).then(
            (doc) => {
                resolve(vscode.window.showTextDocument(doc));
            },
            (err) => reject(err)
        );
    });
}

// close active text editor in tests
export function closeTextEditor() {
    vscode.commands.executeCommand('workbench.action.closeActiveEditor');
}

export function prependZeroes(n: number) {
    if (n <= 9) { return '0' + n; }
    return n;
}