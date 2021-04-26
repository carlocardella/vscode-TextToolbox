import { TextEditor, TextEditorDecorationType, workspace } from "vscode";
import { newDecorator, updateDecorations } from "./decorations";
import { getSelections, getTextFromSelection, getActiveEditor } from './helpers';


/**
 * Array of control (bad) chars
 * @type {*}
*/
export const chars = [
    // https://github.com/possan/sublime_unicode_nbsp/blob/master/sublime_unicode_nbsp.py
    '\x82', // High code comma
    '\x84', // High code double comma
    '\x85', // Tripple dot
    '\x88', // High carat
    '\x91', // Forward single quote
    '\x92', // Reverse single quote
    '\x93', // Forward double quote
    '\x94', // Reverse double quote
    '\x95', // <control> Message Waiting
    '\x96', // High hyphen
    '\x97', // Double hyphen
    '\x99', // <control>
    '\xA0', // No-break space
    '\xA6', // Split vertical bar
    '\xAB', // Double less than
    '\xBB', // Double greater than
    '\xBC', // one quarter
    '\xBD', // one half
    '\xBE', // three quarters
    '\xBF', // c-single quote
    '\xA8', // modifier - under curve
    '\xB1', // modifier - under line

    // https://www.cs.tut.fi/~jkorpela/chars/spaces.html
    '\u00A0', // no-break space
    '\u1680', // ogham space mark
    '\u180E', // mongolian vowel separator
    '\u2000', // en quad
    '\u2001', // em quad
    '\u2002', // en space
    '\u2003', // em space
    '\u2004', // three-per-em space
    '\u2005', // four-per-em space
    '\u2006', // six-per-em space
    '\u2007', // figure space
    '\u2008', // punctuation space
    '\u2009', // thin space
    '\u200A', // hair space
    '\u200B', // zero width space
    '\u200D', // zero width joiner
    '\u2013', // en dash
    '\u2014', // em dash
    '\u2028', // line separator space
    '\u202F', // narrow no-break space
    '\u205F', // medium mathematical space
    '\u3000', // ideographic space
    '\uFEFF', // zero width no-break space

    // others
    '\u037E', // greek question mark
    '\u0000', // <control>
    '\u0011', // <control>
    '\u0012', // <control>
    '\u0013', // <control>
    '\u0014', // <control>
    '\u001B', // <control>
    '\u0080', // <control>
    '\u0090', // <control>
    '\u009B', // <control>
    '\u009F', // <control>
    '\u00B8', // cadilla
    '\u01C0', // latin letter dental click
    '\u2223', // divides
    '\u0008',
    '\u000c',
    '\u000e',
    '\u001f',
    '\u007f',
    "\u2018", // "left single quotation mark",
    "\u2019", // "right single quotation mark",
    "\u2029", // "paragraph separator",
    "\u0003", // "end of text",
    "\u000b", // "line tabulation",
    "\u00ad", // "soft hyphen",
    "\u200c", // "zero width non-joiner",
    "\u200e", // "left-to-right mark",
    "\u201c", // "left double quotation mark",
    "\u201d", // "right double quotation mark",
    "\u202c", // "pop directional formatting",
    "\u202d", // "left-to-right override",
    "\u202e", // "right-to-left override",
    "\ufffc", // "object replacement character",
];

const regExpText = "[" + chars.join("") + "]";
const regexp = new RegExp(regExpText, "g");
let textEditorDecorationType: TextEditorDecorationType;

/**
 * Decorate control (bad) characters
 * @param {TextEditor} editor The Text Editor to decorate
 * @param {boolean} configurationChanged If true, reads the tt.decorateControlCharacters configuration
 * @async
 */
export async function decorateControlCharacters(editor: TextEditor, configurationChanged?: boolean) {
    if (configurationChanged || !textEditorDecorationType) {
        // update textEditorDecorationType only if the value is empty or if tt.decorateControlCharacters has changed;
        // this is to properly maintain/update/remove existing decorations.
        // If textEditorDecorationType is updated unnecessarily, the decorations become all confused
        const decorationRenderOptions = workspace.getConfiguration("tt").decorateControlCharacters;
        textEditorDecorationType = await newDecorator(decorationRenderOptions);
    }
    updateDecorations(editor, regexp, textEditorDecorationType);
}

/**
 * Remove control (bad) characters from the active editor
 * @param {TextEditor} [editor] The active text editor
 * @async
 */
export async function removeControlCharacters(editor?: TextEditor, replaceControlCharactersWith?: any) {
    if (!editor) { editor = getActiveEditor(); }
    if (!editor) { return; }
    if (!replaceControlCharactersWith) {
        replaceControlCharactersWith = workspace.getConfiguration("tt").replaceControlCharactersWith;
    }
    
    let selections = await getSelections(editor);
    let text: string | undefined;
    let newText: string;

    editor.edit(editBuilder => {
        selections.forEach(async selection => {
            text = getTextFromSelection(editor!, selection);
            newText = text?.replace(regexp, replaceControlCharactersWith)!;
            editBuilder.replace(selection, newText);
        });
    });
}
