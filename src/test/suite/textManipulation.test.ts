import * as assert from 'assert';
import { before, after, describe } from 'mocha';
import { sleep, closeTextEditor, createNewEditor, getActiveEditor } from '../../modules/helpers';
import * as os from 'os';
import { trimLineOrSelection } from '../../modules/textManipulation';
import { Selection } from 'vscode';

suite("textManipulation", () => {
    before(() => {
        console.log('Starting textManipulation tests');
    });
    after(async () => {
        await sleep(500);
        await closeTextEditor(true);
        console.log('All testManipulation tests done')
    });

    describe("Trim whitespaces from selection or document", () => {
        const eol = os.EOL;

        test("Trim whitespaces from document", async () => {
            const text = `Hutruaka pouzjan pu ${eol}   elnordu ce ${eol}     jan gabajo ${eol}genlosif fobavos vucozu jesidjo  ${eol}     os ijme koige fomej zuce ruv juusuje    ${eol}`;
            const expected = `Hutruaka pouzjan pu${eol}elnordu ce${eol}jan gabajo${eol}genlosif fobavos vucozu jesidjo${eol}os ijme koige fomej zuce ruv juusuje${eol}`;

            await createNewEditor(text);

            await trimLineOrSelection();
            await sleep(500);
            const editor = getActiveEditor();
            const trimmedText = editor?.document.getText();

            assert.deepStrictEqual(trimmedText, expected);
        });

        test("Trim whitespaces from selection", async () => {
            const text = `Hutruaka pouzjan pu ${eol}   elnordu ce ${eol}     jan gabajo ${eol}genlosif fobavos vucozu jesidjo  ${eol}     os ijme koige fomej zuce ruv juusuje    ${eol}`;
            const expected = `Hutruaka pouzjan pu ${eol}elnordu ce${eol}     jan gabajo ${eol}genlosif fobavos vucozu jesidjo${eol}     os ijme koige fomej zuce ruv juusuje    ${eol}`;

            await createNewEditor(text);
            const editor = getActiveEditor();
            let selections: Selection[] = [];
            selections.push(new Selection(1, 0, 1, 15));
            selections.push(new Selection(3, 0, 3, 34));
            editor!.selections = selections;

            await trimLineOrSelection();
            await sleep(500);

            const trimmedText = editor?.document.getText();

            assert.deepStrictEqual(trimmedText, expected);
        });
    });

    describe("Split Selection", () => {
        const tests = [
            { description: "Split one line by comma", delimiter: ",", text: "", expected: "", openInNewEditor: false }
        ];
    });
});