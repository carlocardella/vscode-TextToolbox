import { createNewEditor, getDocumentTextOrSelection, getSelection, getLinesFromString, linesToLine, getActiveEditor, getDocumentEOL } from "./helpers";
import * as os from "os";
import { EndOfLine, window } from "vscode";

/**
 * Sorting direction: ascending | descending | reverse
 */
export const sortDirection = ["ascending", "descending", "reverse"];

/**
 * Ask the user the sort direction: ascending (default), descending and reverse
 * @param openInNewTextEditor Optionally open the sorted lines in a new editor
 * @async
 */
export async function askForSortDirection(openInNewTextEditor?: boolean) {
    const direction = await window.showQuickPick(sortDirection, {
        ignoreFocusOut: true,
        canPickMany: false,
    });
    if (!direction) {
        return;
    }

    sortLines(direction, openInNewTextEditor);
}

/**
 * Sort lines in the active selection or active editor.
 * Optionally open the sorted lines in a new editor.
 * @param {string} direction The direction to sort the selection: ascending | descending | reverse
 * @param {boolean} openInNewTextEditor Optionally open the sorted lines in a new editor
 * @returns {Promise<boolean>}
 * @async
 */
export async function sortLines(direction: string, openInNewTextEditor?: boolean): Promise<boolean> {
    const eol = getDocumentEOL(getActiveEditor());

    let newLines = getDocumentTextOrSelection()
        ?.split(eol)
        .filter((el) => {
            return el !== null && el !== "";
        });
    if (!newLines) {
        return Promise.reject("No lines to sort, all lines are null or empty");
    }

    let sortedLines: string[];
    switch (direction) {
        case "ascending":
            sortedLines = newLines.sort((a, b) => 0 - (a > b ? -1 : 1));
            break;
        case "descending":
            sortedLines = newLines.sort((a, b) => 0 - (a > b ? 1 : -1));
            break;
        case "reverse":
            sortedLines = newLines.reverse();
            break;
        default:
            return Promise.reject("Sort direction is invalid");
    }

    if (openInNewTextEditor) {
        createNewEditor(sortedLines?.join(eol));
        return Promise.resolve(true);
    } else {
        const editor = window.activeTextEditor;
        const selection = getSelection(editor!);
        editor?.edit((editBuilder) => {
            editBuilder.replace(selection!, sortedLines!.join(eol));
        });
    }

    return Promise.resolve(true);
}

/**
 * Inverts the selected lines or all the lines in the document, if there is no selection
 * Does not support multiple selections
 *
 * @export
 * @return {*}  {Promise<boolean>}
 */
export async function invertLines(): Promise<boolean> {
    const eol = getDocumentEOL(getActiveEditor());

    let lines = getDocumentTextOrSelection()?.split(eol).reverse();

    const editor = getActiveEditor();
    editor?.edit((editBuilder) => {
        editBuilder.replace(getSelection(editor)!, lines!.join(eol));
        return Promise.resolve(true);
    });

    return Promise.reject(false);
}

/**
 * Sort by line length the selected lines or all the lines in the document, if there is no selection.
 * Optionally opens the sorted lines in a new editor.
 *
 * @export
 * @async
 * @param {string} direction Sort direction: ascending, descending or reverse
 * @param {?boolean} [openInNewTextEditor] Optionally open the sorted lines in a new editor
 * @returns {Promise<boolean>}
 */
export async function sortLinesByLength(direction: string, openInNewTextEditor?: boolean): Promise<boolean> {
    const eol = getDocumentEOL(getActiveEditor());

    let newLines = getDocumentTextOrSelection()
        ?.split(eol)
        .filter((el) => {
            return el !== null && el !== "";
        });
    if (!newLines) {
        return Promise.reject("No lines to sort, all lines are null or empty");
    }

    let sortedLines: string[];
    switch (direction) {
        case "ascending":
            sortedLines = newLines.sort((a, b) => a.length - b.length);
            break;
        case "descending":
            sortedLines = newLines.sort((a, b) => b.length - a.length);
            break;
        case "reverse":
            sortedLines = newLines.reverse();
            break;
        default:
            return Promise.reject("Sort direction is invalid");
    }

    if (openInNewTextEditor) {
        createNewEditor(sortedLines?.join(eol));
        return Promise.resolve(true);
    } else {
        const editor = window.activeTextEditor;
        const selection = getSelection(editor!);
        editor?.edit((editBuilder) => {
            editBuilder.replace(selection!, sortedLines!.join(eol));
        });
    }

    return Promise.resolve(true);
}
