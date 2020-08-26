import * as vscode from 'vscode';
import { window } from 'vscode';
import { DateTime } from 'luxon';
import { Chance } from 'chance';


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
    const chance = new Chance();
    const newGuid = chance.guid();
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

export async function pickRandom() {
    const randomTypeToInsert = [
        'IPV4',
        'IPV6',
        'NUMBER',
        'PERSON_NAME',
        'SSN',
        'PROFESSION',
        'ANIMAL',
        'COMPANY',
        'DOMAIN',
        'EMAIL',
        'COLOR',
        'TWITTER',
        'URL',
        'CITY',
        'ADDRESS',
        'COUNTRY',
        'PHONE',
        'ZIP_CODE',
        'STATE',
        'STREET',
        'TIMEZONE',
        'PARAGRAPH',
        'HASH'
    ];
    const selectedRandomType: string | undefined = await window.showQuickPick(randomTypeToInsert, { ignoreFocusOut: true });
    insertRandom(selectedRandomType);
}

export async function insertRandom(selectedRandomType: string | undefined) {
    const chance = new Chance();
    let text;

    switch (selectedRandomType) {
        case 'IPV4':
            text = chance.ip();
            break;
        case 'IPV6':
            text = chance.ipv6();
            break;
        case 'NUMBER':
            text = chance.natural();
            break;
        case 'PERSON_NAME':
            const gender: string | undefined = await window.showQuickPick(['random', 'male', 'female'], { ignoreFocusOut: true });
            // TODO: add optional nationality
            // TODO: add optional middle name
            // TODO: add optional title
            if (gender === 'male') {
                text = chance.name({ gender: 'male' });
            }
            else if (gender === 'female') {
                text = chance.name({ gender: 'female' });
            }
            else {
                text = chance.name();
            }
            break;
        case 'SSN':
            text = chance.ssn();
            break;
        case 'PROFESSION':
            text = chance.profession({ rank: true });
            break;
        case 'ANIMAL':
            // Allowed types are: ocean, desert, grassland, forest, farm, pet, and zoo
            text = chance.animal();
            break;
        case 'COMPANY':
            text = chance.company();
            break;
        case 'DOMAIN':
            text = chance.domain();
            break;
        case 'EMAIL':
            text = chance.email();
            break;
        case 'COLOR':
            const colorType: string | undefined = await window.showQuickPick(['hex', 'rgb'], { ignoreFocusOut: true });
            text = chance.color({ format: colorType });
            break;
        case 'TWITTER':
            text = chance.twitter();
            break;
        case 'URL':
            text = chance.url();
            break;
        case 'CITY':
            text = chance.city();
            break;
        case 'ADDRESS':
            text = chance.address();
            break;
        case 'COUNTRY':
            text = chance.country();
            break;
        case 'PHONE':
            text = chance.phone();
            break;
        case 'ZIP_CODE':
            text = chance.zip();
            break;
        case 'STATE':
            text = chance.state();
            break;
        case 'STREET':
            // INVESTIGATE: return the whole object?
            text = chance.street();
            break;
        case 'TIMEZONE':
            text = chance.timezone().name;
            break;
        case 'PARAGRAPH':
            const n: string | undefined = await window.showInputBox({ prompt: 'How many sentences?', value: '5', ignoreFocusOut: true });
            text = chance.paragraph({ sentences: n });
            break;
        case 'HASH':
            const length: string | undefined = await window.showInputBox({ prompt: 'Enter length', value: '25', ignoreFocusOut: true });
            text = chance.hash({ length: length });
            break;
        default:
            break;
    }

    insertText(String(text));
}