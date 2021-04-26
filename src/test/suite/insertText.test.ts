import * as assert from 'assert';
import * as guid from 'guid';
import { sleep, createNewEditor, selectAllText, closeTextEditor, getDocumentTextOrSelection, getActiveEditor, getLinesFromSelection } from '../../modules/helpers';
import { insertGUID, insertDateTimeInternal, padDirection, padSelectionInternal, insertLineNumbersInternal, sequenceType, insertSequenceInternal as insertSequenceInternal, insertLoremIpsumInternal, insertNumber, insertCurrencyInternal } from '../../modules/insertText';
import { before, after, describe } from 'mocha';
import { DateTime } from 'luxon';
import { EOL } from 'os';
import { Selection } from 'vscode';

suite('insertText', () => {
    before(() => {
        console.log('Starting insertText tests');
    });
    after(async () => {
        await sleep(500);
        await closeTextEditor(true);
        console.log('All insertText tests done');
    });


    describe('Insert Text', () => {
        describe("GUID", () => {
            test('Insert GUID', async () => {
                await createNewEditor();
                insertGUID();
                await sleep(500);

                let text = String(getDocumentTextOrSelection());
                assert.ok(guid.isGuid(text), `Value "${text}" is not a valid GUID`);
            });

            test("Insert GUID multicursor", async () => {
                await createNewEditor(`asd${EOL}${EOL}asd`);
                const editor = getActiveEditor();
                let selections: Selection[] = [];
                selections.push(new Selection(0, 0, 0, 3));
                selections.push(new Selection(2, 0, 2, 3));
                editor!.selections = selections;
                insertGUID();
                await sleep(500);

                let lines = getLinesFromSelection(editor!);
                let g: string;
                lines?.forEach(line => {
                    g = line.text.substr(3, 36);
                    assert.ok(guid.isGuid(g), `Value "${g}" is not a valid GUID`);
                });
            });

            test('Insert GUID all zeros', async () => {
                await createNewEditor();
                insertGUID(true);
                await sleep(500);

                let text = String(getDocumentTextOrSelection());
                assert.ok(guid.isGuid(text), `Value "${text}" is not a valid GUID`);
            });

            test("Insert GUID all zeros multicursor", async () => {
                await createNewEditor(`asd${EOL}${EOL}asd`);
                const editor = getActiveEditor();
                let selections: Selection[] = [];
                selections.push(new Selection(0, 0, 0, 3));
                selections.push(new Selection(2, 0, 2, 3));
                editor!.selections = selections;
                insertGUID(true);
                await sleep(500);

                let lines = getLinesFromSelection(editor!);
                let g: string;
                lines?.forEach(line => {
                    g = line.text.substr(3, 36);
                    assert.ok(guid.isGuid(g), `Value "${g}" is not a valid GUID`);
                });
            });
        });

        describe("Padding", () => {
            let tests = [
                { padDirection: padDirection.right, padString: "@", lenght: 10, expected: "test@@@@@@" },
                { padDirection: padDirection.right, padString: "3", lenght: 10, expected: "test333333" },
                { padDirection: padDirection.right, padString: "ab", lenght: 10, expected: "testababab" },
                { padDirection: padDirection.right, padString: " ", lenght: 10, expected: "test      " },
                { padDirection: padDirection.left, padString: "@", lenght: 10, expected: "@@@@@@test" },
                { padDirection: padDirection.left, padString: "3", lenght: 10, expected: "333333test" },
                { padDirection: padDirection.left, padString: "ab", lenght: 10, expected: "abababtest" },
                { padDirection: padDirection.left, padString: " ", lenght: 10, expected: "      test" }
            ];
            tests.forEach(function (t) {
                test('Padding ' + t.padDirection, async () => {
                    await createNewEditor("test");
                    await selectAllText();
                    await padSelectionInternal(t.padDirection, t.padString, t.lenght);
                    await sleep(500);

                    let text = String(getDocumentTextOrSelection());
                    assert.deepStrictEqual(text, t.expected);
                });
            });

            tests = [
                { padDirection: padDirection.right, padString: "@", lenght: 10, expected: "@@@@@@@@@@" },
                { padDirection: padDirection.right, padString: "3", lenght: 10, expected: "3333333333" },
                { padDirection: padDirection.right, padString: "ab", lenght: 10, expected: "ababababab" },
                { padDirection: padDirection.right, padString: " ", lenght: 10, expected: "          " },
                { padDirection: padDirection.left, padString: "@", lenght: 10, expected: "@@@@@@@@@@" },
                { padDirection: padDirection.left, padString: "3", lenght: 10, expected: "3333333333" },
                { padDirection: padDirection.left, padString: "ab", lenght: 10, expected: "ababababab" },
                { padDirection: padDirection.left, padString: " ", lenght: 10, expected: "          " }
            ];
            tests.forEach(function (t) {
                test('Padding on empty selection ' + t.padDirection, async () => {
                    await createNewEditor();
                    await padSelectionInternal(t.padDirection, t.padString, t.lenght);
                    await sleep(500);

                    let text = String(getDocumentTextOrSelection());
                    assert.deepStrictEqual(text, t.expected);
                });
            });

            tests = [
                { padDirection: padDirection.right, padString: "x", lenght: 10, expected: `asdxxxxxxx${EOL}${EOL}asxxxxxxxx` },
                { padDirection: padDirection.left, padString: "x", lenght: 10, expected: `xxxxxxxasd${EOL}${EOL}xxxxxxxxas` }
            ];
            tests.forEach(function (t) {
                test("Padding multiline " + t.padDirection, async () => {
                    await createNewEditor(`asd${EOL}${EOL}as`);
                    const editor = getActiveEditor();
                    let selections: Selection[] = [];
                    selections.push(new Selection(0, 0, 0, 2));
                    selections.push(new Selection(2, 0, 2, 2));
                    editor!.selections = selections;
                    await padSelectionInternal(t.padDirection, t.padString, t.lenght);
                    await sleep(500);

                    await selectAllText();
                    let text = String(getDocumentTextOrSelection());
                    assert.deepStrictEqual(text, t.expected);
                });
            });
        });

        describe('Test insert DateTime', () => {
            let testDate = DateTime.local(2020, 8, 25, 15, 34, 41).setZone("America/New_York");

            let tests = [
                { dateFormat: 'DATE_SHORT', expected: '8/25/2020' },
                { dateFormat: 'TIME_SIMPLE', expected: '6:34 PM' },
                { dateFormat: 'TIME_WITH_SECONDS', expected: '6:34:41 PM' },
                { dateFormat: 'DATETIME_SHORT', expected: '8/25/2020, 6:34 PM' },
                { dateFormat: 'DATE_HUGE', expected: 'Tuesday, August 25, 2020' },
                { dateFormat: 'SORTABLE', expected: '2020-08-25T18:34:41' },
                { dateFormat: 'UNIVERSAL_SORTABLE', expected: '2020-08-25T22:34:41Z' },
                { dateFormat: 'ISO8601', expected: '2020-08-25T18:34:41.000-04:00' },
                { dateFormat: 'RFC2822', expected: 'Tue, 25 Aug 2020 18:34:41 -0400' },
                { dateFormat: 'HTTP', expected: 'Tue, 25 Aug 2020 22:34:41 GMT' },
                { dateFormat: 'DATETIME_SHORT_WITH_SECONDS', expected: '8/25/2020, 6:34:41 PM' },
                { dateFormat: 'DATETIME_FULL_WITH_SECONDS', expected: 'August 25, 2020, 6:34 PM EDT' },
                { dateFormat: 'UNIX_SECONDS', expected: '1598394881' },
                { dateFormat: 'UNIX_MILLISECONDS', expected: '1598394881000' }
            ];

            tests.forEach(function (t) {
                test('Insert Date ' + t.dateFormat, async () => {
                    await createNewEditor();
                    await insertDateTimeInternal(t.dateFormat, testDate);
                    await sleep(500);

                    let text = String(getDocumentTextOrSelection());
                    assert.deepStrictEqual(text, t.expected);
                });
            });

            test("Insert Date multicursor", async () => {
                await createNewEditor(`asd${EOL}${EOL}asd`);
                const editor = getActiveEditor();
                let selections: Selection[] = [];
                selections.push(new Selection(0, 0, 0, 3));
                selections.push(new Selection(2, 0, 2, 3));
                editor!.selections = selections;
                await insertDateTimeInternal("DATE_SHORT", testDate);
                await sleep(500);

                await selectAllText();
                let text = String(getDocumentTextOrSelection());
                assert.deepStrictEqual(text, `asd8/25/2020${EOL}${EOL}asd8/25/2020`);
            });
        });

        describe("Insert line numbers", async () => {
            const tests = [
                { startFrom: "1", text: `asd${EOL}asd${EOL}asd`, expected: `1 asd${EOL}2 asd${EOL}3 asd` },
                { startFrom: "4", text: `asd${EOL}asd${EOL}asd`, expected: `4 asd${EOL}5 asd${EOL}6 asd` }
            ];

            tests.forEach(t => {
                test(`Insert line numbers, startFrom ${t.startFrom}`, async () => {
                    await createNewEditor(t.text);
                    await selectAllText();
                    await insertLineNumbersInternal(t.startFrom);
                    await sleep(500);

                    let text = String(getDocumentTextOrSelection());
                    assert.deepStrictEqual(text, t.expected);
                });
            });
        });

        describe("Insert sequence", () => {
            describe("Insert numbers sequence", async () => {
                const tests = [
                    { type: sequenceType.Numbers, startFrom: "1", length: 8, direction: undefined, expected: `1${EOL}2${EOL}3${EOL}4${EOL}5${EOL}6${EOL}7${EOL}8${EOL}` },
                    { type: sequenceType.Numbers, startFrom: "14", length: 5, direction: undefined, expected: `14${EOL}15${EOL}16${EOL}17${EOL}18${EOL}` }
                ];

                tests.forEach(t => {
                    test(`Insert a number sequence starting from ${t.startFrom} for ${t.length} lines`, async () => {
                        await createNewEditor();
                        await insertSequenceInternal(t.type, t.startFrom, t.length, t.direction);
                        await sleep(500);

                        let text = String(getDocumentTextOrSelection());
                        assert.deepStrictEqual(text, t.expected);
                    });
                });
            });
        });

        describe("Insert Lorem Ipsum", () => {
            const loremTypes = [
                { type: "Paragraphs" },
                { type: "Sentences" },
                { type: "Words" }
            ];

            loremTypes.forEach(l => {
                test(`Insert Lorem Ipsum ${l.type}`, async () => {
                    await createNewEditor();
                    await insertLoremIpsumInternal(l.type, 5);
                    await sleep(500);

                    let text = String(getDocumentTextOrSelection());
                    switch (l.type) {
                        case 'Paragraphs':
                            assert.deepStrictEqual(text.split(EOL).length, 5);
                            break;
                        case 'Sentences':
                            assert.deepStrictEqual(text.split('. ').length, 5);
                            break;
                        case 'Words':
                            assert.deepStrictEqual(text.split(' ').length, 5);
                            break;
                        default:
                            assert.fail('Invalid Lorem Ipsum paragraph type');
                    }
                });
            });
        });

        describe('Insert Number', () => {
            test('Insert a random Integer', async () => {
                await createNewEditor();
                await insertNumber();
                await sleep(500);

                const newText = getDocumentTextOrSelection();
                assert.doesNotThrow(() => {
                    Number.parseInt(newText!);
                });
            });
        });

        describe('Insert currency', () => {
            const currencies = [
                { currency: "US Dollar" },
                { currency: "Euro" },
                { currency: "British Pound" },
                { currency: "Japanese Yen" },
                { currency: "Chinese Yuan" },
                { currency: "Indian Rupee" },
                { currency: "Mexican Peso" },
                { currency: "Russian Ruble" },
                { currency: "New Israeli Shequel" },
                { currency: "Bitcoin" },
                { currency: "South Korean Won" },
                { currency: "South African Rand" },
                { currency: "Swiss Franc" }
            ];

            currencies.forEach(c => {
                test(`Insert ${c.currency}`, async () => {
                    await createNewEditor();
                    await insertCurrencyInternal(c.currency);
                    await sleep(500);

                    const newText = getDocumentTextOrSelection();

                    assert.deepStrictEqual(
                        newText?.substring(0, 1),
                        c.currency.substring(0, 1)
                    );

                    assert.doesNotThrow(() => {
                        Number.parseFloat(newText.substring(1));
                    });
                });
            });
        });
    });
});
