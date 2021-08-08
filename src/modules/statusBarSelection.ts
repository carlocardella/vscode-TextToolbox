import { window, ExtensionContext, workspace, StatusBarAlignment, Selection, StatusBarItem } from "vscode";

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
    let text = window.activeTextEditor?.document.getText();
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
 * Updates the StatusBar item with the number of lines and workds in the active editor
 */
function updateStatusBar() {
    const selections = window.activeTextEditor?.selections;
    if (!selections) {
        return;
    }
    let lineCount = selections.reduce((previous, current) => previous + countSelectedLines(current), 0);

    let wordCount = countWords();

    if (lineCount > 0 || wordCount > 0) {
        statusBarItem.text = `Lns: ${lineCount}, Wds: ${wordCount}`;
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
