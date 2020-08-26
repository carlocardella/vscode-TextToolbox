import * as vscode from 'vscode';
import * as guid from 'guid';
import { window } from 'vscode';
import { DateTime } from 'luxon';

function insertText(text: string): Promise<boolean> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return Promise.reject(false); }

    const position = vscode.window.activeTextEditor?.selection.active;
    if (!position) { return Promise.reject(false); }

    editor.edit(editBuilder => {
        editBuilder.insert(position, text);
    });

    return Promise.resolve(true);
}

export function insertGUID(): Promise<boolean> {
    let newGuid = guid.raw();
    let op = insertText(newGuid);

    if (op) {
        return Promise.resolve(true);
    } else {
        return Promise.resolve(false);
    }
}

export async function pickDateTime() {
    const dateTimeFormats = [
        'DATE_SHORT', // 8/25/2020
        'TIME_SIMPLE', // 5:34 PM
        'TIME_WITH_SECONDS', // 5:34:45 PM
        'DATETIME_SHORT', // 8/25/2020, 5:34 PM
        'DATE_HUGE', // Tuesday, August 25, 2020
        'SORTABLE', // 2020-08-25T17:34:58
        'UNIVERSAL_SORTABLE', // 2020-08-26T00:35:01Z
        'ISO8601', // 2020-08-25T17:35:05.818-07:00
        'RFC2822', // Tue, 25 Aug 2020 17:35:10 -0700
        'HTTP', // Wed, 26 Aug 2020 00:35:13 GMT
        'DATETIME_SHORT_WITH_SECONDS', // 8/25/2020, 5:35:17 PM
        'DATETIME_FULL_WITH_SECONDS', // August 25, 2020, 5:35 PM PDT
        'UNIX_SECONDS', // 1598402124
        'UNIX_MILLISECONDS' // 1598402132390
    ];
    const selectedFormat: string | undefined = await window.showQuickPick(dateTimeFormats, { ignoreFocusOut: true });
    insertDateTime(selectedFormat);
}

export async function insertDateTime(selectedFormat: string | undefined, testDate?: DateTime) {
    let date;
    testDate ? date = testDate : date = DateTime.local();
    let text: string;

    switch (selectedFormat) {
        case 'DATETIME_SHORT':
            text = date!.toLocaleString(DateTime.DATETIME_SHORT)!;
            break;
        case 'DATE_SHORT':
            text = date!.toLocaleString(DateTime.DATE_SHORT)!;
            break;
        case 'DATE_HUGE':
            text = date!.toLocaleString(DateTime.DATE_HUGE)!;
            break;
        case 'TIME_SIMPLE':
            text = date!.toLocaleString(DateTime.TIME_SIMPLE)!;
            break;
        case 'TIME_WITH_SECONDS':
            text = date!.toLocaleString(DateTime.TIME_WITH_SECONDS)!;
            break;
        case 'SORTABLE':
            text = date!.toFormat("y-MM-dd'T'HH:mm:ss");
            break;
        case 'UNIVERSAL_SORTABLE':
            text = date!.toUTC().toFormat("y-MM-dd'T'HH:mm:ss'Z");
            break;
        case 'ISO8601':
            text = date!.toString();
            break;
        case 'RFC2822':
            text = date!.toRFC2822()!;
            break;
        case 'HTTP':
            text = date!.toHTTP();
            break;
        case 'DATETIME_SHORT_WITH_SECONDS':
            text = date!.toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS)!;
            break;
        case 'DATETIME_FULL_WITH_SECONDS':
            text = date!.toLocaleString(DateTime.DATETIME_FULL)!;
            break;
        case 'UNIX_SECONDS':
            text = date!.toFormat('X');
            break;
        case 'UNIX_MILLISECONDS':
            text = date!.toFormat('x');
            break;
        default:
            text = date!.toString();
            break;
    }

    insertText(text!);
}
