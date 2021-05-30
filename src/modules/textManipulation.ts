import { window } from 'vscode';
import { getActiveEditor, getLinesFromDocumentOrSelection, getTextFromSelection, getDocumentTextOrSelection, createNewEditor, selectAllText } from './helpers';
import * as os from 'os';
import * as path from 'path';

/**
 * Trim whitespaces from the active selection(s) or from the entire document
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
 * @return {*} 
 */
export async function splitSelection(openInNewEditor: boolean) {
    const delimiter = await window.showInputBox({ prompt: "delimiter" });
    if (!delimiter) { return; }

    splitSelectionInternal(delimiter, openInNewEditor);
}

/**
 * Split the selection using the passed in delimiter
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

/**
 * Enumerates Platform path types
 * @enum {number}
 */
export enum pathTransformationType {
    'posix' = 'posix',
    'win32' = 'win32',
    'darwin' = 'darwin'
}

/**
 * Transforms the selected path string to the chosen platform type target
 * @param {pathTransformationType} type Enum the Platform types to transform the path to
 * @return {*}  {(Promise<string | undefined>)}
 */
export async function transformPath(type: pathTransformationType): Promise<string | undefined> {
    const editor = getActiveEditor();
    if (!editor) { return Promise.reject(); }

    const selection = editor.selection;
    if (!selection) { return Promise.reject(); }

    let pathString = getTextFromSelection(editor, selection);

    switch (type) {
        case pathTransformationType.posix:
            pathString = path.posix.normalize(pathString!).replace(/\\+/g, '/');
            break;

        case pathTransformationType.darwin:
            pathString = path.posix.normalize(pathString!).replace(/\\+/g, '/');
            break;

        case pathTransformationType.win32:
            pathString = path.posix.normalize(pathString!).replace(/\/+/g, '\\');
            break;

        default:
            break;
    }

    editor.edit(editBuilder => {
        editBuilder.replace(selection, pathString!);
    });
}