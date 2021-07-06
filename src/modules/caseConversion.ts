import { validateSelection, getActiveEditor, getTextFromSelection, getLinesFromSelection, getLinesFromDocumentOrSelection } from "./helpers";
import { Range } from "vscode";
import G = require("glob");

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
                    editBuilder.replace(selection, ConvertCase.toPascalCase(editor.document.getText(new Range(selection.start, selection.end))));
                    break;
                case caseConversions.camelCase:
                    editBuilder.replace(selection, ConvertCase.toCamelCase(editor.document.getText(new Range(selection.start, selection.end))));
                    break;
                case caseConversions.constantCase:
                    editBuilder.replace(selection, ConvertCase.toConstantCase(editor.document.getText(new Range(selection.start, selection.end))));
                    break;
                case caseConversions.dotCase:
                    editBuilder.replace(selection, ConvertCase.toDotCase(editor.document.getText(new Range(selection.start, selection.end))));
                    break;
                case caseConversions.headerCase:
                    editBuilder.replace(selection, cc.headerCase(editor.document.getText(line.range)));
                    break;
                case caseConversions.noCase:
                    editBuilder.replace(selection, cc.noCase(editor.document.getText(line.range)));
                    break;
                case caseConversions.paramCase:
                    editBuilder.replace(selection, cc.paramCase(editor.document.getText(line.range)));
                    break;
                case caseConversions.pathCase:
                    editBuilder.replace(selection, cc.pathCase(editor.document.getText(line.range)));
                    break;
                case caseConversions.sentenceCase:
                    editBuilder.replace(selection, cc.sentenceCase(editor.document.getText(line.range)));
                    break;
                case caseConversions.snakeCase:
                    editBuilder.replace(selection, ConvertCase.toSnakeCase(editor.document.getText(new Range(selection.start, selection.end))));
                    break;
                case caseConversions.invertCase:
                    editBuilder.replace(selection, ConvertCase.invertCase(editor.document.getText(new Range(selection.start, selection.end))));
                    break;
            }
        });
    });
}

class ConvertCase {
    static toPascalCase(text: string): string {
        // return text.replace(/[ \t]|\b(.)/g, (match, group1) => group1.toUpperCase()); // fix: the first letter should be capitalized
        const re = RegExp("[ \t]|\b(.)", "g");
        return text.replace(re, (match, group1) => group1.toUpperCase());
    }

    static toCamelCase(text: string): string {
        return text.replace(/[ \t]([^A-Z])/g, (match, group1) => `${group1.toUpperCase()}`);
    }

    static toSnakeCase(text: string): string {
        return text.replace(/.*[^ \t]/g, (match) => match.toLowerCase().split(/[ \t]/g).join("_"));
    }

    static toKebabCase(text: string): string {
        return text.replace(/.*[^ \t]/g, (match) => match.toLowerCase().split(/[ \t]/g).join("-"));
    }

    static toConstantCase(text: string): string {
        return text.replace(/.*[^ \t]/g, (match) => match.toUpperCase().split(/[ \t]/g).join("_"));
    }

    static toDotCase(text: string): string {
        return text.replace(/.*[^ \t]/g, (match) => match.toUpperCase().split(/[ \t]/g).join("."));
    }

    /**
     * Invert the case of the selected text
     * @param {string} text The text to invert
     * @return {*}  {string}
     */
    static invertCase(text: string): string {
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
}
