import * as assert from 'assert';
import { before, after, afterEach, describe } from 'mocha';
import { closeTextEditor, sleep, getDocumentText, createNewEditor, selectAllText, closeAllEditors } from '../../modules/helpers';
import { removeDuplicateLines, removeEmptyLines } from '../../modules/filterText';
import * as os from 'os';
import { truncateSync } from 'fs';


suite("filterText", () => {
    before(() => {
        console.log('Starting insertText tests');
    });
    after(() => {
        console.log('All insertText tests done');
    });
    // afterEach(() => {
    //     closeTextEditor();
    // });
    after(async () => {
        await sleep(1000);
        await closeAllEditors();
    });

    describe("Remove all empty lines", async () => {
        const eol = os.EOL;
        const testEditorText = `Fehfomda pemup mihjeb${eol}${eol}uvonono nelvojpo wokragsi geligab${eol}${eol}${eol}pokacan repafme racje ut alhacov${eol}${eol}Hireme gahze${eol}${eol}${eol}${eol}${eol}pi zo iro becago vekabo${eol}luihait abe zukuv gof tususho${eol}${eol}${eol}${eol}`;
        const testEditorTextRedundantExpected = `Fehfomda pemup mihjeb${eol}${eol}uvonono nelvojpo wokragsi geligab${eol}${eol}pokacan repafme racje ut alhacov${eol}${eol}Hireme gahze${eol}${eol}pi zo iro becago vekabo${eol}luihait abe zukuv gof tususho${eol}${eol}`;
        const testEditorTextAllExpected = `Fehfomda pemup mihjeb${eol}uvonono nelvojpo wokragsi geligab${eol}pokacan repafme racje ut alhacov${eol}Hireme gahze${eol}pi zo iro becago vekabo${eol}luihait abe zukuv gof tususho${eol}`;

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

    describe("Remove duplicate lines", async () => {
        const eol = os.EOL;
        const testEditorDuplicateLines = `Gowul ibbohu tafeid fokecdif lab adazujob${eol}meaf dekase sij of wehi nefowumu wizabeti${eol}${eol}Gowul ibbohu tafeid fokecdif lab adazujob${eol}Gowul ibbohu tafeid fokecdif lab adazujob${eol}${eol}${eol}palte${eol}${eol}${eol}meaf dekase sij of wehi nefowumu wizabeti${eol}meaf dekase sij of wehi nefowumu wizabeti${eol}meaf dekase sij of wehi nefowumu wizabeti${eol}${eol}${eol}Nefzuh toehe jiubvid tic didukod ehe ji ${eol}ana mur tiofapel sudvivot hub wurgo jifhi jumkehfot ${eol}palte${eol}${eol}ana mur tiofapel sudvivot hub wurgo jifhi jumkehfot ${eol}`;
        const testEditorDuplicateLinesRemoved = `Gowul ibbohu tafeid fokecdif lab adazujob${eol}meaf dekase sij of wehi nefowumu wizabeti${eol}palte${eol}Nefzuh toehe jiubvid tic didukod ehe ji${eol}ana mur tiofapel sudvivot hub wurgo jifhi jumkehfot${eol}`;

        const tests = [
            { docText: testEditorDuplicateLines, selection: true, openInNewEditor: false, expected: testEditorDuplicateLinesRemoved },
            { docText: testEditorDuplicateLines, selection: false, openInNewEditor: false, expected: testEditorDuplicateLinesRemoved },
            { docText: testEditorDuplicateLines, selection: true, openInNewEditor: true, expected: testEditorDuplicateLinesRemoved },
            { docText: testEditorDuplicateLines, selection: false, openInNewEditor: true, expected: testEditorDuplicateLinesRemoved },
        ];

        tests.forEach(function (t) {
            let testTitle: string;
            if (t.selection && !t.openInNewEditor) { testTitle = "Remove duplicate lines and update selection"; }
            else if (!t.selection && !t.openInNewEditor) { testTitle = "Remove duplicate lines from then document"; }
            else if (t.selection && t.openInNewEditor) { testTitle = "Remove duplciate lines, open result in new editor"; }
            else if (!t.selection && t.openInNewEditor) { testTitle = "Remove duplicate lines from the document, open resul in new editor"; }

            test(testTitle!, async () => {
                await createNewEditor(t.docText);
                if (t.selection) { await selectAllText(); }
                await removeDuplicateLines(t.openInNewEditor);
                await sleep(500);

                let text = getDocumentText();
                assert.deepStrictEqual(text, t.expected);
            });
        });
    });
});