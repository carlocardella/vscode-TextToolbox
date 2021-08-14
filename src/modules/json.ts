import { getActiveEditor, getTextFromSelection } from "./helpers";
import * as jsonic from "jsonic";

/**
 * Transforms a text string into proper JSON format, optionally can fix syntax errors.
 * @param {boolean} fixJson Fix syntax errors
 * @return {*}  {(Promise<string | undefined>)}
 */
export async function stringifyJson(fixJson: boolean): Promise<void> {
    const editor = getActiveEditor();
    if (!editor) {
        return Promise.reject();
    }

    editor.edit((editBuilder) => {
        editor.selections.forEach((s) => {
            let newJson: string = "";
            let selectionText = getTextFromSelection(editor, s);
            if (fixJson) {
                newJson = JSON.stringify(jsonic(selectionText!), null, 4);
            } else {
                newJson = JSON.stringify(selectionText, null, 4);
            }

            editBuilder.replace(s, newJson);
        });
    });

    return Promise.resolve();
}

/**
 * Minifies a JSON string or object
 * @return {*}  {(Promise<string | undefined>)}
 */
export async function minifyJson(): Promise<void> {
    const editor = getActiveEditor();
    if (!editor) {
        return Promise.reject();
    }

    editor.edit((editBuilder) => {
        editor.selections.forEach((s) => {
            let selectionText = getTextFromSelection(editor, s);
            let newJson = JSON.stringify(jsonic(selectionText!));

            editBuilder.replace(s, newJson);
        });
    });

    return Promise.resolve();
}

export function escapeWin32PathInJson() {
    const editor = getActiveEditor();
    if (!editor) {
        return;
    }

    editor.edit((editBuilder) => {
        editor.selections.forEach((selection) => {
            const text = getTextFromSelection(editor, selection);
            const newText = text!.replace(/\\/g, "\\\\");
            editBuilder.replace(selection, newText);
        });
    });

    return;
}
