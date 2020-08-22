import * as vscode from 'vscode';
import { validateSelection } from './helpers';
import { window, ExtensionContext } from 'vscode';
import { privateEncrypt } from 'crypto';

let statusBar: vscode.StatusBarItem;

export function createStatusBarItem(context: ExtensionContext) {
    statusBar = window.createStatusBarItem(vscode.StatusBarAlignment.Right, 1000);
    statusBar.command = 'vscode-texttoolbox.createStatusBarItem';
    context.subscriptions.push(statusBar);

    const selections = window.activeTextEditor?.selections;
    if (!selections) { return; }
    let lineCount = selections.reduce((previous, current) => countSelectedLines(current), 0);

    // context.subscriptions.push(window.onDidChangeTextEditorSelection(countSelectedLines));
    // statusBar.show();
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

