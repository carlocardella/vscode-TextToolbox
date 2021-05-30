import { getActiveEditor, createNewEditor, getSelection, getTextFromSelection } from './helpers';
import { window } from 'vscode';
import { EOL } from 'os';

/**
 * Asks the user how to split the text or selection and which delimiter to use.
 * @param {boolean} openInNewEditor Optionally open the result of this operation in a new editor
 * @return {*}  {Promise<boolean>}
 */
export async function splitText(openInNewEditor: boolean): Promise<boolean> {
    let delimiter = await window.showInputBox({ prompt: "delimiter", ignoreFocusOut: true });
    if (!delimiter) { return false; };

    await splitTextInternal(delimiter, openInNewEditor);
    return Promise.resolve(true);
}

/**
 * Split test or selection based on the passed delimiter
 * @param {string} delimiter Delimiter to use to split the selection or text document
 * @param {boolean} openInNewEditor Optionally open the result of this operation in a new editor
 * @return {*} 
 */
export async function splitTextInternal(delimiter: string, openInNewEditor: boolean) {
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
            editBuilder.replace(selection, text!.split(delimiter).toString());
        }
    });
}