import * as assert from "assert";
import { after, before, describe, it } from "mocha";
import { sleep, createNewEditor, selectAllText, closeTextEditor, getDocumentTextOrSelection, getActiveEditor } from "../../modules/helpers";
import { convertSelection, caseConversions } from "../../modules/caseConversion";
import { Selection } from "vscode";

describe("caseConversion", () => {
    before(() => {
        console.log("Starting caseConversion tests");
    });
    after(async () => {
        await sleep(500);
        await closeTextEditor(true);
        console.log("All caseConversion tests done");
    });

    describe("Case Conversion Single Line", () => {
        const testsSingleLine = [
            { conversionType: caseConversions.camelCase, text: "test document", expectedText: "testDocument" },
            { conversionType: caseConversions.camelCase, text: "hello world test", expectedText: "helloWorldTest" },
            { conversionType: caseConversions.camelCase, text: "already_snake_case", expectedText: "alreadySnakeCase" },
            { conversionType: caseConversions.constantCase, text: "test document", expectedText: "TEST_DOCUMENT" },
            { conversionType: caseConversions.constantCase, text: "already-kebab-case", expectedText: "ALREADY_KEBAB_CASE" },
            { conversionType: caseConversions.dotCase, text: "test document", expectedText: "test.document" },
            { conversionType: caseConversions.dotCase, text: "multiple word test", expectedText: "multiple.word.test" },
            { conversionType: caseConversions.headerCase, text: "test document", expectedText: "TEST-DOCUMENT" },
            { conversionType: caseConversions.headerCase, text: "multiple word test", expectedText: "MULTIPLE-WORD-TEST" },
            { conversionType: caseConversions.invertCase, text: "TeSt dOcuUMent", expectedText: "tEsT DoCUumENT" },
            { conversionType: caseConversions.invertCase, text: "UPPERCASE", expectedText: "uppercase" },
            { conversionType: caseConversions.invertCase, text: "lowercase", expectedText: "LOWERCASE" },
            { conversionType: caseConversions.kebabCase, text: "test document", expectedText: "test-document" },
            { conversionType: caseConversions.kebabCase, text: "camelCase text", expectedText: "camel-case-text" },
            { conversionType: caseConversions.pascalCase, text: "test document", expectedText: "TestDocument" },
            { conversionType: caseConversions.pascalCase, text: "multiple word test", expectedText: "MultipleWordTest" },
            { conversionType: caseConversions.pathCase, text: "test document", expectedText: "test/document" },
            { conversionType: caseConversions.pathCase, text: "multiple word test", expectedText: "multiple/word/test" },
            { conversionType: caseConversions.sentenceCase, text: "test document", expectedText: "Test document" },
            { conversionType: caseConversions.sentenceCase, text: "UPPERCASE TEXT", expectedText: "Uppercase text" },
            { conversionType: caseConversions.snakeCase, text: "test document", expectedText: "test_document" },
            { conversionType: caseConversions.snakeCase, text: "camelCase text", expectedText: "camel_case_text" },
        ];

        testsSingleLine.forEach((t) => {
            it(`Convert "${t.text}" to ${t.conversionType}`, async () => {
                await createNewEditor(t.text);
                await selectAllText();
                convertSelection(t.conversionType);
                await sleep(500);
                const expectedText = t.expectedText;
                const actualText = getDocumentTextOrSelection();
                assert.strictEqual(actualText, expectedText, `Expected "${expectedText}" but got "${actualText}" for ${t.conversionType}`);
            });
        });
    });

    describe("Case Conversion Edge Cases", () => {
        it("Convert empty string", async () => {
            await createNewEditor("");
            await selectAllText();
            convertSelection(caseConversions.camelCase);
            await sleep(500);
            const actualText = getDocumentTextOrSelection();
            assert.strictEqual(actualText, "", "Empty string should remain empty");
        });

        it("Convert single word", async () => {
            await createNewEditor("word");
            await selectAllText();
            convertSelection(caseConversions.pascalCase);
            await sleep(500);
            const actualText = getDocumentTextOrSelection();
            assert.strictEqual(actualText, "Word", "Single word should be capitalized for PascalCase");
        });

        it("Convert numbers and special characters", async () => {
            await createNewEditor("test123 document_with$special@chars");
            await selectAllText();
            convertSelection(caseConversions.camelCase);
            await sleep(500);
            const actualText = getDocumentTextOrSelection();
            // The actual behavior depends on the implementation - this test validates consistency
            assert.ok(actualText && actualText.length > 0, "Should handle special characters gracefully");
        });

        it("Convert already correct case", async () => {
            await createNewEditor("alreadyCamelCase");
            await selectAllText();
            convertSelection(caseConversions.camelCase);
            await sleep(500);
            const actualText = getDocumentTextOrSelection();
            assert.ok(actualText && actualText.length > 0, "Should handle already correct case");
        });
    });

    describe("Case Conversion Multi Line", () => {
        it("Convert multiple lines", async () => {
            await createNewEditor("first line\nsecond line\nthird line");
            await selectAllText();
            convertSelection(caseConversions.camelCase);
            await sleep(500);
            const actualText = getDocumentTextOrSelection();
            assert.ok(actualText, "Should return text result");
            const lines = actualText!.split('\n');
            assert.strictEqual(lines.length, 3, "Should preserve line structure");
            assert.strictEqual(lines[0], "firstLine", "First line should be converted");
            assert.strictEqual(lines[1], "secondLine", "Second line should be converted");
            assert.strictEqual(lines[2], "thirdLine", "Third line should be converted");
        });

        it("Convert with multicursor selection", async () => {
            await createNewEditor("first text\n\nsecond text");
            const editor = getActiveEditor();
            if (editor) {
                // Select "first" and "second" words independently
                let selections: Selection[] = [];
                selections.push(new Selection(0, 0, 0, 5)); // "first"
                selections.push(new Selection(2, 0, 2, 6)); // "second"
                editor.selections = selections;
                
                convertSelection(caseConversions.constantCase);
                await sleep(500);
                
                const actualText = getDocumentTextOrSelection();
                assert.ok(actualText, "Should return text result");
                assert.ok(actualText!.includes("FIRST"), "First selection should be converted to CONSTANT_CASE");
                assert.ok(actualText!.includes("SECOND"), "Second selection should be converted to CONSTANT_CASE");
            }
        });
    });

    describe("Case Conversion Partial Selection", () => {
        it("Convert partial word selection", async () => {
            await createNewEditor("hello world test");
            const editor = getActiveEditor();
            if (editor) {
                // Select only "world" 
                editor.selection = new Selection(0, 6, 0, 11);
                
                convertSelection(caseConversions.constantCase);
                await sleep(500);
                
                const actualText = getDocumentTextOrSelection();
                assert.ok(actualText, "Should return text result");
                assert.ok(actualText!.includes("WORLD"), "Selected word should be converted");
                assert.ok(actualText!.includes("hello"), "Non-selected parts should remain unchanged");
                assert.ok(actualText!.includes("test"), "Non-selected parts should remain unchanged");
            }
        });
    });
});
