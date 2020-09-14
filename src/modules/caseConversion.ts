import { window, Range, Selection } from "vscode";
import { validateSelection } from "./helpers";
import * as cc from 'change-case';


/**
 * Case conversion types
 */
const enum caseConversions {
    upperCase = 1,
    lowerCase = 2,
    camelCase = 3,
    capitalCase = 4,
    constantCase = 5,
    dotCase = 6,
    headerCase = 7,
    noCase = 8,
    paramCase = 9,
    pascalCase = 10,
    pathCase = 11,
    sentenceCase = 12,
    snakeCase = 13
}

export function convertToPascalCase() { window.activeTextEditor?.selections.forEach(element => { convertSelection(element, caseConversions.pascalCase); }); }
export function convertToCapitalCase() { window.activeTextEditor?.selections.forEach(element => { convertSelection(element, caseConversions.capitalCase); }); }
export function convertToCamelCase() { window.activeTextEditor?.selections.forEach(element => { convertSelection(element, caseConversions.camelCase); }); }
export function convertToConstantCase() { window.activeTextEditor?.selections.forEach(element => { convertSelection(element, caseConversions.constantCase); }); }
export function convertToDotCase() { window.activeTextEditor?.selections.forEach(element => { convertSelection(element, caseConversions.dotCase); }); }
export function convertToHarderCase() { window.activeTextEditor?.selections.forEach(element => { convertSelection(element, caseConversions.headerCase); }); }
export function convertToNoCase() { window.activeTextEditor?.selections.forEach(element => { convertSelection(element, caseConversions.noCase); }); }
export function convertToParamCase() { window.activeTextEditor?.selections.forEach(element => { convertSelection(element, caseConversions.paramCase); }); }
export function convertToPathCase() { window.activeTextEditor?.selections.forEach(element => { convertSelection(element, caseConversions.pathCase); }); }
export function convertToSentenceCase() { window.activeTextEditor?.selections.forEach(element => { convertSelection(element, caseConversions.sentenceCase); }); }
export function convertToSnakeCase() { window.activeTextEditor?.selections.forEach(element => { convertSelection(element, caseConversions.snakeCase); }); }

/**
 * Convert the current selection to uppercase
 */
export function convertToUppercase() {
    validateSelection();

    const editor = window.activeTextEditor;
    editor?.edit(editBuilder => {
        editor.selections.forEach(selection => {
            let text = editor.document.getText(new Range(selection.start, selection.end));
            editBuilder.replace(selection, text.toUpperCase());
        });
    });
};

/**
 * Convert the current selection to lowercase
 */
export function convertToLowercase() {
    validateSelection();

    const editor = window.activeTextEditor;
    editor?.edit(editBuilder => {
        editor.selections.forEach(selection => {
            let text = editor.document.getText(new Range(selection.start, selection.end));
            editBuilder.replace(selection, text.toLowerCase());
        });
    });
};

/**
 * Converts the active selection according to the selected type
 * @param {Selection} text The text selection to convert
 * @param {caseConversions} conversion The type of case conversion to perform on the active selection
 */
function convertSelection(text: Selection, conversion: caseConversions) {
    validateSelection();

    const editor = window.activeTextEditor;
    editor?.edit(editBuilder => {
        let range = new Range(text?.start, text?.end);
        switch (conversion) {
            case caseConversions.capitalCase:
                editBuilder.replace(text, cc.capitalCase(editor.document.getText(range)));
                break;
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
        }
    });
}