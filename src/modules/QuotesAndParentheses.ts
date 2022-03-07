import { getActiveEditor, getLinesFromSelection, getDocumentTextOrSelection } from "./helpers";
import { TextEditor, Position, Selection, Range } from "vscode";

export function selectTextBetweenQuotes() {
    selectWithinQuotes();
}

/**
 * Return the string within quotes (single or double)
 * @param {string} text The text to filter
 * @return {*}  {(string | undefined)}
 */
export function selectWithinQuotes(text?: string, includeQuotes?: boolean): string | undefined {
    const editor = getActiveEditor();
    if (!editor) {
        return "";
    }

    let cursorPosition = getCursorPosition(editor);
    let documentText = getDocumentTextOrSelection();
    if (!documentText) {
        return "";
    }

    let activeDocument = editor.document;
    let docLines = activeDocument.lineCount;
    let docStart = new Position(0, 0);
    let docEnd = new Position(docLines + 1, 0);
    let beforeRange = new Range(docStart, cursorPosition[0]);
    let afterRange = new Range(cursorPosition[0], docEnd);

    // [\"'`][^\"'`]*?[\"'`]/gmi
    let regexTextBeforeCursor = new RegExp("[^\"'` ]*?$", "g");
    let regexTextAfterCursor = new RegExp("[^\"'` ]*", "g");

	
	let beforeLines = getLinesFromSelection(editor, new Selection(beforeRange.start, beforeRange.end));
	let afterLines = getLinesFromSelection(editor, new Selection(afterRange.start, afterRange.end));

	let beforeLine = beforeLines?.reverse().find(e => e.text.includes('"'));
	let afterLine = afterLines?.find(e => e.text.includes('"'));

	// let p = new Position(line, character);
	// let r = new Range(startLine, startCharacter, endLine, endCharacter);




    // let textBeforeCursor = activeDocument.getText(beforeRange).match(regexTextBeforeCursor)![0].trim();
    // let textAfterCursor = activeDocument.getText(afterRange).match(regexTextAfterCursor)![0].trim();

    // let stringWithinQuotes = textBeforeCursor + textAfterCursor;

    // return stringWithinQuotes;
}

/**
 * Returns the Position of the cursor in the editor. Supports multicursor
 * @export
 * @param {TextEditor} editor The editor to get the cursor position from
 * @return {*}  {Position[]}
 */
export function getCursorPosition(editor: TextEditor): Position[] {
    let position: Position[] = [];
    editor.selections.forEach((selection) => {
        position.push(selection.active);
    });

    return position;
}

// todo: getStringWithinParentheses
// todo: replaceQuotes
// todo: replaceParentheses
