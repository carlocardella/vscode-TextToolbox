import * as assert from 'assert';
import { after, before, describe } from 'mocha';
import { EOL } from 'os';
import { removeControlCharacters } from '../../modules/controlCharacters';
import { closeTextEditor, createNewEditor, getActiveEditor, getDocumentTextOrSelection, sleep } from '../../modules/helpers';
import { ConfigurationTarget, window, workspace } from 'vscode';


suite("controlCharacters", () => {
    before(() => {
        console.log('Starting controlCharacters tests');
    });
    after(async () => {
        let config = workspace.getConfiguration("tt", window.activeTextEditor?.document);
        await config.update("filtersUseRegularExpressions", undefined, ConfigurationTarget.Global);
        await sleep(500);
        await closeTextEditor(true);
        console.log('All controlCharacters tests done');
    });

    describe("Control Characters", () => {
        const newTextEditor = `Lorem​Ipsum­Dolor​Sit­Amet​Consectetur​Adipiscing​Elit​Sed‌Do​Eiusmod​Tempor​Incididunt​Ut​Labore​Et​Dolore​Magna​Aliqua​Ut​Enim​Ad​Minim​Veniam​Quis​Nostrud​Exercitation­Ullamco​Laboris‌Nisi​Ut​Aliquip­Ex​Ea​Commodo​Consequat​Duis​Aute‌Irure​Dolor​In​Reprehenderit​In​Voluptate​Velit​Esse​Cillum​Dolore­Eu​Fugiat​Nulla‌Pariatur​Excepteur­Sint​Occaecat‌Cupidatat​Non‌Proident​Sunt​In​Culpa­Qui​Officia​Deserunt​Mollit​Anim​Id​Est​Laborum${EOL}Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing Elit Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua Ut Enim Ad Minim Veniam Quis Nostrud Exercitation Ullamco Laboris Nisi Ut Aliquip Ex Ea Commodo Consequat Duis Aute Irure Dolor In Reprehenderit In Voluptate Velit Esse Cillum Dolore Eu Fugiat Nulla Pariatur Excepteur Sint Occaecat Cupidatat Non Proident Sunt In Culpa Qui Officia Deserunt Mollit Anim Id Est Laborum${EOL}<img src=“image.jpg” />${EOL}There‎ is one ‎before${EOL}– vs -${EOL}`;

        const expectedWithEmptyString = `LoremIpsumDolorSitAmetConsecteturAdipiscingElitSedDoEiusmodTemporIncididuntUtLaboreEtDoloreMagnaAliquaUtEnimAdMinimVeniamQuisNostrudExercitationUllamcoLaborisNisiUtAliquipExEaCommodoConsequatDuisAuteIrureDolorInReprehenderitInVoluptateVelitEsseCillumDoloreEuFugiatNullaPariaturExcepteurSintOccaecatCupidatatNonProidentSuntInCulpaQuiOfficiaDeseruntMollitAnimIdEstLaborum${EOL}LoremIpsumDolorSitAmetConsecteturAdipiscingElitSedDoEiusmodTemporIncididuntUtLaboreEtDoloreMagnaAliquaUtEnimAdMinimVeniamQuisNostrudExercitationUllamcoLaborisNisiUtAliquipExEaCommodoConsequatDuisAuteIrureDolorInReprehenderitInVoluptateVelitEsseCillumDoloreEuFugiatNullaPariaturExcepteurSintOccaecatCupidatatNonProidentSuntInCulpaQuiOfficiaDeseruntMollitAnimIdEstLaborum${EOL}<img src=image.jpg />${EOL}There is one before${EOL} vs -${EOL}`;

        const expectedWithSpace = `Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing Elit Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua Ut Enim Ad Minim Veniam Quis Nostrud Exercitation Ullamco Laboris Nisi Ut Aliquip Ex Ea Commodo Consequat Duis Aute Irure Dolor In Reprehenderit In Voluptate Velit Esse Cillum Dolore Eu Fugiat Nulla Pariatur Excepteur Sint Occaecat Cupidatat Non Proident Sunt In Culpa Qui Officia Deserunt Mollit Anim Id Est Laborum${EOL}Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing Elit Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua Ut Enim Ad Minim Veniam Quis Nostrud Exercitation Ullamco Laboris Nisi Ut Aliquip Ex Ea Commodo Consequat Duis Aute Irure Dolor In Reprehenderit In Voluptate Velit Esse Cillum Dolore Eu Fugiat Nulla Pariatur Excepteur Sint Occaecat Cupidatat Non Proident Sunt In Culpa Qui Officia Deserunt Mollit Anim Id Est Laborum${EOL}<img src= image.jpg  />${EOL}There  is one  before${EOL}  vs -${EOL}`;

        const expectedWithCustomStringX = `LoremxIpsumxDolorxSitxAmetxConsecteturxAdipiscingxElitxSedxDoxEiusmodxTemporxIncididuntxUtxLaborexEtxDolorexMagnaxAliquaxUtxEnimxAdxMinimxVeniamxQuisxNostrudxExercitationxUllamcoxLaborisxNisixUtxAliquipxExxEaxCommodoxConsequatxDuisxAutexIrurexDolorxInxReprehenderitxInxVoluptatexVelitxEssexCillumxDolorexEuxFugiatxNullaxPariaturxExcepteurxSintxOccaecatxCupidatatxNonxProidentxSuntxInxCulpaxQuixOfficiaxDeseruntxMollitxAnimxIdxEstxLaborum${EOL}LoremxIpsumxDolorxSitxAmetxConsecteturxAdipiscingxElitxSedxDoxEiusmodxTemporxIncididuntxUtxLaborexEtxDolorexMagnaxAliquaxUtxEnimxAdxMinimxVeniamxQuisxNostrudxExercitationxUllamcoxLaborisxNisixUtxAliquipxExxEaxCommodoxConsequatxDuisxAutexIrurexDolorxInxReprehenderitxInxVoluptatexVelitxEssexCillumxDolorexEuxFugiatxNullaxPariaturxExcepteurxSintxOccaecatxCupidatatxNonxProidentxSuntxInxCulpaxQuixOfficiaxDeseruntxMollitxAnimxIdxEstxLaborum${EOL}<img src=ximage.jpgx />${EOL}Therex is one xbefore${EOL}x vs -${EOL}`;

        test("Remove control characters, replace with empty string", async () => {
            await createNewEditor(newTextEditor);
            const editor = getActiveEditor();
            await removeControlCharacters(editor);
            await sleep(500);

            let text = getDocumentTextOrSelection();
            assert.deepStrictEqual(text, expectedWithEmptyString);
        });

        test("Remove control characters, replace with space", async () => {
            let config = workspace.getConfiguration("tt", window.activeTextEditor?.document);
            await config.update("replaceControlCharactersWith", " ", ConfigurationTarget.Global);
            await createNewEditor(newTextEditor);
            const editor = getActiveEditor();
            await removeControlCharacters(editor);
            await sleep(500);

            let text = getDocumentTextOrSelection();
            assert.deepStrictEqual(text, expectedWithSpace);
        });

        test("Remove control characters, replace with custom string x", async () => {
            let config = workspace.getConfiguration("tt", window.activeTextEditor?.document);
            await config.update("replaceControlCharactersWith", "x", ConfigurationTarget.Global);
            await createNewEditor(newTextEditor);
            const editor = getActiveEditor();
            await removeControlCharacters(editor);
            await sleep(500);

            let text = getDocumentTextOrSelection();
            assert.deepStrictEqual(text, expectedWithCustomStringX);
        });
    });
});