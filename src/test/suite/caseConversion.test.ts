import * as assert from "assert";
import { after, before, describe } from "mocha";
import { sleep, createNewEditor, selectAllText, closeTextEditor, getDocumentTextOrSelection, getActiveEditor } from "../../modules/helpers";
import { convertSelection, caseConversions } from "../../modules/caseConversion";
import { EOL } from "os";
import { Selection } from "vscode";
import * as os from "os";

suite("caseConversion", () => {
    before(() => {
        console.log("Starting caseConversion tests");
    });
    after(async () => {
        await sleep(500);
        await closeTextEditor(true);
        console.log("All insertText tests done");
    });

    describe("Case Conversion Single Line", () => {
        const testsSingleLine = [
            { conversionType: caseConversions.camelCase, text: "test document", expectedText: "testDocument" },
            { conversionType: caseConversions.constantCase, text: "test document", expectedText: "TEST_DOCUMENT" },
            { conversionType: caseConversions.dotCase, text: "test document", expectedText: "test.document" },
            { conversionType: caseConversions.headerCase, text: "test document", expectedText: "TEST-DOCUMENT" },
            { conversionType: caseConversions.invertCase, text: "TeSt dOcuUMent", expectedText: "tEsT DoCUumENT" },
            { conversionType: caseConversions.kebabCase, text: "test document", expectedText: "test-document" },
            { conversionType: caseConversions.pascalCase, text: "test document", expectedText: "TestDocument" },
            { conversionType: caseConversions.pathCase, text: "test document", expectedText: `test${os.EOL}document` },
            { conversionType: caseConversions.sentenceCase, text: "test document", expectedText: "Test document" },
        ];

        testsSingleLine.forEach((t) => {
            test(`Convert a single line of text to ${t.conversionType}`, async () => {
                await createNewEditor(t.text);
                await selectAllText();
                convertSelection(t.conversionType);
                await sleep(500);
                const expectedText = t.expectedText;
                const actualText = getDocumentTextOrSelection();
                assert.strictEqual(actualText, expectedText);
            });
        });
    });

    describe.skip("Case Conversion Multi Line", () => {
        // todo: implement
        // test("Convert multicursor", async () => {
        //     await createNewEditor(`asd${EOL}${EOL}asd`);
        //     const editor = getActiveEditor();
        //     let selections: Selection[] = [];
        //     selections.push(new Selection(0, 0, 0, 2));
        //     selections.push(new Selection(2, 0, 2, 2));
        //     editor!.selections = selections;
        //     convertSelection(caseConversions.snakeCase);
        //     await sleep(500);
        //     await selectAllText();
        //     assert.deepStrictEqual(getDocumentTextOrSelection(), `asd_asd${EOL}${EOL}asd_asd`);
        // });
    });

    describe.skip("Case Conversion Multi Cursor", () => {
        // todo: implement
    });
});
