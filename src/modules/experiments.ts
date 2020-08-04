import * as vscode from 'vscode';
import { TextDecoder } from 'util';
import * as CaseConversion from "./caseConversion";
import { createNewEditor, createTextEditor } from './helpers';
import { window, Range } from 'vscode';
import { convertToDotCase, convertToUppercase, convertToLowercase } from './caseConversion';
import { time } from 'console';

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

// EUREKA!
// export function experiment1() {
//     createTextEditor().then(() => {
//         vscode.commands.executeCommand('editor.action.selectAll').then(() => {
//             convertToUppercase();
//         });
//     });
// }

export function experiment1() {
    console.log(window.activeTextEditor?.document.getText());
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
