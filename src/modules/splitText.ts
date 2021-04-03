import { getActiveEditor, createNewEditor, getSelection, getTextFromSelection } from './helpers';
import { window, Range } from 'vscode';
import { EOL } from 'os';

export async function splitText(openInNewEditor: boolean): Promise<boolean> {
    let delimiter = await window.showInputBox({ prompt: "delimiter", ignoreFocusOut: true });
    if (!delimiter) { return false; };

    return Promise.resolve(await splitTextInternal(delimiter, openInNewEditor));
}

export async function splitTextInternal(delimiter: string, openInNewEditor: boolean): Promise<boolean> {
    const editor = getActiveEditor();
    if (!editor) { return false; }

    let selection = getSelection(editor);
    if (!selection) { return false; }

    editor.edit(async editBuilder => {
        let text = getTextFromSelection(editor, selection);
        if (openInNewEditor) {
            await createNewEditor(text!.split(delimiter).join(EOL));
        }
        else {
            editBuilder.replace(selection, text!.split(delimiter).join(EOL));
        }
    });
    return Promise.resolve(true);
}