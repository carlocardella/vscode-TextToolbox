const jsonic = require('jsonic');
const inputJson = `{
    "message": "Hello\\nWorld",
    "path": "C:\\\\Users\\\\test",
    "unicode": "café"
}`;

console.log('Input JSON:', JSON.stringify(inputJson));
const parsed = jsonic(inputJson);
console.log('Parsed object:', parsed);
const stringified = JSON.stringify(parsed);
console.log('Stringified:', stringified);

// Test the specific checks
console.log('Contains Hello\\\\nWorld:', stringified.includes('Hello\\nWorld'));
console.log('Contains C:\\\\\\\\Users:', stringified.includes('C:\\\\Users'));
console.log('Contains café:', stringified.includes('café'));

// Check the exact characters
console.log('Message value:', parsed.message);
console.log('Message char codes:', [...parsed.message].map(c => c.charCodeAt(0)));
console.log('Path value:', parsed.path);
console.log('Path char codes:', [...parsed.path].map(c => c.charCodeAt(0)));
