import { commands, Range, Selection, TextEditor, window, workspace, TextLine, DocumentHighlight, Position, EndOfLine } from "vscode";
import * as os from "os";

/**
 * Returns the active text editor
 * @returns {TextEditor | undefined}
 */
export function getActiveEditor(): TextEditor | undefined {
    return window.activeTextEditor;
}

/**
 * Validates that there is an active text editor
 */
function validateEditor() {
    const editor = getActiveEditor();
    if (!editor) {
        return;
    }
}

/**
 * Validate that there is an active selection
 * @returns {boolean}
 */
export function validateSelection(): boolean {
    validateEditor();

    const selections = window.activeTextEditor?.selections;
    if (!selections) {
        return false;
    }

    if (selections?.length < 1) {
        window.showWarningMessage("You must select some text first");
        return false;
    }

    return true;
}

/**
 * Pauses execution of the given number of milliseconds
 * @param milliseconds the number of milliseconds to wait
 */
export function sleep(milliseconds: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
    });
}

/**
 * Selects all text in the active text editor
 */
export function selectAllText(): Thenable<unknown> {
    return commands.executeCommand("editor.action.selectAll");
}

/**
 * Returns text from the Selection, or the entire document if there is no selection
 * Does not support multiple selections
 *
 * @returns {string | undefined}
 */
export function getDocumentTextOrSelection(fullLineOnly?: boolean): string | undefined {
    const editor = getActiveEditor()!;
    const selection = editor!.selection;

    if (selection.isEmpty) {
        return editor.document.getText();
    } else {
        if (fullLineOnly) {
            
        } else {
            return getTextFromSelection(editor, selection);
        }
    }
}

/**
 * Returns the current selection or the entire document as new selection, but it does not actually select the text in the editor
 * @param editor The editor containing the selection to return or create
 * @returns {Selection}
 */
export function getSelection(editor: TextEditor): Selection {
    if (editor.selection.isEmpty) {
        let selection: Selection;

        const lineCount = editor.document.lineCount;
        selection = new Selection(0, 0, lineCount, editor.document.lineAt(lineCount - 1).text.length);
        return selection;
    }

    return editor.selection;
}

/**
 * Returns text from the passed in Selection
 * @param editor The Editor with the selection
 * @param selection The Selection object to convert into text
 * @type {string | undefined}
 */
export function getTextFromSelection(editor: TextEditor, selection: Selection): string | undefined {
    return editor.document.getText(new Range(selection.start, selection.end));
}

/**
 * Returns an object with line information for each line in the selection
 * @param editor The Editor with the selection
 * @param selection The Selection object to split into lines
 * @return {(TextLine[] | undefined)}
 */
export function getLinesFromSelection(editor: TextEditor, selection?: Selection): TextLine[] | undefined {
    let lines: TextLine[] = [];
    let selections: Selection[] = [];

    if (selection) {
        selections.push(selection);
    } else {
        // The type 'readonly Selection[]' is 'readonly' and cannot be assigned to the mutable type 'Selection[]'.
        // https://stackoverflow.com/a/53416703
        // selection = editor?.selections;
        selections = editor.selections.map((s) => s);
        if (!selections) {
            return;
        }
    }

    selections.forEach((s) => {
        let selectionStartLine = s.start.line;
        let selectionEndLine = s.end.line;

        for (let i = selectionStartLine; i <= selectionEndLine; i++) {
            lines.push(editor?.document.lineAt(i));
        }
    });

    return lines!;
}

/**
 * Returns an array of lines from the document or selection
 *
 * @export
 * @param {TextEditor} editor The editor containing the selection
 * @return {*}  {(TextLine[] | undefined)}
 */
export function getLinesFromDocumentOrSelection(editor: TextEditor): TextLine[] | undefined;
/**
 * Returns an array of lines from the document or selection
 *
 * @export
 * @param {TextEditor} editor The editor containing the selection
 * @param {Range} range The range to split into lines
 * @return {*}  {(TextLine[] | undefined)}
 */
export function getLinesFromDocumentOrSelection(editor: TextEditor, range: Range): TextLine[] | undefined;
/**
 * Returns an array of lines from the document or selection
 *
 * @export
 * @param {TextEditor} editor The editor containing the selection
 * @param {Selection} selection The selection to split into lines
 * @return {*}  {(TextLine[] | undefined)}
 */
export function getLinesFromDocumentOrSelection(editor: TextEditor, selection: Selection): TextLine[] | undefined;
/**
 * Returns an array of lines from the document or selection
 *
 * @export
 * @param {TextEditor} editor The editor containing the selection
 * @param {Range} [range] The range to get lines from
 * @param {Selection} [selection] The selection to get lines from
 * @return {*}  {(TextLine[] | undefined)}
 */
export function getLinesFromDocumentOrSelection(editor: TextEditor, range?: Range, selection?: Selection): TextLine[] | undefined {
    const lineCount = editor.document.lineCount;
    if (lineCount < 1) {
        return;
    }

    let textLines: TextLine[] = [];

    if (selection) {
        return getLinesFromSelection(editor, selection);
    } else if (range) {
        return getLinesFromSelection(editor, new Selection(range.start, range.end));
    } else {
        for (let i = 0; i < lineCount; i++) {
            textLines.push(editor.document.lineAt(i));
        }
    }

    return textLines;
}

/**
 * Creates a new TextEditor containing the passed in text
 * @param {string} text
 * @returns {TextEditor}
 */
export function createNewEditor(text?: string): Promise<TextEditor> {
    return new Promise(async (resolve, reject) => {
        await workspace.openTextDocument({ content: text, language: "plaintext", preview: false } as any).then(
            (doc) => {
                resolve(window.showTextDocument(doc));
            },
            (err) => reject(err)
        );
    });
}

/**
 * Close the active editor or all active editors in the current window
 * @param {boolean} closeAll Optional: if `true`, closes all editors in the current window; if `false` or missing closes the active editor only
 * @returns {Promise}
 */
export function closeTextEditor(closeAll?: boolean): Promise<void> {
    if (closeAll) {
        commands.executeCommand("workbench.action.closeAllEditors");
    } else {
        commands.executeCommand("workbench.action.closeActiveEditor");
    }

    return Promise.resolve();
}

/**
 * Join an array of lines using the document EOL and returns the resulting string
 * @param {string[]} lines The array of lines (text) to convert into a single line
 * @returns {Promise<string>}
 * @async
 */
export async function linesToLine(lines: string[]): Promise<string> {
    const eol = getDocumentEOL(getActiveEditor());

    return Promise.resolve(lines.join(eol));
}

/**
 * Split a string based on the document EOL and returns the resulting array of strings (lines)
 * @param {string} line The line to convert into an array of strings
 * @returns {*} {Promise<string[]>}
 * @async
 */
export async function getLinesFromString(line: string): Promise<string[]> {
    const eol = getDocumentEOL(getActiveEditor());

    return Promise.resolve(line.split(eol));
}

/**
 * Returns an array of selections if any is available in the active document, otherwise returns the entire document as a single selection
 * @param {TextEditor} editor The active text editor to get the selections from
 * @return {*}  {Promise<Selection[]>}
 * @async
 */
export async function getSelections(editor: TextEditor): Promise<readonly Selection[]> {
    if (editor.selections.length >= 1 && !editor.selection.isEmpty) {
        return Promise.resolve(editor.selections);
    } else {
        const lastLine = editor.document.lineAt(editor.document.lineCount - 1);
        let selection = new Selection(0, 0, lastLine.lineNumber, lastLine.text.length);
        let selections: Selection[] = [];
        selections.push(selection);
        return Promise.resolve(selections);
    }
}

/**
 * Returns a RegExp object based on a RegExp string and flags
 *
 * @export
 * @param {string} regex The RegExp string to convert into a RegExp object
 * @return {*}  {RegExp}
 */
export function getRegExpObject(regex: string): RegExp {
    const regExpFlags = regex.match("(?!.*/).*")![0] || undefined;
    const regExpString = regex.match("(?<=/)(.*?)(?=/)")![0];
    const regExpObject = new RegExp(regExpString, regExpFlags);

    return new RegExp(regExpObject);
}

/**
 * Adds a new selection to the active editor; replaces any existing selections
 *
 * @export
 * @param {Position} positionStart The start position of the selection
 * @param {Position} positionEnd The end position of the selection
 * @return {*}
 */
export function addSelection(positionStart: Position, positionEnd: Position) {
    let editor = getActiveEditor();
    if (!editor) {
        return;
    }

    let document = editor.document;
    if (!document) {
        return;
    }

    let newSelection = new Selection(positionStart, positionEnd);
    editor.selections = [newSelection];
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

/**
 * Returns the end of line sequence that is predominately used in this document.
 * If the document contains mixed line endings, it returns the OS default.
 *
 * @export
 * @param {?TextEditor} [editor] The editor to get the EOL from
 * @returns {string}
 */
export function getDocumentEOL(editor?: TextEditor): string {
    if (!editor) {
        editor = getActiveEditor();
    }
    if (!editor) {
        return os.EOL;
    }

    if (editor.document.eol === EndOfLine.CRLF) {
        return "\r\n";
    } else if (editor.document.eol === EndOfLine.LF) {
        return "\n";
    }

    return os.EOL;
}
