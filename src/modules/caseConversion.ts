import {
    window,
    Range
} from "vscode";
import { validateEditor, validateSelection } from "./modules/helpers";

export enum CaseConversion {
    convertToUppercase
}

export function convertToUppercase() {
    // const editor = window.activeTextEditor;
    // if (!editor) { return; }

    // if (editor.selections.length < 1) {
    //     window.showWarningMessage("You must select some text first");
    //     return;
    // }

    validateSelection();

    const editor = window.activeTextEditor();
    editor.selections.forEach(function (selection) {
        let text = editor?.document.getText(new Range(selection?.start, selection?.end));
        if (!text) { return; }
        editor?.edit(editorBuilder => {
            editorBuilder.replace(selection, text.toUpperCase());
        });
    });
};

export function convertToLowercase() {
    // const editor = window.activeTextEditor;
    // if (!editor) { return; }

    // if (editor.selections.length < 1) {
    //     window.showWarningMessage("You must select some text first");
    //     return;
    // }

    validateSelection();

    const editor = window.activeTextEditor();
    editor.selections.forEach(function (selection) {
        let text = editor.document.getText(new Range(selection.start, selection.end));
        if (!text) { return; }
        editor.edit(editorBuilder => {
            editorBuilder.replace(selection, text.toLowerCase());
        });
    });
};