import { validateSelection, getActiveEditor, getTextFromSelection } from "./helpers";
import * as cc from "change-case";

/**
 * Case conversion types
 */
export const enum caseConversions {
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

/**
 * Converts the active selection according to the selected type
 * @param {caseConversions} conversion The type of case conversion to perform on the active selection
 */
export function convertSelection(conversion: caseConversions) {
    validateSelection();

    const editor = getActiveEditor();
    editor?.edit((editBuilder) => {
        editor.selections.forEach((selection) => {
            switch (conversion) {
                case caseConversions.pascalCase:
                    editBuilder.replace(selection, cc.pascalCase(getTextFromSelection(editor, selection)!));
                    break;
                case caseConversions.camelCase:
                    editBuilder.replace(selection, cc.camelCase(getTextFromSelection(editor, selection)!));
                    break;
                case caseConversions.constantCase:
                    editBuilder.replace(selection, cc.constantCase(getTextFromSelection(editor, selection)!));
                    break;
                case caseConversions.dotCase:
                    editBuilder.replace(selection, cc.dotCase(getTextFromSelection(editor, selection)!));
                    break;
                case caseConversions.headerCase:
                    editBuilder.replace(selection, cc.headerCase(getTextFromSelection(editor, selection)!));
                    break;
                case caseConversions.noCase:
                    editBuilder.replace(selection, cc.noCase(getTextFromSelection(editor, selection)!));
                    break;
                case caseConversions.paramCase:
                    editBuilder.replace(selection, cc.paramCase(getTextFromSelection(editor, selection)!));
                    break;
                case caseConversions.pathCase:
                    editBuilder.replace(selection, cc.pathCase(getTextFromSelection(editor, selection)!));
                    break;
                case caseConversions.sentenceCase:
                    editBuilder.replace(selection, cc.sentenceCase(getTextFromSelection(editor, selection)!));
                    break;
                case caseConversions.snakeCase:
                    editBuilder.replace(selection, cc.snakeCase(getTextFromSelection(editor, selection)!));
                    break;
                case caseConversions.invertCase:
                    editBuilder.replace(selection, invertCaseInternal(getTextFromSelection(editor, selection)!));
                    break;
            }
        });
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
