import { createNewEditor, getDocumentTextOrSelection, getLines, getSelection } from './helpers';
import * as os from 'os';
import { window } from 'vscode';


/**
 * Sort lines in the active selection or active editor.
 * Optionally open the sorted lines in a new editor.
 * @param {boolean} openInNewTextEditor Optionally open the sorted lines in a new editor
 * @returns {Promise<boolean>}
 * @async
 */
export async function sortLines(openInNewTextEditor?: boolean): Promise<boolean> {
    let linesToSort = getDocumentTextOrSelection();
    if (!linesToSort) { return Promise.reject(false); }

    let linesArray = await getLines(linesToSort);
    if (!linesArray) { return Promise.reject(false); }


    let newLines = await sortLinesInternal(linesArray);
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

    return Promise.reject(false);
}

/**
 * Sort the passed in lines and returns a new sorted array of strings (text)
 * @param {string[]} linesToSort The lines to sort
 * @returns {string[] | undefined}
 * @async
 */
export async function sortLinesInternal(linesToSort: string[]): Promise<string[] | undefined> {
    if (!linesToSort) { return; }

    // await removeEmptyLines(false);
    return Promise.resolve(linesToSort.sort());
}