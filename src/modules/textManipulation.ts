import { Position, Range, window } from 'vscode';
import { getActiveEditor, getLinesFromDocumentOrSelection, getTextFromSelection, getDocumentTextOrSelection, createNewEditor } from './helpers';
import * as os from 'os';

/**
 * Trim whitespaces from the active selection(s) or from the entire document
 * @export
 * @return {*}  {(Promise<boolean | undefined>)}
 */
export async function trimLineOrSelection(): Promise<boolean | undefined> {
    const editor = getActiveEditor();
    if (!editor) { return; }

    const textLines = getLinesFromDocumentOrSelection(editor);

    editor.edit(eb => {
        textLines?.forEach(textLine => {
            eb.replace(textLine.range, textLine.text.trim());
        });
    });

    return Promise.resolve(true);
}

/**
 * Split the selection using the passed in delimiter
 * @export
 * @return {*} 
 */
export async function splitSelection(openInNewEditor: boolean) {
    const delimiter = await window.showInputBox({ prompt: "delimiter" });
    if (!delimiter) { return; }

    splitSelectionInternal(delimiter, openInNewEditor);
}

/**
 * Split the selection using the passed in delimiter
 * @export
 * @param {string} delimiter Delimiter to use to split the selection
 * @return {*}  {Promise<boolean>}
 */
export async function splitSelectionInternal(delimiter: string, openInNewEditor: boolean): Promise<boolean> {
    const editor = getActiveEditor();
    if (!editor) { return Promise.resolve(false); }

    if (editor.selection.isEmpty) { return Promise.resolve(false); }

    let selection = getDocumentTextOrSelection();

    if (openInNewEditor) {
        let newEditorText: string = "";

        editor.selections.forEach(s => {
            newEditorText += getTextFromSelection(editor, s)?.split(delimiter) + os.EOL;
        });

        await createNewEditor(newEditorText);
    }
    else {
        editor.edit(editBuilder => {
            editor.selections.forEach(s => {
                editBuilder.replace(s, getTextFromSelection(editor, s)?.split(delimiter).join(os.EOL)!);
            });
        });
    }

    return Promise.resolve(true);
}