const jsonic = require('jsonic');
const testJson = `{
    "message": "Hello\\nWorld",
    "path": "C:\\\\Users\\\\test",
    "unicode": "café"
}`;
console.log('Input:', testJson);
try {
    const parsed = jsonic(testJson);
    console.log('Parsed:', parsed);
    const stringified = JSON.stringify(parsed);
    console.log('Stringified:', stringified);
    console.log('Contains Hello\\\\nWorld:', stringified.includes('Hello\\\\nWorld'));
    console.log('Contains C:\\\\\\\\Users:', stringified.includes('C:\\\\\\\\Users'));
} catch (error) {
    console.log('Error:', error);
}
