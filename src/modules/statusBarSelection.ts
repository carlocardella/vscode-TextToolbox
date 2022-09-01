import { window, ExtensionContext, workspace, StatusBarAlignment, Selection, StatusBarItem } from "vscode";
import { getActiveEditor, getCursorPosition, getTextFromSelection } from "./helpers";

let statusBarItem: StatusBarItem;

/**
 * Registers relevant StatusBar events to the ExtensionContext
 * @param {ExtensionContext} context An ExtensionContext used to subscribe to relevant StatusBar events
 */
export function createStatusBarItem(context: ExtensionContext) {
    updateStatusBarConfiguration();
    statusBarItem.command = undefined;
    context.subscriptions.push(statusBarItem);

    context.subscriptions.push(window.onDidChangeTextEditorSelection(updateStatusBar));
    context.subscriptions.push(window.onDidChangeActiveTextEditor(updateStatusBar));
    context.subscriptions.push(window.onDidChangeActiveTextEditor(countWords));
    context.subscriptions.push(
        workspace.onDidChangeConfiguration((e) => {
            if (e.affectsConfiguration("TextToolbox.enableStatusBarWordLineCount") || e.affectsConfiguration("TextToolbox.statusBarPriority")) {
                window.showInformationMessage("Please reload the window for the change to take effect");
            }
        })
    );
}

/**
 * Updates the StatusBar configuration for this extension
 */
function updateStatusBarConfiguration() {
    if (!workspace.getConfiguration().get("TextToolbox.enableStatusBarWordLineCount")) {
        disposeStatusBarItem();
        return;
    }

    let statusBarAlignment;
    switch (workspace.getConfiguration().get("TextToolbox.statusBarAlignment")) {
        case "Right":
            statusBarAlignment = StatusBarAlignment.Right;
            break;
        case "Left":
            statusBarAlignment = StatusBarAlignment.Left;
            break;
        default:
            break;
    }
    const statusBarPriority: number | undefined = workspace.getConfiguration().get("TextToolbox.statusBarPriority");

    if (!statusBarItem) {
        statusBarItem = window.createStatusBarItem(statusBarAlignment, statusBarPriority);
        statusBarItem.command = "vscode-texttoolbox.createStatusBarItem";
    }
}

/**
 * Returns the number of lines in a selection
 * @param {Selection} selection The selection containing the lines to be counted
 * @returns {number}
 */
function countSelectedLines(selection: Selection): number {
    let n = 0;
    if (selection.start.line === selection.end.line) {
        if (selection.start.character !== selection.end.character) {
            // only one line
            n += 1;
        }
    } else {
        n = selection.end.line - selection.start.line + 1;
    }

    return n;
}

/**
 * Returns the number of works in the active document
 * @returns {number}
 */
function countWords(): number {
    let text = window.activeTextEditor?.selection.isEmpty
        ? window.activeTextEditor?.document.getText()
        : getTextFromSelection(window.activeTextEditor!, window.activeTextEditor!.selection);
    if (!text) {
        return 0;
    }

    // remove unnecessary whitespaces
    text = text.replace(/(< ([^>]+)<)/g, "").replace(/\s+/g, " ");
    text = text.replace(/^\s\s*/, "").replace(/\s\s*$/, "");
    let n = 0;
    if (text !== "") {
        n = text.split(" ").length;
    }

    return n;
}

/**
 * Updates the StatusBar item with the number of lines and words in the active editor or selections.
 * Also add the cursor position (offset)
 */
function updateStatusBar() {
    const selections = window.activeTextEditor?.selections;
    if (!selections) {
        return;
    }
    let lineCount = selections.reduce((previous, current) => previous + countSelectedLines(current), 0);

    let wordCount = countWords();

    let editor = getActiveEditor();
    let cursorPosition = getCursorPosition(editor!)[0];
    let offset = editor!.document.offsetAt(cursorPosition);
    // investigate: support multicursor offsets?

    if (lineCount > 0 || wordCount > 0) {
        statusBarItem.text = `Lns: ${lineCount}, Wds: ${wordCount}, Pos: ${offset}`;
        statusBarItem.show();
    } else {
        statusBarItem.hide();
    }
}

/**
 * Cleanup the StatusBar item
 */
export function disposeStatusBarItem() {
    statusBarItem.dispose();
}
