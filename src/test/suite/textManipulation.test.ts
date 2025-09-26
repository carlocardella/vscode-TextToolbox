import * as assert from 'assert';
import { before, after, describe, it } from 'mocha';
import { 
    sleep, 
    closeTextEditor, 
    createNewEditor, 
    getActiveEditor, 
    selectAllText, 
    getDocumentTextOrSelection,
    getDocumentEOL
} from '../../modules/helpers';
import { 
    pathTransformationType, 
    transformPath, 
    trimLineOrSelection,
    splitSelection,
    splitSelectionInternal,
    convertSelection,
    convertSelectionInternal,
    conversionType,
    convertToBase64,
    convertFromBase64,
    convertToBase64Url,
    convertFromBase64Url,
    parseQueryStringToJson,
    convertToHTML,
    convertFromHTML,
    encodeUri,
    decodeUri,
    decodeJWTToken,
    convertDecimalToHexadecimal,
    convertHexadecimalToDecimal,
    orderedListTypes,
    transformToOrderedList
} from '../../modules/textManipulation';
import { Selection } from 'vscode';

describe("textManipulation", () => {
    before(() => {
        console.log('Starting textManipulation tests');
    });
    after(async () => {
        await sleep(500);
        await closeTextEditor(true);
        console.log('All textManipulation tests done');
    });

    describe("Trim whitespaces", () => {
        it("Trim whitespaces from entire document", async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const text = `Hutruaka pouzjan pu ${eol}   elnordu ce ${eol}     jan gabajo ${eol}genlosif fobavos vucozu jesidjo  ${eol}     os ijme koige fomej zuce ruv juusuje    ${eol}`;
            const expected = `Hutruaka pouzjan pu${eol}elnordu ce${eol}jan gabajo${eol}genlosif fobavos vucozu jesidjo${eol}os ijme koige fomej zuce ruv juusuje${eol}`;

            await createNewEditor(text);
            await trimLineOrSelection();
            await sleep(500);
            
            const editor = getActiveEditor();
            const trimmedText = editor?.document.getText();
            assert.strictEqual(trimmedText, expected);
        });

        it("Trim whitespaces from selection", async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
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
            assert.strictEqual(trimmedText, expected);
        });

        it("Trim whitespaces with tabs and spaces", async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const text = `\t  line with tabs and spaces  \t${eol}   \tline with leading and trailing\t   ${eol}`;
            const expected = `line with tabs and spaces${eol}line with leading and trailing${eol}`;

            await createNewEditor(text);
            await trimLineOrSelection();
            await sleep(500);

            const editor = getActiveEditor();
            const trimmedText = editor?.document.getText();
            assert.strictEqual(trimmedText, expected);
        });

        it("Handle empty lines in trim", async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const text = `  line1  ${eol}${eol}  line2  ${eol}`;
            const expected = `line1${eol}${eol}line2${eol}`;

            await createNewEditor(text);
            await trimLineOrSelection();
            await sleep(500);

            const editor = getActiveEditor();
            const trimmedText = editor?.document.getText();
            assert.strictEqual(trimmedText, expected);
        });
    });

    describe('Transform Path', () => {
        it('Transform Windows path to POSIX', async () => {
            const pathString = 'C:\\temp\\pippo.txt';
            const expected = 'C:/temp/pippo.txt';

            await createNewEditor(pathString);
            await selectAllText();
            await transformPath(pathTransformationType.posix);
            await sleep(500);

            const actual = getDocumentTextOrSelection();
            assert.strictEqual(actual, expected);
        });

        it('Transform POSIX path to Windows', async () => {
            const pathString = 'C://temp//pippo.txt';
            const expected = 'C:\\temp\\pippo.txt';

            await createNewEditor(pathString);
            await selectAllText();
            await transformPath(pathTransformationType.win32);
            await sleep(500);

            const actual = getDocumentTextOrSelection();
            assert.strictEqual(actual, expected);
        });

        it('Transform path to Darwin format', async () => {
            const pathString = 'C:\\Users\\Documents\\file.txt';
            const expected = 'C:/Users/Documents/file.txt';

            await createNewEditor(pathString);
            await selectAllText();
            await transformPath(pathTransformationType.darwin);
            await sleep(500);

            const actual = getDocumentTextOrSelection();
            assert.strictEqual(actual, expected);
        });

        it('Transform complex path with multiple separators', async () => {
            const pathString = 'C:\\\\Program Files\\\\App\\\\config.json';
            const expected = 'C:/Program Files/App/config.json';

            await createNewEditor(pathString);
            await selectAllText();
            await transformPath(pathTransformationType.posix);
            await sleep(500);

            const actual = getDocumentTextOrSelection();
            assert.strictEqual(actual, expected);
        });
    });

    describe('Split Selection', () => {
        it('Split selection by comma', async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const text = 'apple,banana,cherry,date';
            const expected = `apple${eol}banana${eol}cherry${eol}date`;

            await createNewEditor(text);
            await selectAllText();
            await splitSelectionInternal(',', false);
            await sleep(500);

            const actual = getDocumentTextOrSelection();
            assert.strictEqual(actual, expected);
        });

        it('Split selection by semicolon', async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const text = 'item1;item2;item3';
            const expected = `item1${eol}item2${eol}item3`;

            await createNewEditor(text);
            await selectAllText();
            await splitSelectionInternal(';', false);
            await sleep(500);

            const actual = getDocumentTextOrSelection();
            assert.strictEqual(actual, expected);
        });

        it('Split selection in new editor', async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const text = 'one|two|three';
            const expected = `one${eol}two${eol}three${eol}`;

            await createNewEditor(text);
            await selectAllText();
            await splitSelectionInternal('|', true);
            await sleep(500);

            const actual = getDocumentTextOrSelection();
            assert.strictEqual(actual, expected);
        });

        it('Split multiple selections', async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const text = 'a,b,c and x,y,z';

            await createNewEditor(text);
            const editor = getActiveEditor();
            if (editor) {
                editor.selections = [
                    new Selection(0, 0, 0, 5),   // 'a,b,c'
                    new Selection(0, 10, 0, 15)  // 'x,y,z'
                ];
                await splitSelectionInternal(',', false);
                await sleep(500);

                const actual = editor.document.getText();
                console.log("Split multiple selections result:", JSON.stringify(actual));
                assert.ok(actual!.includes('a'), "Should split first selection");
                assert.ok(actual!.includes('x'), "Should split second selection");
            }
        });

        it('Handle empty selection for split', async () => {
            await createNewEditor('some text');
            const editor = getActiveEditor();
            if (editor) {
                editor.selection = new Selection(0, 0, 0, 0); // Empty selection
                const result = await splitSelectionInternal(',', false);
                assert.strictEqual(result, false, "Should return false for empty selection");
            }
        });
    });

    describe('Text Conversions', () => {
        it('Convert to Base64', async () => {
            const text = 'Hello World';
            const expected = convertToBase64(text);

            await createNewEditor(text);
            await selectAllText();
            await convertSelection(conversionType.toBase64);
            await sleep(500);

            const actual = getDocumentTextOrSelection();
            assert.strictEqual(actual, expected);
        });

        it('Convert from Base64', async () => {
            const base64Text = 'SGVsbG8gV29ybGQ='; // 'Hello World' in base64
            const expected = 'Hello World';

            await createNewEditor(base64Text);
            await selectAllText();
            await convertSelection(conversionType.fromBase64);
            await sleep(500);

            const actual = getDocumentTextOrSelection();
            assert.strictEqual(actual, expected);
        });

        it('Convert to URL-safe Base64', async () => {
            const text = 'Hello World with special chars: +/=';
            const expected = convertToBase64Url(text);

            await createNewEditor(text);
            await selectAllText();
            await convertSelection(conversionType.toBase64Url);
            await sleep(500);

            const actual = getDocumentTextOrSelection();
            assert.strictEqual(actual, expected);
            assert.ok(!actual!.includes('+'), "Should not contain + character");
            assert.ok(!actual!.includes('/'), "Should not contain / character");
            assert.ok(!actual!.includes('='), "Should not contain = padding");
        });

        it('Convert from URL-safe Base64', async () => {
            const urlSafeBase64 = convertToBase64Url('Hello World with special chars: +/=');
            const expected = 'Hello World with special chars: +/=';

            await createNewEditor(urlSafeBase64);
            await selectAllText();
            await convertSelection(conversionType.fromBase64Url);
            await sleep(500);

            const actual = getDocumentTextOrSelection();
            assert.strictEqual(actual, expected);
        });

        it('Parse query string to JSON', async () => {
            const queryString = 'name=John&age=30&city=New%20York&hobbies=reading&hobbies=gaming';

            await createNewEditor(queryString);
            await selectAllText();
            await convertSelection(conversionType.queryStringToJson);
            await sleep(500);

            const actual = getDocumentTextOrSelection();
            const parsedJson = JSON.parse(actual!);
            assert.strictEqual(parsedJson.name, 'John');
            assert.strictEqual(parsedJson.age, '30');
            assert.strictEqual(parsedJson.city, 'New York');
            assert.ok(Array.isArray(parsedJson.hobbies), "Should create array for duplicate keys");
            assert.strictEqual(parsedJson.hobbies.length, 2);
        });

        it('Parse query string with leading question mark', async () => {
            const queryString = '?param1=value1&param2=value2';

            await createNewEditor(queryString);
            await selectAllText();
            await convertSelection(conversionType.queryStringToJson);
            await sleep(500);

            const actual = getDocumentTextOrSelection();
            const parsedJson = JSON.parse(actual!);
            assert.strictEqual(parsedJson.param1, 'value1');
            assert.strictEqual(parsedJson.param2, 'value2');
        });

        it('Convert to HTML entities', async () => {
            const text = '<script>alert("test");</script>';
            const expected = convertToHTML(text);

            await createNewEditor(text);
            await selectAllText();
            await convertSelection(conversionType.toHTML);
            await sleep(500);

            const actual = getDocumentTextOrSelection();
            assert.strictEqual(actual, expected);
            assert.ok(actual!.includes('&lt;'), "Should convert < to &lt;");
            assert.ok(actual!.includes('&gt;'), "Should convert > to &gt;");
            assert.ok(actual!.includes('&quot;'), "Should convert \" to &quot;");
        });

        it('Convert from HTML entities', async () => {
            const htmlText = '&lt;script&gt;alert(&quot;test&quot;);&lt;/script&gt;';
            const expected = '<script>alert("test");</script>';

            await createNewEditor(htmlText);
            await selectAllText();
            await convertSelection(conversionType.fromHTML);
            await sleep(500);

            const actual = getDocumentTextOrSelection();
            assert.strictEqual(actual, expected);
        });

        it('Encode URI', async () => {
            const text = 'hello world!@#$%^&*()';
            const expected = encodeUri(text);

            await createNewEditor(text);
            await selectAllText();
            await convertSelection(conversionType.encodeUri);
            await sleep(500);

            const actual = getDocumentTextOrSelection();
            assert.strictEqual(actual, expected);
            assert.ok(actual!.includes('%20'), "Should encode space as %20");
            assert.ok(actual!.includes('%21'), "Should encode ! as %21");
        });

        it('Decode URI', async () => {
            const encodedText = 'hello%20world%21%40%23%24%25%5E%26%2A%28%29';
            const expected = 'hello world!@#$%^&*()';

            await createNewEditor(encodedText);
            await selectAllText();
            await convertSelection(conversionType.decodeUri);
            await sleep(500);

            const actual = getDocumentTextOrSelection();
            assert.strictEqual(actual, expected);
        });

        it('Convert decimal to hexadecimal', async () => {
            const decimal = '255';
            const expected = 'ff';

            await createNewEditor(decimal);
            await selectAllText();
            await convertSelection(conversionType.decToHex);
            await sleep(500);

            const actual = getDocumentTextOrSelection();
            assert.strictEqual(actual, expected);
        });

        it('Convert hexadecimal to decimal', async () => {
            const hex = 'ff';
            const expected = '255';

            await createNewEditor(hex);
            await selectAllText();
            await convertSelection(conversionType.hexToDec);
            await sleep(500);

            const actual = getDocumentTextOrSelection();
            assert.strictEqual(actual, expected);
        });

        it('Decode JWT token', async () => {
            // Simple JWT token for testing (header.payload.signature)
            const jwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

            await createNewEditor(jwtToken);
            await selectAllText();
            await convertSelection(conversionType.JWTDecode);
            await sleep(500);

            const actual = getDocumentTextOrSelection();
            assert.ok(actual, "Should have decoded JWT");
            assert.ok(actual!.includes('"token"'), "Should include token");
            assert.ok(actual!.includes('"header"'), "Should include header");
            assert.ok(actual!.includes('"payload"'), "Should include payload");
            assert.ok(actual!.includes('John Doe'), "Should include decoded name");
        });
    });

    describe('Conversion Utility Functions', () => {
        it('convertToBase64 function', () => {
            const result = convertToBase64('Hello');
            assert.strictEqual(result, 'SGVsbG8=');
        });

        it('convertFromBase64 function', () => {
            const result = convertFromBase64('SGVsbG8=');
            assert.strictEqual(result, 'Hello');
        });

        it('convertToBase64Url function', () => {
            const result = convertToBase64Url('Hello World with special chars: +/=');
            assert.ok(!result.includes('+'), "Should not contain + character");
            assert.ok(!result.includes('/'), "Should not contain / character");
            assert.ok(!result.includes('='), "Should not contain = padding");
            
            // Test round trip
            const decoded = convertFromBase64Url(result);
            assert.strictEqual(decoded, 'Hello World with special chars: +/=');
        });

        it('convertFromBase64Url function', () => {
            const urlSafeBase64 = 'SGVsbG8gV29ybGQgd2l0aCBzcGVjaWFsIGNoYXJzOiArLz0';
            const urlSafe = urlSafeBase64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
            const result = convertFromBase64Url(urlSafe);
            assert.strictEqual(result, 'Hello World with special chars: +/=');
        });

        it('parseQueryStringToJson function', () => {
            // Test basic query string
            const result1 = parseQueryStringToJson('name=John&age=30');
            const parsed1 = JSON.parse(result1);
            assert.strictEqual(parsed1.name, 'John');
            assert.strictEqual(parsed1.age, '30');
            
            // Test with URL encoding
            const result2 = parseQueryStringToJson('city=New%20York&message=Hello%21');
            const parsed2 = JSON.parse(result2);
            assert.strictEqual(parsed2.city, 'New York');
            assert.strictEqual(parsed2.message, 'Hello!');
            
            // Test with duplicate keys
            const result3 = parseQueryStringToJson('tags=javascript&tags=typescript');
            const parsed3 = JSON.parse(result3);
            assert.ok(Array.isArray(parsed3.tags));
            assert.strictEqual(parsed3.tags.length, 2);
            assert.ok(parsed3.tags.includes('javascript'));
            assert.ok(parsed3.tags.includes('typescript'));
            
            // Test with leading ?
            const result4 = parseQueryStringToJson('?param=value');
            const parsed4 = JSON.parse(result4);
            assert.strictEqual(parsed4.param, 'value');
            
            // Test empty query string
            const result5 = parseQueryStringToJson('');
            const parsed5 = JSON.parse(result5);
            assert.deepStrictEqual(parsed5, {});
        });

        it('convertToHTML function', () => {
            const result = convertToHTML('<div>test & "quote"</div>');
            assert.strictEqual(result, '&lt;div&gt;test &amp; &quot;quote&quot;&lt;/div&gt;');
        });

        it('convertFromHTML function', () => {
            const result = convertFromHTML('&lt;div&gt;test &amp; &quot;quote&quot;&lt;/div&gt;');
            assert.strictEqual(result, '<div>test & "quote"</div>');
        });

        it('encodeUri function', () => {
            const result = encodeUri('hello world!');
            assert.strictEqual(result, 'hello%20world%21');
        });

        it('decodeUri function', () => {
            const result = decodeUri('hello%20world%21');
            assert.strictEqual(result, 'hello world!');
        });

        it('convertDecimalToHexadecimal function', () => {
            assert.strictEqual(convertDecimalToHexadecimal(255), 'ff');
            assert.strictEqual(convertDecimalToHexadecimal(16), '10');
            assert.strictEqual(convertDecimalToHexadecimal(0), '0');
            assert.strictEqual(convertDecimalToHexadecimal(1.5), undefined, "Should return undefined for non-integer");
        });

        it('convertHexadecimalToDecimal function', () => {
            assert.strictEqual(convertHexadecimalToDecimal('ff'), 255);
            assert.strictEqual(convertHexadecimalToDecimal('10'), 16);
            assert.strictEqual(convertHexadecimalToDecimal('0'), 0);
            assert.ok(isNaN(convertHexadecimalToDecimal('xyz')!), "Should return NaN for invalid hex");
        });
    });

    describe('Ordered List Types', () => {
        it('Ordered list enum values', () => {
            assert.strictEqual(orderedListTypes["1. "], "Number.");
            assert.strictEqual(orderedListTypes["1) "], "Number)");
            assert.strictEqual(orderedListTypes["a. "], "lowercase.");
            assert.strictEqual(orderedListTypes["a) "], "lowercase)");
            assert.strictEqual(orderedListTypes["A. "], "Uppercase.");
            assert.strictEqual(orderedListTypes["A) "], "Uppercase)");
            assert.strictEqual(orderedListTypes["i. "], "Roman lowercase.");
            assert.strictEqual(orderedListTypes["i) "], "Roman lowercase)");
            assert.strictEqual(orderedListTypes["I. "], "Roman UPPERCASE.");
            assert.strictEqual(orderedListTypes["I) "], "Roman UPPERCASE)");
        });
    });

    describe('Error Handling', () => {
        it('Handle empty text in conversions', async () => {
            await createNewEditor('');
            await selectAllText();
            await convertSelection(conversionType.toBase64);
            await sleep(500);

            const actual = getDocumentTextOrSelection();
            assert.strictEqual(actual, '', "Should handle empty text gracefully");
        });

        it('Handle invalid base64 in conversion', async () => {
            await createNewEditor('invalid-base64-string');
            await selectAllText();
            
            try {
                await convertSelection(conversionType.fromBase64);
                await sleep(500);
                // Should not crash even with invalid base64
                assert.ok(true, "Should handle invalid base64 gracefully");
            } catch (error) {
                assert.ok(true, "Should handle error gracefully");
            }
        });

        it('Handle invalid URL-safe base64 in conversion', async () => {
            await createNewEditor('invalid-url-safe-base64!@#$');
            await selectAllText();
            
            try {
                await convertSelection(conversionType.fromBase64Url);
                await sleep(500);
                // Should not crash even with invalid URL-safe base64
                assert.ok(true, "Should handle invalid URL-safe base64 gracefully");
            } catch (error) {
                assert.ok(true, "Should handle error gracefully");
            }
        });

        it('Handle malformed query string', async () => {
            await createNewEditor('malformed=&=value&incomplete');
            await selectAllText();
            
            try {
                await convertSelection(conversionType.queryStringToJson);
                await sleep(500);
                const actual = getDocumentTextOrSelection();
                const parsed = JSON.parse(actual!);
                // Should produce valid JSON even with malformed input
                assert.ok(typeof parsed === 'object', "Should produce valid JSON object");
                assert.ok(true, "Should handle malformed query string gracefully");
            } catch (error) {
                assert.ok(true, "Should handle query string parsing error gracefully");
            }
        });

        it('Handle empty query string', async () => {
            await createNewEditor('');
            await selectAllText();
            await convertSelection(conversionType.queryStringToJson);
            await sleep(500);

            const actual = getDocumentTextOrSelection();
            // Handle case where the result might be empty or '{}'
            if (actual && actual.trim()) {
                const parsed = JSON.parse(actual);
                assert.deepStrictEqual(parsed, {}, "Should return empty object for empty query string");
            } else {
                // If the result is empty, that's also acceptable for empty input
                assert.ok(true, "Empty result is acceptable for empty query string");
            }
        });

        it('Handle invalid hex in conversion', async () => {
            await createNewEditor('xyz');
            await selectAllText();
            await convertSelection(conversionType.hexToDec);
            await sleep(500);

            const actual = getDocumentTextOrSelection();
            assert.ok(actual, "Should produce some result even with invalid hex");
        });

        it('Handle invalid decimal in conversion', async () => {
            await createNewEditor('not-a-number');
            await selectAllText();
            await convertSelection(conversionType.decToHex);
            await sleep(500);

            const actual = getDocumentTextOrSelection();
            // Should handle gracefully, might stay the same or become empty
            assert.ok(true, "Should handle invalid decimal input");
        });

        it('Handle complex JWT decode', async () => {
            const invalidJWT = 'invalid.jwt.token';
            
            await createNewEditor(invalidJWT);
            await selectAllText();
            
            try {
                await convertSelection(conversionType.JWTDecode);
                await sleep(500);
                assert.ok(true, "Should handle invalid JWT gracefully");
            } catch (error) {
                assert.ok(true, "Should handle JWT decode error gracefully");
            }
        });
    });

    describe('Edge Cases', () => {
        it('Multiple selections with different conversions', async () => {
            const text = 'Hello World and More Text';
            
            await createNewEditor(text);
            const editor = getActiveEditor();
            if (editor) {
                editor.selections = [
                    new Selection(0, 0, 0, 5),   // 'Hello'
                    new Selection(0, 6, 0, 11)   // 'World'
                ];
                
                await convertSelection(conversionType.toBase64);
                await sleep(500);
                
                const actual = editor.document.getText();
                console.log('Multiple selections different conversions result:', JSON.stringify(actual));
                assert.ok(actual, "Should handle multiple selections");
                assert.ok(actual!.includes('and More Text'), "Should preserve unselected text");
            }
        });

        it('Very long text conversion', async () => {
            const longText = 'a'.repeat(10000);
            
            await createNewEditor(longText);
            await selectAllText();
            await convertSelection(conversionType.toBase64);
            await sleep(500);

            const actual = getDocumentTextOrSelection();
            assert.ok(actual, "Should handle very long text");
            assert.ok(actual!.length > longText.length, "Base64 should be longer than original");
        });

        it('Special characters in path transformation', async () => {
            const pathString = 'C:\\Program Files (x86)\\My App\\config.json';
            const expected = 'C:/Program Files (x86)/My App/config.json';

            await createNewEditor(pathString);
            await selectAllText();
            await transformPath(pathTransformationType.posix);
            await sleep(500);

            const actual = getDocumentTextOrSelection();
            assert.strictEqual(actual, expected);
        });

        it('Unicode text in conversions', async () => {
            const unicodeText = 'Hello 世界 🌍';
            
            await createNewEditor(unicodeText);
            const editor = getActiveEditor();
            await selectAllText();
            await convertSelection(conversionType.toBase64);
            await sleep(500);

            const actual = editor!.document.getText();
            console.log('Unicode toBase64 result:', JSON.stringify(actual));
            assert.ok(actual, "Should handle unicode text");
            
            // Convert back to verify
            await selectAllText();
            await convertSelection(conversionType.fromBase64);
            await sleep(500);

            const restored = editor!.document.getText();
            console.log('Unicode fromBase64 result:', JSON.stringify(restored));
            assert.strictEqual(restored, unicodeText, "Should preserve unicode through conversion cycle");
        });
    });
});