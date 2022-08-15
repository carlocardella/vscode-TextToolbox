import { addSelection, getActiveEditor, getDocumentTextOrSelection, getTextFromSelection, getCursorPosition } from "./helpers";
import { Position, Range, Selection } from "vscode";

/**
 * Enumerates the type of quotes
 *
 * @enum {string}
 */
enum quotes {
    single = "'",
    double = '"',
    backtick = "`",
}

/**
 * Enumerates the type of parentheses
 *
 * @enum {string}
 */
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

/**
 * Type of delimiters: quotes or parentheses
 *
 * @export
 * @enum {string}
 */
export enum delimiterType {
    quotes = "quotes",
    parentheses = "parentheses",
}

/**
 * Enumerates Regex strings to find the delimiter, based on type and before/after the cursor's active position
 *
 * @enum {string}
 */
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
 * Returns the selection offset
 *
 * @param {delimiterType} delimiter Delimiter type, parethentheses or quotes
 * @param {string} text The text to filter
 * @return {*}  {(string | undefined)}
 */
export function getSelectionOffset(delimiter: delimiterType, regexTextBeforeSelection?: RegExp, regexTextAfterSelection?: RegExp): selectionOffset | undefined {
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
                regexTextBeforeSelection = new RegExp(regexSelectionType.withParenthesesBefore, "g");
                regexTextAfterSelection = new RegExp(regexSelectionType.withParenthesesAfter, "g");
            } else {
                // expand the selection up to the next delimiters but not the delimiters themselves
                regexTextBeforeSelection = new RegExp(regexSelectionType.withoutParenthesesBefore, "g");
                regexTextAfterSelection = new RegExp(regexSelectionType.withoutParenthesesAfter, "g");
                // regexTextAfterSelection = new RegExp(".*(?=[\\]})])", "g"); // this works but only with an existing selection
            }
        }

        if (delimiter === delimiterType.quotes) {
            if (expandSelection && !selectionIncludeDelimiters) {
                // expand the selection to include the delimiters
                regexTextBeforeSelection = new RegExp(regexSelectionType.withQuotesBefore, "g");
                regexTextAfterSelection = new RegExp(regexSelectionType.withQuotesAfter, "g");
            } else {
                // expand the selection up to the next delimiters but not the delimiters themselves
                regexTextBeforeSelection = new RegExp(regexSelectionType.withoutQuotesBefore, "g");
                regexTextAfterSelection = new RegExp(regexSelectionType.withoutQuotesAfter, "g");
            }
        }
    }

    let activeDocument = getActiveEditor()!.document;
    let selectionStartOffsetFromCursor = activeDocument.offsetAt(selectionStartPosition);
    let selectionEndOffsetFromCursor = activeDocument.offsetAt(selectionEndPosition);
    let docLinesCount = activeDocument.lineCount;
    let docStartPosition = new Position(0, 0);
    let docEndPosition = new Position(docLinesCount - 1, activeDocument.lineAt(docLinesCount - 1).text.length);
    // note: the line where the cursor is, belongs to both ranges
    let beforeCursorRange = new Range(docStartPosition, activeDocument.positionAt(selectionStartOffsetFromCursor));
    let afterCursorRange = new Range(activeDocument.positionAt(selectionEndOffsetFromCursor), docEndPosition);

    let textBeforeCursor = activeDocument.getText(beforeCursorRange).match(regexTextBeforeSelection!)![0];

    let selectionEndOffset: number;
    let selectionStartOffset: number;
    selectionStartOffset = selectionStartOffsetFromCursor - textBeforeCursor.length;

    // find the opening delimiter, even if it should not be selected; this is to ensure we use the proper closing pair
    let openingDelimiter = findOpeningDelimiter(
        getTextFromSelection(editor, new Selection(docStartPosition, activeDocument.positionAt(selectionStartOffset)))!
    );

    if (selectionIncludeDelimiters) {
        let text = activeDocument.getText(new Range(activeDocument.positionAt(selectionStartOffset), docEndPosition));
        let n = findClosingDelimiter(text, openingDelimiter.char!);
        selectionEndOffset = selectionStartOffset + n;
    } else {
        let text = activeDocument.getText(afterCursorRange);
        let n = findClosingDelimiter(text, openingDelimiter.char!);
        selectionEndOffset = selectionStartOffset + textBeforeCursor.length + n - 1;
    }

    return {
        start: selectionStartOffset!,
        end: selectionEndOffset!,
    };
}

/**
 * Select the text between delimiters
 *
 * @export
 * @param {selectionOffset} selectionOffset Offsets use to select the text
 */
export function selectTextBetweenDelimiters(delimiter: delimiterType) {
    let selectionOffset = getSelectionOffset(delimiter);
    if (!selectionOffset) {
        return;
    }

    // if (validateDelimiters(delimiter)) {
    let activeDocument = getActiveEditor()?.document;

    addSelection(activeDocument!.positionAt(selectionOffset.start), activeDocument!.positionAt(selectionOffset.end));
    // }
}

/**
 * Type to describe the selection offsets
 */
type selectionOffset = {
    start: number;
    end: number;
};

/**
 * Remove the delimiters from the text
 *
 * @export
 * @param {delimiterType} delimiter The delimiter type to remove (parentheses or quotes)
 * @return {*}
 */
export function removeDelimiters(delimiter: delimiterType) {
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
            return;
    }

    let selectionOffset = getSelectionOffset(delimiter, before!, after!);
    if (!selectionOffset) {
        return;
    }

    if (validateDelimiters(delimiter)) {
        let editor = getActiveEditor();
        editor?.edit((editBuilder) => {
            const [selectionStart, selectionEnd] = findDelimiterPositions(selectionOffset!) as [Selection, Selection];
            editBuilder.replace(selectionStart, "");
            editBuilder.replace(selectionEnd, "");
        });
    }
}

/**
 * Find the delimiter position
 *
 * @param {selectionOffset} selectionOffset Offsets to use to find the delimiter's position
 * @return {*}  {readonly [Selection, Selection]}
 */
function findDelimiterPositions(selectionOffset: selectionOffset): readonly [Selection, Selection] | undefined {
    const editor = getActiveEditor();
    if (!editor) {
        return;
    }

    let selectionStart = new Selection(editor?.document.positionAt(selectionOffset!.start)!, editor?.document.positionAt(selectionOffset!.start + 1)!);
    let selectionEnd = new Selection(editor?.document.positionAt(selectionOffset!.end)!, editor?.document.positionAt(selectionOffset!.end - 1)!);

    return [selectionStart, selectionEnd] as const;
}

enum delimiterPairs {
    ")" = "(",
    "]" = "[",
    "}" = "{",
    ">" = "<",
    "'" = "'",
    '"' = '"',
    "`" = "`",
}

/**
 * Validate that the start and end delimiters are the same
 *
 * @param {delimiterType} delimiterType
 * @return {*}  {boolean}
 */
function validateDelimiters(delimiter: delimiterType): boolean {
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
            return false;
    }

    let selectionOffset = getSelectionOffset(delimiter, before!, after!);
    if (!selectionOffset) {
        return false;
    }

    const [selectionStart, selectionEnd] = findDelimiterPositions(selectionOffset) as [Selection, Selection];
    const editor = getActiveEditor()!;

    const startDelimiter = getTextFromSelection(editor, selectionStart);
    // needed to avoid the error "Element implicitly has an 'any' type because expression of type 'string' can't be used to index type 'typeof delimiterPairs'"
    type dp = keyof typeof delimiterPairs;
    const endDelimiter = getTextFromSelection(editor, selectionEnd) as dp;

    if (startDelimiter === delimiterPairs[endDelimiter!]) {
        return true;
    } else {
        console.log(`Invalid delimiters pair: "${startDelimiter}" - "${endDelimiter}"`);
        return false;
    }
}

// todo: replaceParentheses
// todo: replaceQuotes

// investigate: support content within angle brackets tags, e.g. html/xml:
// <tag>text</tag>  <== in this example, select "text"

// @investigate
// use active language grammar: in the same line below, if the cursor is in "selectionOffset.start", expanding the parentheses selection will eventually include the wrong pair
// addSelection(activeDocument.positionAt(selectionOffset.start), activeDocument.positionAt(selectionOffset.end));
// I use a workaround for now (see validateDelimiters function) but the language grammar may be better

function findClosingDelimiter(text: string, openingDelimiter: string): number {
    let position = 0;
    let openingDelimiterFound = false;

    let dic = {
        openRound: 0,
        closeRound: 0,
        openSquare: 0,
        closeSquare: 0,
        openCurly: 0,
        closeCurly: 0,
        openChevron: 0,
        closeChevron: 0,
    };

    // increment the delimiter count for the opening delimiter so the count will be zero when we find the corresponding closing delimiter
    switch (openingDelimiter) {
        case "(":
            dic.openRound++;
            break;
        case "{":
            dic.openCurly++;
            break;
        case "[":
            dic.openSquare++;
            break;
        case "<":
            dic.openChevron++;
            break;

        default:
            break;
    }

    // look for more delimiter pairs or for the closing delimiter
    while (dic.openChevron > 0 || dic.openCurly > 0 || dic.openRound > 0 || dic.openSquare > 0) {
        if (position >= text.length) {
            return -1;
        }

        switch (text[position]) {
            case "(":
                dic.openRound++;
                openingDelimiterFound = true;
                break;
            case ")":
                dic.openRound--;
                break;
            case "[":
                dic.openSquare++;
                openingDelimiterFound = true;
                break;
            case "]":
                dic.openSquare--;
                break;
            case "{":
                dic.openCurly++;
                openingDelimiterFound = true;
                break;
            case "}":
                dic.openCurly--;
                break;
            case "<":
                dic.openChevron++;
                openingDelimiterFound = true;
                break;
            case ">":
                dic.openChevron--;
                break;

            default:
                break;
        }

        position++;
    }

    if (dic.openCurly === 0 || dic.openChevron === 0 || dic.openRound === 0 || dic.openSquare === 0) {
        // one too many closing delimiters found, we don't need it, return the position
        return position;
    }

    return 0;
}

type delimiterPositionType = {
    char: string;
    position: number;
};

function findOpeningDelimiter(text: string): delimiterPositionType {
    let delimiter: delimiterPositionType = {"char": "", "position": 0};
    if (text.length <= 0) {
        return delimiter;
    }


    let position = text.length - 1;
    for (position; position >= 0; position--) {
        if (openParenthesesArray.includes(text[position])) {
            delimiter.char = text[position];
            delimiter.position = position;
            return delimiter;
        }
    };

    return delimiter;
}