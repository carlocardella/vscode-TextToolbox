import { Selection, TextEditor, window, TextLine } from "vscode";
import {
    getActiveEditor,
    getLinesFromDocumentOrSelection,
    getTextFromSelection,
    createNewEditor,
    getDocumentEOL,
    isNumber,
    incrementString,
    toRoman,
} from "./helpers";
import * as path from "path";
import jwt_decode from "jwt-decode";
import { caseOptions } from './helpers';

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

    const eol = getDocumentEOL(getActiveEditor());

    if (openInNewEditor) {
        let newEditorText: string = "";

        editor.selections.forEach((s) => {
            newEditorText += getTextFromSelection(editor, s)?.split(delimiter).join(eol) + eol;
        });

        await createNewEditor(newEditorText);
    } else {
        editor.edit((editBuilder) => {
            editor.selections.forEach((s) => {
                editBuilder.replace(s, getTextFromSelection(editor, s)?.split(delimiter).join(eol)!);
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

/**
 * Conversion type
 *
 * @export
 * @enum {number}
 */
export enum conversionType {
    "toBase64" = "toBase64",
    "fromBase64" = "fromBase64",
    "toHTML" = "toHTML",
    "fromHTML" = "fromHTML",
    "decToHex" = "decToHex",
    "hexToDec" = "hexToDec",
    "encodeUri" = "encodeUri",
    "decodeUri" = "decodeUri",
    "JWTDecode" = "JWTDecode",
}

/**
 * Convert the selected text to Base64
 *
 * @export
 * @async
 * @param {conversionType} conversion Conversion Type: toBase64 or fromBase64
 * @returns {*}
 */
export async function convertSelection(conversion: conversionType) {
    const editor = getActiveEditor();
    if (!editor) {
        return;
    }

    const selections: any = editor.selections;
    if (!selections) {
        return;
    }

    await convertSelectionInternal(editor, selections, conversion);
}

/**
 * Convert the selected text to Base64 ro ASCII
 *
 * @export
 * @async
 * @param {TextEditor} editor The editor to convert the selection in
 * @param {Selection} selection The Selection to convert
 * @param {conversionType} conversion Conversion Type: toBase64 or fromBase64
 * @returns {(Promise<string | undefined>)}
 */
export async function convertSelectionInternal(editor: TextEditor, selection: Selection[], conversion: conversionType): Promise<string | undefined> {
    if (!editor) {
        return Promise.reject();
    }

    editor.edit((editBuilder) => {
        selection.forEach((s) => {
            let textSelection = getTextFromSelection(editor, s);
            if (!textSelection) {
                return;
            }
            let convertedText: string | number | undefined;

            switch (conversion) {
                case conversionType.toBase64:
                    convertedText = convertToBase64(textSelection);
                    break;
                case conversionType.fromBase64:
                    convertedText = convertFromBase64(textSelection);
                    break;
                case conversionType.toHTML:
                    convertedText = convertToHTML(textSelection);
                    break;
                case conversionType.fromHTML:
                    convertedText = convertFromHTML(textSelection);
                    break;
                case conversionType.decToHex:
                    convertedText = convertDecimalToHexadecimal(+textSelection);
                    break;
                case conversionType.hexToDec:
                    convertedText = convertHexadecimalToDecimal(<string>textSelection);
                    break;
                case conversionType.encodeUri:
                    convertedText = encodeUri(textSelection);
                    break;
                case conversionType.decodeUri:
                    convertedText = decodeUri(textSelection);
                    break;
                case conversionType.JWTDecode:
                    convertedText = decodeJWTToken(textSelection);
                    break;

                default:
                    break;
            }

            if (convertedText) {
                editBuilder.replace(s, convertedText!.toString());
            }
        });
    });
}

export function convertToBase64(text: string): string {
    return Buffer.from(text, "binary").toString("base64");
}
export function convertFromBase64(text: string): string {
    return Buffer.from(text, "base64").toString("binary");
}

export function convertToHTML(text: string): string {
    return text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function convertFromHTML(text: string): string {
    return text
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&");
}

export function encodeUri(text: string): string {
    return encodeURIComponent(text);
}

export function decodeUri(text: string): string {
    return decodeURIComponent(text);
}

export function decodeJWTToken(token: string): string {
    let decodedToken: jwtToken = {
        token: token,
        header: {
            ...jwt_decode(token, { header: true }),
        },
        payload: {
            ...jwt_decode(token),
        },
    };

    return JSON.stringify(decodedToken, null, 4);
}

type jwtToken = {
    token: string;
    header: {
        alg: string;
        typ: string;
    };
    payload: {
        [key: string]: string;
    };
};

export enum orderedListTypes {
    "1. " = "Number.",
    "1) " = "Number)",
    "a. " = "lowercase.",
    "a) " = "lowercase)",
    "A. " = "Uppercase.",
    "A) " = "Uppercase)",
    "i. " = "Roman lowercase.",
    "i) " = "Roman lowercase)",
    "I. " = "Roman UPPERCASE.",
    "I) " = "Roman UPPERCASE)",
}

export async function transformToOrderedList() {
    const editor = getActiveEditor();
    if (!editor) {
        return;
    }

    let pick: string | undefined;
    await new Promise((resolve) => {
        let quickPick = window.createQuickPick();
        quickPick.onDidHide(() => quickPick.dispose());
        quickPick.title = "Select the list type";
        quickPick.canSelectMany = false;
        quickPick.matchOnDescription = true;

        const enumAsKeyValue = Object.entries(orderedListTypes).reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {} as { [key: string]: string });
        quickPick.items = Object.keys(enumAsKeyValue).map((listItem) => {
            return { label: listItem, description: enumAsKeyValue[listItem] };
        });
        quickPick.title = "Select the list type";
        quickPick.show();

        quickPick.onDidChangeSelection(async (selection) => {
            pick = selection[0].label;
        });

        quickPick.onDidAccept(async () => {
            if (pick) {
                quickPick.hide();
                resolve(pick);
            }
        });
    });
    if (!pick) {
        return;
    }

    const selections = editor.selections;
    let lines: TextLine[] = [];
    if (selections.every((selection) => selection.isEmpty)) {
        // multi-cursor, no text selected
        selections.forEach((selection) => {
            lines!.push(editor.document.lineAt(selection.start.line));
        });
    } else {
        lines = selections.map((selection) => getLinesFromDocumentOrSelection(editor, selection)!).flat();
    }

    let [index, separator] = [pick[0], `${pick[1]}${pick[2]}`];

    // handles 1. and 1)
    if (isNumber(index)) {
        editor.edit((editBuilder) => {
            let i = parseInt(index);
            lines!.forEach((line) => {
                editBuilder.insert(line.range.start, `${i}${separator}`);
                i++;
            });
        });
    }

    // handles a. and a) and A. and A)
    // 97 = a
    // 122 = z
    // 65 = A
    // 90 = Z
    if (index === "a" || index === "A") {
        editor.edit((editBuilder) => {
            lines!.forEach((line) => {
                editBuilder.insert(line.range.start, `${index}${separator}`);
                index = incrementString(index);
            });
        });
    }

    // handles I. and I) and i. and i)
    if (index === "I" || index === "i") {
        editor.edit((editBuilder) => {
            let outputCase = index === "I" ? caseOptions.upper : caseOptions.lower;
            // let outputCase: "upper" | "lower" = index === "I" ? "upper" : "lower";
            let i = 1;
            lines!.forEach((line) => {
                editBuilder.insert(line.range.start, `${index}${separator}`);
                index = toRoman(i, outputCase);
                i++;
            });
        });
    }

    Promise.resolve();
}
