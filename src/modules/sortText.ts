import { createNewEditor, getDocumentTextOrSelection, getSelection, getLinesFromString, linesToLine } from './helpers';
import * as os from 'os';
import { window } from 'vscode';
import { removeEmptyLinesInternal } from './filterText';


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
    let linesToSort = getDocumentTextOrSelection();
    if (!linesToSort) { return Promise.reject(false); }

    let linesArray = await getLinesFromString(linesToSort);
    if (!linesArray) { return Promise.reject(false); }


    let newLines = await sortLinesInternal(linesArray, direction);
    if (openInNewTextEditor) {
        createNewEditor(newLines?.join(os.EOL));
        return Promise.resolve(true);
    }
    else {
        const editor = window.activeTextEditor;
        const selection = getSelection(editor!);
        editor?.edit(editBuilder => {
            editBuilder.replace(selection!, newLines!.join(os.EOL));
        });
    }

    return Promise.resolve(true);
}

/**
 * Sort the passed in lines and returns a new sorted array of strings (text)
 * @param {string[]} linesToSort The lines to sort
 * @returns {string[] | undefined}
 * @async
 */
export async function sortLinesInternal(linesToSort: string[], direction: string): Promise<string[] | undefined> {
    if (!linesToSort) { return; }

    // remove empty lines, need to convert to a string and the result back to an array
    let line = await linesToLine(linesToSort);
    let lineWithoutEmpty = await removeEmptyLinesInternal(line, false);
    let lines = lineWithoutEmpty.split(os.EOL);

    let sortedLines;
    switch (direction) {
        case "ascending":
            sortedLines = lines.sort((a, b) => 0 - (a > b ? -1 : 1));
            break;
        case "descending":
            sortedLines = lines.sort((a, b) => 0 - (a > b ? 1 : -1));
            break;
        case "reverse":
            sortedLines = lines.reverse();
            break;
        default:
            return;
    }

    return Promise.resolve(sortedLines);
}