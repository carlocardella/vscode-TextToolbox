import * as assert from 'assert';
import { after, before, describe } from 'mocha';
import { closeTextEditor, sleep, createNewEditor, selectAllText, getDocumentTextOrSelection } from '../../modules/helpers';
import { minifyJson, stringifyJson } from '../../modules/json';
import { EOL, EOL } from 'os';

suite('JSON', () => {
    before(() => {
        console.log('Starting JSON tests');
    });
    after(async () => {
        await sleep(500);
        await closeTextEditor(true);
        console.log('All JSON tests done');
    });

    describe('Json', async () => {
        let tests = [
            {
                description: "Stringify",
                text: '[\n \t{\n \t\t"Name": "pwsh",\n \t\t"Id": 10788,\n \t\t"Company": "Microsoft Corporation"\n \t},\n \t{\n \t\t"Name": "pwsh",\n \t\t"Id": 24072,\n \t\t"Company": "Microsoft Corporation"\n \t},\n \t{\n \t\t"Name": "pwsh",\n \t\t"Id": 24784,\n \t\t"Company": "Microsoft Corporation"\n \t}\n ]',
                expected: '"[\\n \\t{\\n \\t\\t\\"Name\\": \\"pwsh\\",\\n \\t\\t\\"Id\\": 10788,\\n \\t\\t\\"Company\\": \\"Microsoft Corporation\\"\\n \\t},\\n \\t{\\n \\t\\t\\"Name\\": \\"pwsh\\",\\n \\t\\t\\"Id\\": 24072,\\n \\t\\t\\"Company\\": \\"Microsoft Corporation\\"\\n \\t},\\n \\t{\\n \\t\\t\\"Name\\": \\"pwsh\\",\\n \\t\\t\\"Id\\": 24784,\\n \\t\\t\\"Company\\": \\"Microsoft Corporation\\"\\n \\t}\\n ]"',
                fixJson: false
            },
            {
                description: "Stringify simple object",
                text: "a:a,b:b",
                expected: `{${EOL}    \"a\": \"a\",${EOL}    \"b\": \"b\"${EOL}}`,
                fixJson: true
            },
            {
                description: "Stringify with duplicate properties",
                text: "a:a,b:b,a:a",
                expected: `{${EOL}    \"a\": \"a\",${EOL}    \"b\": \"b\"${EOL}}`,
                fixJson: true
            }
        ];

        tests.forEach(t => {
            test(`${t.description}`, async () => {
                await createNewEditor(t.text);
                await selectAllText();

                await stringifyJson(t.fixJson);
                await selectAllText();

                let actual = getDocumentTextOrSelection();
                assert.deepStrictEqual(actual, t.expected);
            });
        });

        test('Minify', async () => {
            const text = '[\n \t{\n \t\t"Name": "pwsh",\n \t\t"Id": 10788,\n \t\t"Company": "Microsoft Corporation"\n \t},\n \t{\n \t\t"Name": "pwsh",\n \t\t"Id": 24072,\n \t\t"Company": "Microsoft Corporation"\n \t},\n \t{\n \t\t"Name": "pwsh",\n \t\t"Id": 24784,\n \t\t"Company": "Microsoft Corporation"\n \t}\n ]';

            const expected = '[{"Name":"pwsh","Id":10788,"Company":"Microsoft Corporation"},{"Name":"pwsh","Id":24072,"Company":"Microsoft Corporation"},{"Name":"pwsh","Id":24784,"Company":"Microsoft Corporation"}]';

            await createNewEditor(text);
            await selectAllText();

            await minifyJson();
            await selectAllText();

            let actual = getDocumentTextOrSelection();
            assert.deepStrictEqual(actual, expected);
        });
    });
});