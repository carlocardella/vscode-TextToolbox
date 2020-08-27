import { getDocumentText, getActiveEditor, selectAllText } from './helpers';


export async function removeEmptyLines(redundandOnly: boolean) {
    let text = getDocumentText();
    if (!text) { return; }

    let r;
    let rr: string;
    // /^\n{2,}/gm ==> two or more bland lines
    // /^\n+/gm    ==> any empty line
    redundandOnly ? r = /^\n{2,}/gm : r = /^\n+/gm;
    // replace multiple empty lines with a single one, or with nothing
    redundandOnly ? rr = "\n" : rr = "";

    const newText = text.replace(r, rr!);

    let editor = getActiveEditor();
    if (!editor) { return; }

    selectAllText().then(() => {
        let selection = editor?.selection;
        if (!selection) { return; }
        editor?.edit(editBuilder => {
            editBuilder.replace(selection!, newText);
        });
    });
}