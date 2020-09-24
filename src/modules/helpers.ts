import { commands, Range, Selection, TextEditor, window, workspace, TextLine } from 'vscode';
import * as os from 'os';

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
    if (!editor) { return; }
}

/**
 * Validate that there is an active selection
 * @returns {boolean}
 */
export function validateSelection(): boolean {
    validateEditor();

    const selections = window.activeTextEditor?.selections;
    if (!selections) { return false; }

    if (selections?.length < 1) {
        window.showWarningMessage("You must select some text first");
        return false;
    }

    return true;
}

/**
 * Pauses execution of the given number of millisaeconds
 * @param ms the number of milliseconds to wait
 */
export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

/**
 * Selects all text in the active text editor
 */
export function selectAllText(): Thenable<unknown> {
    return commands.executeCommand('editor.action.selectAll');
}

/**
 * Returns text from the Selection, or the entire document if there is no selection
 * @returns {string | undefined}
 */
export function getDocumentTextOrSelection(): string | undefined {
    const editor = getActiveEditor()!;
    const selection = editor!.selection;

    if (selection.isEmpty) {
        return editor.document.getText();
    }
    else {
        return getTextFromSelection(editor, selection);
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
 * @return {(TextLine[] | undefined)}
 */
export function getLinesFromSelection(editor: TextEditor): TextLine[] | undefined {
    let lines: TextLine[] = [];
    let selections = editor?.selections;
    if (!selections) { return; }

    selections.forEach(s => {
        let selectionStartLine = s.start.line;
        let selectionEndLine = s.end.line;

        for (let i = selectionStartLine; i <= selectionEndLine; i++) {
            lines.push(editor?.document.lineAt(i));
        }
    });

    return lines!;
}

/**
 * Creates a new TextEditor containing the passed in text
 * @param {string} text
 * @returns {TextEditor}
 */
export function createNewEditor(text?: string): PromiseLike<TextEditor> {
    return new Promise((resolve, reject) => {
        workspace.openTextDocument({ content: text, language: "plaintext", preview: false } as any).then(
            (doc) => {
                resolve(window.showTextDocument(doc));
            },
            (err) => reject(err)
        );
    });
}

/**
 * Close the active editor or all active editors in the current winddow
 * @param {boolean} closeAll Optional: if `true`, closes all editors in the current window; if `false` or missing closes the active editor only
 * @returns {Promise}
 */
export function closeTextEditor(closeAll?: boolean): Promise<void> {
    if (closeAll) {
        commands.executeCommand("workbench.action.closeAllEditors");
    }
    else {
        commands.executeCommand('workbench.action.closeActiveEditor');
    }

    return Promise.resolve();
}

/**
 * Join an array of lines using the OS EOL and returns the resulting string
 * @param {string[]} lines The array of lines (text) to convert into a single line
 * @returns {Promise<string>}
 * @async
 */
export async function linesToLine(lines: string[]): Promise<string> {
    return Promise.resolve(lines.join(os.EOL));
}

/**
 * Split a string based on the OS EOL and returns the resulting array of strings (lines)
 * @param {string} line The line to convert into an array of strings
 * @async
 * @returns {Promise<string[]>}
 */
export async function getLines(line: string): Promise<string[]> {
    return Promise.resolve(line.split(os.EOL));
}