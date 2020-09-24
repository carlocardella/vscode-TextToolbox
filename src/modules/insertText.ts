import { window } from 'vscode';
import { DateTime } from 'luxon';
import { Chance } from 'chance';
import { getActiveEditor, getLinesFromSelection } from './helpers';


/**
 * Insert a random GUID
 */
export function insertGUID() {
    const chance = new Chance();
    const editor = getActiveEditor();

    editor?.edit(editBuilder => {
        editor.selections.forEach(async s => {
            editBuilder.insert(s.active, chance.guid());
        });
    });
}

/**
 * Asks the user which DateTime format to insert
 * @async
 */
export async function pickDateTime() {
    const dateTimeFormats = [
        "DATE_SHORT", // 8/25/2020
        "TIME_SIMPLE", // 5:34 PM
        "TIME_WITH_SECONDS", // 5:34:45 PM
        "DATETIME_SHORT", // 8/25/2020, 5:34 PM
        "DATE_HUGE", // Tuesday, August 25, 2020
        "SORTABLE", // 2020-08-25T17:34:58
        "UNIVERSAL_SORTABLE", // 2020-08-26T00:35:01Z
        "ISO8601", // 2020-08-25T17:35:05.818-07:00
        "ISO8601_DATE", // 2020-08-25
        "ISO8601_TIME", // 17:35:05.818-07:00
        "RFC2822", // Tue, 25 Aug 2020 17:35:10 -0700
        "HTTP", // Wed, 26 Aug 2020 00:35:13 GMT
        "DATETIME_SHORT_WITH_SECONDS", // 8/25/2020, 5:35:17 PM
        "DATETIME_FULL_WITH_SECONDS", // August 25, 2020, 5:35 PM PDT
        "UNIX_SECONDS", // 1598402124
        "UNIX_MILLISECONDS" // 1598402132390
    ];
    const selectedFormat: string | undefined = await window.showQuickPick(dateTimeFormats, {
        ignoreFocusOut: true,
    });

    if (selectedFormat) { await insertDateTimeInternal(selectedFormat); }
}

/**
 * Insert a DateTime format based on user's selection
 * @param {string | undefined} selectedFormat Format of DateTime to insert
 * @param {DateTime} testDate Optional DateTime to render based on the selected format. Used primarily for Mocha unit tests
 * @async
 */
export async function insertDateTimeInternal(selectedFormat: string | undefined, testDate?: DateTime) {
    let date: DateTime;
    testDate ? date = testDate : date = DateTime.local();
    let text: string;
    const editor = getActiveEditor();

    editor?.edit(editBuilder => {
        editor?.selections.forEach(async s => {
            switch (selectedFormat) {
                case 'DATETIME_SHORT':
                    text = date.toLocaleString(DateTime.DATETIME_SHORT)!;
                    break;
                case 'DATE_SHORT':
                    text = date.toLocaleString(DateTime.DATE_SHORT)!;
                    break;
                case 'DATE_HUGE':
                    text = date.toLocaleString(DateTime.DATE_HUGE)!;
                    break;
                case 'TIME_SIMPLE':
                    text = date.toLocaleString(DateTime.TIME_SIMPLE)!;
                    break;
                case 'TIME_WITH_SECONDS':
                    text = date.toLocaleString(DateTime.TIME_WITH_SECONDS)!;
                    break;
                case 'SORTABLE':
                    text = date.toFormat("y-MM-dd'T'HH:mm:ss");
                    break;
                case 'UNIVERSAL_SORTABLE':
                    text = date.toUTC().toFormat("y-MM-dd'T'HH:mm:ss'Z");
                    break;
                case 'ISO8601':
                    text = date.toString();
                    break;
                case 'ISO8601_DATE':
                    text = date.toFormat("y-MM-dd");
                    break;
                case 'ISO8601_TIME':
                    text = date.toFormat("HH:mm:ss.SSSZZ");
                    break;
                case 'RFC2822':
                    text = date.toRFC2822()!;
                    break;
                case 'HTTP':
                    text = date.toHTTP();
                    break;
                case 'DATETIME_SHORT_WITH_SECONDS':
                    text = date.toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS)!;
                    break;
                case 'DATETIME_FULL_WITH_SECONDS':
                    text = date.toLocaleString(DateTime.DATETIME_FULL)!;
                    break;
                case 'UNIX_SECONDS':
                    text = date.toFormat('X');
                    break;
                case 'UNIX_MILLISECONDS':
                    text = date.toFormat('x');
                    break;
                default:
                    text = date.toString();
                    break;
            }

            editBuilder.insert(s.active, text);
        });
    });
}

/**
 * Aks the user which random string type to insert
 * @async
 */
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
        'COUNTRY_FULL_NAME',
        'PHONE',
        'ZIP_CODE',
        'STATE',
        'STATE_FULL_NAME',
        'STREET',
        'TIMEZONE',
        'PARAGRAPH',
        'HASH'
    ];
    const selectedRandomType: string | undefined = await window.showQuickPick(randomTypeToInsert, { ignoreFocusOut: true });
    if (selectedRandomType) { await insertRandomInternal(selectedRandomType); }
}

/**
 * Inserts a random string, based on the type passed as `selectRandomType`
 * @param {string | undefined} selectedRandomType User selected choise of random string to insers
 * @async
 */
export async function insertRandomInternal(selectedRandomType: string | undefined, testRandomType?: string) {
    const chance = new Chance();
    const editor = getActiveEditor();
    let text: string | number;

    editor?.edit(editBuilder => {
        editor?.selections.forEach(async s => {
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
                case 'COUNTRY_FULL_NAME':
                    text = chance.country({ full: true });
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
                case 'STATE_FULL_NAME':
                    text = chance.state({ full: true });
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
                    const length: string | undefined = await window.showInputBox({ prompt: 'Enter length', value: '32', ignoreFocusOut: true });
                    text = chance.hash({ length: length });
                    break;
                default:
                    break;
            }

            editBuilder.insert(s.active, String(text));
        });
    });
}

/**
 * Direction to pad the selection, used by `padText`
 */
export enum padDirection {
    right = 'right',
    left = 'left'
}

/**
 * Ask the user info about the paddind:
 *   - string to use for padding
 *   - length of the resulting string after padding
 * @param {padDirection} padDirection
 * @async
 */
export async function padSelection(padDirection: string) {
    const s: string | undefined = await window.showInputBox({ placeHolder: 'Padding string', ignoreFocusOut: true });
    if (!s) { return; }
    const n: string | undefined = await window.showInputBox({ placeHolder: 'Padding length', ignoreFocusOut: true });
    if (!n) { return; }

    await padSelectionInternal(padDirection, s, Number(n));
}

/**
 * Pads the selection with the user's selected string and direction, to the user's selected length
 * @param {string} padDirection Direction to pad with the user's selected string: left or right
 * @param {string} padString String to use as padding
 * @param {number} length Length of the new string, after padding
 * @async
 */
export async function padSelectionInternal(padDirection: string, padString: string, length: number) {
    const editor = getActiveEditor();

    editor?.edit(editBulder => {
        let lines = getLinesFromSelection(editor);
        let paddedSelection: string;

        lines?.forEach(line => {
            if (padDirection === "right") {
                paddedSelection = line.text.padEnd(length, padString);
            }
            if (padDirection === "left") {
                paddedSelection = line.text.padStart(length, padString);
            }

            editBulder.replace(line.range, paddedSelection);
        });
    });
}
