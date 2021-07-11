import * as assert from "assert";
import { before, after, describe } from "mocha";
import { sleep, closeTextEditor, createNewEditor, getActiveEditor, selectAllText, getDocumentTextOrSelection } from "../../modules/helpers";
import { Selection } from "vscode";
import { splitTextInternal } from "../../modules/splitText";
import { EOL } from "os";

suite("splitText", () => {
    before(() => {
        console.log("Starting splitText tests");
    });
    after(async () => {
        await sleep(500);
        await closeTextEditor(true);
        console.log("All splitText tests done");
    });

    describe("Split Text", () => {
        const textToSplit = `Aute ex anim dolore sunt pariatur culpa sit ut ut ex incididunt mollit dolore.${EOL}Irure, enim, culpa, reprehenderit, aliqua, laboris, irure, sint, proident, labore, quis, laboris, quis, quis.${EOL}Aute proident mollit eiusmod fugiat.`;

        const textSplitSecondLine = `Aute ex anim dolore sunt pariatur culpa sit ut ut ex incididunt mollit dolore.${EOL}Irure${EOL} enim${EOL} culpa${EOL} reprehenderit${EOL} aliqua${EOL} laboris${EOL} irure${EOL} sint${EOL} proident${EOL} labore${EOL} quis${EOL} laboris${EOL} quis${EOL} quis.${EOL}Aute proident mollit eiusmod fugiat.`;

        const textSplitFirstLineNewEditor = `Aute${EOL}ex${EOL}anim${EOL}dolore${EOL}sunt${EOL}pariatur${EOL}culpa${EOL}sit${EOL}ut${EOL}ut${EOL}ex${EOL}incididunt${EOL}mollit${EOL}dolore.${EOL}Irure, enim, culpa, reprehenderit, aliqua, laboris, irure, sint, proident, labore, quis, laboris, quis, quis.${EOL}Aute proident mollit eiusmod fugiat.`;

        test("Split the second line in a text of three", async () => {
            await createNewEditor(textToSplit);
            const editor = getActiveEditor();
            // editor!.selections = [new Selection(1, 0, 1, editor?.document.lineAt(1).text.length!)];
            editor!.selections = [new Selection(1, 0, 1, 269)];
            await splitTextInternal(",", false);
            await sleep(500);

            await selectAllText();
            let text = getDocumentTextOrSelection();
            assert.deepStrictEqual(text, textSplitSecondLine);
        });

        test("Split the first line in a text of three, open in new editor", async () => {
            await createNewEditor(textToSplit);
            const editor = getActiveEditor();
            // editor!.selections = [new Selection(0, 0, 0, editor?.document.lineAt(1).text.length!)];
            editor!.selections = [new Selection(0, 0, 0, 99)];
            await splitTextInternal(" ", true);
            await sleep(500);

            await selectAllText();
            let text = getDocumentTextOrSelection();
            assert.deepStrictEqual(text, textSplitFirstLineNewEditor);
        });
    });
});
