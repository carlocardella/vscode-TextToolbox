import * as assert from 'assert';
import { after, before, describe } from 'mocha';
import { EOL } from 'os';
import { ConfigurationTarget, window, workspace } from 'vscode';
import { alignToSeparator } from '../../modules/alignText';
import { closeTextEditor, sleep, createNewEditor, selectAllText, getDocumentTextOrSelection } from '../../modules/helpers';


suite('alignText', () => {
    before(() => {
        console.log('Starting alignText tests');
    });
    after(async () => {
        await sleep(500);
        await closeTextEditor(true);
        let config = workspace.getConfiguration("tt", window.activeTextEditor?.document);
        await config.update("textElementAlignment", undefined, ConfigurationTarget.Global);
        console.log('All alignText tests done');
    });

    describe.skip("Align text to separator", () => {
        let newText = `asd,qwesdfqer,as,a,qwe${EOL}3,sdf433,as@#$d,a234,4564sdsdf@#$6`;
        let expectedRight = `asd           ,qwesdfqer     ,as            ,a             ,qwe           ${EOL}3             ,sdf433        ,as@#$d        ,a234          ,4564sdsdf@#$6 `;
        let expectedLeft = `asd,           qwesdfqer,     as,            a,             qwe,          ${EOL}3,             sdf433,        as@#$d,        a234,          4564sdsdf@#$6`;
        let tests = [
            { newText: newText, textElementAlignment: "right", expected: expectedRight },
            { newText: newText, textElementAlignment: "left", expected: expectedLeft }
        ];

        tests.forEach(t => {
            test(`Align text to separator ${t.textElementAlignment}`, async () => {
                let config = workspace.getConfiguration("tt", window.activeTextEditor?.document);
                await config.update("textElementAlignment", t.textElementAlignment, ConfigurationTarget.Global);
                await createNewEditor(t.newText);
                await selectAllText();
                await alignToSeparator(",");
                await sleep(500);

                const text = getDocumentTextOrSelection();
                assert.deepStrictEqual(text, t.expected);
            });
        });
    });
});