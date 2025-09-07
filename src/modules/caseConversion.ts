import { validateSelection, getActiveEditor } from "./helpers";
import { Range } from "vscode";

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
        // Process each line separately to preserve line breaks
        return text.split('\n').map(line => {
            return line
                // Handle existing separators
                .replace(/[-_\s]+/g, ' ')
                .toLowerCase()
                .replace(/\b\w/g, (match) => match.toUpperCase())
                .replace(/\s+/g, "");
        }).join('\n');
    }

    static toCamelCase(text: string): string {
        // Process each line separately to preserve line breaks
        return text.split('\n').map((line, index) => {
            const pascalLine = line
                // Handle existing separators
                .replace(/[-_\s]+/g, ' ')
                .toLowerCase()
                .replace(/\b\w/g, (match) => match.toUpperCase())
                .replace(/\s+/g, "");
            
            // For camelCase, first character should be lowercase (except for first line if processing single text)
            return pascalLine.charAt(0).toLowerCase() + pascalLine.slice(1);
        }).join('\n');
    }

    static toSnakeCase(text: string): string {
        // Process each line separately to preserve line breaks
        return text.split('\n').map(line => {
            return line
                // Handle existing separators
                .replace(/[-\s]+/g, '_')
                // Handle camelCase/PascalCase
                .replace(/(?<=[a-z])[A-Z]/g, (match) => `_${match}`)
                .toLowerCase();
        }).join('\n');
    }

    static toKebabCase(text: string): string {
        // Process each line separately to preserve line breaks
        return text.split('\n').map(line => {
            return line
                // Handle existing separators
                .replace(/[_\s]+/g, '-')
                // Handle camelCase/PascalCase
                .replace(/(?<=[a-z])[A-Z]/g, (match) => `-${match}`)
                .toLowerCase();
        }).join('\n');
    }

    static toConstantCase(text: string): string {
        return this.toSnakeCase(text).toUpperCase();
    }

    static toDotCase(text: string): string {
        // Process each line separately to preserve line breaks
        return text.split('\n').map(line => {
            return line
                // Handle existing separators
                .replace(/[-_\s]+/g, '.')
                // Handle camelCase/PascalCase
                .replace(/(?<=[a-z])[A-Z]/g, (match) => `.${match}`)
                .toLowerCase();
        }).join('\n');
    }

    static toPathCase(text: string): string {
        // Process each line separately to preserve line breaks
        return text.split('\n').map(line => {
            return line
                // Handle existing separators
                .replace(/[-_\s]+/g, '/')
                // Handle camelCase/PascalCase
                .replace(/(?<=[a-z])[A-Z]/g, (match) => `/${match}`)
                .toLowerCase();
        }).join('\n');
    }

    static toHeaderCase(text: string): string {
        return this.toKebabCase(text).toUpperCase();
    }

    static toSentenceCase(text: string): string {
        // Process each line separately to preserve line breaks
        return text.split('\n').map(line => {
            return line
                // Handle existing separators - convert to spaces
                .replace(/[-_]+/g, ' ')
                // Handle camelCase/PascalCase
                .replace(/(?<=[a-z])[A-Z]/g, (match) => ` ${match}`)
                // Clean up multiple spaces
                .replace(/\s+/g, ' ')
                .toLowerCase()
                .trim()
                // Capitalize first letter
                .replace(/^./, (match) => match.toUpperCase());
        }).join('\n');
    }

    static toCapitalCase(text: string): string {
        // Process each line separately to preserve line breaks
        return text.split('\n').map(line => {
            return line.replace(/\b\w/g, (_) => _.toUpperCase());
        }).join('\n');
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
