import { QuickPickItem, window } from "vscode";
import { DateTime } from "luxon";
import { Chance } from "chance";
import { createNewEditor, getActiveEditor, getDocumentEOL, getLinesFromSelection } from "./helpers";
import { LoremIpsum } from "lorem-ipsum";
import { randomBytes } from "crypto";

/**
 * Insert a random GUID, or a neutral GUID made of all zeros
 *
 * @export
 * @param {?boolean} [uniqueRandomValues] If true, each selection will have a unique GUID (unless the GUID is all zeros). If false, all selections will have the same GUID.
 * @param {?boolean} [allZeros] If true, all GUIDs will be all zeros. If false, GUIDs will be random.
 */
export function insertGUID(uniqueRandomValues?: boolean, allZeros?: boolean) {
    const chance = new Chance();
    const editor = getActiveEditor();
    let guid = allZeros ? "00000000-0000-0000-0000-000000000000" : chance.guid();

    editor?.edit((editBuilder) => {
        editor.selections.forEach(async (s) => {
            if (uniqueRandomValues) {
                guid = chance.guid();
            }
            s.isEmpty ? editBuilder.insert(s.active, guid) : editBuilder.replace(s, guid);
        });
    });
}

/**
 * Insert a new UUID in the document or selection
 *
 * @export
 * @param {boolean} [uniqueRandomValues]
 */
export function insertUUID(uniqueRandomValues?: boolean) {
    const editor = getActiveEditor();
    let uuid = generateUUID();

    editor?.edit((editBuilder) => {
        editor.selections.forEach(async (s) => {
            if (uniqueRandomValues) {
                uuid = generateUUID();
            }
            s.isEmpty ? editBuilder.insert(s.active, uuid) : editBuilder.replace(s, uuid);
        });
    });
}

/**
 * Returns a new UUID
 *
 * @return {*}  {string}
 */
function generateUUID(): string {
    const match = randomBytes(16)
        .toString("hex")
        .match(/(.{8})(.{4})(.{4})(.{4})(.{12})/);

    if (match === null) {
        throw new Error("Failed to generate UUID");
    }

    return match.slice(1).join("-");
}

/**
 * Asks the user which DateTime format to insert
 *
 * @export
 * @async
 * @returns {*}
 */
export async function pickDateTime() {
    const dateTimeFormats = [
        "DATE_SHORT", // 8/25/2020
        "DATE_LONG", // Tuesday, August 25, 2020
        "TIME_SIMPLE", // 5:34 PM
        "TIME_WITH_SECONDS", // 5:34:45 PM
        "DATETIME_SHORT", // 8/25/2020, 5:34 PM
        "DATETIME_SHORT_WITH_SECONDS", // 8/25/2020, 5:35:17 PM
        "DATETIME_FULL_WITH_SECONDS", // August 25, 2020, 5:35 PM PDT
        "DATETIME_HUGE", // Sunday, May 30, 2021, 5:59 PM PDT
        "SORTABLE", // 2020-08-25T17:34:58
        "UNIVERSAL_SORTABLE", // 2020-08-26T00:35:01Z
        "ROUNDTRIP", // 2021-05-31T00:52:12.057Z
        "ISO8601", // 2020-08-25T17:35:05.818-07:00
        "ISO8601_DATE", // 2020-08-25
        "ISO8601_TIME", // 17:35:05.818-07:00
        "RFC2822", // Tue, 25 Aug 2020 17:35:10 -0700
        "HTTP", // Wed, 26 Aug 2020 00:35:13 GMT
        "UNIX_SECONDS", // 1598402124
        "UNIX_MILLISECONDS", // 1598402132390
    ];

    let quickPickItems: QuickPickItem[] = [];
    dateTimeFormats.forEach((item) => {
        let qp: QuickPickItem = {
            label: item,
            description: getTimeFormatsQuickPickItemDescription(item),
        };
        quickPickItems.push(qp);
    });

    const selectedFormat = await window.showQuickPick(quickPickItems, { ignoreFocusOut: true });

    if (selectedFormat) {
        await insertDateTimeInternal(selectedFormat.label);
    }
}

/**
 * Returns the formatted DateTime.
 * This is used to populate the "description" in the QuickPick but also to get the actual formatted DateTime to insert in the active editor
 * @param {string} format DateTime format to return
 * @param {DateTime} [testDate] Optional DateTime to format (default is the current DateTime); this is useful to run local tests
 * @return {*}  {string}
 */
function getTimeFormatsQuickPickItemDescription(format: string, testDate?: DateTime): string {
    let date: DateTime;
    testDate ? (date = testDate) : (date = DateTime.local());
    let dateTimeValue: string;

    switch (format) {
        case "DATETIME_SHORT":
            dateTimeValue = date.toLocaleString(DateTime.DATETIME_SHORT)!;
            break;
        case "DATE_SHORT":
            dateTimeValue = date.toLocaleString(DateTime.DATE_SHORT)!;
            break;
        case "DATE_LONG":
            dateTimeValue = date.toLocaleString(DateTime.DATE_HUGE)!;
            break;
        case "DATETIME_HUGE":
            dateTimeValue = date.toLocaleString({
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
                timeZoneName: "short",
            });
            break;
        case "TIME_SIMPLE":
            dateTimeValue = date.toLocaleString(DateTime.TIME_SIMPLE)!;
            break;
        case "TIME_WITH_SECONDS":
            dateTimeValue = date.toLocaleString(DateTime.TIME_WITH_SECONDS)!;
            break;
        case "SORTABLE":
            dateTimeValue = date.toFormat("y-MM-dd'T'HH:mm:ss");
            break;
        case "UNIVERSAL_SORTABLE":
            dateTimeValue = date.toUTC().toFormat("y-MM-dd'T'HH:mm:ss'Z");
            break;
        case "ROUNDTRIP":
            dateTimeValue = date.toUTC().toFormat("yyyy'-'MM'-'dd'T'HH':'mm':'ss'.'SSS'Z");
            break;
        case "ISO8601":
            dateTimeValue = date.toString();
            break;
        case "ISO8601_DATE":
            dateTimeValue = date.toFormat("y-MM-dd");
            break;
        case "ISO8601_TIME":
            dateTimeValue = date.toFormat("HH:mm:ss.SSSZZ");
            break;
        case "RFC2822":
            dateTimeValue = date.toRFC2822()!;
            break;
        case "HTTP":
            dateTimeValue = date.toHTTP()!;
            break;
        case "DATETIME_SHORT_WITH_SECONDS":
            dateTimeValue = date.toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS)!;
            break;
        case "DATETIME_FULL_WITH_SECONDS":
            dateTimeValue = date.toLocaleString(DateTime.DATETIME_FULL)!;
            break;
        case "UNIX_SECONDS":
            dateTimeValue = date.toFormat("X");
            break;
        case "UNIX_MILLISECONDS":
            dateTimeValue = date.toFormat("x");
            break;
        default:
            dateTimeValue = date.toString();
            break;
    }

    return dateTimeValue;
}

/**
 * Insert a DateTime format based on user's selection
 * @param {string | undefined} selectedFormat Format of DateTime to insert
 * @param {DateTime} testDate Optional DateTime to render based on the selected format. Used primarily for Mocha unit tests
 * @async
 */
export async function insertDateTimeInternal(selectedFormat: string, testDate?: DateTime) {
    let date: DateTime;
    testDate ? (date = testDate) : (date = DateTime.local());
    let text: string;
    const editor = getActiveEditor();

    editor?.edit((editBuilder) => {
        editor?.selections.forEach(async (s) => {
            text = getTimeFormatsQuickPickItemDescription(selectedFormat, date);
            s.isEmpty ? editBuilder.insert(s.active, text) : editBuilder.replace(s, text);
        });
    });
}

/**
 * Pick a random type of string to insert at the cursor's position
 *
 * @export
 * @async
 * @returns {(Promise<string | undefined>)}
 */
export async function pickRandom(): Promise<string | undefined> {
    let quickPickItems: QuickPickItem[] = [];
    Object.values(randomTypes).forEach(async (item) => {
        let qp: QuickPickItem = {
            label: item,
            description: getRandom(item, 10),
        };
        quickPickItems.push(qp);
    });

    const pick = await window.showQuickPick(quickPickItems, {
        canPickMany: false,
        title: "Pick a random item to insert",
        ignoreFocusOut: true,
        matchOnDetail: true,
    });

    return Promise.resolve(pick?.label);
}

/**
 * Insert a random string at the cursor's position
 *
 * @export
 * @async
 * @param {string} randomType Type of random string to insert
 * @param {(number | undefined)} length Length of random string to insert
 * @param {boolean} uniqueRandomValues If true, each random string will be unique
 * @returns {*}
 */
export async function insertRandom(randomType: string, length: number | undefined, uniqueRandomValues: boolean) {
    let text = getRandom(randomType, length);
    const editor = getActiveEditor();

    editor?.edit((editBuilder) => {
        editor?.selections.forEach(async (s) => {
            if (uniqueRandomValues) {
                text = getRandom(randomType, length);
            }
            s.isEmpty ? editBuilder.insert(s.active, text) : editBuilder.replace(s, text);
        });
    });
}

/**
 * Random type sto insert
 *
 * @export
 * @enum {number}
 */
export enum randomTypes {
    "IPV4" = "IPv4",
    "IPV6" = "IPv6",
    "NUMBER" = "Number",
    "MALE_NAME" = "Male name",
    "FEMALE_NAME" = "Female name",
    "RANDOM_NAME" = "Random name",
    "SSN" = "Social Security Number",
    "PROFESSION" = "Profession",
    "ANIMAL" = "Animal",
    "COMPANY" = "Company",
    "DOMAIN" = "Domain",
    "EMAIL" = "Email",
    "HEX_COLOR" = "Hex color",
    "RGB_COLOR" = "Rgb color",
    "TWITTER" = "Twitter handle",
    "URL" = "Url",
    "CITY" = "City",
    "ADDRESS" = "Address",
    "COUNTRY" = "Country",
    "COUNTRY_FULL_NAME" = "Country full name",
    "PHONE" = "Phone number",
    "ZIP_CODE" = "Zip code",
    "STATE" = "State",
    "STATE_FULL_NAME" = "State full name",
    "STREET" = "Street address",
    "TIMEZONE" = "Timezone",
    "PARAGRAPH" = "Paragraph...",
    "HASH" = "Hash...",
}

/**
 * Get a random string based on the type of random string to insert
 *
 * @param {string} randomType Type of random string to insert
 * @param {(number | undefined)} length Length of random string to insert
 * @returns {string}
 */
function getRandom(randomType: string, length: number | undefined): string {
    const chance = new Chance();
    let text: string;

    switch (randomType) {
        case randomTypes.IPV4:
            text = chance.ip();
            break;
        case randomTypes.IPV6:
            text = chance.ipv6();
            break;
        case randomTypes.NUMBER:
            text = chance.natural().toString();
            break;
        case randomTypes.MALE_NAME:
            // TODO: add optional nationality
            // TODO: add optional middle name
            // TODO: add optional title
            text = chance.name({ gender: "male" });
            break;
        case randomTypes.FEMALE_NAME:
            text = chance.name({ gender: "female" });
            break;
        case randomTypes.RANDOM_NAME:
            text = chance.name();
            break;
        case randomTypes.SSN:
            text = chance.ssn();
            break;
        case randomTypes.PROFESSION:
            text = chance.profession({ rank: true });
            break;
        case randomTypes.ANIMAL:
            // Allowed types are: ocean, desert, grassland, forest, farm, pet, and zoo
            text = chance.animal();
            break;
        case randomTypes.COMPANY:
            text = chance.company();
            break;
        case randomTypes.DOMAIN:
            text = chance.domain();
            break;
        case randomTypes.EMAIL:
            text = chance.email();
            break;
        case randomTypes.HEX_COLOR:
            text = chance.color({ format: "hex" });
            break;
        case randomTypes.RGB_COLOR:
            text = chance.color({ format: "rgb" });
            break;
        case randomTypes.TWITTER:
            text = chance.twitter();
            break;
        case randomTypes.URL:
            text = chance.url();
            break;
        case randomTypes.CITY:
            text = chance.city();
            break;
        case randomTypes.ADDRESS:
            text = chance.address();
            break;
        case randomTypes.COUNTRY:
            text = chance.country();
            break;
        case randomTypes.COUNTRY_FULL_NAME:
            text = chance.country({ full: true });
            break;
        case randomTypes.PHONE:
            text = chance.phone();
            break;
        case randomTypes.ZIP_CODE:
            text = chance.zip();
            break;
        case randomTypes.STATE:
            text = chance.state();
            break;
        case randomTypes.STATE_FULL_NAME:
            text = chance.state({ full: true });
            break;
        case randomTypes.STREET:
            // INVESTIGATE: return the whole object?
            text = chance.street();
            break;
        case randomTypes.TIMEZONE:
            text = chance.timezone().name;
            break;
        case randomTypes.PARAGRAPH:
            text = chance.paragraph({ sentences: length });
            break;
        case randomTypes.HASH:
            text = chance.hash({ length: length });
            break;
        default:
            break;
    }

    return text!;
}

/**
 * Direction to pad the selection, used by `padText`
 */
export enum padDirection {
    right = "right",
    left = "left",
}

/**
 * Ask the user info about the padding:
 *   - string to use for padding
 *   - length of the resulting string after padding
 * @param {padDirection} padDirection
 * @async
 */
export async function padSelection(padDirection: string) {
    const s: string | undefined = await window.showInputBox({ placeHolder: "Padding string", ignoreFocusOut: true });
    if (!s) {
        return;
    }
    const n: string | undefined = await window.showInputBox({ placeHolder: "Padding length", ignoreFocusOut: true });
    if (!n) {
        return;
    }

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

    editor?.edit((editBuilder) => {
        let lines = getLinesFromSelection(editor);
        let paddedSelection: string;

        lines?.forEach((line) => {
            if (padDirection === "right") {
                paddedSelection = line.text.padEnd(length, padString);
            }
            if (padDirection === "left") {
                paddedSelection = line.text.padStart(length, padString);
            }

            editBuilder.replace(line.range, paddedSelection);
        });
    });
}

/**
 * Insert line numbers in the active selection, the user can change the starting index (defaut: 1)
 * @return {*}  {Promise<boolean>}
 * @async
 */
export async function insertLineNumbers(): Promise<boolean> {
    let startFrom = await window.showInputBox({ prompt: "start from", value: "1", ignoreFocusOut: true });
    if (!startFrom) {
        return false;
    }

    return Promise.resolve(await insertLineNumbersInternal(startFrom));
}

/**
 * Insert line numbers in the active selection, the user can change the starting index (defaut: 1)
 * @return {*}  {Promise<boolean>}
 * @async
 */
export async function insertLineNumbersInternal(startFrom: string): Promise<boolean> {
    let i = Number(startFrom);

    const editor = getActiveEditor();
    if (!editor) {
        return false;
    }

    let lines = getLinesFromSelection(editor);

    editor.edit((editBuilder) => {
        lines?.forEach((line) => {
            editBuilder.replace(line.range, `${i} ${line.text}`);
            i++;
        });
    });

    return Promise.resolve(true);
}

/**
 * Type of sequence to insert
 * @enum {number}
 */
export enum sequenceType {
    Numbers = "Numbers",
    Letters = "Letters",
}

/**
 * Ask the user information about the sequence of numbers or letters to insert
 * @param {sequenceType} type The type of characters to use for the sequence to insert
 * @return {*} {Promise<boolean>}
 * @async
 */
export async function insertSequence(type: sequenceType): Promise<boolean> {
    let startFrom: string | undefined;
    switch (type) {
        case "Letters":
            startFrom = await window.showInputBox({ prompt: "start from", value: "a", ignoreFocusOut: true });
            if (!startFrom) {
                return false;
            }
            break;
        case "Numbers":
            startFrom = await window.showInputBox({ prompt: "start from", value: "1", ignoreFocusOut: true });
            if (!startFrom) {
                return false;
            }
            break;
        default:
            break;
    }

    const length = await window.showInputBox({ prompt: "length", value: "10", ignoreFocusOut: true });
    if (!length) {
        return false;
    }

    return Promise.resolve(await insertSequenceInternal(type, startFrom!, Number(length)));
}

/**
 * Internal function to inserts the sequence of numbers or letters as selected by the user
 * @param {sequenceType} type The type of characters to use for the sequence to insert
 * @param {string} startFrom Starting index (for numbers sequence) or letter (for letters sequence)
 * @param {number} length The length of the sequence to insert
 * @param {string} [direction] The direction of the sequence to insert
 * @return {*} {Promise<boolean>}
 * @async
 */
export async function insertSequenceInternal(type: sequenceType, startFrom: string, length: number, direction?: string): Promise<boolean> {
    const editor = getActiveEditor();
    if (!editor) {
        return false;
    }

    const alphabetLowercase = "abcdefghijklmnopqrstuvwxyz";
    const alphabetUppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let i: number;
    type === "Letters" ? (i = alphabetLowercase.indexOf(startFrom)) : (i = Number(startFrom));
    const eol = getDocumentEOL(getActiveEditor());

    editor.edit((editBuilder) => {
        let position = editor.selection.active;
        length = i + length;
        let newText: string = "";

        for (i; i < length; i++) {
            if (type === "Letters") {
                newText = alphabetLowercase.charAt(i);
            }
            if (type === "Numbers") {
                newText = String(i);
            }
            editBuilder.insert(position, newText);
            editBuilder.insert(position.translate({ characterDelta: 1 }), eol);
            position = position.translate(1, 0);
        }
    });

    return Promise.resolve(true);
}

/**
 * Insert random Lorem Ipsum style text.
 * @param {string} loremIpsumType Type of text to insert: Paragraphs, Sentences or Words
 * @param {number} length Length of the text to insert: how many (Paragraphs, Sentences, Words).
 * @return {*}  {Promise<boolean>}
 */
export async function insertLoremIpsumInternal(loremIpsumType: string, length: number): Promise<boolean> {
    const editor = getActiveEditor();
    const loremIpsum = new LoremIpsum();
    var lorem: string;

    switch (loremIpsumType) {
        case "Paragraphs":
            lorem = loremIpsum.generateParagraphs(length);
            break;
        case "Sentences":
            lorem = loremIpsum.generateSentences(length);
            break;
        case "Words":
            lorem = loremIpsum.generateWords(length);
            break;
        default:
            break;
    }

    editor?.edit((editBuilder) => {
        editor.selections.forEach(async (s) => {
            s.isEmpty ? editBuilder.insert(s.active, lorem) : editBuilder.replace(s, lorem);
        });
    });

    return Promise.resolve(true);
}

/**
 * Insert random Lorem Ipsum style text.
 * Choose the type of text to insert (Paragraph, Sentence, Word) and it's length (how many to insert).
 * @async
 */
export async function insertLoremIpsum() {
    const loremIpsumType = ["Paragraphs", "Sentences", "Words"];
    const loremIpsumTypeChoice: string | undefined = await window.showQuickPick(loremIpsumType, { ignoreFocusOut: true });
    if (!loremIpsumTypeChoice) {
        return;
    }
    const loremIpsumLength: string | undefined = await window.showInputBox({
        prompt: "Insert length",
        value: "5",
        ignoreFocusOut: true,
    });
    if (!loremIpsumLength) {
        return;
    }

    insertLoremIpsumInternal(loremIpsumTypeChoice, Number(loremIpsumLength));
}

/**
 * Insert a random Currency value
 * @return {*}
 */
export async function insertCurrency() {
    const editor = getActiveEditor();
    if (!editor) {
        return;
    }

    const currencies = [
        "US Dollar",
        "Euro",
        "British Pound",
        "Japanese Yen",
        "Chinese Yuan",
        "Indian Rupee",
        "Mexican Peso",
        "Russian Ruble",
        "Israeli New Shequel",
        "Bitcoin",
        "South Korean Won",
        "South African Rand",
        "Swiss Franc",
    ];

    let quickPickItems: QuickPickItem[] = [];
    currencies.forEach((item) => {
        let qp: QuickPickItem = {
            label: item,
            description: getCurrencyQuickPickItemDescription(item),
        };
        quickPickItems.push(qp);
    });

    const selectedFormat = await window.showQuickPick(quickPickItems, { ignoreFocusOut: true });

    const selections = editor.selections;
    let uniqueValues: string | undefined = "";
    if (selections.length > 1) {
        uniqueValues = await window.showQuickPick(["Yes", "No"], {
            canPickMany: false,
            ignoreFocusOut: true,
            title: `Insert unique ${selectedFormat?.label} at each cursor position?`,
        });
    }
    const uniqueRandomValues = uniqueValues === "Yes" ? true : false;

    if (selectedFormat) {
        await insertCurrencyInternal(selectedFormat.label, uniqueRandomValues);
    }
}

export function getCurrencyQuickPickItemDescription(item: string): string {
    const chance = new Chance();
    let number = chance.floating({ min: 0, fixed: 2 });
    let currencyValue: string = "";

    switch (item) {
        case "US Dollar":
            currencyValue = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2, useGrouping: true }).format(number);
            break;
        case "Euro":
            currencyValue = new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 2, useGrouping: true }).format(number);
            break;
        case "British Pound":
            currencyValue = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 2, useGrouping: true }).format(number);
            break;
        case "Japanese Yen":
            currencyValue = new Intl.NumberFormat("jp-JP", { style: "currency", currency: "JPY", maximumFractionDigits: 2, useGrouping: true }).format(number);
            break;
        case "Chinese Yuan":
            currencyValue = new Intl.NumberFormat("zh-CN", { style: "currency", currency: "CNY", maximumFractionDigits: 2, useGrouping: true }).format(number);
            break;
        case "Indian Rupee":
            currencyValue = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2, useGrouping: true }).format(number);
            break;
        case "Mexican Peso":
            currencyValue = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 2, useGrouping: true }).format(number);
            break;
        case "Russian Ruble":
            currencyValue = new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 2, useGrouping: true }).format(number);
            break;
        case "Israeli New Shequel":
            currencyValue = new Intl.NumberFormat("he-HE", { style: "currency", currency: "ILS", maximumFractionDigits: 2, useGrouping: true }).format(number);
            break;
        case "Bitcoin":
            currencyValue = new Intl.NumberFormat("en-US", { style: "currency", currency: "BTC", maximumFractionDigits: 2, useGrouping: true }).format(number);
            break;
        case "South Korean Won":
            currencyValue = new Intl.NumberFormat("ko-KO", { style: "currency", currency: "KRW", maximumFractionDigits: 2, useGrouping: true }).format(number);
            break;
        case "South African Rand":
            currencyValue = new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 2, useGrouping: true }).format(number);
            break;
        case "Swiss Franc":
            currencyValue = new Intl.NumberFormat("de-CH", { style: "currency", currency: "CHF", maximumFractionDigits: 2, useGrouping: true }).format(number);
            break;
        default:
            break;
    }

    return currencyValue;
}

/**
 * Insert a random currency value
 * @param {string} currency The currency to insert
 * @return {*}  {(Promise<boolean | undefined>)}
 */
export async function insertCurrencyInternal(currency: string, uniqueRandomValues: boolean): Promise<boolean | undefined> {
    const editor = getActiveEditor();
    if (!editor) {
        return;
    }
    let userChoice = getCurrencyQuickPickItemDescription(currency);

    editor.edit((editBuilder) => {
        editor.selections.forEach((s) => {
            if (uniqueRandomValues) {
                userChoice = getCurrencyQuickPickItemDescription(currency);
            }
            s.isEmpty ? editBuilder.insert(s.active, userChoice) : editBuilder.replace(s, userChoice);
        });
    });

    Promise.resolve(true);
}

export async function duplicateTab(): Promise<boolean | undefined> {
    let currentEditor = getActiveEditor();
    if (!currentEditor) {
        return Promise.reject(false);
    }

    await createNewEditor(currentEditor.document.getText());
    return Promise.resolve(true);
}

/**
 * Enum surround actions
 *
 * @export
 * @enum {string}
 */
export enum SurroundAction {
    Prefix = "prefix",
    Suffix = "suffix",
    Surround = "surround",
}

/**
 * Surround selections with user's text
 *
 * @export
 * @async
 * @param {SurroundAction} action The type if surround action to use
 * @returns {*}
 */
export async function surroundText(action: SurroundAction) {
    const editor = getActiveEditor();
    if (!editor) {
        return;
    }

    const surround = await window.showInputBox({
        prompt: `Enter the ${action} text...`,
        ignoreFocusOut: true,
    });
    if (!surround) {
        return;
    }

    const selections = editor.selections;
    editor.edit((editBuilder) => {
        selections.forEach((s) => {
            const text = editor.document.getText(s);
            const newText = surroundTextInternal(text, surround, action);
            editBuilder.replace(s, newText);
        });
    });
}

/**
 * Surround text with user's text
 *
 * @param {string} text The text to surround
 * @param {string} surround The text to surround with
 * @param {SurroundAction} action The type of surround action to use
 * @returns {string}
 */
function surroundTextInternal(text: string, surround: string, action: SurroundAction): string {
    let newText = "";

    switch (action) {
        case SurroundAction.Prefix:
            newText = surround + text;
            break;
        case SurroundAction.Suffix:
            newText = text + surround;
            break;
        case SurroundAction.Surround:
            newText = surround + text + surround;
            break;
        default:
            break;
    }

    return newText;
}

/**
 * Insert a line separator
 *
 * @export
 * @async
 * @param {?string} [separator] The separator to insert
 * @returns {*}
 */
export async function InsertLineSeparator(separator?: string) {
    const editor = getActiveEditor();
    if (!editor) {
        return;
    }

    if (!separator) {
        separator = await window.showInputBox({
            prompt: "Enter the separator...",
            placeHolder: "-",
            ignoreFocusOut: true,
        });
    }

    if (!separator) {
        separator = "-";
    }

    const selections = editor.selections;
    editor.edit((editBuilder) => {
        selections.forEach((s) => {
            const newText = `\n${separator?.repeat(100)}\n\n`;
            editBuilder.replace(s, newText);
        });
    });
}
