import { DecorationOptions, DecorationRenderOptions, Range, TextEditor, TextEditorDecorationType, window, workspace } from "vscode";
import { getActiveEditor, getDocumentTextOrSelection } from "./helpers";
import { Chance } from "chance";

let config = workspace.getConfiguration("TextToolbox");

/**
 * Creates a new Decorator object to decorate text in a Text Editor
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
    if (!text) {
        return;
    }

    const decorationOptions: DecorationOptions[] = [];
    let match;
    while ((match = regExp.exec(text))) {
        const start = editor.document.positionAt(match.index);
        const end = editor.document.positionAt(match.index + match[0].length);
        const decoration = { range: new Range(start, end), hoverMessage: "Control character" };
        decorationOptions.push(decoration);
    }

    editor.setDecorations(textEditorDecorationType, decorationOptions);
}

export async function highlightText(pickDefaultDecorator: boolean) {
    let decoratorRenderOptions: DecorationRenderOptions | undefined;
    pickDefaultDecorator ? (decoratorRenderOptions = getRandomDecorator()) : (decoratorRenderOptions = await askForDecorationColor());

    if (decoratorRenderOptions) {
        await decorateTextInternal(decoratorRenderOptions);
    }
}

export async function decorateTextInternal(decorationRenderOptions: DecorationRenderOptions) {
    const editor = getActiveEditor();
    if (!editor) {
        return;
    }

    let currentWordRange = editor.document.getWordRangeAtPosition(editor.selection.active);
    let ranges: Range[] = [];
    ranges.push(currentWordRange!);
    if (!currentWordRange) {
        return;
    }

    let decorator = await newDecorator(decorationRenderOptions);

    editor.setDecorations(decorator, ranges); // investigate: decorations are not persisted if the editor loses and regains focus (switch between editors)
}

export async function removeDecoration() {
    const editor = getActiveEditor();
    if (!editor) {
        return;
    }

    let decorationRenderOptions: DecorationRenderOptions = {};
    let decorator = await newDecorator(decorationRenderOptions);
    editor.setDecorations(decorator, []); // investigate: the document needs to be refreshed by switching focus, why?
}

function getRandomDecorator(): DecorationRenderOptions {
    const chance = new Chance();

    let decorationColors = config.get<DecorationRenderOptions[]>("decorationDefaults")!;
    return chance.pickone(decorationColors);
}

async function askForDecorationColor(): Promise<DecorationRenderOptions | undefined> {
    const userColor = await window.showInputBox({ ignoreFocusOut: true, prompt: "Enter a color. Accepted formats: color name, hex, rgba" });
    if (!userColor) {
        Promise.reject();
    }

    const userDecoration: DecorationRenderOptions = {
        backgroundColor: userColor,
    };
    return Promise.resolve(userDecoration);
}
