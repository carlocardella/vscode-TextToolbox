import * as assert from "assert";
import { after, before, describe } from "mocha";
import { sleep, createNewEditor, selectAllText, closeTextEditor, getDocumentTextOrSelection, getActiveEditor } from "../../modules/helpers";
import { convertSelection, caseConversions, invertCaseInternal } from "../../modules/caseConversion";
import { EOL } from "os";
import { Selection } from "vscode";

suite("caseConversion", () => {
    before(() => {
        console.log("Starting caseConversion tests");
    });
    after(async () => {
        await sleep(500);
        await closeTextEditor(true);
        console.log("All insertText tests done");
    });

    describe("Case Conversion", () => {
        test("Convert to PascalCase", async () => {
            await createNewEditor("test document");
            await selectAllText();
            convertSelection(caseConversions.pascalCase);
            await sleep(500);
            assert.deepStrictEqual(getDocumentTextOrSelection(), "TestDocument");
        });

        test("Convert to camelCase", async () => {
            await createNewEditor("test document");
            await selectAllText();
            convertSelection(caseConversions.camelCase);
            await sleep(500);
            assert.deepStrictEqual(getDocumentTextOrSelection(), "testDocument");
        });

        test("Convert to CONSTANT_CASE", async () => {
            await createNewEditor("test document");
            await selectAllText();
            convertSelection(caseConversions.constantCase);
            await sleep(500);
            assert.deepStrictEqual(getDocumentTextOrSelection(), "TEST_DOCUMENT");
        });

        test("Convert to dot.case", async () => {
            await createNewEditor("test document");
            await selectAllText();
            convertSelection(caseConversions.dotCase);
            await sleep(500);
            assert.deepStrictEqual(getDocumentTextOrSelection(), "test.document");
        });

        test("Convert to header_case", async () => {
            await createNewEditor("test document");
            await selectAllText();
            convertSelection(caseConversions.headerCase);
            await sleep(500);
            assert.deepStrictEqual(getDocumentTextOrSelection(), "Test-Document");
        });

        test("Convert to no case", async () => {
            await createNewEditor("test document");
            await selectAllText();
            convertSelection(caseConversions.noCase);
            await sleep(500);
            assert.deepStrictEqual(getDocumentTextOrSelection(), "test document");
        });

        test("Convert to param_case", async () => {
            await createNewEditor("test document");
            await selectAllText();
            convertSelection(caseConversions.paramCase);
            await sleep(500);
            assert.deepStrictEqual(getDocumentTextOrSelection(), "test-document");
        });

        test("Convert to path/case", async () => {
            await createNewEditor("test document");
            await selectAllText();
            convertSelection(caseConversions.pathCase);
            await sleep(500);
            assert.deepStrictEqual(getDocumentTextOrSelection(), "test/document");
        });

        test("Convert to Sentence case", async () => {
            await createNewEditor("test document");
            await selectAllText();
            convertSelection(caseConversions.sentenceCase);
            await sleep(500);
            assert.deepStrictEqual(getDocumentTextOrSelection(), "Test document");
        });

        test("Convert to snake_case", async () => {
            await createNewEditor("test document");
            await selectAllText();
            convertSelection(caseConversions.snakeCase);
            await sleep(500);
            assert.deepStrictEqual(getDocumentTextOrSelection(), "test_document");
        });

        test("Convert multicursor", async () => {
            await createNewEditor(`asd asd${EOL}${EOL}asd asd`);
            const editor = getActiveEditor();
            let selections: Selection[] = [];
            selections.push(new Selection(0, 0, 0, 3));
            selections.push(new Selection(2, 0, 2, 3));
            editor!.selections = selections;
            convertSelection(caseConversions.snakeCase);
            await sleep(500);
            await selectAllText();
            assert.deepStrictEqual(getDocumentTextOrSelection(), `asd_asd${EOL}${EOL}asd_asd`);
        });

        test("Invert case", async () => {
            const text = `saMple TeXt fIrsT liNe${EOL}seCond liNe saMPLe TExT`;
            const expected = `SAmPLE tExT FiRSt LInE${EOL}SEcOND LInE SAmplE teXt`;
            await createNewEditor(text);
            await selectAllText();

            const selectedText = getDocumentTextOrSelection();
            invertCaseInternal(selectedText!);
            await sleep(500);

            assert.deepStrictEqual(getDocumentTextOrSelection(), expected);
        });
    });
});
