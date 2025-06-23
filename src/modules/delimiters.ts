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

/**
 * Find the opening bracket starting from the cursor position or active selection
 *
 * @param {string} text The text to search
 * @param {delimiterTypes} delimiterType The delimiter type to search for
 * @param {number} startOffset The offset to start searching from
 * @returns {(delimiter | undefined)}
 */
function findOpeningBracket(text: string, delimiterType: delimiterTypes, startOffset: number): delimiter | undefined {
    if (!text) {
        return undefined;
    }

    let position = text.length - 1;
    let closedDelimiters = {
        closeRound: 0,
        closeSquare: 0,
        closeCurly: 0,
        closeAngle: 0,
    };
    type closeDelimitersKey = keyof typeof closedDelimiters;

    let openingDelimiters = delimiters.filter((delimiter) => delimiter.direction === "open" && delimiter.type === delimiterType);

    while (position >= 0) {
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

function findClosingBracket(text: string, openingDelimiter: delimiter, startOffset: number, position: number = 0): delimiter | undefined {
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

    let openingDelimiter =
        delimiterType === delimiterTypes.bracket
            ? findOpeningBracket(textSplitAtSelectionStart.textBeforeSelectionStart, delimiterType, selectionOffset.start)
            : findOpeningQuote(textSplitAtSelectionStart.textBeforeSelectionStart, delimiterType, selectionOffset.start);
    if (!openingDelimiter) {
        return;
    }

    let closingDelimiter =
        delimiterType === delimiterTypes.bracket
            ? findClosingBracket(textSplitAtSelectionStart.textAfterSelectionStart, openingDelimiter, selectionOffset.end)
            : findClosingQuote(textSplitAtSelectionStart.textAfterSelectionStart, openingDelimiter, selectionOffset.end);
    if (!closingDelimiter) {
        return;
    }

    let newSelectionOffsetStart = openingDelimiter.position;
    let newSelectionOffsetEnd = closingDelimiter.position;

    let currentSelection = getTextFromSelection(editor, editor.selection);
    if (selectionIncludesDelimiters(currentSelection!, delimiterType) || !currentSelection) {
        // the current selection already includes the delimiters, so the new selection should not, unless:
        // - the current selection is empty
        // - the new selection needs to include consecutive delimiters
        if ((selectionOffset.start !== newSelectionOffsetStart + 1 && selectionOffset.end !== newSelectionOffsetEnd - 1) || currentSelection!.length === 0) {
            newSelectionOffsetStart++;
            newSelectionOffsetEnd--;
        }
        if (selectionOffset.start === newSelectionOffsetStart + 1 && selectionOffset.end !== newSelectionOffsetEnd - 1) {
            newSelectionOffsetStart++;
            newSelectionOffsetEnd--;
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

    let [newSelectionOffsetStart, newSelectionOffsetEnd] = getDelimitersOffset(delimiterType);
    if (!newSelectionOffsetStart || !newSelectionOffsetEnd) {
        return;
    }
    let correctOffset = 1;

    editor.edit((editBuilder) => {
        // remove end delimiter
        editBuilder.replace(
            new Selection(activeDocument.positionAt(newSelectionOffsetEnd!), activeDocument.positionAt(newSelectionOffsetEnd! - correctOffset)),
            ""
        );

        // remove start delimiter
        editBuilder.replace(
            new Selection(activeDocument.positionAt(newSelectionOffsetStart!), activeDocument.positionAt(newSelectionOffsetStart! + correctOffset)),
            ""
        );
    });
}

/**
 * Find the offset of the delimiter
 *
 * @param {delimiterTypes} delimiterType The type of delimiter to find
 * @returns {([number | undefined, number | undefined])}
 */
function getDelimitersOffset(delimiterType: delimiterTypes): [number | undefined, number | undefined] {
    const editor = getActiveEditor();
    if (!editor) {
        return [undefined, undefined];
    }

    const activeDocument = editor.document;
    if (!activeDocument) {
        return [undefined, undefined];
    }

    let selectionOffset = getSelectionOffset(editor);
    if (!selectionOffset) {
        return [undefined, undefined];
    }

    let textSplitAtSelectionStart = getTextSplitAtSelection();
    if (!textSplitAtSelectionStart) {
        return [undefined, undefined];
    }

    let openingDelimiter =
        delimiterType === delimiterTypes.bracket
            ? findOpeningBracket(textSplitAtSelectionStart.textBeforeSelectionStart, delimiterType, selectionOffset.start)
            : findOpeningQuote(textSplitAtSelectionStart.textBeforeSelectionStart, delimiterType, selectionOffset.start);
    if (!openingDelimiter) {
        return [undefined, undefined];
    }

    let closingDelimiter =
        delimiterType === delimiterTypes.bracket
            ? findClosingBracket(textSplitAtSelectionStart.textAfterSelectionStart, openingDelimiter, selectionOffset.end)
            : findClosingQuote(textSplitAtSelectionStart.textAfterSelectionStart, openingDelimiter, selectionOffset.end);

    return [openingDelimiter?.position, closingDelimiter?.position];
}

/**
 * Find the opening quote starting from the cursor position or active selection
 * Now handles both escaped and unescaped quotes to find the closest pair
 *
 * @param {string} text
 * @param {delimiterTypes} delimiterType
 * @param {number} startOffset
 * @returns {(delimiter | undefined)}
 */
function findOpeningQuote(text: string, delimiterType: delimiterTypes, startOffset: number): delimiter | undefined {
    if (!text) {
        return undefined;
    }

    let position = text.length - 1;
    let openingDelimiters = delimiters.filter((delimiter) => delimiter.direction === "open" && delimiter.type === delimiterType);

    while (position >= 0) {
        let openingDelimiter = Object.values(openingDelimiters).find((delimiter) => delimiter.char === text.at(position)) ?? undefined;

        if (openingDelimiter) {
            // For escaped quotes, we still consider them as valid delimiters
            // The key is to find the closest matching pair, whether escaped or not
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

        position--;
    }

    return;
}

/**
 * Check if a quote character at the given position is escaped by a backslash
 *
 * @param {string} text The text to check
 * @param {number} position The position of the quote character
 * @returns {boolean} True if the quote is escaped, false otherwise
 */
function isEscapedQuote(text: string, position: number): boolean {
    if (position === 0) {
        return false;
    }

    // Count consecutive backslashes before the quote
    let backslashCount = 0;
    let checkPosition = position - 1;
    
    while (checkPosition >= 0 && text.at(checkPosition) === '\\') {
        backslashCount++;
        checkPosition--;
    }
    
    // If there's an odd number of backslashes, the quote is escaped
    // If there's an even number (including 0), the quote is not escaped
    return backslashCount % 2 === 1;
}

/**
 * Find the closing quote starting from the cursor position or active selection
 * Now handles both escaped and unescaped quotes with proper pairing logic
 *
 * @param {string} text The text to search in
 * @param {delimiter} openingDelimiter The opening delimiter
 * @param {number} startOffset The offset to start the search from
 * @param {number} [position=0] The position to start the search from
 * @returns {(delimiter | undefined)}
 */
function findClosingQuote(text: string, openingDelimiter: delimiter, startOffset: number, position: number = 0): delimiter | undefined {
    if (!text) {
        return undefined;
    }

    // Check if the opening delimiter was escaped
    const openingWasEscaped = isEscapedQuote(text, openingDelimiter.position - startOffset);

    while (position < text.length) {
        if (text.at(position) === openingDelimiter.pairedChar) {
            const currentIsEscaped = isEscapedQuote(text, position);
            
            // Match escaped quotes with escaped quotes, unescaped with unescaped
            if (openingWasEscaped === currentIsEscaped) {
                // For escaped quotes, we want to exclude the escape character from the selection
                // So if this is an escaped quote, the selection should end before the backslash
                let adjustedPosition = position;
                if (currentIsEscaped && position > 0) {
                    // For escaped quotes, adjust position to exclude the backslash
                    adjustedPosition = position - 1;
                }
                
                return {
                    name: delimiters.filter((delimiter) => delimiter.char === text.at(position))[0].name,
                    char: text.at(position)!,
                    pairedChar: openingDelimiter.char,
                    position: startOffset + adjustedPosition + 1,
                    pairedOffset: undefined, // update
                    type: openingDelimiter.type,
                    direction: delimiterTypeDirection.close,
                    offset: startOffset,
                } as delimiter;
            }
        }

        position++;
    }

    return;
}

/**
 * Cycle between delimiter types
 *
 * @export
 * @param {delimiterTypes} delimiterType
 */
export function cycleDelimiters(delimiterType: delimiterTypes) {
    const editor = getActiveEditor();
    if (!editor) {
        return;
    }

    const activeDocument = editor.document;
    if (!activeDocument) {
        return;
    }

    let [newSelectionOffsetStart, newSelectionOffsetEnd] = getDelimitersOffset(delimiterType);
    if (!newSelectionOffsetStart || !newSelectionOffsetEnd) {
        return;
    }
    const delimiters = getDelimiters(delimiterType, delimiterTypeDirection.open);
    const currentDelimiter = delimiters.find((delimiter) => delimiter.char === activeDocument.getText()[newSelectionOffsetStart!]);
    const currentDelimiterIndex = delimiters.indexOf(currentDelimiter!);
    const nextDelimiter = delimiters[(currentDelimiterIndex + 1) % delimiters.length];

    const correctOffset = 1;

    editor.edit((editBuilder) => {
        // replace start delimiter
        editBuilder.replace(
            new Selection(activeDocument.positionAt(newSelectionOffsetStart!), activeDocument.positionAt(newSelectionOffsetStart! + correctOffset)),
            nextDelimiter.char
        );

        // replace end delimiter
        editBuilder.replace(
            new Selection(activeDocument.positionAt(newSelectionOffsetEnd!), activeDocument.positionAt(newSelectionOffsetEnd! - correctOffset)),
            nextDelimiter.pairedChar
        );
    });
}

/**
 * Returns the delimiters for the given type and direction
 *
 * @param {delimiterTypes} delimiterType The type of delimiter to return
 * @param {delimiterTypeDirection} delimiterDirection The direction of the delimiter to return
 * @returns {delimiter[]}
 */
function getDelimiters(delimiterType: delimiterTypes, delimiterDirection: delimiterTypeDirection): delimiter[] {
    return Object.values(delimiters).filter((delimiter) => delimiter.type === delimiterType && delimiter.direction === delimiterDirection) as delimiter[];
}
