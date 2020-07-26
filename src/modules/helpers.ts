import { window } from 'vscode';

function validateEditor() {
    const editor = window.activeTextEditor;
    if (!editor) { return; }
};

export function validateSelection() {
    validateEditor();

    const selections = window.activeTextEditor?.selections;
    if (!selections) { return; }

    if (selections?.length < 0) {
        window.showWarningMessage("You must select some text first");
        return;
    }
};