import { window, Range, Selection } from "vscode";
import { validateSelection, getActiveEditor } from "./helpers";
import * as cc from "change-case";

/**
 * Case conversion types
 */
const enum caseConversions {
    camelCase = "camelCase",
    constantCase = "constantCase",
    dotCase = "dotCase",
    headerCase = "headerCase",
    noCase = "noCase",
    paramCase = "paramCase",
    pascalCase = "pascalCase",
    pathCase = "pathCase",
    sentenceCase = "sentenceCase",
    snakeCase = "snakeCase",
    invertCase = "invertCase",
}

export function convertToPascalCase() {
    window.activeTextEditor?.selections.forEach((element) => {
        convertSelection(element, caseConversions.pascalCase);
    });
}
export function convertToCamelCase() {
    window.activeTextEditor?.selections.forEach((element) => {
        convertSelection(element, caseConversions.camelCase);
    });
}
export function convertToConstantCase() {
    window.activeTextEditor?.selections.forEach((element) => {
        convertSelection(element, caseConversions.constantCase);
    });
}
export function convertToDotCase() {
    window.activeTextEditor?.selections.forEach((element) => {
        convertSelection(element, caseConversions.dotCase);
    });
}
export function convertToHarderCase() {
    window.activeTextEditor?.selections.forEach((element) => {
        convertSelection(element, caseConversions.headerCase);
    });
}
export function convertToNoCase() {
    window.activeTextEditor?.selections.forEach((element) => {
        convertSelection(element, caseConversions.noCase);
    });
}
export function convertToParamCase() {
    window.activeTextEditor?.selections.forEach((element) => {
        convertSelection(element, caseConversions.paramCase);
    });
}
export function convertToPathCase() {
    window.activeTextEditor?.selections.forEach((element) => {
        convertSelection(element, caseConversions.pathCase);
    });
}
export function convertToSentenceCase() {
    window.activeTextEditor?.selections.forEach((element) => {
        convertSelection(element, caseConversions.sentenceCase);
    });
}
export function convertToSnakeCase() {
    window.activeTextEditor?.selections.forEach((element) => {
        convertSelection(element, caseConversions.snakeCase);
    });
}
export function invertCase() {
    window.activeTextEditor?.selections.forEach((element) => {
        convertSelection(element, caseConversions.invertCase);
    });
}

/**
 * Converts the active selection according to the selected type
 * @param {Selection} text The text selection to convert
 * @param {caseConversions} conversion The type of case conversion to perform on the active selection
 */
function convertSelection(text: Selection, conversion: caseConversions) {
    validateSelection();

    const editor = getActiveEditor();
    editor?.edit((editBuilder) => {
        let range = new Range(text?.start, text?.end);
        switch (conversion) {
            case caseConversions.pascalCase:
                editBuilder.replace(text, cc.pascalCase(editor.document.getText(range)));
                break;
            case caseConversions.camelCase:
                editBuilder.replace(text, cc.camelCase(editor.document.getText(range)));
                break;
            case caseConversions.constantCase:
                editBuilder.replace(text, cc.constantCase(editor.document.getText(range)));
                break;
            case caseConversions.dotCase:
                editBuilder.replace(text, cc.dotCase(editor.document.getText(range)));
                break;
            case caseConversions.headerCase:
                editBuilder.replace(text, cc.headerCase(editor.document.getText(range)));
                break;
            case caseConversions.noCase:
                editBuilder.replace(text, cc.noCase(editor.document.getText(range)));
                break;
            case caseConversions.paramCase:
                editBuilder.replace(text, cc.paramCase(editor.document.getText(range)));
                break;
            case caseConversions.pathCase:
                editBuilder.replace(text, cc.pathCase(editor.document.getText(range)));
                break;
            case caseConversions.sentenceCase:
                editBuilder.replace(text, cc.sentenceCase(editor.document.getText(range)));
                break;
            case caseConversions.snakeCase:
                editBuilder.replace(text, cc.snakeCase(editor.document.getText(range)));
                break;
            case caseConversions.invertCase:
                editBuilder.replace(text, invertCaseInternal(editor.document.getText(range)));
                break;
        }
    });
}

/**
 * Invert the case of the selected text
 * @param {string} text The text to invert
 * @return {*}  {string}
 */
export function invertCaseInternal(text: string): string {
    return text
        .split("")
        .map((value) => {
            let char = value;
            if (value === value.toUpperCase()) {
                char = value.toLowerCase();
            } else if (value === value.toLowerCase()) {
                char = value.toUpperCase();
            }
            return char;
        })
        .join("");
}
