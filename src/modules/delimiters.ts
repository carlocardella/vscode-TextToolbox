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

    let position = text.length - 1;
    let closedDelimiters = {
        closeRound: 0,
        closeSquare: 0,
        closeCurly: 0,
        closeAngle: 0,
        singleQuote: 0,
        doubleQuote: 0,
        backtick: 0,
    };
    type closeDelimitersKey = keyof typeof closedDelimiters;

    let openingDelimiters = delimiters.filter((delimiter) => delimiter.direction === "open" && delimiter.type === delimiterType);

    while (position >= 0) {
        // let closingDelimiter = Object.values(delimiters).find((delimiter) => delimiter.char === text.at(position)) ?? undefined;
        let closingDelimiter =
            Object.values(delimiters)
                .filter((delimiter) => delimiter.type === delimiterType)
                .filter((delimiter) => delimiter.direction === delimiterTypeDirection.close)
                .find((delimiter) => delimiter.char === text.at(position)) ?? undefined;

        if (closingDelimiter) {
            // do not count arrow functions as delimiters
            if (text.at(position - 1) !== "=") {
                closedDelimiters[closingDelimiter!.name as closeDelimitersKey]++;
            }
        }

        let openingDelimiter = Object.values(openingDelimiters).find((delimiter) => delimiter.char === text.at(position)) ?? undefined;
        if (openingDelimiter) {
            // found opening delimiter, let's check if it is paired with a closing delimiter we already found
            let closingDelimiter = Object.values(delimiters).find((d) => d.char === openingDelimiter!.pairedChar);
            if (closedDelimiters[closingDelimiter?.name as closeDelimitersKey] > 0) {
                closedDelimiters[closingDelimiter?.name as closeDelimitersKey]--;
            } else {
                if (Object.values(closedDelimiters).every((value) => value <= 0)) {
                    return {
                        name: openingDelimiter.name,
                        char: text.at(position)!,
                        pairedChar: openingDelimiter.pairedChar,
                        position: position,
                        pairedOffset: undefined, // update
                        type: openingDelimiter.type,
                        direction: openingDelimiter.direction,
                        offset: startOffset,
                    } as delimiter;
                }
            }
        }

        position--;
    }

    return;
}

function findClosingDelimiter(text: string, openingDelimiter: delimiter, startOffset: number, position: number = 0): delimiter | undefined {
    if (!text) {
        return undefined;
    }

    // keep track of the number of opening delimiters found
    let openingDelimiterCount = 0;

    while (position < text.length) {
        if (text.at(position) === openingDelimiter.char) {
            openingDelimiterCount++;
        }

        if (text.at(position) === openingDelimiter.pairedChar) {
            if (openingDelimiterCount === 0) {
                return {
                    name: delimiters.filter((delimiter) => delimiter.char === text.at(position))[0].name,
                    char: text.at(position)!,
                    pairedChar: openingDelimiter.char,
                    position: startOffset + position + 1,
                    pairedOffset: undefined, // update
                    type: openingDelimiter.type,
                    direction: delimiterTypeDirection.close,
                    offset: startOffset,
                } as delimiter;
            } else {
                openingDelimiterCount--;
            }
        }

        position++;
    }

    return;
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
        // newSelectionOffsetStart++;
        // newSelectionOffsetEnd--;

        if ((selectionOffset.start !== newSelectionOffsetStart + 1 && selectionOffset.end !== newSelectionOffsetEnd - 1) || currentSelection!.length === 0) {
            newSelectionOffsetStart++;
            newSelectionOffsetEnd--;
            // newSelectionOffsetStart--;
            // newSelectionOffsetEnd++;
        }
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
