import * as vscode from 'vscode';
import { TextDecoder } from 'util';
import * as CaseConversion from "./caseConversion";
import { createTextEditor, promiseCreateNewEditor } from './helpers';

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

export function experiment1() {
    vscode.window.showInformationMessage("entered experiment1()");
    createTextEditor().then(() => {
        vscode.commands.executeCommand('editor.action.selectAll');
    }).then(() => {
        vscode.window.showInformationMessage("before call to CaseConversion");
        CaseConversion.convertToUppercase();
    });
}


export function mySelectAll() {
    // createTextEditor().then(() => {
    //     vscode.commands.executeCommand('editor.action.selectAll');
    //     // }).then(() => {
    //     CaseConversion.convertToCamelCase();
    // });

    let editor = promiseCreateNewEditor();
    editor.then(() => {
        vscode.commands.executeCommand('editor.action.selectAll');

    });
}



async function showSampleText(context: vscode.ExtensionContext): Promise<void> {
    const sampleTextEncoded = await vscode.workspace.fs.readFile(vscode.Uri.file(context.asAbsolutePath('sample.txt')));
    const sampleText = new TextDecoder('utf-8').decode(sampleTextEncoded);
    const doc = await vscode.workspace.openTextDocument({ language: 'plaintext', content: sampleText });
    vscode.window.showTextDocument(doc);
}