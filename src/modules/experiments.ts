import * as vscode from 'vscode';
import { createNewEditor, getDocumentText, sleep } from './helpers';
import { convertToDotCase, convertToUppercase, convertToLowercase } from './caseConversion';
import guid = require('guid');
import * as moment from 'moment';
import { DateTime } from 'luxon';
import { insertDateTime } from './insertText';

export function experiment1() {
    createNewEditor("asdfasdfasdaf\nasdfasdfasdfasdf\n\nf");
}



export async function mySelectAll() {
    await createNewEditor("test document");
    await vscode.commands.executeCommand('editor.action.selectAll');
    convertToUppercase(); //.then(() => {
    // await sleep(5000);
    setTimeout(experiment1, 200);
    // console.log(window.activeTextEditor?.document.getText());
    experiment1();
}
