import * as assert from 'assert';
import { before, after, afterEach, describe } from 'mocha';
import { closeTextEditor, sleep, getDocumentText, createNewEditor } from '../../modules/helpers';
import { removeEmptyLines } from '../../modules/filterText';


suite("filterText", () => {
    before(() => {
        console.log('Starting insertText tests');
    });
    after(() => {
        console.log('All insertText tests done');
    });
    afterEach(() => {
        closeTextEditor();
    });

    describe("Remove all empty lines", async () => {
        const testEditorText = "Fehfomda pemup mihjeb\n\nuvonono nelvojpo wokragsi geligab\n\n\npokacan repafme racje ut alhacov\n\nHireme gahze\n\n\n\n\npi zo iro becago vekabo\nluihait abe zukuv gof tususho\n\n\n\n";
        const testEditorTextRedundantExpected = "Fehfomda pemup mihjeb\n\nuvonono nelvojpo wokragsi geligab\n\npokacan repafme racje ut alhacov\n\nHireme gahze\n\npi zo iro becago vekabo\nluihait abe zukuv gof tususho\n\n";
        const testEditorTextAllExpected = "Fehfomda pemup mihjeb\nuvonono nelvojpo wokragsi geligab\npokacan repafme racje ut alhacov\nHireme gahze\npi zo iro becago vekabo\nluihait abe zukuv gof tususho\n";

        let tests = [
            { docText: testEditorText, redundantOnly: true, expected: testEditorTextRedundantExpected },
            { docText: testEditorText, redundantOnly: false, expected: testEditorTextAllExpected }
        ];

        tests.forEach(function (t) {
            let itRedundant;
            t.redundantOnly ? itRedundant = "redundant" : itRedundant = "all";
            test("Filter " + itRedundant + " empty lines", async () => {
                await createNewEditor(testEditorText);
                await removeEmptyLines(t.redundantOnly);
                await sleep(500);

                let text = getDocumentText();
                assert.deepStrictEqual(text, t.expected);
            });
        });
    });
});