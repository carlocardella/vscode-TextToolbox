import * as vscode from 'vscode';
import { window, ExtensionContext, workspace } from 'vscode';

let statusBarItem: vscode.StatusBarItem;

export function createStatusBarItem(context: ExtensionContext) {
    updateStatusBarConfiguration();
    context.subscriptions.push(statusBarItem);

    context.subscriptions.push(window.onDidChangeTextEditorSelection(updateStatusBar));
    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(updateStatusBar));
    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(countWords));
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(showUpdateMessage));
}

function showUpdateMessage() {
    window.showInformationMessage("Please reload the window for the change to take effect");
}

function updateStatusBarConfiguration() {
    // if (statusBarItem) { disposeStatusBarItem(); }
    // statusBarItem.hide();

    if (!workspace.getConfiguration().get('tt.enableStatusBarWordLineCount')) {
        disposeStatusBarItem();
        return;
    }

    let statusBarAlignment;
    switch (workspace.getConfiguration().get('tt.statusBarAlignment')) {
        case 'Right':
            statusBarAlignment = vscode.StatusBarAlignment.Right;
            break;
        case 'Left':
            statusBarAlignment = vscode.StatusBarAlignment.Left;
            break;
        default:
            break;
    }
    const statusBarPriority: number | undefined = workspace.getConfiguration().get('tt.statusBarPriority');

    if (!statusBarItem) {
        statusBarItem = window.createStatusBarItem(statusBarAlignment, statusBarPriority);
        statusBarItem.command = 'vscode-texttoolbox.createStatusBarItem';
    }
}

function countSelectedLines(selection: vscode.Selection): number {
    let n = 0;
    if (selection.start.line === selection.end.line) {
        if (selection.start.character !== selection.end.character) {
            // only one line
            n += 1;
        }
    }
    else {
        n = selection.end.line - selection.start.line + 1;
    }

    return n;
}

function countWords(): number {
    let text = window.activeTextEditor?.document.getText();
    if (!text) { return 0; }

    // remove unnecessary whitespaces
    text = text.replace(/(< ([^>]+)<)/g, '').replace(/\s+/g, ' ');
    text = text.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    let n = 0;
    if (text !== "") {
        n = text.split(" ").length;
    }

    return n;
}

function updateStatusBar() {
    const selections = window.activeTextEditor?.selections;
    if (!selections) { return; }
    let lineCount = selections.reduce((previous, current) => previous + countSelectedLines(current), 0);

    let wordCount = countWords();

    if (lineCount > 0 || wordCount > 0) {
        statusBarItem.text = `Lns: ${lineCount}, Wds: ${wordCount}`;
        statusBarItem.show();
    }
    else {
        statusBarItem.hide();
    }
}

export function disposeStatusBarItem() {
    statusBarItem.dispose();
}