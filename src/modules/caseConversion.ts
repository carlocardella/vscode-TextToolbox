import {
    window,
    Range,
} from "vscode";
import { validateSelection } from "./helpers";
import * as cc from 'change-case';


export function convertToUppercase() {
    validateSelection();

    const editor = window.activeTextEditor;

    let ns = editor?.selections.length.toString();
    window.showInformationMessage(`number of selections: ${ns}`);

    editor?.selections.forEach((selection) => {
        let text = editor?.document.getText(new Range(selection.start, selection.end));
        if (!text) { return; }
        editor?.edit(editorBulder => {
            editorBulder.replace(selection, text.toUpperCase());
        });
    });
};

export function convertToLowercase() {
    validateSelection();

    const editor = window.activeTextEditor;
    editor?.selections.forEach(function (selection) {
        let text = editor.document.getText(new Range(selection.start, selection.end));
        if (!text) { return; }
        editor.edit(editorBuilder => {
            editorBuilder.replace(selection, text.toLowerCase());
        });
    });
};

export function convertToPascalCase() {
    validateSelection();

    const editor = window.activeTextEditor;
    if (!editor) { return; }
    const selection = editor?.selections[0];
    if (!selection) { return; }
    let text = editor.document.getText(new Range(selection.start, selection.end));
    if (!text) { return; }
    editor?.edit(eb => {
        eb.replace(selection, cc.camelCase(text, undefined));
    });
}