import * as vscode from 'vscode';
import { TextDecoder } from 'util';
import * as CaseConversion from "./caseConversion";
import { createNewEditor, getDocumentText, sleep } from './helpers';
import { window, Range, workspace } from 'vscode';
import { convertToDotCase, convertToUppercase, convertToLowercase } from './caseConversion';
import { assert, time } from 'console';
import guid = require('guid');
import { insertGUID } from './insertText';

// function sleep(ms: number): Promise<void> {
//     return new Promise(resolve => {
//         setTimeout(resolve, ms);
//     });
// }

// EUREKA!
// export function experiment1() {
//     createTextEditor().then(() => {
//         vscode.commands.executeCommand('editor.action.selectAll').then(() => {
//             convertToUppercase();
//         });
//     });
// }

// export function experiment1() {
//     console.log(window.activeTextEditor?.document.getText());
// }

// export async function experiment1() {
//     await createNewEditor();
//     insertGUID();
//     await sleep(200);
//     console.log(getDocumentText());

//     let text = getDocumentText()!.toString();
//     let validator = guid.isGuid(text);
//     window.showInformationMessage(text);
//     window.showInformationMessage(String(validator));
// }

export function experiment1() {
    const selections = window.activeTextEditor?.selections;
    if (!selections) { return; }
    let lineCount = selections.reduce((previous, current) => countLines(current), 0);
    window.showInformationMessage(String(lineCount));
}

function countLines(selection: vscode.Selection): number {
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



// THIS WORKS
// export function mySelectAll() {
//     console.log("entered mySelectAll");
//     createTextEditor().then(() => {
//         vscode.commands.executeCommand('editor.action.selectAll');
//     });
//     sleep(200).then(() => {
//         CaseConversion.convertToUppercase(); // this works too!
//     });
// }

// export function mySelectAll() {
//     createTextEditor().then(editor => {
//         vscode.commands.executeCommand('editor.action.selectAll').then(() => {
//             convertToUppercase();
//             vscode.window.showInformationMessage(editor.document.getText());
//         });
//     });
// }

// works
// export function mySelectAll() {
//     vscode.workspace.openTextDocument({ language: "plaintext", content: "test document" }).then(doc => {
//         vscode.window.showTextDocument(doc).then(() => {
//             vscode.commands.executeCommand('editor.action.selectAll').then(() => {
//                 let text = vscode.window.activeTextEditor?.document.getText();
//                 window.activeTextEditor?.edit(eb => {
//                     eb.replace(new vscode.Selection(new vscode.Position(0, 0), new vscode.Position(0, 24)), text?.toUpperCase());
//                 }).then(() => {
//                     console.log(vscode.window.activeTextEditor?.document.getText());
//                 });
//             });
//         });
//     });
// }

export async function mySelectAll() {
    await createNewEditor();
    await vscode.commands.executeCommand('editor.action.selectAll');
    convertToUppercase(); //.then(() => {
    // await sleep(5000);
    setTimeout(experiment1, 200);
    // console.log(window.activeTextEditor?.document.getText());
    experiment1();
}
