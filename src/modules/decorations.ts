import { DecorationOptions, DecorationRenderOptions, Range, TextEditor, TextEditorDecorationType, window, workspace } from "vscode";
import { getDocumentTextOrSelection } from './helpers';


/**
 * Creates a new Deorator object to decorate text in a Text Editor
 * @param {DecorationRenderOptions} decorationRenderOptions Configuration to use with the new decoration
 * @return {*}  {Promise<TextEditorDecorationType>}
 * @async
 */
export async function newDecorator(decorationRenderOptions: DecorationRenderOptions): Promise<TextEditorDecorationType> {
    const decorator = window.createTextEditorDecorationType(decorationRenderOptions);
    return Promise.resolve(decorator);
}

/**
 * Decorates text in the passed in editor, using the passed regular expression
 * @param {TextEditor} editor The editor containing the text to decorate
 * @param {RegExp} regExp The regular expression to use to decorate the text in the active editor
 * @param {TextEditorDecorationType} textEditorDecorationType Decorations style to be used in the active Text Editor
 * @return {*} 
 */
export async function updateDecorations(editor: TextEditor, regExp: RegExp, textEditorDecorationType: TextEditorDecorationType) {
    const text = getDocumentTextOrSelection();
    if (!text) { return; }

    const decorationOptions: DecorationOptions[] = [];
    let match;
    while ((match = regExp.exec(text))) {
        const start = editor.document.positionAt(match.index);
        const end = editor.document.positionAt(match.index + match[0].length);
        const decoration = { range: new Range(start, end), hoverMessage: 'Control character' };
        decorationOptions.push(decoration);
    }

    editor.setDecorations(textEditorDecorationType, decorationOptions);
}
