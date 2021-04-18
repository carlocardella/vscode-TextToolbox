import { getActiveEditor, getLinesFromDocumentOrSelection } from './helpers';

/**
 * Trim whitespaces from the active selection(s) or from the entire document
 *
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