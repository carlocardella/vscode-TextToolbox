import * as assert from 'assert';
import { after, before, describe } from 'mocha';
import { EOL } from 'os';
import { alignToSeparator } from '../../modules/alignText';
import { closeTextEditor, sleep, createNewEditor, selectAllText, getDocumentTextOrSelection } from '../../modules/helpers';


suite('alignText', () => {
    before(() => {
        console.log('Starting alignText tests');
    });
    after(async () => {
        await sleep(500);
        await closeTextEditor(true);
        console.log('All alignText tests done');
    });

    describe("Align text to separator", () => {
        let newText = `Hew lihu riznen fo wour omju, ojhomo bewe mo kul, taten bozi fe gonzabhu acoitotez, rizzapev abwizfa ca.${EOL}Hif marfi busaume, zobbihi, javelvaf kukapgo bopuwi ajo gamdi anosve, muiwizon lago jape gahihgod podehdab.${EOL}Tec piawa ma mimbim jotenejos bidnar, divtovo wufe cov sah fozgaw, niobete azonar ujajono akuek wimgob.`;
        let expectedSpace = `Hew  lihu   riznen    fo        wour       omju,    ojhomo   bewe  mo     kul,     taten     bozi     fe      gonzabhu  acoitotez,  rizzapev  abwizfa  ca.  ${EOL}Hif  marfi  busaume,  zobbihi,  javelvaf   kukapgo  bopuwi   ajo   gamdi  anosve,  muiwizon  lago     jape    gahihgod  podehdab.   ${EOL}Tec  piawa  ma        mimbim    jotenejos  bidnar,  divtovo  wufe  cov    sah      fozgaw,   niobete  azonar  ujajono   akuek       wimgob.   `;
        let expectedComma = `Hew lihu riznen fo wour omju,          ojhomo bewe mo kul,           taten bozi fe gonzabhu acoitotez,          rizzapev abwizfa ca.                   ${EOL}Hif marfi busaume,                     zobbihi,                      javelvaf kukapgo bopuwi ajo gamdi anosve,  muiwizon lago jape gahihgod podehdab.  ${EOL}Tec piawa ma mimbim jotenejos bidnar,  divtovo wufe cov sah fozgaw,  niobete azonar ujajono akuek wimgob.,     ${EOL}`;


        let tests = [
            { newText: newText, separator: ",", expected: expectedComma },
            // { newText: newText, delimiter: " ", expected: expectedSpace }
        ];

        tests.forEach(t => {
            test(`Align text to separator '${t.separator}'`, async () => {
                await createNewEditor(t.newText);
                await selectAllText();
                await alignToSeparator(t.separator);
                await sleep(500);

                const text = getDocumentTextOrSelection();
                assert.deepStrictEqual(text, t.expected);
            });
        });
    });
});