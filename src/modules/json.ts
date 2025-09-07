import { getActiveEditor, getTextFromSelection } from "./helpers";
import jsonic from "jsonic";
import { Selection } from "vscode";

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

    return editor.edit((editBuilder) => {
        let selections: Selection[] = [];

        if (editor.selection.isEmpty) {
            selections.push(new Selection(0, 0, editor.document.lineCount, editor.document.lineAt(editor.document.lineCount - 1).text.length));
        } else {
            selections = editor.selections.map((s) => s);
        }

        selections.forEach((s) => {
            let newJson: string = "";
            let selectionText = getTextFromSelection(editor, s);
            
            if (fixJson) {
                try {
                    const parsed = jsonic(selectionText!);
                    newJson = JSON.stringify(parsed, null, 4);
                } catch (error) {
                    // If jsonic parsing fails, fallback to original text
                    newJson = selectionText!;
                }
            } else {
                newJson = JSON.stringify(selectionText, null, 4);
            }

            editBuilder.replace(s, newJson);
        });
    }).then(() => {
        // Return void after successful edit
        return Promise.resolve();
    });
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

    return editor.edit((editBuilder) => {
        let selections: Selection[] = [];

        if (editor.selection.isEmpty) {
            selections.push(new Selection(0, 0, editor.document.lineCount, editor.document.lineAt(editor.document.lineCount - 1).text.length));
        } else {
            selections = editor.selections.map((s) => s);
        }

        selections.forEach((s) => {
            let selectionText = getTextFromSelection(editor, s);
            let newJson = JSON.stringify(jsonic(selectionText!));

            editBuilder.replace(s, newJson);
        });
    }).then(() => {
        // Return void after successful edit
        return Promise.resolve();
    });
}

export function escapeWin32PathInJson() {
    const editor = getActiveEditor();
    if (!editor) {
        return;
    }

    if (!editor.selection.isEmpty) {
        editor.edit((editBuilder) => {
            editor.selections.forEach((selection) => {
                const text = getTextFromSelection(editor, selection);
                const newText = text!.replace(/\\/g, "\\\\");
                editBuilder.replace(selection, newText);
            });
        });
    }

    return;
}
