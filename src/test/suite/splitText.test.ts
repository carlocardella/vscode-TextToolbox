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
        const textToSplit = `Igceb rud ezwudel zu guc nuh, beoputac zidoti towposi alvez jomojsot, luhminka ve nabomo su wipwir.${EOL}Vo,zoenpi,zassagon,ipauv,kojuf,meronewis,degveam,zopev,anowoofi,ewol,disin,mo,la,olobozad,kafwa.,Vefoegu,vazuaw,jomo,cel,bim,zam,upmele,dinga,zulkuc,div,ca,kuratim,joim,avi,liut,bife,eranijoh.,Rezom,kuwher,ricaslo,je,rojhofil,cugi,cohjarjo,ev,wimecarar,ov,bi,egi,ucure.${EOL}Kelgi etfaelu vurozvu suduta kilaw tilespeg wojma cirgoja dezpa ot hajuidu, iru tukihuvap dupsatig dam usto wuasi.`;

        const textSplitSecondLine = `Igceb rud ezwudel zu guc nuh, beoputac zidoti towposi alvez jomojsot, luhminka ve nabomo su wipwir.${EOL}Vo${EOL}zoenpi${EOL}zassagon${EOL}ipauv${EOL}kojuf${EOL}meronewis${EOL}degveam${EOL}zopev${EOL}anowoofi${EOL}ewol${EOL}disin${EOL}mo${EOL}la${EOL}olobozad${EOL}kafwa.${EOL}Vefoegu${EOL}vazuaw${EOL}jomo${EOL}cel${EOL}bim${EOL}zam${EOL}upmele${EOL}dinga${EOL}zulkuc${EOL}div${EOL}ca${EOL}kuratim${EOL}joim${EOL}avi${EOL}liut${EOL}bife${EOL}eranijoh.${EOL}Rezom${EOL}kuwher${EOL}ricaslo${EOL}je${EOL}rojhofil${EOL}cugi${EOL}cohjarjo${EOL}ev${EOL}wimecarar${EOL}ov${EOL}bi${EOL}egi${EOL}ucure.${EOL}Kelgi etfaelu vurozvu suduta kilaw tilespeg wojma cirgoja dezpa ot hajuidu, iru tukihuvap dupsatig dam usto wuasi.`;

        const textSplitFirstLineNewEditor = `Igceb rud ezwudel zu guc nuh${EOL} beoputac zidoti towposi alvez jomojsot${EOL} luhminka ve nabomo su wipwir.`;

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
            await splitTextInternal(",", true);
            await sleep(500);

            await selectAllText();
            let text = getDocumentTextOrSelection();
            assert.deepStrictEqual(text, textSplitFirstLineNewEditor);
        });
    });
});
