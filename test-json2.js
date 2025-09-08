const jsonic = require('jsonic');

// Test what the test expects: literal backslash-n in JSON
const testJsonWithEscapedBackslash = `{
    "message": "Hello\\\\nWorld",
    "path": "C:\\\\\\\\Users\\\\\\\\test",
    "unicode": "café"
}`;

console.log('Input with escaped backslashes:', testJsonWithEscapedBackslash);

try {
    const parsed = jsonic(testJsonWithEscapedBackslash);
    console.log('Parsed:', parsed);
    const stringified = JSON.stringify(parsed);
    console.log('Stringified:', stringified);
    console.log('Contains Hello\\\\nWorld:', stringified.includes('Hello\\\\nWorld'));
    console.log('Contains C:\\\\\\\\Users:', stringified.includes('C:\\\\\\\\Users'));
} catch (error) {
    console.log('Error:', error);
}
