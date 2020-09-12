import * as assert from 'assert';
import { before, after, describe } from 'mocha';
import { sleep, getLines, closeTextEditor } from '../../modules/helpers';
import * as os from 'os';
import { sortLinesInternal } from '../../modules/sortText';


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
        // const textFilteredExpected = `Alabama${eol}Arkansas${eol}Connecticut${eol}Delaware${eol}New Jersey${eol}New York${eol}Pennsylvania${eol}Rhode Island${eol}Texas${eol}Washington${eol}`
        const textFilteredExpected = `${eol}Alabama${eol}Arkansas${eol}Connecticut${eol}Delaware${eol}New Jersey${eol}New York${eol}Pennsylvania${eol}Rhode Island${eol}Texas${eol}Washington`;

        test("Sort lines", async () => {
            // await createNewEditor(textUnsorted);
            let lines = await getLines(textUnsorted);
            const sortedLines = await sortLinesInternal(lines!);

            assert.deepStrictEqual(sortedLines?.join(eol), textFilteredExpected);
        });
    });
});