import * as assert from "assert";
import { after, before, describe, afterEach } from "mocha";
import { EOL } from "os";
import { replaceControlCharacters } from "../../modules/controlCharacters";
import { closeTextEditor, createNewEditor, getActiveEditor, getDocumentTextOrSelection, selectAllText, sleep } from "../../modules/helpers";
import { ConfigurationTarget, Selection, window, workspace, commands, env } from "vscode";

describe("controlCharacters", () => {
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

    afterEach(async function () {
        this.timeout(5000);
        try {
            let config = workspace.getConfiguration("TextToolbox", window.activeTextEditor?.document);
            await config.update("replaceControlCharactersWith", undefined, ConfigurationTarget.Global);
            await sleep(100); // Give time for config to settle
        } catch (error) {
            console.warn("Failed to reset config in afterEach:", error);
        }
    });

    describe("Control Characters", () => {
        const newTextEditor = `Lorem​Ipsum­Dolor​Sit­Amet​Consectetur​Adipiscing​Elit​Sed‌Do​Eiusmod​Tempor​Incididunt​Ut​Labore​Et​Dolore​Magna​Aliqua​Ut​Enim​Ad​Minim​Veniam​Quis​Nostrud​Exercitation­Ullamco​Laboris‌Nisi​Ut​Aliquip­Ex​Ea​Commodo​Consequat​Duis​Aute‌Irure​Dolor​In​Reprehenderit​In​Voluptate​Velit​Esse​Cillum​Dolore­Eu​Fugiat​Nulla‌Pariatur​Excepteur­Sint​Occaecat‌Cupidatat​Non‌Proident​Sunt​In​Culpa­Qui​Officia​Deserunt​Mollit​Anim​Id​Est​Laborum${EOL}Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing Elit Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua Ut Enim Ad Minim Veniam Quis Nostrud Exercitation Ullamco Laboris Nisi Ut Aliquip Ex Ea Commodo Consequat Duis Aute Irure Dolor In Reprehenderit In Voluptate Velit Esse Cillum Dolore Eu Fugiat Nulla Pariatur Excepteur Sint Occaecat Cupidatat Non Proident Sunt In Culpa Qui Officia Deserunt Mollit Anim Id Est Laborum${EOL}<img src=“image.jpg” />${EOL}There‎ is one ‎before${EOL}– vs -${EOL}`;

            describe("Remove control characters from full document", function () {
                this.timeout(10000);
                // With empty configured replacement we now normalize quotes/apostrophes and collapse special spaces.
                // Actual observed output retains some ASCII spaces where unicode space-like chars mapped to space.
                    const expectedFullDocumentWithEmptyString = `LoremIpsumDolorSitAmetConsecteturAdipiscingElitSed DoEiusmodTemporIncididuntUtLaboreEtDoloreMagnaAliquaUtEnimAdMinimVeniamQuisNostrudExercitationUllamcoLaboris NisiUtAliquipExEaCommodoConsequatDuisAute IrureDolorInReprehenderitInVoluptateVelitEsseCillumDoloreEuFugiatNulla PariaturExcepteurSintOccaecat CupidatatNon ProidentSuntInCulpaQuiOfficiaDeseruntMollitAnimIdEstLaborum${EOL}Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing Elit Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua Ut Enim Ad Minim Veniam Quis Nostrud Exercitation Ullamco Laboris Nisi Ut Aliquip Ex Ea Commodo Consequat Duis Aute Irure Dolor In Reprehenderit In Voluptate Velit Esse Cillum Dolore Eu Fugiat Nulla Pariatur Excepteur Sint Occaecat Cupidatat Non Proident Sunt In Culpa Qui Officia Deserunt Mollit Anim Id Est Laborum${EOL}<img src="image.jpg" />${EOL}There is one before${EOL}- vs -${EOL}`;

                const expectedFullDocumentWithSpace = `Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing Elit Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua Ut Enim Ad Minim Veniam Quis Nostrud Exercitation Ullamco Laboris Nisi Ut Aliquip Ex Ea Commodo Consequat Duis Aute Irure Dolor In Reprehenderit In Voluptate Velit Esse Cillum Dolore Eu Fugiat Nulla Pariatur Excepteur Sint Occaecat Cupidatat Non Proident Sunt In Culpa Qui Officia Deserunt Mollit Anim Id Est Laborum${EOL}Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing Elit Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua Ut Enim Ad Minim Veniam Quis Nostrud Exercitation Ullamco Laboris Nisi Ut Aliquip Ex Ea Commodo Consequat Duis Aute Irure Dolor In Reprehenderit In Voluptate Velit Esse Cillum Dolore Eu Fugiat Nulla Pariatur Excepteur Sint Occaecat Cupidatat Non Proident Sunt In Culpa Qui Officia Deserunt Mollit Anim Id Est Laborum${EOL}<img src= image.jpg  />${EOL}There  is one  before${EOL}  vs -${EOL}`;

                const expectedFullDocumentWithCustomStringX = `LoremxIpsumxDolorxSitxAmetxConsecteturxAdipiscingxElitxSedxDoxEiusmodxTemporxIncididuntxUtxLaborexEtxDolorexMagnaxAliquaxUtxEnimxAdxMinimxVeniamxQuisxNostrudxExercitationxUllamcoxLaborisxNisixUtxAliquipxExxEaxCommodoxConsequatxDuisxAutexIrurexDolorxInxReprehenderitxInxVoluptatexVelitxEssexCillumxDolorexEuxFugiatxNullaxPariaturxExcepteurxSintxOccaecatxCupidatatxNonxProidentxSuntxInxCulpaxQuixOfficiaxDeseruntxMollitxAnimxIdxEstxLaborum${EOL}LoremxIpsumxDolorxSitxAmetxConsecteturxAdipiscingxElitxSedxDoxEiusmodxTemporxIncididuntxUtxLaborexEtxDolorexMagnaxAliquaxUtxEnimxAdxMinimxVeniamxQuisxNostrudxExercitationxUllamcoxLaborisxNisixUtxAliquipxExxEaxCommodoxConsequatxDuisxAutexIrurexDolorxInxReprehenderitxInxVoluptatexVelitxEssexCillumxDolorexEuxFugiatxNullaxPariaturxExcepteurxSintxOccaecatxCupidatatxNonxProidentxSuntxInxCulpaxQuixOfficiaxDeseruntxMollitxAnimxIdxEstxLaborum${EOL}<img src=ximage.jpgx />${EOL}Therex is one xbefore${EOL}x vs -${EOL}`;

                it("Remove control characters from full document, replace with empty string", async () => {
                    await createNewEditor(newTextEditor);
                    const editor = getActiveEditor();
                    await replaceControlCharacters(editor);
                    await sleep(500);

                    let text = getDocumentTextOrSelection();
                    assert.deepStrictEqual(text, expectedFullDocumentWithEmptyString);
                });

                it("Remove control characters from full document, replace with space", async () => {
                    let config = workspace.getConfiguration("TextToolbox", window.activeTextEditor?.document);
                    await config.update("replaceControlCharactersWith", " ", ConfigurationTarget.Global);
                    await createNewEditor(newTextEditor);
                    const editor = getActiveEditor();
                    await replaceControlCharacters(editor);
                    await sleep(500);

                    let text = getDocumentTextOrSelection();
                    assert.deepStrictEqual(text, expectedFullDocumentWithSpace);
                });

                it("Remove control characters from full document, replace with custom string x", async () => {
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
                const buildSelectionExpectation = (replacement: string) => {
                    // We only transform the selected line segment; rest of the document must remain identical
                    const originalLines = newTextEditor.split(EOL);
                    // The dash test line is the last non-empty line in the fixture: "– vs -"
                    const dashLineIndex = originalLines.findIndex(l => l.includes("– vs -"));
                    const updatedLines = [...originalLines];
                    updatedLines[dashLineIndex] = originalLines[dashLineIndex].replace("–", replacement);
                    return updatedLines.join(EOL);
                };
                const expectedSelectiontWithEmptyString = buildSelectionExpectation("-"); // normalization maps en dash -> -
                const expectedSelectiontWithSpace = buildSelectionExpectation(" ");
                const expectedSelectiontWithCustomStringX = buildSelectionExpectation("x");
                it("Remove control characters from selection, replace with empty string", async () => {
                    await createNewEditor(newTextEditor);
                    const editor = getActiveEditor();
                    let selections: Selection[] = [];
                    // Select the substring beginning at start of dash line through just after the en dash
                    // The dash line is line index 4 in this test context (0-based) after editor creation
                    selections.push(new Selection(4, 0, 4, 1));
                    editor!.selections = selections;
                    await replaceControlCharacters(editor);
                    await sleep(500);

                    await selectAllText();
                    let text = getDocumentTextOrSelection();
                    assert.deepStrictEqual(text, expectedSelectiontWithEmptyString);
                });

                it("Remove control characters from selection, replace with space", async () => {
                    let config = workspace.getConfiguration("TextToolbox", window.activeTextEditor?.document);
                    await config.update("replaceControlCharactersWith", " ", ConfigurationTarget.Global);
                    await createNewEditor(newTextEditor);
                    const editor = getActiveEditor();
                    let selections: Selection[] = [];
                    selections.push(new Selection(4, 0, 4, 1));
                    editor!.selections = selections;
                    await replaceControlCharacters(editor);
                    await sleep(500);

                    await selectAllText();
                    let text = getDocumentTextOrSelection();
                    assert.deepStrictEqual(text, expectedSelectiontWithSpace);
                });

                it("Remove control characters from selection, replace with custom string x", async () => {
                    let config = workspace.getConfiguration("TextToolbox", window.activeTextEditor?.document);
                    await config.update("replaceControlCharactersWith", "x", ConfigurationTarget.Global);
                    await createNewEditor(newTextEditor);
                    const editor = getActiveEditor();
                    let selections: Selection[] = [];
                    selections.push(new Selection(4, 0, 4, 1));
                    editor!.selections = selections;
                    await replaceControlCharacters(editor);
                    await sleep(500);

                    await selectAllText();
                    let text = getDocumentTextOrSelection();
                    assert.deepStrictEqual(text, expectedSelectiontWithCustomStringX);
                });
            });

            describe("Quotes and Apostrophes normalization", () => {
                it("Normalizes curly apostrophes and double quotes when replacement string is empty", async () => {
                    const sample = "Here\u2019s a test: It\u2018s “fine”."; // includes curly double quotes
                    await createNewEditor(sample);
                    const editor = getActiveEditor();
                    await replaceControlCharacters(editor!);
                    await sleep(200);
                    const result = getDocumentTextOrSelection();
                    assert.strictEqual(result, "Here's a test: It's \"fine\".");
                });
            });

            describe("Edge cases", () => {
                it("Removes soft hyphen, zero-width space and left-to-right mark, keeps text contiguous", async () => {
                    const sample = `co\u00adoperate zero\u200Bwidth LTR\u200emark`; // soft hyphen, zero-width space, LTR mark
                    await createNewEditor(sample);
                    const editor = getActiveEditor();
                    await replaceControlCharacters(editor!); // undefined config => normalization/removal
                    await sleep(150);
                    const result = getDocumentTextOrSelection();
                    assert.strictEqual(result, "cooperate zerowidth LTRmark");
                });

                it("Normalizes zero width non-joiner to ASCII space", async () => {
                    const sample = `join\u200cHere`; // zero width non-joiner mapped to space
                    await createNewEditor(sample);
                    const editor = getActiveEditor();
                    await replaceControlCharacters(editor!);
                    await sleep(150);
                    const result = getDocumentTextOrSelection();
                    assert.strictEqual(result, "join Here");
                });

                it("Converts en and em dashes to hyphen when normalizing (empty string config)", async () => {
                    const sample = `range 1\u201310 and 20\u201430`;
                    let config = workspace.getConfiguration("TextToolbox", window.activeTextEditor?.document);
                    await config.update("replaceControlCharactersWith", "", ConfigurationTarget.Global); // explicit empty
                    await createNewEditor(sample);
                    const editor = getActiveEditor();
                    await replaceControlCharacters(editor!);
                    await sleep(150);
                    const result = getDocumentTextOrSelection();
                    assert.strictEqual(result, "range 1-10 and 20-30");
                });

                it("Uses configured multi-character replacement per occurrence", async () => {
                    const sample = `a\u2013b\u200Bb`; // en dash + zero width space
                    let config = workspace.getConfiguration("TextToolbox", window.activeTextEditor?.document);
                    await config.update("replaceControlCharactersWith", "--", ConfigurationTarget.Global);
                    await createNewEditor(sample);
                    const editor = getActiveEditor();
                    await replaceControlCharacters(editor!);
                    await sleep(150);
                    const result = getDocumentTextOrSelection();
                    // Each matched char replaced by "--"
                    assert.strictEqual(result, "a--b--b");
                });

                it("Removes Unicode line and paragraph separators (U+2028/U+2029)", async () => {
                    const sample = `A\u2028B\u2029C`;
                    await createNewEditor(sample);
                    const editor = getActiveEditor();
                    await replaceControlCharacters(editor!);
                    await sleep(150);
                    const result = getDocumentTextOrSelection();
                    assert.strictEqual(result, "ABC");
                });
            });
    });
});
