import {
    createNewEditor,
    getDocumentTextOrSelection,
    getSelection,
    getActiveEditor,
    getDocumentEOL,
    getLinesFromSelection,
} from "./helpers";
import { Selection, TextLine, window } from "vscode";

/**
 * Sorting direction: ascending | descending | reverse
 */
export enum sortDirection {
    ascending = "ascending",
    descending = "descending",
    reverse = "reverse",
}

/**
 * Ask the user the sort direction: ascending (default), descending and reverse
 * @param openInNewTextEditor Optionally open the sorted lines in a new editor
 * @async
 */
export async function askForSortDirection(openInNewTextEditor?: boolean): Promise<sortDirection | undefined> {
    const direction = await window.showQuickPick(Object.values(sortDirection), {
        ignoreFocusOut: true,
        canPickMany: false,
    });
    if (!direction) {
        return Promise.reject();
    }

    return Promise.resolve(sortDirection[direction as keyof typeof sortDirection]);
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

    let editor = getActiveEditor();
    if (!editor) {
        return Promise.reject("No active editor");
    }
    let selectedLines = getLinesFromSelection(editor);

    if (!selectedLines) {
        return Promise.reject("No lines to sort, all lines are null or empty");
    }

    let sortedLines: TextLine[];
    let selectionStartLineNumber = selectedLines[0].lineNumber;
    let selectionEndLineNumber = selectedLines.at(-1)!.lineNumber;
    switch (direction) {
        case "ascending":
            sortedLines = selectedLines.sort((a, b) => 0 - (a.text > b.text ? -1 : 1));
            break;
        case "descending":
            sortedLines = selectedLines.sort((a, b) => 0 - (a.text > b.text ? 1 : -1));
            break;
        case "reverse":
            sortedLines = selectedLines.reverse();
            break;
        default:
            return Promise.reject("Sort direction is invalid");
    }

    let newText = sortedLines.map((line) => line.text).join(eol);
    if (openInNewTextEditor) {
        createNewEditor(newText);
        return Promise.resolve(true);
    } else {
        const editor = window.activeTextEditor;
        // prettier-ignore
        const selection = new Selection(
            selectionStartLineNumber,
            0,
            selectionEndLineNumber,
            editor!.document.lineAt(selectionEndLineNumber).text.length
        );

        editor?.edit((editBuilder) => {
            editBuilder.replace(selection, newText);
        });
    }

    return Promise.resolve(true);
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
