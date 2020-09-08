import { createNewEditor, getDocumentTextOrSelection, getLines, getSelectionOrFullDocument } from './helpers';
import * as os from 'os';
import { window } from 'vscode';
import { removeEmptyLinesInternal } from './filterText';


export async function sortLines(openInNewTextEditor?: boolean): Promise<boolean> {
    let linesToSort = getDocumentTextOrSelection();
    if (!linesToSort) { return Promise.reject(false); }

    // linesToSort = await removeEmptyLinesInternal(linesToSort, false);

    let linesArray = await getLines(linesToSort);
    if (!linesArray) { return Promise.reject(false); }


    let newLines = await sortLinesInternal(linesArray);
    if (openInNewTextEditor) {
        createNewEditor(newLines?.join(os.EOL));
        return Promise.resolve(true);
    }
    else {
        const editor = window.activeTextEditor;
        const selection = getSelectionOrFullDocument(editor!);
        editor?.edit(editBuilder => {
            editBuilder.replace(selection!, newLines!.join(os.EOL));
        });
    }

    return Promise.reject(false);
}

export async function sortLinesInternal(linesToSort: string[]): Promise<string[] | undefined> {
    if (!linesToSort) { return; }

    // await removeEmptyLinesInternal()

    return Promise.resolve(linesToSort.sort());
}