import * as assert from "assert";
import { after, before, describe, it } from "mocha";
import { EOL } from "os";
import { alignText } from '../../modules/alignText';
import { closeTextEditor, sleep, createNewEditor, selectAllText, getDocumentTextOrSelection } from '../../modules/helpers';

describe("alignText", () => {
    before(() => {
        console.log("Starting alignText tests");
    });
    after(async () => {
        await sleep(500);
        await closeTextEditor(true);
        console.log("All alignText tests done");
    });

    describe("Align text to separator", () => {
        let newText = `asdfasdfasd,fadfasdfasdfasdf,adsfadf,asdf,asdfa,df${EOL}asdasdfa,sdfasdfa,sdf,adsf,asd,fasdfasdfadsf,${EOL}asd,sdfasdfa,dsf,asdfa,sdf,as,df,a,df,adfadfa`;
        let expectedComma = `asdfasdfasd, fadfasdfasdfasdf, adsfadf, asdf,  asdfa, df,            ,,,,${EOL}asdasdfa,    sdfasdfa,         sdf,     adsf,  asd,   fasdfasdfadsf, ,,,,${EOL}asd,         sdfasdfa,         dsf,     asdfa, sdf,   as,            df, a, df, adfadfa ${EOL}`;

        let tests = [{ newText: newText, separator: ",", expected: expectedComma }];

        tests.forEach((t) => {
            it(`Align text to separator '${t.separator}'`, async () => {
                await createNewEditor(t.newText);
                await selectAllText();
                await alignText(t.separator);
                await sleep(500);

                const text = getDocumentTextOrSelection();
                assert.deepStrictEqual(text, t.expected);
            });
        });
    });

    describe("Align text as table", () => {
        let newText = `asdfasdfasd,fadfasdfasdfasdf,adsfadf,asdf,asdfa,df${EOL}asdasdfa,sdfasdfa,sdf,adsf,asd,fasdfasdfadsf,${EOL}asd,sdfasdfa,dsf,asdfa,sdf,as,df,a,df,adfadfa`;
        let expectedTable = `| asdfasdfasd | fadfasdfasdfasdf | adsfadf | asdf  | asdfa | df            |    |   |    |         |${EOL}| asdasdfa    | sdfasdfa         | sdf     | adsf  | asd   | fasdfasdfadsf |    |   |    |         |${EOL}| asd         | sdfasdfa         | dsf     | asdfa | sdf   | as            | df | a | df | adfadfa |${EOL}`;
        let expectedTableWithHeaders = `| asdfasdfasd | fadfasdfasdfasdf | adsfadf | asdf  | asdfa | df            |    |   |    |         |${EOL}|-------------|------------------|---------|-------|-------|---------------|----|---|----|---------|${EOL}| asdasdfa    | sdfasdfa         | sdf     | adsf  | asd   | fasdfasdfadsf |    |   |    |         |${EOL}| asd         | sdfasdfa         | dsf     | asdfa | sdf   | as            | df | a | df | adfadfa |${EOL}`;

        let tests = [
            { newText: newText, separator: ",", withHeaders: false, expected: expectedTable },
            { newText: newText, separator: ",", withHeaders: true, expected: expectedTableWithHeaders },
        ];

        tests.forEach((t) => {
            it(`Align text as table ${t.withHeaders ? "with headers" : ""}`, async () => {
                await createNewEditor(t.newText);
                await selectAllText();
                await alignText(t.separator, true, t.withHeaders);
                await sleep(500);

                const text = getDocumentTextOrSelection();
                assert.deepStrictEqual(text, t.expected);
            });
        });
    });
});
