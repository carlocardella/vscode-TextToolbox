import * as vscode from 'vscode';
import { createNewEditor, getDocumentText, sleep } from './helpers';
import { convertToDotCase, convertToUppercase, convertToLowercase } from './caseConversion';
import guid = require('guid');
import * as moment from 'moment';
import { DateTime } from 'luxon';
import { insertDateTime } from './insertText';

export function experiment1() {
    let dt = DateTime.local(2020, 8, 25, 15, 34, 41);

    let dateTimeFormats = [
        'DATE_SHORT', // 8/25/2020
        'TIME_SIMPLE', // 3:34 PM
        'TIME_WITH_SECONDS', // 3:34:45 PM
        'DATETIME_SHORT', // 8/25/2020, 3:34 PM
        'DATE_HUGE', // Tuesday, August 25, 2020
        'SORTABLE', // 2020-08-25T15:34:58
        'UNIVERSAL_SORTABLE', // 2020-08-25T22:34:41Z
        'ISO8601', // 2020-08-25T15:34:41.000-07:00
        'RFC2822', // Tue, 25 Aug 2020 15:34:41 -0700
        'HTTP', // Tue, 25 Aug 2020 22:34:41 GMT
        'DATETIME_SHORT_WITH_SECONDS', // 8/25/2020, 3:34:41 PM
        'DATETIME_FULL_WITH_SECONDS', // August 25, 2020, 3:34 PM PDT
        'UNIX_SECONDS', // 1598394881
        'UNIX_MILLISECONDS' // 1598394881000
    ];

    dateTimeFormats.forEach(function (d) {
        console.log(d);
        insertDateTime(d, dt);
    });
}



export async function mySelectAll() {
    await createNewEditor();
    await vscode.commands.executeCommand('editor.action.selectAll');
    convertToUppercase(); //.then(() => {
    // await sleep(5000);
    setTimeout(experiment1, 200);
    // console.log(window.activeTextEditor?.document.getText());
    experiment1();
}
