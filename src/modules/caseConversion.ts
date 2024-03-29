import { validateSelection, getActiveEditor } from "./helpers";
import { Range } from "vscode";
import * as os from "os";

/**
 * Case conversion types
 */
export const enum caseConversions {
    camelCase = "camelCase",
    constantCase = "constantCase",
    dotCase = "dotCase",
    headerCase = "headerCase",
    kebabCase = "kebabCase",
    pascalCase = "pascalCase",
    pathCase = "pathCase",
    sentenceCase = "sentenceCase",
    snakeCase = "snakeCase",
    invertCase = "invertCase",
    capitalCase = "capitalCase",
    // titleCase = "titleCase",
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
                    editBuilder.replace(selection, ConvertCase.toHeaderCase(editor.document.getText(new Range(selection.start, selection.end))));
                    break;
                case caseConversions.kebabCase:
                    editBuilder.replace(selection, ConvertCase.toKebabCase(editor.document.getText(new Range(selection.start, selection.end))));
                    break;
                case caseConversions.pathCase:
                    editBuilder.replace(selection, ConvertCase.toPathCase(editor.document.getText(new Range(selection.start, selection.end))));
                    break;
                case caseConversions.sentenceCase:
                    editBuilder.replace(selection, ConvertCase.toSentenceCase(editor.document.getText(new Range(selection.start, selection.end))));
                    break;
                case caseConversions.snakeCase:
                    editBuilder.replace(selection, ConvertCase.toSnakeCase(editor.document.getText(new Range(selection.start, selection.end))));
                    break;
                case caseConversions.invertCase:
                    editBuilder.replace(selection, ConvertCase.invertCase(editor.document.getText(new Range(selection.start, selection.end))));
                    break;
                case caseConversions.capitalCase:
                    editBuilder.replace(selection, ConvertCase.toCapitalCase(editor.document.getText(new Range(selection.start, selection.end))));
                    break;
                // case caseConversions.titleCase:
                //     editBuilder.replace(selection, ConvertCase.toTitleCase(editor.document.getText(new Range(selection.start, selection.end))));
                //     break;
            }
        });
    });
}

class ConvertCase {
    static toPascalCase(text: string): string {
        return text
            .replace(/(?<=[a-z])[A-Z]/gm, (match) => match.replace(match, ` ${match}`))
            .toLowerCase()
            .replace(/\b\w|[ \t]./g, (match) => match.toUpperCase())
            .split(" ")
            .join("");
    }

    static toCamelCase(text: string): string {
        return text
            .replace(/(?<=[a-z])[A-Z]/gm, (match) => match.replace(match, ` ${match}`))
            .toLowerCase()
            .replace(/[ \t]([^A-Z])/g, (match, group1) => group1.toUpperCase());
    }

    static toSnakeCase(text: string): string {
        return text
            .replace(/(?<=[a-z])[A-Z]/gm, (match) => match.replace(match, `_${match}`))
            .replace(/(?<!^)\s/gm, "_")
            .toLowerCase();
    }

    static toKebabCase(text: string): string {
        return text
            .replace(/(?<=[a-z])[A-Z]/gm, (match) => match.replace(match, `-${match}`))
            .replace(/(?<!^)\s/gm, "-")
            .toLowerCase();
    }

    static toConstantCase(text: string): string {
        return this.toSnakeCase(text).toUpperCase();
    }

    static toDotCase(text: string): string {
        // prettier-ignore
        return text
            .replace(/(?<=[a-z])[A-Z]/gm, (match) => match.replace(match, `.${match}`))
            .replace(/(?<!^)\s/gm, ".");
    }

    static toPathCase(text: string): string {
        return text
            .replace(/(?<=[a-z])[A-Z]/gm, (match) => match.replace(match, `/${match}`))
            .replace(/(?<!^)\s/gm, "/")
            .toLowerCase();
    }

    static toHeaderCase(text: string): string {
        return this.toKebabCase(text).toUpperCase();
    }

    static toSentenceCase(text: string): string {
        // return text.replace(/(\b[a-zA-Z])/g, (match, group1) => group1.toUpperCase());
        return text
            .replace(/(?<=[a-z])[A-Z]/gm, (match) => match.replace(match, ` ${match}`))
            .toLowerCase()
            .replace(/^./, (match) => match.toUpperCase());
    }

    static toCapitalCase(text: string): string {
        return text.replace(/\b\w/g, (_) => _.toUpperCase());
    }

    // static toTitleCase(text: string): string {
    //     const exclusions = ["in", "to", "and", "but", "for", "nor", "the", "a", "an", "as", "it"];
    //     const theLastWord = text.split(" ").length - 1;
    //     return text
    //         .split(" ")
    //         .map((word, index) => {
    //             if (index === theLastWord) {
    //                 return word.charAt(0).toUpperCase() + word.slice(1);
    //             } else if (exclusions.indexOf(word) > -1) {
    //                 return word.toLowerCase();
    //             } else {
    //                 return word.charAt(0).toUpperCase() + word.slice(1);
    //             }
    //         })
    //         .join(" ");
    // }

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
