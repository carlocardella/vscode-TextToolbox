import { addSelection, getActiveEditor, getDocumentTextOrSelection, getTextFromSelection } from "./helpers";
import { TextEditor, Position, Selection, Range } from "vscode";

/**
 * Select the string within quotes (single or double or backtick)
 * @param {string} text The text to filter
 * @return {*}  {(string | undefined)}
 */
export function selectTextBetweenQuotes(text?: string) {
    const editor = getActiveEditor();
    if (!editor) {
        return "";
    }
    let documentText = getDocumentTextOrSelection();
    if (!documentText) {
        return "";
    }

    let cursorPosition = getCursorPosition(editor)[0];

    // if there is a selection and the cursor is within the selection, expand the selection
    let expandSelection = false;
    let selectionIncludeQuotes = false;
    let selectionStartPosition = cursorPosition;
    let selectionEndPosition = cursorPosition;
    if (!editor.selection.isEmpty) {
        editor.selection.contains(cursorPosition) ? (expandSelection = true) : (expandSelection = false);
        selectionStartPosition = editor.selection.start;
        selectionEndPosition = editor.selection.end;

        // if the selection already includes the staring and ending quotes,
        // expand the selection only including the text up to the next pair of quotes but not the quotes themselves
        let selectedText = getTextFromSelection(editor, editor.selection);
        if (['"', "'", "`"].includes(selectedText![0]) && ['"', "'", "`"].includes(selectedText![selectedText!.length - 1])) {
            selectionIncludeQuotes = true;
        }
    }

    let regexTextBeforeSelection: any;
    let regexTextAfterSelection: any;
    if (expandSelection && !selectionIncludeQuotes) {
        // [\"'`][^\"'`]*?[\"'`]/gmi
        regexTextBeforeSelection = new RegExp("[\"'`][^\"'` ]*?$", "g");
        regexTextAfterSelection = new RegExp("[^\"'` ]*[\"'`]", "g");
    } else {
        // [\"'`][^\"'`]*?[\"'`]/gmi
        regexTextBeforeSelection = new RegExp("[^\"'` ]*?$", "g");
        regexTextAfterSelection = new RegExp("[^\"'` ]*", "g");
    }

    let activeDocument = editor.document;
    let selectionStartOffsetFromCursor = activeDocument.offsetAt(selectionStartPosition);
    let selectionEndOffsetFromCursor = activeDocument.offsetAt(selectionEndPosition);
    let docLinesCount = activeDocument.lineCount;
    let docStartPosition = new Position(0, 0);
    let docEndPosition = new Position(docLinesCount - 1, activeDocument.lineAt(docLinesCount - 1).text.length);
    // note: the line where the cursor is, belongs to both ranges
    let beforeCursorRange = new Range(docStartPosition, activeDocument.positionAt(selectionStartOffsetFromCursor));
    let afterCursorRange = new Range(activeDocument.positionAt(selectionEndOffsetFromCursor), docEndPosition);

    let textBeforeCursor = activeDocument.getText(beforeCursorRange).match(regexTextBeforeSelection)![0].trim();
    let textAfterCursor = activeDocument.getText(afterCursorRange).match(regexTextAfterSelection)![0].trim();
    let selectionStartOffset = selectionStartOffsetFromCursor - textBeforeCursor.length;
    let selectionEndOffset = selectionEndOffsetFromCursor + textAfterCursor.length;

    addSelection(activeDocument.positionAt(selectionStartOffset), activeDocument.positionAt(selectionEndOffset));
}

/**
 * Select the string within parenthesis (single or double or backtick)
 * @param {string} text The text to filter
 * @return {*}  {(string | undefined)}
 */
export function selectTextBetweenParenthesis(text?: string) {
    throw new Error("Method not implemented.");
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

// todo: selectTextBetweenParenthesis
// todo: replaceParentheses
// todo: remove parentheses
// todo: replaceQuotes
// todo: remove quotes
