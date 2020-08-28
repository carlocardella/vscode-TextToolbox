import * as assert from 'assert';
import * as guid from 'guid';
import { closeTextEditor, sleep, getDocumentText, createNewEditor } from '../../modules/helpers';
import { insertGUID, insertDateTime, padText } from '../../modules/insertText';
import { before, after, afterEach, describe } from 'mocha';
import { DateTime } from 'luxon';

suite('insertText', () => {
    before(() => {
        console.log('Starting insertText tests');
    });
    after(() => {
        console.log('All insertText tests done');
    });
    afterEach(() => {
        closeTextEditor();
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
            { padString: "@", lenght: 10, expected: "@@@@@@@@@@" },
            { padString: "3", lenght: 10, expected: "3333333333" },
            { padString: "ab", lenght: 10, expected: "abababababababababab" }
        ];

        tests.forEach(function (t) {
            test('Padding ' + t.padString, async () => {
                await createNewEditor();
                await padText(t.padString, t.lenght);
                await sleep(500);

                let text = String(getDocumentText());
                assert.deepStrictEqual(text, t.expected);
            });
        });
    });

    describe('Test insert DateTime', () => {
        let testDate = DateTime.local(2020, 8, 25, 15, 34, 41);

        let tests = [
            { args: 'DATE_SHORT', expected: '8/25/2020' },
            { args: 'TIME_SIMPLE', expected: '3:34 PM' },
            { args: 'TIME_WITH_SECONDS', expected: '3:34:41 PM' },
            { args: 'DATETIME_SHORT', expected: '8/25/2020, 3:34 PM' },
            { args: 'DATE_HUGE', expected: 'Tuesday, August 25, 2020' },
            { args: 'SORTABLE', expected: '2020-08-25T15:34:41' },
            { args: 'UNIVERSAL_SORTABLE', expected: '2020-08-25T22:34:41Z' },
            { args: 'ISO8601', expected: '2020-08-25T15:34:41.000-07:00' },
            { args: 'RFC2822', expected: 'Tue, 25 Aug 2020 15:34:41 -0700' },
            { args: 'HTTP', expected: 'Tue, 25 Aug 2020 22:34:41 GMT' },
            { args: 'DATETIME_SHORT_WITH_SECONDS', expected: '8/25/2020, 3:34:41 PM' },
            { args: 'DATETIME_FULL_WITH_SECONDS', expected: 'August 25, 2020, 3:34 PM PDT' },
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
