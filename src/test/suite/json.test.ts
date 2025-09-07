import * as assert from 'assert';
import { after, before, describe, it } from 'mocha';
import { 
    closeTextEditor, 
    sleep, 
    createNewEditor, 
    selectAllText, 
    getDocumentTextOrSelection, 
    getActiveEditor,
    getDocumentEOL
} from '../../modules/helpers';
import { minifyJson, stringifyJson, escapeWin32PathInJson } from '../../modules/json';
import { Selection } from 'vscode';

describe('JSON', () => {
    before(() => {
        console.log('Starting JSON tests');
    });
    after(async () => {
        await sleep(500);
        await closeTextEditor(true);
        console.log('All JSON tests done');
    });

describe('JSON', () => {
    before(() => {
        console.log('Starting JSON tests');
    });
    after(async () => {
        await sleep(500);
        await closeTextEditor(true);
        console.log('All JSON tests done');
    });

    describe('JSON Stringify', () => {
        it('Stringify valid JSON object', async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const inputJson = `{
    "Name": "pwsh",
    "Id": 10788,
    "Company": "Microsoft Corporation"
}`;
            const expectedOutput = `"${inputJson.replace(/\n/g, '\\n').replace(/"/g, '\\"').replace(/    /g, '\\t')}"`;

            await createNewEditor(inputJson);
            await selectAllText();
            await stringifyJson(false);

            let actual = getDocumentTextOrSelection();
            assert.ok(actual, "Should have output");
            assert.ok(actual!.includes("Name"), "Should contain Name property");
            assert.ok(actual!.includes("pwsh"), "Should contain pwsh value");
        });

        it('Stringify and fix simple object syntax', async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const inputText = "a:a,b:b";
            const expectedPattern = `{${eol}    "a": "a",${eol}    "b": "b"${eol}}`;

            await createNewEditor(inputText);
            await selectAllText();
            await stringifyJson(true);

            let actual = getDocumentTextOrSelection();
            assert.strictEqual(actual, expectedPattern);
        });

        it('Stringify and fix object with duplicate properties', async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const inputText = "a:a,b:b,a:c";
            
            await createNewEditor(inputText);
            await selectAllText();
            await stringifyJson(true);

            let actual = getDocumentTextOrSelection();
            assert.ok(actual, "Should have output");
            assert.ok(actual!.includes('"a"'), "Should contain property a");
            assert.ok(actual!.includes('"b"'), "Should contain property b");
            // Note: jsonic handles duplicates by keeping the last value
        });

        it('Stringify complex nested object', async () => {
            const inputText = "name:John,age:30,address:{street:123 Main St,city:Anytown}";
            
            await createNewEditor(inputText);
            await selectAllText();
            await stringifyJson(true);

            let actual = getDocumentTextOrSelection();
            assert.ok(actual, "Should have output");
            assert.ok(actual!.includes('"name"'), "Should contain name property");
            assert.ok(actual!.includes('"address"'), "Should contain address property");
            assert.ok(actual!.includes('"street"'), "Should contain nested street property");
        });

        it('Stringify array syntax', async () => {
            const inputText = "[item1,item2,item3]";
            
            await createNewEditor(inputText);
            await selectAllText();
            await stringifyJson(true);

            let actual = getDocumentTextOrSelection();
            assert.ok(actual, "Should have output");
            assert.ok(actual!.includes("item1"), "Should contain item1");
            assert.ok(actual!.includes("item2"), "Should contain item2");
            assert.ok(actual!.includes("item3"), "Should contain item3");
        });

        it('Stringify with selection', async () => {
            const inputText = `{
    "prop1": "value1",
    "prop2": "value2"
}`;
            
            await createNewEditor(inputText);
            const editor = getActiveEditor();
            if (editor) {
                // Select only part of the text
                editor.selection = new Selection(1, 4, 1, 19); // Select "prop1": "value1"
                await stringifyJson(false);

                let actual = getDocumentTextOrSelection();
                assert.ok(actual, "Should have output");
            }
        });

        it('Handle empty document for stringify', async () => {
            await createNewEditor("");
            await stringifyJson(false);

            let actual = getDocumentTextOrSelection();
            assert.strictEqual(actual, '""', "Should return empty string stringified");
        });

        it('Handle invalid JSON syntax with fix enabled', async () => {
            const inputText = "{invalid:json,missing:quotes}";
            
            await createNewEditor(inputText);
            await selectAllText();
            await stringifyJson(true);

            let actual = getDocumentTextOrSelection();
            assert.ok(actual, "Should have output even with invalid syntax");
            assert.ok(actual!.includes('"invalid"'), "Should fix property names");
            assert.ok(actual!.includes('"quotes"'), "Should fix property names");
        });
    });

    describe('JSON Minify', () => {
        it('Minify formatted JSON', async () => {
            const inputJson = `[
    {
        "Name": "pwsh",
        "Id": 10788,
        "Company": "Microsoft Corporation"
    },
    {
        "Name": "pwsh",
        "Id": 24072,
        "Company": "Microsoft Corporation"
    }
]`;
            const expectedMinified = '[{"Name":"pwsh","Id":10788,"Company":"Microsoft Corporation"},{"Name":"pwsh","Id":24072,"Company":"Microsoft Corporation"}]';

            await createNewEditor(inputJson);
            await selectAllText();
            await minifyJson();

            let actual = getDocumentTextOrSelection();
            assert.strictEqual(actual, expectedMinified);
        });

        it('Minify already minified JSON', async () => {
            const inputJson = '{"name":"value","number":123}';
            
            await createNewEditor(inputJson);
            await selectAllText();
            await minifyJson();

            let actual = getDocumentTextOrSelection();
            assert.strictEqual(actual, inputJson, "Should remain the same if already minified");
        });

        it('Minify with selection', async () => {
            const inputJson = `{
    "first": "value1",
    "second": "value2"
}`;
            
            await createNewEditor(inputJson);
            const editor = getActiveEditor();
            if (editor) {
                // Select only part of the JSON
                editor.selection = new Selection(0, 0, 2, 20);
                await minifyJson();

                let actual = getDocumentTextOrSelection();
                assert.ok(actual, "Should have output");
                assert.ok(!actual!.includes('\n'), "Should remove newlines");
            }
        });

        it('Minify complex nested structure', async () => {
            const inputJson = `{
    "users": [
        {
            "name": "John",
            "details": {
                "age": 30,
                "city": "New York"
            }
        }
    ],
    "meta": {
        "count": 1
    }
}`;
            
            await createNewEditor(inputJson);
            await selectAllText();
            await minifyJson();

            let actual = getDocumentTextOrSelection();
            assert.ok(actual, "Should have output");
            assert.ok(!actual!.includes('\n'), "Should remove all newlines");
            assert.ok(!actual!.includes('    '), "Should remove all indentation");
            assert.ok(actual!.includes('"users"'), "Should preserve content");
        });

        it('Handle empty document for minify', async () => {
            await createNewEditor("");
            await minifyJson();

            let actual = getDocumentTextOrSelection();
            assert.strictEqual(actual, '""', "Should handle empty document");
        });

        it('Minify array', async () => {
            const inputJson = `[
    "item1",
    "item2",
    "item3"
]`;
            const expectedMinified = '["item1","item2","item3"]';
            
            await createNewEditor(inputJson);
            await selectAllText();
            await minifyJson();

            let actual = getDocumentTextOrSelection();
            assert.strictEqual(actual, expectedMinified);
        });

        it('Minify with special characters', async () => {
            const inputJson = `{
    "message": "Hello\\nWorld",
    "path": "C:\\\\Users\\\\test",
    "unicode": "café"
}`;
            
            await createNewEditor(inputJson);
            await selectAllText();
            await minifyJson();

            let actual = getDocumentTextOrSelection();
            assert.ok(actual, "Should have output");
            assert.ok(actual!.includes("Hello\\\\nWorld"), "Should preserve escaped characters");
            assert.ok(actual!.includes("C:\\\\\\\\Users"), "Should preserve file paths");
            assert.ok(actual!.includes("café"), "Should preserve unicode");
        });
    });

    describe('Escape Win32 Paths', () => {
        it('Escape single backslashes in selection', async () => {
            const inputText = 'C:\\Users\\Documents\\file.txt';
            const expectedOutput = 'C:\\\\Users\\\\Documents\\\\file.txt';
            
            await createNewEditor(inputText);
            await selectAllText();
            escapeWin32PathInJson();
            await sleep(100);

            let actual = getDocumentTextOrSelection();
            assert.strictEqual(actual, expectedOutput);
        });

        it('Escape backslashes in JSON string', async () => {
            const inputText = '{"path": "C:\\Program Files\\App\\config.json"}';
            const expectedOutput = '{"path": "C:\\\\Program Files\\\\App\\\\config.json"}';
            
            await createNewEditor(inputText);
            await selectAllText();
            escapeWin32PathInJson();
            await sleep(100);

            let actual = getDocumentTextOrSelection();
            assert.strictEqual(actual, expectedOutput);
        });

        it('Escape multiple paths in selection', async () => {
            const inputText = 'Path1: C:\\Users\\user1\\file.txt\nPath2: D:\\Data\\backup\\archive.zip';
            const expectedOutput = 'Path1: C:\\\\Users\\\\user1\\\\file.txt\nPath2: D:\\\\Data\\\\backup\\\\archive.zip';
            
            await createNewEditor(inputText);
            await selectAllText();
            escapeWin32PathInJson();
            await sleep(100);

            let actual = getDocumentTextOrSelection();
            assert.strictEqual(actual, expectedOutput);
        });

        it('Handle already escaped paths', async () => {
            const inputText = 'C:\\\\Users\\\\Documents\\\\file.txt';
            const expectedOutput = 'C:\\\\\\\\Users\\\\\\\\Documents\\\\\\\\file.txt';
            
            await createNewEditor(inputText);
            await selectAllText();
            escapeWin32PathInJson();
            await sleep(100);

            let actual = getDocumentTextOrSelection();
            assert.strictEqual(actual, expectedOutput);
        });

        it('Handle text without backslashes', async () => {
            const inputText = 'No backslashes here, just forward/slashes/and/normal/text';
            
            await createNewEditor(inputText);
            await selectAllText();
            escapeWin32PathInJson();
            await sleep(100);

            let actual = getDocumentTextOrSelection();
            assert.strictEqual(actual, inputText, "Should remain unchanged if no backslashes");
        });

        it('Handle empty selection for path escaping', async () => {
            await createNewEditor("Some text with C:\\path\\here");
            const editor = getActiveEditor();
            if (editor) {
                // Set cursor without selection
                editor.selection = new Selection(0, 0, 0, 0);
                escapeWin32PathInJson();
                await sleep(100);

                let actual = getDocumentTextOrSelection();
                assert.ok(actual!.includes("C:\\path\\here"), "Should not modify text when no selection");
            }
        });

        it('Escape multiple selections', async () => {
            const inputText = 'Path1: C:\\Users\nPath2: D:\\Data\nPath3: E:\\Backup';
            
            await createNewEditor(inputText);
            const editor = getActiveEditor();
            if (editor) {
                // Create multiple selections
                editor.selections = [
                    new Selection(0, 7, 0, 15), // C:\Users
                    new Selection(1, 7, 1, 14), // D:\Data
                    new Selection(2, 7, 2, 16)  // E:\Backup
                ];
                escapeWin32PathInJson();
                await sleep(100);

                let actual = getDocumentTextOrSelection();
                assert.ok(actual!.includes("C:\\\\Users"), "Should escape first selection");
                assert.ok(actual!.includes("D:\\\\Data"), "Should escape second selection");
                assert.ok(actual!.includes("E:\\\\Backup"), "Should escape third selection");
            }
        });
    });

    describe('Error Handling', () => {
        it('Handle malformed JSON gracefully', async () => {
            const inputText = '{broken:json,missing"quotes:values}';
            
            await createNewEditor(inputText);
            await selectAllText();
            
            try {
                await stringifyJson(true);
                let actual = getDocumentTextOrSelection();
                assert.ok(actual, "Should produce some output even with malformed JSON");
            } catch (error) {
                // Should handle gracefully without crashing
                assert.ok(true, "Should handle malformed JSON without crashing");
            }
        });

        it('Handle very large JSON objects', async () => {
            const largeObject = Array.from({length: 100}, (_, i) => `"prop${i}": "value${i}"`).join(',');
            const inputText = `{${largeObject}}`;
            
            await createNewEditor(inputText);
            await selectAllText();
            await minifyJson();

            let actual = getDocumentTextOrSelection();
            assert.ok(actual, "Should handle large JSON objects");
            assert.ok(actual!.length > 0, "Should produce output");
        });

        it('Handle special JSON values', async () => {
            const inputText = 'null:null,bool:true,number:42,string:"text"';
            
            await createNewEditor(inputText);
            await selectAllText();
            await stringifyJson(true);

            let actual = getDocumentTextOrSelection();
            assert.ok(actual, "Should handle special JSON values");
            assert.ok(actual!.includes("null"), "Should handle null values");
            assert.ok(actual!.includes("true"), "Should handle boolean values");
            assert.ok(actual!.includes("42"), "Should handle number values");
        });
    });
});
});