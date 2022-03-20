import { addSelection, getActiveEditor, getDocumentTextOrSelection, getTextFromSelection, getCursorPosition } from "./helpers";
import { TextEditor, Position, Range, Selection } from "vscode";
import { before } from "mocha";

enum quotes {
    single = "'",
    double = '"',
    backtick = "`",
}

enum parentheses {
    // https://en.wikipedia.org/wiki/Bracket#Parentheses_.28_.29
    openRound = "(",
    closeRound = ")",
    openSquare = "[",
    closeSquare = "]",
    openCurly = "{",
    closeCurly = "}",
    openChevron = "<",
    closeChevron = ">",
}

let quotesArray = ["'", '"', "`"];
let parenthesesArray = ["(", ")", "[", "]", "{", "}", "<", ">"];
let openParenthesesArray = ["(", "[", "{", "<"];
let closeParenthesesArray = [")", "]", "}", ">"];

export enum delimiterType {
    quotes = "quotes",
    parentheses = "parentheses",
}

enum regexSelectionType {
    withParenthesesBefore = "[\\[{(<][^\\[{(<]*?$",
    withParenthesesAfter = "[^\\]})>]*[\\]})>]",
    withoutParenthesesBefore = "[^\\[{(<]*?$",
    withoutParenthesesAfter = "[^\\]})>]*",
    withQuotesBefore = "[\"'`][^\"'` ]*?$",
    withQuotesAfter = "[^\"'` ]*[\"'`]",
    withoutQuotesBefore = "[^\"'` ]*?$",
    withoutQuotesAfter = "[^\"'` ]*",
}

/**
 * Select the string within quotes (single or double or backtick)
 *
 * @param {delimiterType} delimiter Delimiter type, parethentheses or quotes
 * @param {string} text The text to filter
 * @return {*}  {(string | undefined)}
 */
export function findTextBetweenDelimiters(
    delimiter: delimiterType,
    regexTextBeforeSelection?: RegExp,
    regexTextAfterSelection?: RegExp
): selectionOffset | undefined {
    const editor = getActiveEditor();
    if (!editor) {
        return;
    }
    let documentText = getDocumentTextOrSelection();
    if (!documentText) {
        return;
    }

    let cursorPosition = getCursorPosition(editor)[0];

    let expandSelection = false;
    let selectionIncludeDelimiters = false;
    let selectionStartPosition = cursorPosition;
    let selectionEndPosition = cursorPosition;

    // if there is a selection and the cursor is within the selection, expand the selection
    if (!editor.selection.isEmpty) {
        editor.selection.contains(cursorPosition) ? (expandSelection = true) : (expandSelection = false);
        selectionStartPosition = editor.selection.start;
        selectionEndPosition = editor.selection.end;

        // if the selection already includes the starting and ending delimiter,
        // expand the selection only including the text up to the next pair of delimiters but not the delimiters themselves
        let selectedText = getTextFromSelection(editor, editor.selection);
        if (delimiter === delimiterType.parentheses) {
            if (openParenthesesArray.includes(selectedText![0]) && closeParenthesesArray.includes(selectedText![selectedText!.length - 1])) {
                selectionIncludeDelimiters = true;
            }
        }
        if (delimiter === delimiterType.quotes) {
            if (quotesArray.includes(selectedText![0]) && quotesArray.includes(selectedText![selectedText!.length - 1])) {
                selectionIncludeDelimiters = true;
            }
        }
    }

    if (!regexTextBeforeSelection && !regexTextAfterSelection) {
        // use the built-in regex
        if (delimiter === delimiterType.parentheses) {
            if (expandSelection && !selectionIncludeDelimiters) {
                // expand the selection to include the delimiters
                regexTextBeforeSelection = new RegExp("[\\[{(<][^\\[{(<]*?$", "g");
                regexTextAfterSelection = new RegExp("[^\\]})>]*[\\]})>]", "g");
            } else {
                // expand the selection up to the next delimiters but not the delimiters themselves
                regexTextBeforeSelection = new RegExp("[^\\[{(<]*?$", "g");
                regexTextAfterSelection = new RegExp("[^\\]})>]*", "g");
            }
        }

        if (delimiter === delimiterType.quotes) {
            if (expandSelection && !selectionIncludeDelimiters) {
                // expand the selection to include the delimiters
                regexTextBeforeSelection = new RegExp("[\"'`][^\"'` ]*?$", "g");
                regexTextAfterSelection = new RegExp("[^\"'` ]*[\"'`]", "g");
            } else {
                // expand the selection up to the next delimiters but not the delimiters themselves
                regexTextBeforeSelection = new RegExp("[^\"'` ]*?$", "g");
                regexTextAfterSelection = new RegExp("[^\"'` ]*", "g");
            }
        }
    }

    return getSelectionOffsets(selectionStartPosition, regexTextBeforeSelection!, selectionEndPosition, regexTextAfterSelection!);
}

/**
 * Select the text between delimiters
 *
 * @export
 * @param {selectionOffset} selectionOffset Offsets use to select the text
 */
export function selectTextBetweenDelimiters(delimiter: delimiterType) {
    let selectionOffset = findTextBetweenDelimiters(delimiter);
    if (!selectionOffset) {
        return;
    }

    let activeDocument = getActiveEditor()?.document;

    addSelection(activeDocument!.positionAt(selectionOffset.start), activeDocument!.positionAt(selectionOffset.end));
}

/**
 * Type to describe the selection offsets
 */
type selectionOffset = {
    start: number;
    end: number;
};

/**
 * Expand the selection and get the start and end offsets
 *
 * @export
 * @param {Position} selectionStartPosition Position where the current selection starts
 * @param {RegExp} regexTextBeforeSelection RegEx to find the text before the selection
 * @param {Position} selectionEndPosition Position where the current selection ends
 * @param {RegExp} regexTextAfterSelection Regex to find the text after the selection
 * @return {*}  {selectionOffset}
 */
export function getSelectionOffsets(
    selectionStartPosition: Position,
    regexTextBeforeSelection: RegExp,
    selectionEndPosition: Position,
    regexTextAfterSelection: RegExp
): selectionOffset {
    let activeDocument = getActiveEditor()!.document;
    let selectionStartOffsetFromCursor = activeDocument.offsetAt(selectionStartPosition);
    let selectionEndOffsetFromCursor = activeDocument.offsetAt(selectionEndPosition);
    let docLinesCount = activeDocument.lineCount;
    let docStartPosition = new Position(0, 0);
    let docEndPosition = new Position(docLinesCount - 1, activeDocument.lineAt(docLinesCount - 1).text.length);
    // note: the line where the cursor is, belongs to both ranges
    let beforeCursorRange = new Range(docStartPosition, activeDocument.positionAt(selectionStartOffsetFromCursor));
    let afterCursorRange = new Range(activeDocument.positionAt(selectionEndOffsetFromCursor), docEndPosition);

    let textBeforeCursor = activeDocument.getText(beforeCursorRange).match(regexTextBeforeSelection)![0];
    let textAfterCursor = activeDocument.getText(afterCursorRange).match(regexTextAfterSelection)![0];
    let selectionStartOffset = selectionStartOffsetFromCursor - textBeforeCursor.length;
    let selectionEndOffset = selectionEndOffsetFromCursor + textAfterCursor.length;

    return {
        start: selectionStartOffset,
        end: selectionEndOffset,
    };
}

export function removeQuotesOrParentheses(delimiter: delimiterType) {
    let before: RegExp;
    let after: RegExp;

    switch (delimiter) {
        case delimiterType.parentheses:
            before = new RegExp(regexSelectionType.withParenthesesBefore, "g");
            after = new RegExp(regexSelectionType.withParenthesesAfter, "g");
            break;
        case delimiterType.quotes:
            before = new RegExp(regexSelectionType.withQuotesBefore, "g");
            after = new RegExp(regexSelectionType.withQuotesAfter, "g");
            break;
        default:
            console.log(`Invalid delimiter type: ${delimiter}`);
            break;
    }

    let selectionOffset = findTextBetweenDelimiters(delimiter, before, after);
    if (!selectionOffset) {
        return;
    }

    let editor = getActiveEditor();
    editor?.edit((editBuilder) => {
        let selectionStart = new Selection(editor?.document.positionAt(selectionOffset!.start)!, editor?.document.positionAt(selectionOffset!.start + 1)!);
        let selectionEnd = new Selection(editor?.document.positionAt(selectionOffset!.end)!, editor?.document.positionAt(selectionOffset!.end - 1)!);
        editBuilder.replace(selectionStart, "");
        editBuilder.replace(selectionEnd, "");
    });
}

// todo: replaceParentheses
// todo: replaceQuotes

// @bug @investigate
// use active language grammar: in the same line below, if the cursor is in "selectionOffset.start", expanding the parentheses selection will eventually include the wrong pair
// addSelection(activeDocument.positionAt(selectionOffset.start), activeDocument.positionAt(selectionOffset.end));
