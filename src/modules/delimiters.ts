import { Position, Selection } from "vscode";
import { addSelection, getActiveEditor, getCursorPosition, getTextFromSelection } from "./helpers";

export enum delimiterTypes {
    parenthesis = "parenthesis",
    quote = "quote",
}

enum typeDirection {
    open = "open",
    close = "close",
}

type delimiter = {
    name: string;
    char: string;
    pairedChar: string;
    offset: number | undefined;
    pairedOffset: number | undefined;
    type: delimiterTypes;
    direction: typeDirection;
};

const delimiters: {
    name: string;
    char: string;
    pairedChar: string;
    type: delimiterTypes;
    direction: typeDirection;
}[] = [
    {
        name: "openRound",
        char: "(",
        pairedChar: ")",
        type: delimiterTypes.parenthesis,
        direction: typeDirection.open,
    },
    {
        name: "openSquare",
        char: "[",
        pairedChar: "]",
        type: delimiterTypes.parenthesis,
        direction: typeDirection.open,
    },
    {
        name: "openCurly",
        char: "{",
        pairedChar: "}",
        type: delimiterTypes.parenthesis,
        direction: typeDirection.open,
    },
    {
        name: "openChevron",
        char: "<",
        pairedChar: ">",
        type: delimiterTypes.parenthesis,
        direction: typeDirection.open,
    },
    {
        name: "openSingleQuote",
        char: "'",
        pairedChar: "'",
        type: delimiterTypes.quote,
        direction: typeDirection.open,
    },
    {
        name: "openDoubleQuote",
        char: '"',
        pairedChar: '"',
        type: delimiterTypes.quote,
        direction: typeDirection.open,
    },
    {
        name: "openBacktick",
        char: "`",
        pairedChar: "`",
        type: delimiterTypes.quote,
        direction: typeDirection.open,
    },
    {
        name: "closeRound",
        char: ")",
        pairedChar: "(",
        type: delimiterTypes.parenthesis,
        direction: typeDirection.close,
    },
    {
        name: "closeSquare",
        char: "]",
        pairedChar: "[",
        type: delimiterTypes.parenthesis,
        direction: typeDirection.close,
    },
    {
        name: "closeCurly",
        char: "}",
        pairedChar: "{",
        type: delimiterTypes.parenthesis,
        direction: typeDirection.close,
    },
    {
        name: "closeChevron",
        char: ">",
        pairedChar: "<",
        type: delimiterTypes.parenthesis,
        direction: typeDirection.close,
    },
    {
        name: "closeSingleQuote",
        char: "'",
        pairedChar: "'",
        type: delimiterTypes.quote,
        direction: typeDirection.close,
    },
    {
        name: "closeDoubleQuote",
        char: '"',
        pairedChar: '"',
        type: delimiterTypes.quote,
        direction: typeDirection.close,
    },
    {
        name: "closeBacktick",
        char: "`",
        pairedChar: "`",
        type: delimiterTypes.quote,
        direction: typeDirection.close,
    },
];

type selectionOffset = {
    start: number;
    end: number;
};

type textSpitAtSelectionStart = {
    textBeforeSelectionStart: string;
    textAfterSelectionStart: string;
};

const openDelimiters = delimiters.filter((delimiter) => delimiter.direction === "open"); //.map((delimiter) => delimiter.char);
const closeDelimiters = delimiters.filter((delimiter) => delimiter.direction === "close"); //.map((delimiter) => delimiter.char);

function getSelectionOffset(): selectionOffset | undefined {
    const editor = getActiveEditor();
    if (!editor) {
        return;
    }

    return {
        start: editor.document.offsetAt(editor.selection.start),
        end: editor.document.offsetAt(editor.selection.end),
    };
}

function getTextSplitAtSelectionStart(): textSpitAtSelectionStart | undefined {
    let editor = getActiveEditor();
    if (!editor) {
        return;
    }

    let selectionStartPosition = getSelectionOffset()?.start;
    if (!selectionStartPosition) {
        return;
    }

    let documentStartPosition = new Position(0, 0);
    let documentEndPosition = new Position(editor.document.lineCount - 1, editor.document.lineAt(editor.document.lineCount - 1).range.end.character);
    let textBeforeSelectionStart = getTextFromSelection(editor, new Selection(documentStartPosition, editor.document.positionAt(selectionStartPosition)))!;
    let textAfterSelectionStart = getTextFromSelection(editor, new Selection(editor.document.positionAt(selectionStartPosition), documentEndPosition))!;

    return {
        textBeforeSelectionStart,
        textAfterSelectionStart,
    };
}

// function shouldExpandSelection(): boolean {
//     let shouldExpandSelection = false;
//     const editor = getActiveEditor();
//     if (!editor) {
//         return shouldExpandSelection;
//     }

//     const cursorPosition = getCursorPosition(editor)[0];
//     let selectionContainsCursor = false;
//     editor.selection.contains(cursorPosition) ? (selectionContainsCursor = true) : (selectionContainsCursor = false);

//     if (selectionContainsCursor && !editor.selection.isEmpty) {
//         shouldExpandSelection = true;
//     }

//     return shouldExpandSelection;
// }

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

function findOpeningDelimiter(text: string, delimiterType: delimiterTypes): delimiter | undefined {
    if (!text) {
        return undefined;
    }

    let position = text.length - 1;
    for (position; position >= 0; position--) {
        if (openDelimiters.filter((delimiter) => delimiter.type === delimiterType).find((delimiter) => delimiter.char === text[position])) {
            return {
                name: delimiters.filter((delimiter) => delimiter.char === text[position])[0].name,
                char: text[position],
                pairedChar: delimiters.filter((delimiter) => delimiter.char === text[position])[0].pairedChar,
                offset: position,
                pairedOffset: undefined, // update
                type: delimiterType,
                direction: typeDirection.open,
            };
        }
    }

    return undefined;
}

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
        openChevron: 0,
        closeChevron: 0,
        singleQuote: 0,
        doubleQuote: 0,
        backtick: 0
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
            dic.openChevron++;
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
        dic.openChevron > 0 ||
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
                dic.openChevron++;
                break;
            case ">":
                dic.openChevron--;
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
        dic.openChevron === 0 ||
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
            offset: startOffset + position,
            pairedOffset: undefined, // update
            type: openingDelimiter.type,
            direction: typeDirection.close,
        };
    }

    return undefined;
}

export function selectTextBetweenDelimiters(delimiterType: delimiterTypes) {
    const editor = getActiveEditor();
    if (!editor) {
        return;
    }

    const activeDocument = editor.document;
    if (!activeDocument) {
        return;
    }

    let selectionOffset = getSelectionOffset();
    if (!selectionOffset) {
        return;
    }

    let newSelectionOffsetStart: number = 0;
    let newSelectionOffsetEnd: number = 0;

    let textSplitAtSelectionStart = getTextSplitAtSelectionStart();
    if (!textSplitAtSelectionStart) {
        return;
    }
    let openingDelimiter = findOpeningDelimiter(textSplitAtSelectionStart.textBeforeSelectionStart, delimiterType);
    if (!openingDelimiter) {
        return;
    }
    let closingDelimiter = findClosingDelimiter(textSplitAtSelectionStart.textAfterSelectionStart, openingDelimiter, selectionOffset.start);
    if (!closingDelimiter) {
        // closing delimiter not found, let's try to expand the selection but only for one iteration to avoid infinite loops @todo
        return;
    }

    newSelectionOffsetStart = openingDelimiter.offset!;
    newSelectionOffsetEnd = closingDelimiter.offset!;

    let currentSelection = getTextFromSelection(editor, editor.selection);
    if (selectionIncludesDelimiters(currentSelection!, delimiterType) || !currentSelection) {
        // the current selection already includes the delimiters, so the new selection should not
        newSelectionOffsetStart++;
        newSelectionOffsetEnd--;
    }

    addSelection(activeDocument.positionAt(newSelectionOffsetStart), activeDocument.positionAt(newSelectionOffsetEnd));
}

// fix: if the cursor is at the dash (-) position, it will not select the text. The reason may be because the first opening bracket is { but does not have a proper closing
// console.log(`some text: "${startDelimiter}" - "${endDelimiter}"`);

// textAfterCursor: " "${endDelimiter}"`); <== two open { but only one closed, so findClosingDelimiter returns undefined
