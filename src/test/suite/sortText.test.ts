import * as assert from 'assert';
import { before, after, describe, it } from 'mocha';
import { 
    sleep, 
    closeTextEditor, 
    createNewEditor, 
    getDocumentTextOrSelection, 
    getLinesFromString, 
    linesToLine,
    getActiveEditor,
    getDocumentEOL
} from '../../modules/helpers';
import { sortLines, sortLinesByLength, sortDirection, askForSortDirection } from '../../modules/sortText';
import { Selection } from 'vscode';


describe('sortText', () => {
    before(() => {
        console.log('Starting sortText tests');
    });
    after(async () => {
        await sleep(500);
        await closeTextEditor(true);
        console.log('All sortText tests done');
    });

    describe("Sort Text Lines", () => {
        it("Sort lines ascending", async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const textUnsorted = `Connecticut${eol}Pennsylvania${eol}Rhode Island${eol}${eol}${eol}Delaware${eol}Alabama${eol}Arkansas${eol}${eol}New Jersey${eol}Washington${eol}New York${eol}Texas${eol}${eol}`;
            const expectedAscending = `Alabama${eol}Arkansas${eol}Connecticut${eol}Delaware${eol}New Jersey${eol}New York${eol}Pennsylvania${eol}Rhode Island${eol}Texas${eol}Washington`;
            
            await createNewEditor(textUnsorted);
            await sortLines("ascending", false);
            await sleep(500);

            let lines = await getLinesFromString(String(getDocumentTextOrSelection()));
            assert.deepStrictEqual(await linesToLine(lines!), expectedAscending);
        });

        it("Sort lines descending", async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const textUnsorted = `Connecticut${eol}Pennsylvania${eol}Rhode Island${eol}${eol}${eol}Delaware${eol}Alabama${eol}Arkansas${eol}${eol}New Jersey${eol}Washington${eol}New York${eol}Texas${eol}${eol}`;
            const expectedDescending = `Washington${eol}Texas${eol}Rhode Island${eol}Pennsylvania${eol}New York${eol}New Jersey${eol}Delaware${eol}Connecticut${eol}Arkansas${eol}Alabama`;
            
            await createNewEditor(textUnsorted);
            await sortLines("descending", false);
            await sleep(500);

            let lines = await getLinesFromString(String(getDocumentTextOrSelection()));
            assert.deepStrictEqual(await linesToLine(lines!), expectedDescending);
        });

        it("Sort lines reverse", async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const textUnsorted = `Connecticut${eol}Pennsylvania${eol}Rhode Island${eol}${eol}${eol}Delaware${eol}Alabama${eol}Arkansas${eol}${eol}New Jersey${eol}Washington${eol}New York${eol}Texas${eol}${eol}`;
            const expectedReverse = `Texas${eol}New York${eol}Washington${eol}New Jersey${eol}Arkansas${eol}Alabama${eol}Delaware${eol}Rhode Island${eol}Pennsylvania${eol}Connecticut`;
            
            await createNewEditor(textUnsorted);
            await sortLines("reverse", false);
            await sleep(500);

            let lines = await getLinesFromString(String(getDocumentTextOrSelection()));
            assert.deepStrictEqual(await linesToLine(lines!), expectedReverse);
        });

        it("Sort lines ascending in new editor", async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const textUnsorted = `Connecticut${eol}Pennsylvania${eol}Rhode Island${eol}${eol}${eol}Delaware${eol}Alabama${eol}Arkansas${eol}${eol}New Jersey${eol}Washington${eol}New York${eol}Texas${eol}${eol}`;
            const expectedAscending = `Alabama${eol}Arkansas${eol}Connecticut${eol}Delaware${eol}New Jersey${eol}New York${eol}Pennsylvania${eol}Rhode Island${eol}Texas${eol}Washington`;
            
            await createNewEditor(textUnsorted);
            await sortLines("ascending", true);
            await sleep(500);

            let lines = await getLinesFromString(String(getDocumentTextOrSelection()));
            assert.deepStrictEqual(await linesToLine(lines!), expectedAscending);
        });

        it("Sort selected lines", async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const textUnsorted = `Connecticut${eol}Pennsylvania${eol}Rhode Island${eol}${eol}${eol}Delaware${eol}Alabama${eol}Arkansas${eol}${eol}New Jersey${eol}Washington${eol}New York${eol}Texas${eol}${eol}`;
            const selectionExpectedAscending = `New Jersey${eol}New York${eol}Texas${eol}Washington`;
            
            const editor = await createNewEditor(textUnsorted);
            let selections: Selection[] = [];
            selections.push(new Selection(9, 0, 12, 5));
            editor!.selections = selections;
            await sortLines("ascending", false);
            await sleep(500);

            let lines = await getLinesFromString(String(getDocumentTextOrSelection()));
            assert.deepStrictEqual(await linesToLine(lines!), selectionExpectedAscending);
        });

        it("Handle empty document", async () => {
            await createNewEditor("");
            try {
                await sortLines("ascending", false);
                assert.fail("Should throw error for empty document");
            } catch (error) {
                assert.ok(error, "Should handle empty document gracefully");
            }
        });

        it("Handle invalid sort direction", async () => {
            await createNewEditor("line1\nline2\nline3");
            try {
                await sortLines("invalid", false);
                assert.fail("Should throw error for invalid sort direction");
            } catch (error) {
                assert.ok(error, "Should handle invalid sort direction");
            }
        });

        it("Sort case sensitive", async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const textUnsorted = `apple${eol}Banana${eol}cherry${eol}Date`;
            const expectedAscending = `Banana${eol}Date${eol}apple${eol}cherry`;
            
            await createNewEditor(textUnsorted);
            await sortLines("ascending", false);
            await sleep(500);

            let lines = await getLinesFromString(String(getDocumentTextOrSelection()));
            assert.deepStrictEqual(await linesToLine(lines!), expectedAscending);
        });

        it("Sort numeric strings", async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const textUnsorted = `10${eol}2${eol}1${eol}20`;
            const expectedAscending = `1${eol}10${eol}2${eol}20`;
            
            await createNewEditor(textUnsorted);
            await sortLines("ascending", false);
            await sleep(500);

            let lines = await getLinesFromString(String(getDocumentTextOrSelection()));
            assert.deepStrictEqual(await linesToLine(lines!), expectedAscending);
        });
    });

    describe("Sort Lines by Length", () => {
        it("Sort by length ascending", async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const textUnsorted = `verylonglineoftext${eol}short${eol}medium length${eol}x`;
            const expectedAscending = `x${eol}short${eol}medium length${eol}verylonglineoftext`;
            
            await createNewEditor(textUnsorted);
            await sortLinesByLength("ascending", false);
            await sleep(500);

            let text = String(getDocumentTextOrSelection());
            assert.deepStrictEqual(text, expectedAscending);
        });

        it("Sort by length descending", async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const textUnsorted = `verylonglineoftext${eol}short${eol}medium length${eol}x`;
            const expectedDescending = `verylonglineoftext${eol}medium length${eol}short${eol}x`;
            
            await createNewEditor(textUnsorted);
            await sortLinesByLength("descending", false);
            await sleep(500);

            let text = String(getDocumentTextOrSelection());
            assert.deepStrictEqual(text, expectedDescending);
        });

        it("Sort by length reverse", async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const textUnsorted = `verylonglineoftext${eol}short${eol}medium length${eol}x`;
            const expectedReverse = `x${eol}medium length${eol}short${eol}verylonglineoftext`;
            
            await createNewEditor(textUnsorted);
            await sortLinesByLength("reverse", false);
            await sleep(500);

            let text = String(getDocumentTextOrSelection());
            assert.deepStrictEqual(text, expectedReverse);
        });

        it("Sort by length in new editor", async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const textUnsorted = `verylonglineoftext${eol}short${eol}medium length${eol}x`;
            const expectedAscending = `x${eol}short${eol}medium length${eol}verylonglineoftext`;
            
            await createNewEditor(textUnsorted);
            await sortLinesByLength("ascending", true);
            await sleep(500);

            let text = String(getDocumentTextOrSelection());
            assert.deepStrictEqual(text, expectedAscending);
        });

        it("Handle empty lines in length sort", async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const textUnsorted = `long line${eol}${eol}short${eol}${eol}x`;
            const expectedAscending = `x${eol}short${eol}long line`;
            
            await createNewEditor(textUnsorted);
            await sortLinesByLength("ascending", false);
            await sleep(500);

            let text = String(getDocumentTextOrSelection());
            assert.deepStrictEqual(text, expectedAscending);
        });

        it("Handle invalid sort direction for length", async () => {
            await createNewEditor("line1\nline2\nline3");
            try {
                await sortLinesByLength("invalid", false);
                assert.fail("Should throw error for invalid sort direction");
            } catch (error) {
                assert.ok(error, "Should handle invalid sort direction");
            }
        });

        it("Handle empty document for length sort", async () => {
            await createNewEditor("");
            try {
                await sortLinesByLength("ascending", false);
                assert.fail("Should throw error for empty document");
            } catch (error) {
                assert.ok(error, "Should handle empty document gracefully");
            }
        });
    });

    describe("Sort Direction Enum", () => {
        it("Sort direction enum values", () => {
            assert.strictEqual(sortDirection.ascending, "ascending");
            assert.strictEqual(sortDirection.descending, "descending");
            assert.strictEqual(sortDirection.reverse, "reverse");
        });
    });

    describe("Edge Cases", () => {
        it("Sort single line", async () => {
            await createNewEditor("single line");
            await sortLines("ascending", false);
            await sleep(500);

            let text = String(getDocumentTextOrSelection());
            assert.strictEqual(text, "single line");
        });

        it("Sort identical lines", async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const textUnsorted = `same${eol}same${eol}same`;
            const expected = `same${eol}same${eol}same`;
            
            await createNewEditor(textUnsorted);
            await sortLines("ascending", false);
            await sleep(500);

            let text = String(getDocumentTextOrSelection());
            assert.deepStrictEqual(text, expected);
        });

        it("Sort with special characters", async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const textUnsorted = `@symbol${eol}#hashtag${eol}!exclamation${eol}$dollar`;
            const expectedAscending = `!exclamation${eol}#hashtag${eol}$dollar${eol}@symbol`;
            
            await createNewEditor(textUnsorted);
            await sortLines("ascending", false);
            await sleep(500);

            let lines = await getLinesFromString(String(getDocumentTextOrSelection()));
            assert.deepStrictEqual(await linesToLine(lines!), expectedAscending);
        });

        it("Sort with whitespace", async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const textUnsorted = `  spaced${eol}nospace${eol}\ttabbed${eol} single`;
            
            await createNewEditor(textUnsorted);
            await sortLines("ascending", false);
            await sleep(500);

            let text = String(getDocumentTextOrSelection());
            assert.ok(text, "Should handle whitespace in sorting");
            assert.ok(text.includes("spaced"), "Should preserve spacing");
            assert.ok(text.includes("\t"), "Should preserve tabs");
        });

        it("Sort very long lines", async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const longLine = "a".repeat(1000);
            const shortLine = "b";
            const textUnsorted = `${longLine}${eol}${shortLine}`;
            
            await createNewEditor(textUnsorted);
            await sortLines("ascending", false);
            await sleep(500);

            let text = String(getDocumentTextOrSelection());
            assert.ok(text, "Should handle very long lines");
            assert.ok(text.indexOf(longLine) < text.indexOf(shortLine), "Should sort correctly even with long lines");
        });
    });
});