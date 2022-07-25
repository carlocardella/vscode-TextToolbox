import { window } from "vscode";
import { getActiveEditor, getLinesFromDocumentOrSelection, getTextFromSelection, createNewEditor } from "./helpers";
import * as os from "os";
import * as path from "path";

/**
 * Trim whitespaces from the active selection(s) or from the entire document
 * @return {*}  {(Promise<boolean | undefined>)}
 */
export async function trimLineOrSelection(): Promise<boolean | undefined> {
    const editor = getActiveEditor();
    if (!editor) {
        return;
    }

    const textLines = getLinesFromDocumentOrSelection(editor);

    editor.edit((eb) => {
        textLines?.forEach((textLine) => {
            eb.replace(textLine.range, textLine.text.trim());
        });
    });

    return Promise.resolve(true);
}

/**
 * Split the selection using the passed in delimiter
 * @return {*}
 */
export async function splitSelection(openInNewEditor: boolean) {
    const delimiter = await window.showInputBox({ prompt: "delimiter" });
    if (!delimiter) {
        return;
    }

    splitSelectionInternal(delimiter, openInNewEditor);
}

/**
 * Split the selection using the passed in delimiter
 * @param {string} delimiter Delimiter to use to split the selection
 * @return {*}  {Promise<boolean>}
 */
export async function splitSelectionInternal(delimiter: string, openInNewEditor: boolean): Promise<boolean> {
    const editor = getActiveEditor();
    if (!editor) {
        return Promise.resolve(false);
    }

    if (editor.selection.isEmpty) {
        return Promise.resolve(false);
    }

    if (openInNewEditor) {
        let newEditorText: string = "";

        editor.selections.forEach((s) => {
            newEditorText += getTextFromSelection(editor, s)?.split(delimiter).join(os.EOL) + os.EOL;
        });

        await createNewEditor(newEditorText);
    } else {
        editor.edit((editBuilder) => {
            editor.selections.forEach((s) => {
                editBuilder.replace(s, getTextFromSelection(editor, s)?.split(delimiter).join(os.EOL)!);
            });
        });
    }

    return Promise.resolve(true);
}

/**
 * Enumerates Platform path types
 * @enum {number}
 */
export enum pathTransformationType {
    "posix" = "posix",
    "win32" = "win32",
    "darwin" = "darwin",
}

/**
 * Transforms the selected path string to the chosen platform type target
 * @param {pathTransformationType} type Enum the Platform types to transform the path to
 * @return {*}  {(Promise<string | undefined>)}
 */
export async function transformPath(type: pathTransformationType): Promise<string | undefined> {
    const editor = getActiveEditor();
    if (!editor) {
        return Promise.reject();
    }

    const selection = editor.selection;
    if (!selection) {
        return Promise.reject();
    }

    let pathString = getTextFromSelection(editor, selection);

    switch (type) {
        case pathTransformationType.posix:
            pathString = path.posix.normalize(pathString!).replace(/\\+/g, "/");
            break;

        case pathTransformationType.darwin:
            pathString = path.posix.normalize(pathString!).replace(/\\+/g, "/");
            break;

        case pathTransformationType.win32:
            // if this is a json document, use double backslashes
            if (editor.document.languageId === "json" || editor.document.languageId === "jsonc") {
                pathString = path.posix.normalize(pathString!).replace(/\/+/g, "\\\\");
            } else {
                pathString = path.posix.normalize(pathString!).replace(/\/+/g, "\\");
            }

            break;

        default:
            break;
    }

    editor.edit((editBuilder) => {
        editBuilder.replace(selection, pathString!);
    });
}

/**
 * Convert an integer to its hexadecimal representation
 *
 * @export
 * @param {number} n The integer to convert
 * @returns {(string | undefined)}
 */
export function convertDecimalToHexadecimal(n: number): string | undefined {
    if (Number.isInteger(n)) {
        return n.toString(16);
    }
}

/**
 * Convert an hexadecimal number to its decimal representation
 *
 * @export
 * @param {string} hex The hexadecimal number to convert
 * @returns {(number | undefined)}
 */
export function convertHexadecimalToDecimal(hex: string): number | undefined {
    return parseInt(hex, 16);
}

export function convertHexDec(conversionType: hexConversionType) {
    const editor = getActiveEditor();
    if (!editor) {
        return;
    }

    const selection = editor.selection;
    if (!selection) {
        return;
    }

    const selectionText = getTextFromSelection(editor, selection);
    if (!selectionText) {
        return;
    }

    let newText: string | number | undefined;

    if (conversionType === hexConversionType.decToHex) {
        newText = convertDecimalToHexadecimal(+selectionText);
    }

    if (conversionType === hexConversionType.hexToDec) {
        newText = convertHexadecimalToDecimal(selectionText);
    }

    if (newText) {
        editor.edit((editBuilder) => {
            editBuilder.replace(selection, newText!.toString());
        });
    }
}

export enum hexConversionType {
    "decToHex" = "decToHex",
    "hexToDec" = "hexToDec"
}