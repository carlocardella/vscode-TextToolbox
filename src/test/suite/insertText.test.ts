import * as assert from 'assert';
import * as guid from 'guid';
import { closeTextEditor, sleep, getDocumentText, createNewEditor, selectAllText, closeAllEditors } from '../../modules/helpers';
import { insertGUID, insertDateTime, padText, padDirection } from '../../modules/insertText';
import { before, after, afterEach, describe } from 'mocha';
import { DateTime } from 'luxon';

suite('insertText', () => {
    before(() => {
        console.log('Starting insertText tests');
    });
    after(() => {
        console.log('All insertText tests done');
    });
    after(async () => {
        await sleep(1000);
        await closeAllEditors();
    });


    describe('Test insert text', () => {
        test('Insert GUID', async () => {
            await createNewEditor();
            insertGUID();
            await sleep(200);

            let text = String(getDocumentText());
            assert.ok(guid.isGuid(text), `Value "${text}" is not a valid GUID`);
        });

        let tests = [
            { padDirection: padDirection.right, padString: "@", lenght: 10, expected: "test@@@@@@" },
            { padDirection: padDirection.right, padString: "3", lenght: 10, expected: "test333333" },
            { padDirection: padDirection.right, padString: "ab", lenght: 10, expected: "testababab" },
            { padDirection: padDirection.left, padString: "@", lenght: 10, expected: "@@@@@@test" },
            { padDirection: padDirection.left, padString: "3", lenght: 10, expected: "333333test" },
            { padDirection: padDirection.left, padString: "ab", lenght: 10, expected: "abababtest" }
        ];
        tests.forEach(function (t) {
            test('Padding ' + t.padDirection, async () => {
                await createNewEditor("test");
                await selectAllText();
                await padText(t.padDirection, t.padString, t.lenght);
                await sleep(500);

                let text = String(getDocumentText());
                assert.deepStrictEqual(text, t.expected);
            });
        });

        tests = [
            { padDirection: padDirection.right, padString: "@", lenght: 10, expected: "@@@@@@@@@@" },
            { padDirection: padDirection.right, padString: "3", lenght: 10, expected: "3333333333" },
            { padDirection: padDirection.right, padString: "ab", lenght: 10, expected: "ababababab" },
            { padDirection: padDirection.left, padString: "@", lenght: 10, expected: "@@@@@@@@@@" },
            { padDirection: padDirection.left, padString: "3", lenght: 10, expected: "3333333333" },
            { padDirection: padDirection.left, padString: "ab", lenght: 10, expected: "ababababab" }
        ];
        tests.forEach(function (t) {
            test('Padding on empty selection ' + t.padDirection, async () => {
                await createNewEditor();
                await padText(t.padDirection, t.padString, t.lenght);
                await sleep(500);

                let text = String(getDocumentText());
                assert.deepStrictEqual(text, t.expected);
            });
        });
    });

    describe('Test insert DateTime', () => {
        let testDate = DateTime.local(2020, 8, 25, 15, 34, 41).setZone("America/New_York");

        let tests = [
            { args: 'DATE_SHORT', expected: '8/25/2020' },
            { args: 'TIME_SIMPLE', expected: '6:34 PM' },
            { args: 'TIME_WITH_SECONDS', expected: '6:34:41 PM' },
            { args: 'DATETIME_SHORT', expected: '8/25/2020, 6:34 PM' },
            { args: 'DATE_HUGE', expected: 'Tuesday, August 25, 2020' },
            { args: 'SORTABLE', expected: '2020-08-25T18:34:41' },
            { args: 'UNIVERSAL_SORTABLE', expected: '2020-08-25T22:34:41Z' },
            { args: 'ISO8601', expected: '2020-08-25T18:34:41.000-04:00' },
            { args: 'RFC2822', expected: 'Tue, 25 Aug 2020 18:34:41 -0400' },
            { args: 'HTTP', expected: 'Tue, 25 Aug 2020 22:34:41 GMT' },
            { args: 'DATETIME_SHORT_WITH_SECONDS', expected: '8/25/2020, 6:34:41 PM' },
            { args: 'DATETIME_FULL_WITH_SECONDS', expected: 'August 25, 2020, 6:34 PM EDT' },
            { args: 'UNIX_SECONDS', expected: '1598394881' },
            { args: 'UNIX_MILLISECONDS', expected: '1598394881000' }
        ];

        tests.forEach(function (t) {
            test('Insert Date ' + t.args, async () => {
                await createNewEditor();
                await insertDateTime(t.args, testDate);
                await sleep(500);

                let text = String(getDocumentText());
                assert.deepStrictEqual(text, t.expected);
            });
        });
    });
});
