import { createNewEditor, getDocumentTextOrSelection, getSelection, getLinesFromString, linesToLine, getActiveEditor } from './helpers';
import * as os from 'os';
import { window } from 'vscode';


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
    if (!direction) { return; }

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
    let newLines = getDocumentTextOrSelection()?.split(os.EOL).filter(el => { return el !== null && el !== ""; });
    if (!newLines) { return Promise.reject("No lines to sort, all lines are null or empty"); }

    // newLines?.sort();
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
        createNewEditor(sortedLines?.join(os.EOL));
        return Promise.resolve(true);
    }
    else {
        const editor = window.activeTextEditor;
        const selection = getSelection(editor!);
        editor?.edit(editBuilder => {
            editBuilder.replace(selection!, sortedLines!.join(os.EOL));
        });
    }

    return Promise.resolve(true);
}
