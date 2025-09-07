import * as assert from "assert";
import { before, after, describe } from "mocha";
import { sleep, createNewEditor, selectAllText, getDocumentTextOrSelection, closeTextEditor, linesToLine, getActiveEditor, getDocumentEOL } from "../../modules/helpers";
import { 
    findLinesMatchingRegEx, 
    findLinesMatchingString,
    openSelectionInNewEditor, 
    removeDuplicateLines, 
    removeEmptyLines,
    removeEmptyLinesInternal,
    getTextBetweenSpaces,
    REGEX_TEXT_BETWEEN_SPACES,
    REGEX_VALIDATE_EMAIL
} from "../../modules/filterText";
import { ConfigurationTarget, window, workspace, Selection, Position } from "vscode";

describe("filterText", () => {
    before(() => {
        console.log("Starting filterText tests");
    });
    after(async () => {
        await sleep(500);
        await closeTextEditor(true);
        console.log("All insertText tests done");
    });

    describe("Remove all empty lines", async () => {
        it("Remove redundant empty lines", async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const testEditorText = `Fehfomda pemup mihjeb${eol}${eol}uvonono nelvojpo wokragsi geligab${eol}${eol}${eol}pokacan repafme racje ut alhacov${eol}${eol}Hireme gahze${eol}${eol}${eol}${eol}${eol}pi zo iro becago vekabo${eol}luihait abe zukuv gof tususho${eol}${eol}${eol}${eol}`;
            const testEditorTextRedundantExpected = `Fehfomda pemup mihjeb${eol}${eol}uvonono nelvojpo wokragsi geligab${eol}${eol}pokacan repafme racje ut alhacov${eol}${eol}Hireme gahze${eol}${eol}pi zo iro becago vekabo${eol}luihait abe zukuv gof tususho${eol}${eol}`;
            
            await createNewEditor(testEditorText);
            await removeEmptyLines(true);
            await sleep(500);

            let text = getDocumentTextOrSelection();
            assert.deepStrictEqual(text, testEditorTextRedundantExpected);
        });

        it("Remove all empty lines", async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const testEditorText = `Fehfomda pemup mihjeb${eol}${eol}uvonono nelvojpo wokragsi geligab${eol}${eol}${eol}pokacan repafme racje ut alhacov${eol}${eol}Hireme gahze${eol}${eol}${eol}${eol}${eol}pi zo iro becago vekabo${eol}luihait abe zukuv gof tususho${eol}${eol}${eol}${eol}`;
            const testEditorTextAllExpected = `Fehfomda pemup mihjeb${eol}uvonono nelvojpo wokragsi geligab${eol}pokacan repafme racje ut alhacov${eol}Hireme gahze${eol}pi zo iro becago vekabo${eol}luihait abe zukuv gof tususho${eol}`;
            
            await createNewEditor(testEditorText);
            await removeEmptyLines(false);
            await sleep(500);

            let text = getDocumentTextOrSelection();
            assert.deepStrictEqual(text, testEditorTextAllExpected);
        });

        it("Handle empty document", async () => {
            await createNewEditor("");
            await removeEmptyLines(false);
            await sleep(500);

            let text = getDocumentTextOrSelection();
            assert.strictEqual(text, "");
        });

        it("Handle document with only empty lines", async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const testEditorText = `${eol}${eol}${eol}${eol}`;
            
            await createNewEditor(testEditorText);
            await removeEmptyLines(false);
            await sleep(500);

            let text = getDocumentTextOrSelection();
            assert.strictEqual(text, "");
        });

        it("Remove empty lines internal function", async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const testText = `line1${eol}${eol}${eol}line2${eol}${eol}line3${eol}`;
            const expectedRedundant = `line1${eol}${eol}line2${eol}${eol}line3${eol}`;
            const expectedAll = `line1${eol}line2${eol}line3${eol}`;

            const resultRedundant = await removeEmptyLinesInternal(testText, true);
            assert.strictEqual(resultRedundant, expectedRedundant);

            const resultAll = await removeEmptyLinesInternal(testText, false);
            assert.strictEqual(resultAll, expectedAll);
        });
    });

    describe("Remove duplicate lines", async () => {
        it("Remove duplicate lines with selection", async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const testEditorDuplicateLines = `Gowul ibbohu tafeid fokecdif lab adazujob${eol}meaf dekase sij of wehi nefowumu wizabeti${eol}${eol}Gowul ibbohu tafeid fokecdif lab adazujob${eol}Gowul ibbohu tafeid fokecdif lab adazujob${eol}${eol}${eol}palte${eol}${eol}${eol}meaf dekase sij of wehi nefowumu wizabeti${eol}meaf dekase sij of wehi nefowumu wizabeti${eol}meaf dekase sij of wehi nefowumu wizabeti${eol}${eol}${eol}Nefzuh toehe jiubvid tic didukod ehe ji ${eol}ana mur tiofapel sudvivot hub wurgo jifhi jumkehfot ${eol}palte${eol}${eol}ana mur tiofapel sudvivot hub wurgo jifhi jumkehfot ${eol}`;
            const testEditorDuplicateLinesRemoved = `Gowul ibbohu tafeid fokecdif lab adazujob${eol}meaf dekase sij of wehi nefowumu wizabeti${eol}palte${eol}Nefzuh toehe jiubvid tic didukod ehe ji${eol}ana mur tiofapel sudvivot hub wurgo jifhi jumkehfot`;

            await createNewEditor(testEditorDuplicateLines);
            await selectAllText();
            await removeDuplicateLines(false);
            await sleep(500);

            let text = getDocumentTextOrSelection();
            assert.deepStrictEqual(text, testEditorDuplicateLinesRemoved);
        });

        it("Remove duplicate lines from document", async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const testEditorDuplicateLines = `Gowul ibbohu tafeid fokecdif lab adazujob${eol}meaf dekase sij of wehi nefowumu wizabeti${eol}${eol}Gowul ibbohu tafeid fokecdif lab adazujob${eol}Gowul ibbohu tafeid fokecdif lab adazujob${eol}${eol}${eol}palte${eol}${eol}${eol}meaf dekase sij of wehi nefowumu wizabeti${eol}meaf dekase sij of wehi nefowumu wizabeti${eol}meaf dekase sij of wehi nefowumu wizabeti${eol}${eol}${eol}Nefzuh toehe jiubvid tic didukod ehe ji ${eol}ana mur tiofapel sudvivot hub wurgo jifhi jumkehfot ${eol}palte${eol}${eol}ana mur tiofapel sudvivot hub wurgo jifhi jumkehfot ${eol}`;
            const testEditorDuplicateLinesRemoved = `Gowul ibbohu tafeid fokecdif lab adazujob${eol}meaf dekase sij of wehi nefowumu wizabeti${eol}palte${eol}Nefzuh toehe jiubvid tic didukod ehe ji${eol}ana mur tiofapel sudvivot hub wurgo jifhi jumkehfot`;

            await createNewEditor(testEditorDuplicateLines);
            await removeDuplicateLines(false);
            await sleep(500);

            let text = getDocumentTextOrSelection();
            assert.deepStrictEqual(text, testEditorDuplicateLinesRemoved);
        });

        it("Remove duplicate lines and open in new editor", async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const testEditorDuplicateLines = `Gowul ibbohu tafeid fokecdif lab adazujob${eol}meaf dekase sij of wehi nefowumu wizabeti${eol}${eol}Gowul ibbohu tafeid fokecdif lab adazujob${eol}Gowul ibbohu tafeid fokecdif lab adazujob${eol}${eol}${eol}palte${eol}${eol}${eol}meaf dekase sij of wehi nefowumu wizabeti${eol}meaf dekase sij of wehi nefowumu wizabeti${eol}meaf dekase sij of wehi nefowumu wizabeti${eol}${eol}${eol}Nefzuh toehe jiubvid tic didukod ehe ji ${eol}ana mur tiofapel sudvivot hub wurgo jifhi jumkehfot ${eol}palte${eol}${eol}ana mur tiofapel sudvivot hub wurgo jifhi jumkehfot ${eol}`;
            const testEditorDuplicateLinesRemoved = `Gowul ibbohu tafeid fokecdif lab adazujob${eol}meaf dekase sij of wehi nefowumu wizabeti${eol}palte${eol}Nefzuh toehe jiubvid tic didukod ehe ji${eol}ana mur tiofapel sudvivot hub wurgo jifhi jumkehfot`;

            await createNewEditor(testEditorDuplicateLines);
            await selectAllText();
            await removeDuplicateLines(true);
            await sleep(500);

            let text = getDocumentTextOrSelection();
            assert.deepStrictEqual(text, testEditorDuplicateLinesRemoved);
        });

        it("Handle empty lines in duplicate removal", async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const testText = `${eol}line1${eol}${eol}line1${eol}${eol}${eol}`;
            const expected = `line1`;

            await createNewEditor(testText);
            await removeDuplicateLines(false);
            await sleep(500);

            let text = getDocumentTextOrSelection();
            assert.strictEqual(text, expected);
        });

        it("Handle single line document", async () => {
            await createNewEditor("single line");
            await removeDuplicateLines(false);
            await sleep(500);

            let text = getDocumentTextOrSelection();
            assert.strictEqual(text, "single line");
        });
    });

    describe("Filter lines", () => {
        it("Filter text with regex pattern", async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const textToFilter = `pippo${eol}pippo${eol}${eol}paperino${eol}paperino pippo${eol}${eol}${eol}pippo${eol}paperino${eol}pippo paperino${eol}${eol}paperino${eol}paperino${eol}${eol}paperino${eol}`;
            const regExpExpectedResult = `paperino${eol}paperino pippo${eol}paperino${eol}pippo paperino${eol}paperino${eol}paperino${eol}paperino`;

            await createNewEditor(textToFilter);
            let result = findLinesMatchingRegEx("/.*paperino.*/gm");
            await createNewEditor(await linesToLine(result!));
            await sleep(500);

            let text = String(getDocumentTextOrSelection());
            assert.deepStrictEqual(text, regExpExpectedResult);
        });

        it("Filter text with string pattern", async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const textToFilter = `pippo${eol}pippo${eol}${eol}paperino${eol}paperino pippo${eol}${eol}${eol}pippo${eol}paperino${eol}pippo paperino${eol}${eol}paperino${eol}paperino${eol}${eol}paperino${eol}`;
            const regExpExpectedResult = `paperino${eol}paperino pippo${eol}paperino${eol}pippo paperino${eol}paperino${eol}paperino${eol}paperino`;

            let config = workspace.getConfiguration("TextToolbox", window.activeTextEditor?.document);
            await config.update("filtersUseRegularExpressions", false, ConfigurationTarget.Global);

            await createNewEditor(textToFilter);
            let result = await findLinesMatchingString("paperino");
            await createNewEditor(await linesToLine(result!));
            await sleep(500);

            let text = String(getDocumentTextOrSelection());
            assert.deepStrictEqual(text, regExpExpectedResult);

            await config.update("filtersUseRegularExpressions", undefined, ConfigurationTarget.Global);
        });

        it("Filter text with case sensitive search", async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const textToFilter = `Test${eol}test${eol}TEST${eol}Test${eol}`;

            await createNewEditor(textToFilter);
            let result = await findLinesMatchingString("Test");
            assert.ok(result, "Should find matches");
            assert.strictEqual(result!.length, 2, "Should find exactly 2 matches");
            assert.ok(result!.includes("Test"), "Should include exact match");
        });

        it("Handle empty regex search", async () => {
            await createNewEditor("some text");
            let result = findLinesMatchingRegEx("");
            assert.strictEqual(result, undefined, "Should return undefined for empty search");
        });

        it("Handle empty string search", async () => {
            await createNewEditor("some text");
            let result = await findLinesMatchingString("");
            assert.strictEqual(result, undefined, "Should return undefined for empty search");
        });

        it("Handle regex with global flag", async () => {
            await createNewEditor("test line\nanother test\nno match\ntest again");
            let result = findLinesMatchingRegEx("/test/g");
            assert.ok(result, "Should find matches");
            assert.ok(result!.length > 0, "Should have matches");
        });

        it("Handle regex without global flag", async () => {
            await createNewEditor("test line\nanother test\nno match\ntest again");
            let result = findLinesMatchingRegEx("/test/");
            assert.ok(result, "Should find match");
            assert.strictEqual(result!.length, 1, "Should find only one match without global flag");
        });
    });

    describe("Open selection in new editor", () => {
        it("Open single selection in new editor", async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const text = `pippo${eol}pippo${eol}${eol}paperino${eol}paperino pippo${eol}${eol}${eol}pippo${eol}paperino${eol}pippo paperino${eol}${eol}paperino${eol}paperino${eol}${eol}paperino${eol}`;
            
            await createNewEditor(text);
            const editor = getActiveEditor();
            editor!.selection = new Selection(0, 0, 0, 5); // Select "pippo"
            await openSelectionInNewEditor();
            await sleep(500);

            const newEditor = getActiveEditor();
            const newText = newEditor?.document.getText();
            assert.ok(newText?.includes("pippo"), "Should contain selected text");
        });

        it("Open multiple selections in new editor", async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const text = `pippo${eol}pippo${eol}${eol}paperino${eol}paperino pippo${eol}${eol}${eol}pippo${eol}paperino${eol}pippo paperino${eol}${eol}paperino${eol}paperino${eol}${eol}paperino${eol}`;
            const expected = `pippo${eol}${eol}paperino${eol}${eol}paperino pippo${eol}${eol}paperino${eol}`;

            await createNewEditor(text);
            const editor = getActiveEditor();
            let selections: Selection[] = [];
            selections.push(new Selection(0, 0, 0, 6));
            selections.push(new Selection(3, 0, 3, 8));
            selections.push(new Selection(4, 0, 4, 14));
            selections.push(new Selection(11, 0, 11, 8));
            editor!.selections = selections;
            await openSelectionInNewEditor();
            await sleep(500);

            const newEditor = getActiveEditor();
            const newText = newEditor?.document.getText();

            assert.deepStrictEqual(newText, expected);
        });

        it("Handle empty selection", async () => {
            await createNewEditor("test content");
            const editor = getActiveEditor();
            // Set cursor position without selection
            editor!.selection = new Selection(0, 0, 0, 0);
            
            const result = await openSelectionInNewEditor();
            assert.strictEqual(result, false, "Should return false for empty selection");
        });

        it("Handle no active editor", async () => {
            // Close any open editors first
            await closeTextEditor(true);
            
            try {
                const result = await openSelectionInNewEditor();
                assert.fail("Should throw error when no active editor");
            } catch (error) {
                assert.ok(error, "Should throw error when no active editor");
            }
        });
    });

    describe("Text between spaces utility", () => {
        it("Get text between spaces at cursor", async () => {
            await createNewEditor("hello world test");
            const editor = getActiveEditor();
            if (editor) {
                // Position cursor in the middle of "world"
                editor.selection = new Selection(0, 8, 0, 8);
                
                const result = getTextBetweenSpaces(editor);
                assert.strictEqual(result, "world", "Should extract word at cursor position");
            }
        });

        it("Get text with special characters", async () => {
            await createNewEditor("test-name_value.property");
            const editor = getActiveEditor();
            if (editor) {
                // Position cursor in the middle
                editor.selection = new Selection(0, 10, 0, 10);
                
                const result = getTextBetweenSpaces(editor);
                assert.ok(result, "Should extract text with special characters");
            }
        });

        it("Handle cursor at beginning of document", async () => {
            await createNewEditor("hello world");
            const editor = getActiveEditor();
            if (editor) {
                editor.selection = new Selection(0, 0, 0, 0);
                
                const result = getTextBetweenSpaces(editor);
                assert.ok(result === "hello" || result === undefined, "Should handle cursor at beginning");
            }
        });
    });

    describe("Regex constants", () => {
        it("Text between spaces regex", () => {
            const testCases = [
                { text: "hello", expected: true },
                { text: "test-name", expected: true },
                { text: "value_123", expected: true },
                { text: "file.txt", expected: true },
                { text: " ", expected: false },
                { text: "", expected: false }
            ];

            testCases.forEach(({ text, expected }) => {
                const matches = REGEX_TEXT_BETWEEN_SPACES.test(text);
                assert.strictEqual(matches, expected, `"${text}" should ${expected ? 'match' : 'not match'} text between spaces regex`);
            });
        });

        it("Email validation regex", () => {
            const testCases = [
                { email: "test@example.com", expected: true },
                { email: "user.name@domain.org", expected: true },
                { email: "user-name@sub.domain.net", expected: true },
                { email: "invalid.email", expected: false },
                { email: "@domain.com", expected: false },
                { email: "user@", expected: false },
                { email: "", expected: false }
            ];

            testCases.forEach(({ email, expected }) => {
                const matches = REGEX_VALIDATE_EMAIL.test(email);
                assert.strictEqual(matches, expected, `"${email}" should ${expected ? 'be valid' : 'be invalid'} email`);
            });
        });
    });
});
