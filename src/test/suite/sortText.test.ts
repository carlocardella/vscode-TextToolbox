import * as assert from 'assert';
import { before, after, describe } from 'mocha';
import { sleep, closeTextEditor, createNewEditor, getDocumentTextOrSelection, getLinesFromString, linesToLine } from '../../modules/helpers';
import * as os from 'os';
import { sortLines } from '../../modules/sortText';
import { Selection } from 'vscode';


suite('sortText', () => {
    before(() => {
        console.log('Starting sortText tests');
    });
    after(async () => {
        await sleep(500);
        await closeTextEditor(true);
        console.log('All sortText tests done');
    });

    describe("Sort Text", () => {
        const eol = os.EOL;
        const textUnsorted = `Connecticut${eol}Pennsylvania${eol}Rhode Island${eol}${eol}${eol}Delaware${eol}Alabama${eol}Arkansas${eol}${eol}New Jersey${eol}Washington${eol}New York${eol}Texas${eol}${eol}`;
        const expectedAscending = `Alabama${eol}Arkansas${eol}Connecticut${eol}Delaware${eol}New Jersey${eol}New York${eol}Pennsylvania${eol}Rhode Island${eol}Texas${eol}Washington`;
        const expectedDescending = `Washington${eol}Texas${eol}Rhode Island${eol}Pennsylvania${eol}New York${eol}New Jersey${eol}Delaware${eol}Connecticut${eol}Arkansas${eol}Alabama`;
        const expectedReverse = `Texas${eol}New York${eol}Washington${eol}New Jersey${eol}Arkansas${eol}Alabama${eol}Delaware${eol}Rhode Island${eol}Pennsylvania${eol}Connecticut`;
        const selectionExpectedAscending = `New Jersey${eol}New York${eol}Texas${eol}Washington`;
        const selectionExpectedDescending = `Washington${eol}Texas${eol}New York${eol}New Jersey`;
        const selectionExpectedReverse = `Texas${eol}New York${eol}Washington${eol}New Jersey`;

        let tests = [
            { sortDirection: "ascending", textUnsorted: textUnsorted, expected: expectedAscending, openInNewTextEditor: false },
            { sortDirection: "descending", textUnsorted: textUnsorted, expected: expectedDescending, openInNewTextEditor: false },
            { sortDirection: "reverse", textUnsorted: textUnsorted, expected: expectedReverse, openInNewTextEditor: false },
            { sortDirection: "ascending", textUnsorted: textUnsorted, expected: expectedAscending, openInNewTextEditor: true },
            { sortDirection: "descending", textUnsorted: textUnsorted, expected: expectedDescending, openInNewTextEditor: true },
            { sortDirection: "reverse", textUnsorted: textUnsorted, expected: expectedReverse, openInNewTextEditor: true }
        ];

        tests.forEach(function (t) {
            test("Sort lines " + t.sortDirection + (t.openInNewTextEditor ? " in new editor" : ""), async () => {
                await createNewEditor(t.textUnsorted);
                await sortLines(t.sortDirection, t.openInNewTextEditor);
                await sleep(500);

                let lines = await getLinesFromString(String(getDocumentTextOrSelection()));
                assert.deepStrictEqual(await linesToLine(lines!), t.expected);
            });
        });

        tests = [
            { sortDirection: "ascending", textUnsorted: textUnsorted, expected: selectionExpectedAscending, openInNewTextEditor: false },
            { sortDirection: "descending", textUnsorted: textUnsorted, expected: selectionExpectedDescending, openInNewTextEditor: false },
            { sortDirection: "reverse", textUnsorted: textUnsorted, expected: selectionExpectedReverse, openInNewTextEditor: false },
            { sortDirection: "ascending", textUnsorted: textUnsorted, expected: selectionExpectedAscending, openInNewTextEditor: true },
            { sortDirection: "descending", textUnsorted: textUnsorted, expected: selectionExpectedDescending, openInNewTextEditor: true },
            { sortDirection: "reverse", textUnsorted: textUnsorted, expected: selectionExpectedReverse, openInNewTextEditor: true }
        ];

        tests.forEach(t => {
            test("Sort selection " + t.sortDirection + (t.openInNewTextEditor ? " in new editor" : ""), async () => {
                const editor = await createNewEditor(t.textUnsorted);
                let selections: Selection[] = [];
                selections.push(new Selection(9, 0, 12, 5));
                editor!.selections = selections;
                await sortLines(t.sortDirection, t.openInNewTextEditor);
                await sleep(500);

                let lines = await getLinesFromString(String(getDocumentTextOrSelection()));
                assert.deepStrictEqual(await linesToLine(lines!), t.expected);
            });
        });
    });
});