import { TextEditor, TextEditorDecorationType, workspace, window, DecorationRenderOptions, DecorationOptions, Range } from "vscode";
import { getSelections, getTextFromSelection, getActiveEditor, getDocumentTextOrSelection } from "./helpers";

// todo: test https://weblogs.asp.net/kon/finding-those-pesky-unicode-characters-in-visual-studio
/**
 * Array of control (bad) chars
 * @type {*}
 */
export const chars = [
    // https://github.com/possan/sublime_unicode_nbsp/blob/master/sublime_unicode_nbsp.py
    "(\x82)", // High code comma
    "(\x84)", // High code double comma
    "(\x85)", // Triple dot
    "(\x88)", // High carat
    "(\x91)", // Forward single quote
    "(\x92)", // Reverse single quote
    "(\x93)", // Forward double quote
    "(\x94)", // Reverse double quote
    "(\x95)", // <control> Message Waiting
    "(\x96)", // High hyphen
    "(\x97)", // Double hyphen
    "(\x99)", // <control>
    "(\xA0)", // No-break space
    "(\xA6)", // Split vertical bar
    "(\xAB)", // Double less than
    "(\xBB)", // Double greater than
    "(\xBC)", // one quarter
    "(\xBD)", // one half
    "(\xBE)", // three quarters
    "(\xBF)", // c-single quote
    "(\xA8)", // modifier - under curve
    "(\xB1)", // modifier - under line

    // https://www.cs.tut.fi/~jkorpela/chars/spaces.html
    "(\u00A0)", // no-break space
    "(\u1680)", // ogham space mark
    "(\u180E)", // mongolian vowel separator
    "(\u2000)", // en quad
    "(\u2001)", // em quad
    "(\u2002)", // en space
    "(\u2003)", // em space
    "(\u2004)", // three-per-em space
    "(\u2005)", // four-per-em space
    "(\u2006)", // six-per-em space
    "(\u2007)", // figure space
    "(\u2008)", // punctuation space
    "(\u2009)", // thin space
    "(\u200A)", // hair space
    "(\u200B)", // zero width space
    "(\u200D)", // zero width joiner
    "(\u2013)", // en dash
    "(\u2014)", // em dash
    "(\u2028)", // line separator space
    "(\u202F)", // narrow no-break space
    "(\u205F)", // medium mathematical space
    "(\u3000)", // ideographic space
    "(\uFEFF)", // zero width no-break space

    // others
    "(\u037E)", // greek question mark
    "(\u0000)", // <control>
    "(\u0011)", // <control>
    "(\u0012)", // <control>
    "(\u0013)", // <control>
    "(\u0014)", // <control>
    "(\u001B)", // <control>
    "(\u0080)", // <control>
    "(\u0090)", // <control>
    "(\u009B)", // <control>
    "(\u009F)", // <control>
    "(\u00B8)", // cedilla
    "(\u01C0)", // latin letter dental click
    "(\u2223)", // divides
    "(\u0008)",
    "(\u000c)",
    "(\u000e)",
    "(\u001f)",
    "(\u007f)",
    "(\u2018)", // "left single quotation mark",
    "(\u2019)", // "right single quotation mark",
    "(\u2029)", // "paragraph separator",
    "(\u0003)", // "end of text",
    "(\u000b)", // "line tabulation",
    "(\u00ad)", // "soft hyphen",
    "(\u200c)", // "zero width non-joiner",
    "(\u200e)", // "left-to-right mark",
    "(\u201c)", // "left double quotation mark",
    "(\u201d)", // "right double quotation mark",
    "(\u202c)", // "pop directional formatting",
    "(\u202d)", // "left-to-right override",
    "(\u202e)", // "right-to-left override",
    "(\ufffc)", // "object replacement character",
];

const replacementMap: { [key: string]: string } = {
    "\u2018": "'",
    "\u2019": "'",
    "\u201C": '"',
    "\u201D": '"',
    "\x85": "...", // Triple dot
    "\x91": "'", // Forward single quote
    "\x92": "'", // Reverse single quote
    "\x93": '"', // Forward double quote
    "\x94": '"', // Reverse double quote
    "\u00a0": " ", // invisible space
    "\u200c": " ", // invisible space
    "\u200B": "", // zero width space
    "\u00ad": "", // zero width space
    "\u200e": "", // zero width space
    "\u2013": "-", // en dash
    "\u2014": "-", // em dash
};

// const regExpText = "[" + chars.join("") + "]";
const regExpText = chars.join("|");
const regexp = new RegExp(regExpText, "g");
let textEditorDecorationType: TextEditorDecorationType;

let decorator: any;

/**
 * Decorate control (bad) characters
 * @param {TextEditor} editor The Text Editor to decorate
 * @param {boolean} configurationChanged If true, reads the TextToolbox.decorateControlCharacters configuration
 * @async
 */
export async function decorateControlCharacters(editor: TextEditor, configurationChanged?: boolean): Promise<void> {
    if (configurationChanged || !textEditorDecorationType) {
        // update textEditorDecorationType only if the value is empty or if TextToolbox.decorateControlCharacters has changed;
        // this is to properly maintain/update/remove existing decorations.
        // If textEditorDecorationType is updated unnecessarily, the decorations become all confused
        const decorationRenderOptions = workspace.getConfiguration("TextToolbox").decorateControlCharacters;
        textEditorDecorationType = await newDecorator(decorationRenderOptions);
    }
    updateDecorations(editor, regexp, textEditorDecorationType);
    return Promise.resolve();
}

/**
 * Replace Unicode characters with their ASCII equivalent
 * @param {TextEditor} [editor] The active text editor
 * @async
 */
export async function replaceControlCharacters(editor?: TextEditor): Promise<void> {
    if (!editor) {
        editor = getActiveEditor();
    }
    if (!editor) {
        return Promise.reject();
    }

    let selections = await getSelections(editor);
    let text: string | undefined;
    let newText: string;

    editor.edit((editBuilder) => {
        selections.forEach(async (selection) => {
            text = getTextFromSelection(editor!, selection);
            newText = text?.replace(regexp, (match) => replacementMap[match] ?? " ")!;
            editBuilder.replace(selection, newText);
        });
    });

    return Promise.resolve();
}

/**
 * Creates a new Decorator object to decorate text in a Text Editor
 * @param {DecorationRenderOptions} decorationRenderOptions Configuration to use with the new decoration
 * @return {*}  {Promise<TextEditorDecorationType>}
 * @async
 */
export async function newDecorator(decorationRenderOptions: DecorationRenderOptions): Promise<TextEditorDecorationType> {
    decorator = window.createTextEditorDecorationType(decorationRenderOptions);
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
        let charCode = text.charCodeAt(match.index).toString(16);
        const decoration = { range: new Range(start, end), hoverMessage: `${charCode}` };
        decorationOptions.push(decoration);
    }

    editor.setDecorations(textEditorDecorationType, decorationOptions);
}
