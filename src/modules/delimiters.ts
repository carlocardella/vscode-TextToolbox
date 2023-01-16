import { Position, Selection, TextEditor } from "vscode";
import { addSelection, getActiveEditor, getTextFromSelection } from "./helpers";
// import { delimiterType } from './QuotesAndParentheses';

/**
 * Delimiter types to use for selections
 *
 * @export
 * @enum {number}
 */
export enum delimiterTypes {
    bracket = "bracket",
    quote = "quote",
}

/**
 * Delimiter type, can be open or close
 *
 * @enum {number}
 */
enum delimiterTypeDirection {
    open = "open",
    close = "close",
}

/**
 * Delimiter type
 *
 * @typedef {delimiter}
 */
type delimiter = {
    name: string;
    char: string;
    pairedChar: string;
    offset: number | undefined;
    pairedOffset: number | undefined;
    type: delimiterTypes;
    direction: delimiterTypeDirection;
    position: number;
};

/**
 * Delimiters to use for selections
 *
 * @type {{
    name: string;
    char: string;
    pairedChar: string;
    type: delimiterTypes;
    direction: delimiterTypeDirection;
}[]}
 */
const delimiters: {
    name: string;
    char: string;
    pairedChar: string;
    type: delimiterTypes;
    direction: delimiterTypeDirection;
}[] = [
    {
        name: "openRound",
        char: "(",
        pairedChar: ")",
        type: delimiterTypes.bracket,
        direction: delimiterTypeDirection.open,
    },
    {
        name: "openSquare",
        char: "[",
        pairedChar: "]",
        type: delimiterTypes.bracket,
        direction: delimiterTypeDirection.open,
    },
    {
        name: "openCurly",
        char: "{",
        pairedChar: "}",
        type: delimiterTypes.bracket,
        direction: delimiterTypeDirection.open,
    },
    {
        name: "openAngle",
        char: "<",
        pairedChar: ">",
        type: delimiterTypes.bracket,
        direction: delimiterTypeDirection.open,
    },
    {
        name: "openSingleQuote",
        char: "'",
        pairedChar: "'",
        type: delimiterTypes.quote,
        direction: delimiterTypeDirection.open,
    },
    {
        name: "openDoubleQuote",
        char: '"',
        pairedChar: '"',
        type: delimiterTypes.quote,
        direction: delimiterTypeDirection.open,
    },
    {
        name: "openBacktick",
        char: "`",
        pairedChar: "`",
        type: delimiterTypes.quote,
        direction: delimiterTypeDirection.open,
    },
    {
        name: "closeRound",
        char: ")",
        pairedChar: "(",
        type: delimiterTypes.bracket,
        direction: delimiterTypeDirection.close,
    },
    {
        name: "closeSquare",
        char: "]",
        pairedChar: "[",
        type: delimiterTypes.bracket,
        direction: delimiterTypeDirection.close,
    },
    {
        name: "closeCurly",
        char: "}",
        pairedChar: "{",
        type: delimiterTypes.bracket,
        direction: delimiterTypeDirection.close,
    },
    {
        name: "closeAngle",
        char: ">",
        pairedChar: "<",
        type: delimiterTypes.bracket,
        direction: delimiterTypeDirection.close,
    },
    {
        name: "closeSingleQuote",
        char: "'",
        pairedChar: "'",
        type: delimiterTypes.quote,
        direction: delimiterTypeDirection.close,
    },
    {
        name: "closeDoubleQuote",
        char: '"',
        pairedChar: '"',
        type: delimiterTypes.quote,
        direction: delimiterTypeDirection.close,
    },
    {
        name: "closeBacktick",
        char: "`",
        pairedChar: "`",
        type: delimiterTypes.quote,
        direction: delimiterTypeDirection.close,
    },
];

/**
 * Selection offset object, used to get the start and end offsets of the selection
 *
 * @typedef {selectionOffset}
 */
type selectionOffset = {
    start: number;
    end: number;
};

/**
 * Text split at selection.
 * NOTE: The object returned does not include the selection text (if any).
 *
 * @typedef {textSpitAtSelection}
 */
type textSpitAtSelection = {
    textBeforeSelectionStart: string;
    textAfterSelectionStart: string;
};

/**
 * List of open delimiters
 *
 * @type {*}
 */
const openDelimiters = delimiters.filter((delimiter) => delimiter.direction === "open"); //.map((delimiter) => delimiter.char);

/**
 * List of close delimiters
 *
 * @type {*}
 */
const closeDelimiters = delimiters.filter((delimiter) => delimiter.direction === "close"); //.map((delimiter) => delimiter.char);

/**
 * Returns the current selection offset
 *
 * @returns {(selectionOffset | undefined)}
 */
function getSelectionOffset(editor: TextEditor): selectionOffset | undefined {
    return {
        start: editor.document.offsetAt(editor.selection.start),
        end: editor.document.offsetAt(editor.selection.end),
    };
}

/**
 * Returns the text before and after the selection, but not the selected text
 *
 * @returns {(textSpitAtSelection | undefined)}
 */
function getTextSplitAtSelection(): textSpitAtSelection | undefined {
    let editor = getActiveEditor();
    if (!editor) {
        return;
    }

    let selectionOffset = getSelectionOffset(editor);
    if (!selectionOffset) {
        return;
    }
    let documentStartPosition = new Position(0, 0);
    let documentEndPosition = new Position(editor.document.lineCount - 1, editor.document.lineAt(editor.document.lineCount - 1).range.end.character);
    let textBeforeSelectionStart = getTextFromSelection(editor, new Selection(documentStartPosition, editor.document.positionAt(selectionOffset.start)))!;
    let textAfterSelectionStart = getTextFromSelection(editor, new Selection(editor.document.positionAt(selectionOffset.end), documentEndPosition))!;

    return {
        textBeforeSelectionStart,
        textAfterSelectionStart,
    };
}

/**
 * Determines if the current selection already includes delimiters
 *
 * @param {string} text
 * @param {delimiterTypes} delimiterType
 * @returns {boolean}
 */
function selectionIncludesDelimiters(text: string, delimiterType: delimiterTypes): boolean {
    if (!text) {
        return false;
    }

    let includesOpeningDelimiter: boolean;
    let includesClosingDelimiter: boolean;

    openDelimiters.filter((delimiter) => delimiter.type === delimiterType).find((delimiter) => delimiter.char === text[0])
        ? (includesOpeningDelimiter = true)
        : (includesOpeningDelimiter = false);
    closeDelimiters.filter((delimiter) => delimiter.type === delimiterType).find((delimiter) => delimiter.char === text[text.length - 1])
        ? (includesClosingDelimiter = true)
        : (includesClosingDelimiter = false);

    if (includesClosingDelimiter && includesOpeningDelimiter) {
        return true;
    }

    return false;
}

function findOpeningDelimiter(text: string, delimiterType: delimiterTypes, startOffset: number): delimiter | undefined {
    if (!text) {
        return undefined;
    }

    let position = startOffset;
    let dic = {
        openRound: 1,
        closeRound: 1,
        openSquare: 1,
        closeSquare: 1,
        openCurly: 1,
        closeCurly: 1,
        openAngle: 1,
        closeAngle: 1,
        singleQuote: 1,
        doubleQuote: 1,
        backtick: 1,
    };

    do {
        if (position === 0) {
            return undefined;
        }

        if (delimiterType === delimiterTypes.bracket) {
            switch (text.at(position)) {
                case "(":
                    dic.openRound++;
                    break;
                case ")":
                    dic.openRound--;
                    break;
                case "[":
                    dic.openSquare++;
                    break;
                case "]":
                    dic.openSquare--;
                    break;
                case "{":
                    dic.openCurly++;
                    break;
                case "}":
                    dic.openCurly--;
                    break;
                case "<":
                    dic.openAngle++;
                    break;
                case ">":
                    dic.openAngle--;
                    break;
                default:
                    break;
            }
        } else if (delimiterType === delimiterTypes.quote) {
            switch (text.at(position)) {
                case "'":
                    dic.singleQuote++;
                    break;
                case '"':
                    dic.doubleQuote++;
                    break;
                case "`":
                    dic.backtick++;
                    break;
                default:
                    break;
            }
        }

        position--;
    } while (Object.values(dic).every((value) => value <= 1));

    if (dic.openCurly > 1 || dic.openAngle > 1 || dic.openRound > 1 || dic.openSquare > 1 || dic.singleQuote > 1 || dic.doubleQuote > 1 || dic.backtick > 1) {
        // one too many closing delimiters found, we don't need it, return the position
        let delimiter = delimiters.filter((delimiter) => delimiter.direction === "open").filter((delimiter) => delimiter.char === text.at(position + 1))[0];
        return {
            name: delimiter.name,
            char: text.at(position + 1)!,
            pairedChar: delimiter.char,
            position: position + 1,
            pairedOffset: undefined, // update
            type: delimiter.type,
            direction: delimiterTypeDirection.open,
            offset: startOffset,
        };
    }

    return;
}

/**
 * Finds the closing delimiter walking forward from the selection end
 *
 * @param {string} text
 * @param {delimiter} openingDelimiter
 * @param {number} startOffset
 * @returns {(delimiter | undefined)}
 */
function findClosingDelimiter(text: string, openingDelimiter: delimiter, startOffset: number): delimiter | undefined {
    if (!text) {
        return undefined;
    }

    let position = 0;
    let dic = {
        openRound: 0,
        closeRound: 0,
        openSquare: 0,
        closeSquare: 0,
        openCurly: 0,
        closeCurly: 0,
        openAngle: 0,
        closeAngle: 0,
        singleQuote: 0,
        doubleQuote: 0,
        backtick: 0,
    };

    // increment the delimiter count for the opening delimiter so the count will be zero when we find the corresponding closing delimiter
    switch (openingDelimiter.char) {
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
            dic.openAngle++;
            break;
        case "'":
            dic.singleQuote++;
            break;
        case '"':
            dic.doubleQuote++;
            break;
        case "`":
            dic.backtick++;
            break;

        default:
            break;
    }

    while (
        dic.openAngle > 0 ||
        dic.openCurly > 0 ||
        dic.openRound > 0 ||
        dic.openSquare > 0 ||
        dic.singleQuote > 0 ||
        dic.doubleQuote > 0 ||
        dic.backtick > 0
    ) {
        if (position >= text.length) {
            return undefined;
        }

        switch (text[position]) {
            case "(":
                dic.openRound++;
                break;
            case ")":
                dic.openRound--;
                break;
            case "[":
                dic.openSquare++;
                break;
            case "]":
                dic.openSquare--;
                break;
            case "{":
                dic.openCurly++;
                break;
            case "}":
                dic.openCurly--;
                break;
            case "<":
                dic.openAngle++;
                break;
            case ">":
                dic.openAngle--;
                break;
            case "'":
                dic.singleQuote--;
                break;
            case '"':
                dic.doubleQuote--;
                break;
            case "`":
                dic.backtick--;
                break;

            default:
                break;
        }

        position++;
    }

    if (
        dic.openCurly === 0 ||
        dic.openAngle === 0 ||
        dic.openRound === 0 ||
        dic.openSquare === 0 ||
        dic.singleQuote === 0 ||
        dic.doubleQuote === 0 ||
        dic.backtick === 0
    ) {
        // one too many closing delimiters found, we don't need it, return the position
        return {
            name: delimiters.filter((delimiter) => delimiter.direction === "close").filter((delimiter) => delimiter.char === text[position - 1])[0].name,
            char: text[position - 1],
            pairedChar: openingDelimiter.char,
            position: startOffset + position,
            pairedOffset: undefined, // update
            type: openingDelimiter.type,
            direction: delimiterTypeDirection.close,
            offset: startOffset,
        };
    }

    return undefined;
}

/**
 * Select text between delimiters, based on the cursor position or the existing selection
 *
 * @export
 * @param {delimiterTypes} delimiterType
 */
export function selectTextBetweenDelimiters(delimiterType: delimiterTypes) {
    const editor = getActiveEditor();
    if (!editor) {
        return;
    }

    const activeDocument = editor.document;
    if (!activeDocument) {
        return;
    }

    let selectionOffset = getSelectionOffset(editor);
    if (!selectionOffset) {
        return;
    }

    let textSplitAtSelectionStart = getTextSplitAtSelection();
    if (!textSplitAtSelectionStart) {
        return;
    }
    let openingDelimiter = findOpeningDelimiter(textSplitAtSelectionStart.textBeforeSelectionStart, delimiterType, selectionOffset.start);
    if (!openingDelimiter) {
        return;
    }
    let closingDelimiter = findClosingDelimiter(textSplitAtSelectionStart.textAfterSelectionStart, openingDelimiter, selectionOffset.end);
    if (!closingDelimiter) {
        // closing delimiter not found
        return;
    }

    let newSelectionOffsetStart = openingDelimiter.position;
    let newSelectionOffsetEnd = closingDelimiter.position;

    let currentSelection = getTextFromSelection(editor, editor.selection);
    if (selectionIncludesDelimiters(currentSelection!, delimiterType) || !currentSelection) {
        // the current selection already includes the delimiters, so the new selection should not
        newSelectionOffsetStart++;
        newSelectionOffsetEnd--;
    }

    addSelection(activeDocument.positionAt(newSelectionOffsetStart), activeDocument.positionAt(newSelectionOffsetEnd));
}

/**
 * Remove delimiters, based on the cursor position or the existing selection
 *
 * @export
 * @param {delimiterTypes} delimiterType
 */
export function removeDelimiters(delimiterType: delimiterTypes) {
    const editor = getActiveEditor();
    if (!editor) {
        return;
    }

    const activeDocument = editor.document;
    if (!activeDocument) {
        return;
    }

    let selectionOffset = getSelectionOffset(editor);
    if (!selectionOffset) {
        return;
    }

    let textSplitAtSelectionStart = getTextSplitAtSelection();
    if (!textSplitAtSelectionStart) {
        return;
    }
    let openingDelimiter = findOpeningDelimiter(textSplitAtSelectionStart.textBeforeSelectionStart, delimiterType, selectionOffset.start);
    if (!openingDelimiter) {
        return;
    }
    let closingDelimiter = findClosingDelimiter(textSplitAtSelectionStart.textAfterSelectionStart, openingDelimiter, selectionOffset.end);
    if (!closingDelimiter) {
        // closing delimiter not found
        return;
    }

    let newSelectionOffsetStart = openingDelimiter.offset!;
    let newSelectionOffsetEnd = closingDelimiter.offset!;
    let correctOffset = 1;

    editor.edit((editBuilder) => {
        // remove end delimiter
        editBuilder.replace(
            new Selection(activeDocument.positionAt(newSelectionOffsetEnd), activeDocument.positionAt(newSelectionOffsetEnd - correctOffset)),
            ""
        );

        // remove start delimiter
        editBuilder.replace(
            new Selection(activeDocument.positionAt(newSelectionOffsetStart), activeDocument.positionAt(newSelectionOffsetStart + correctOffset)),
            ""
        );
    });
}
