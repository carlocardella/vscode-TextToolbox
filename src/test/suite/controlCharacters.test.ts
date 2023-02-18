import * as assert from "assert";
import { after, before, describe, afterEach } from "mocha";
import { EOL } from "os";
import { replaceControlCharacters } from "../../modules/controlCharacters";
import { closeTextEditor, createNewEditor, getActiveEditor, getDocumentTextOrSelection, selectAllText, sleep } from "../../modules/helpers";
import { ConfigurationTarget, Selection, window, workspace, commands, env } from "vscode";

suite("controlCharacters", () => {
    before(async () => {
        console.log("Starting controlCharacters tests");
        let config = workspace.getConfiguration("TextToolbox", window.activeTextEditor?.document);
        await config.update("replaceControlCharactersWith", undefined, ConfigurationTarget.Global);
    });
    after(async () => {
        await sleep(500);
        await closeTextEditor(true);
        console.log("All controlCharacters tests done");
    });

    afterEach(async () => {
        let config = workspace.getConfiguration("TextToolbox", window.activeTextEditor?.document);
        await config.update("replaceControlCharactersWith", undefined, ConfigurationTarget.Global);
    });

    describe("Control Characters", () => {
        const newTextEditor = `Lorem​Ipsum­Dolor​Sit­Amet​Consectetur​Adipiscing​Elit​Sed‌Do​Eiusmod​Tempor​Incididunt​Ut​Labore​Et​Dolore​Magna​Aliqua​Ut​Enim​Ad​Minim​Veniam​Quis​Nostrud​Exercitation­Ullamco​Laboris‌Nisi​Ut​Aliquip­Ex​Ea​Commodo​Consequat​Duis​Aute‌Irure​Dolor​In​Reprehenderit​In​Voluptate​Velit​Esse​Cillum​Dolore­Eu​Fugiat​Nulla‌Pariatur​Excepteur­Sint​Occaecat‌Cupidatat​Non‌Proident​Sunt​In​Culpa­Qui​Officia​Deserunt​Mollit​Anim​Id​Est​Laborum${EOL}Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing Elit Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua Ut Enim Ad Minim Veniam Quis Nostrud Exercitation Ullamco Laboris Nisi Ut Aliquip Ex Ea Commodo Consequat Duis Aute Irure Dolor In Reprehenderit In Voluptate Velit Esse Cillum Dolore Eu Fugiat Nulla Pariatur Excepteur Sint Occaecat Cupidatat Non Proident Sunt In Culpa Qui Officia Deserunt Mollit Anim Id Est Laborum${EOL}<img src=“image.jpg” />${EOL}There‎ is one ‎before${EOL}– vs -${EOL}`;

        describe("Remove control characters from full document", () => {
            const expectedFullDocumentWithEmptyString = `LoremIpsumDolorSitAmetConsecteturAdipiscingElitSedDoEiusmodTemporIncididuntUtLaboreEtDoloreMagnaAliquaUtEnimAdMinimVeniamQuisNostrudExercitationUllamcoLaborisNisiUtAliquipExEaCommodoConsequatDuisAuteIrureDolorInReprehenderitInVoluptateVelitEsseCillumDoloreEuFugiatNullaPariaturExcepteurSintOccaecatCupidatatNonProidentSuntInCulpaQuiOfficiaDeseruntMollitAnimIdEstLaborum${EOL}LoremIpsumDolorSitAmetConsecteturAdipiscingElitSedDoEiusmodTemporIncididuntUtLaboreEtDoloreMagnaAliquaUtEnimAdMinimVeniamQuisNostrudExercitationUllamcoLaborisNisiUtAliquipExEaCommodoConsequatDuisAuteIrureDolorInReprehenderitInVoluptateVelitEsseCillumDoloreEuFugiatNullaPariaturExcepteurSintOccaecatCupidatatNonProidentSuntInCulpaQuiOfficiaDeseruntMollitAnimIdEstLaborum${EOL}<img src=image.jpg />${EOL}There is one before${EOL} vs -${EOL}`;

            const expectedFullDocumentWithSpace = `Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing Elit Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua Ut Enim Ad Minim Veniam Quis Nostrud Exercitation Ullamco Laboris Nisi Ut Aliquip Ex Ea Commodo Consequat Duis Aute Irure Dolor In Reprehenderit In Voluptate Velit Esse Cillum Dolore Eu Fugiat Nulla Pariatur Excepteur Sint Occaecat Cupidatat Non Proident Sunt In Culpa Qui Officia Deserunt Mollit Anim Id Est Laborum${EOL}Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing Elit Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua Ut Enim Ad Minim Veniam Quis Nostrud Exercitation Ullamco Laboris Nisi Ut Aliquip Ex Ea Commodo Consequat Duis Aute Irure Dolor In Reprehenderit In Voluptate Velit Esse Cillum Dolore Eu Fugiat Nulla Pariatur Excepteur Sint Occaecat Cupidatat Non Proident Sunt In Culpa Qui Officia Deserunt Mollit Anim Id Est Laborum${EOL}<img src= image.jpg  />${EOL}There  is one  before${EOL}  vs -`;

            const expectedFullDocumentWithCustomStringX = `LoremxIpsumxDolorxSitxAmetxConsecteturxAdipiscingxElitxSedxDoxEiusmodxTemporxIncididuntxUtxLaborexEtxDolorexMagnaxAliquaxUtxEnimxAdxMinimxVeniamxQuisxNostrudxExercitationxUllamcoxLaborisxNisixUtxAliquipxExxEaxCommodoxConsequatxDuisxAutexIrurexDolorxInxReprehenderitxInxVoluptatexVelitxEssexCillumxDolorexEuxFugiatxNullaxPariaturxExcepteurxSintxOccaecatxCupidatatxNonxProidentxSuntxInxCulpaxQuixOfficiaxDeseruntxMollitxAnimxIdxEstxLaborum${EOL}LoremxIpsumxDolorxSitxAmetxConsecteturxAdipiscingxElitxSedxDoxEiusmodxTemporxIncididuntxUtxLaborexEtxDolorexMagnaxAliquaxUtxEnimxAdxMinimxVeniamxQuisxNostrudxExercitationxUllamcoxLaborisxNisixUtxAliquipxExxEaxCommodoxConsequatxDuisxAutexIrurexDolorxInxReprehenderitxInxVoluptatexVelitxEssexCillumxDolorexEuxFugiatxNullaxPariaturxExcepteurxSintxOccaecatxCupidatatxNonxProidentxSuntxInxCulpaxQuixOfficiaxDeseruntxMollitxAnimxIdxEstxLaborum${EOL}<img src=ximage.jpgx />${EOL}Therex is one xbefore${EOL}x vs -`;

            test("Remove control characters from full document, replace with empty string", async () => {
                await createNewEditor(newTextEditor);
                const editor = getActiveEditor();
                await replaceControlCharacters(editor);
                await sleep(500);

                let text = getDocumentTextOrSelection();
                assert.deepStrictEqual(text, expectedFullDocumentWithEmptyString);
            });

            test("Remove control characters from full document, replace with space", async () => {
                let config = workspace.getConfiguration("TextToolbox", window.activeTextEditor?.document);
                await config.update("replaceControlCharactersWith", " ", ConfigurationTarget.Global);
                await createNewEditor(newTextEditor);
                const editor = getActiveEditor();
                await replaceControlCharacters(editor);
                await sleep(500);

                let text = getDocumentTextOrSelection();
                assert.deepStrictEqual(text, expectedFullDocumentWithSpace);
            });

            test("Remove control characters from full document, replace with custom string x", async () => {
                let config = workspace.getConfiguration("TextToolbox", window.activeTextEditor?.document);
                await config.update("replaceControlCharactersWith", "x", ConfigurationTarget.Global);
                await createNewEditor(newTextEditor);
                const editor = getActiveEditor();
                await replaceControlCharacters(editor);
                await sleep(500);

                let text = getDocumentTextOrSelection();
                assert.deepStrictEqual(text, expectedFullDocumentWithCustomStringX);
            });
        });

        describe("Remove control characters from selection", () => {
            const expectedSelectiontWithEmptyString = `Lorem​Ipsum­Dolor​Sit­Amet​Consectetur​Adipiscing​Elit​Sed‌Do​Eiusmod​Tempor​Incididunt​Ut​Labore​Et​Dolore​Magna​Aliqua​Ut​Enim​Ad​Minim​Veniam​Quis​Nostrud​Exercitation­Ullamco​Laboris‌Nisi​Ut​Aliquip­Ex​Ea​Commodo​Consequat​Duis​Aute‌Irure​Dolor​In​Reprehenderit​In​Voluptate​Velit​Esse​Cillum​Dolore­Eu​Fugiat​Nulla‌Pariatur​Excepteur­Sint​Occaecat‌Cupidatat​Non‌Proident​Sunt​In​Culpa­Qui​Officia​Deserunt​Mollit​Anim​Id​Est​Laborum${EOL}Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing Elit Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua Ut Enim Ad Minim Veniam Quis Nostrud Exercitation Ullamco Laboris Nisi Ut Aliquip Ex Ea Commodo Consequat Duis Aute Irure Dolor In Reprehenderit In Voluptate Velit Esse Cillum Dolore Eu Fugiat Nulla Pariatur Excepteur Sint Occaecat Cupidatat Non Proident Sunt In Culpa Qui Officia Deserunt Mollit Anim Id Est Laborum${EOL}<img src=“image.jpg” />${EOL}There‎ is one ‎before${EOL} vs -${EOL}`;
            const expectedSelectiontWithSpace = `Lorem​Ipsum­Dolor​Sit­Amet​Consectetur​Adipiscing​Elit​Sed‌Do​Eiusmod​Tempor​Incididunt​Ut​Labore​Et​Dolore​Magna​Aliqua​Ut​Enim​Ad​Minim​Veniam​Quis​Nostrud​Exercitation­Ullamco​Laboris‌Nisi​Ut​Aliquip­Ex​Ea​Commodo​Consequat​Duis​Aute‌Irure​Dolor​In​Reprehenderit​In​Voluptate​Velit​Esse​Cillum​Dolore­Eu​Fugiat​Nulla‌Pariatur​Excepteur­Sint​Occaecat‌Cupidatat​Non‌Proident​Sunt​In​Culpa­Qui​Officia​Deserunt​Mollit​Anim​Id​Est​Laborum${EOL}Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing Elit Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua Ut Enim Ad Minim Veniam Quis Nostrud Exercitation Ullamco Laboris Nisi Ut Aliquip Ex Ea Commodo Consequat Duis Aute Irure Dolor In Reprehenderit In Voluptate Velit Esse Cillum Dolore Eu Fugiat Nulla Pariatur Excepteur Sint Occaecat Cupidatat Non Proident Sunt In Culpa Qui Officia Deserunt Mollit Anim Id Est Laborum${EOL}<img src=“image.jpg” />${EOL}There‎ is one ‎before${EOL}  vs -${EOL}`;
            const expectedSelectiontWithCustomStringX = `Lorem​Ipsum­Dolor​Sit­Amet​Consectetur​Adipiscing​Elit​Sed‌Do​Eiusmod​Tempor​Incididunt​Ut​Labore​Et​Dolore​Magna​Aliqua​Ut​Enim​Ad​Minim​Veniam​Quis​Nostrud​Exercitation­Ullamco​Laboris‌Nisi​Ut​Aliquip­Ex​Ea​Commodo​Consequat​Duis​Aute‌Irure​Dolor​In​Reprehenderit​In​Voluptate​Velit​Esse​Cillum​Dolore­Eu​Fugiat​Nulla‌Pariatur​Excepteur­Sint​Occaecat‌Cupidatat​Non‌Proident​Sunt​In​Culpa­Qui​Officia​Deserunt​Mollit​Anim​Id​Est​Laborum${EOL}Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing Elit Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua Ut Enim Ad Minim Veniam Quis Nostrud Exercitation Ullamco Laboris Nisi Ut Aliquip Ex Ea Commodo Consequat Duis Aute Irure Dolor In Reprehenderit In Voluptate Velit Esse Cillum Dolore Eu Fugiat Nulla Pariatur Excepteur Sint Occaecat Cupidatat Non Proident Sunt In Culpa Qui Officia Deserunt Mollit Anim Id Est Laborum${EOL}<img src=“image.jpg” />${EOL}There‎ is one ‎before${EOL}x vs -${EOL}`;

            test("Remove control characters from selection, replace with empty string", async () => {
                await createNewEditor(newTextEditor);
                const editor = getActiveEditor();
                let selections: Selection[] = [];
                selections.push(new Selection(4, 0, 4, 8));
                editor!.selections = selections;
                await replaceControlCharacters(editor);
                await sleep(500);

                await selectAllText();
                let text = getDocumentTextOrSelection();
                assert.deepStrictEqual(text, expectedSelectiontWithEmptyString);
            });

            test("Remove control characters from selection, replace with space", async () => {
                let config = workspace.getConfiguration("TextToolbox", window.activeTextEditor?.document);
                await config.update("replaceControlCharactersWith", " ", ConfigurationTarget.Global);
                await createNewEditor(newTextEditor);
                const editor = getActiveEditor();
                let selections: Selection[] = [];
                selections.push(new Selection(4, 0, 4, 7));
                editor!.selections = selections;
                await replaceControlCharacters(editor);
                await sleep(500);

                await selectAllText();
                let text = getDocumentTextOrSelection();
                assert.deepStrictEqual(text, expectedSelectiontWithSpace);
            });

            test("Remove control characters from selection, replace with custom string x", async () => {
                let config = workspace.getConfiguration("TextToolbox", window.activeTextEditor?.document);
                await config.update("replaceControlCharactersWith", "x", ConfigurationTarget.Global);
                await createNewEditor(newTextEditor);
                const editor = getActiveEditor();
                let selections: Selection[] = [];
                selections.push(new Selection(4, 0, 4, 8));
                editor!.selections = selections;
                await replaceControlCharacters(editor);
                await sleep(500);

                await selectAllText();
                let text = getDocumentTextOrSelection();
                assert.deepStrictEqual(text, expectedSelectiontWithCustomStringX);
            });
        });

        describe.skip("Remove control charachters on paste", () => {
            test("Remove control characters on paste", async () => {
                let config = workspace.getConfiguration("TextToolbox", window.activeTextEditor?.document);
                await config.update("removeControlCharactersOnPaste", true, ConfigurationTarget.Global);

                await env.clipboard.writeText(newTextEditor);

                await createNewEditor();
                await commands.executeCommand("editor.action.clipboardPasteAction");
                await sleep(500);

                const newText = getDocumentTextOrSelection();
                const expectedFullDocumentWithEmptyString = `LoremIpsumDolorSitAmetConsecteturAdipiscingElitSedDoEiusmodTemporIncididuntUtLaboreEtDoloreMagnaAliquaUtEnimAdMinimVeniamQuisNostrudExercitationUllamcoLaborisNisiUtAliquipExEaCommodoConsequatDuisAuteIrureDolorInReprehenderitInVoluptateVelitEsseCillumDoloreEuFugiatNullaPariaturExcepteurSintOccaecatCupidatatNonProidentSuntInCulpaQuiOfficiaDeseruntMollitAnimIdEstLaborum${EOL}LoremIpsumDolorSitAmetConsecteturAdipiscingElitSedDoEiusmodTemporIncididuntUtLaboreEtDoloreMagnaAliquaUtEnimAdMinimVeniamQuisNostrudExercitationUllamcoLaborisNisiUtAliquipExEaCommodoConsequatDuisAuteIrureDolorInReprehenderitInVoluptateVelitEsseCillumDoloreEuFugiatNullaPariaturExcepteurSintOccaecatCupidatatNonProidentSuntInCulpaQuiOfficiaDeseruntMollitAnimIdEstLaborum${EOL}<img src=image.jpg />${EOL}There is one before${EOL} vs -${EOL}`;

                assert.deepStrictEqual(newText, expectedFullDocumentWithEmptyString);

                await config.update("removeControlCharactersOnPaste", undefined, ConfigurationTarget.Global);
            });
        });
    });
});
