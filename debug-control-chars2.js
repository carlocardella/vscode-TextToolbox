// Test the actual chars array from controlCharacters
const chars = [
    "(\x82)", // High code comma
    "(\u2013)", // en dash
    "(\u2014)", // em dash
];

console.log("Individual chars:", chars);
console.log("chars[1]:", JSON.stringify(chars[1]));
console.log("Expected en-dash unicode:", JSON.stringify("\u2013"));

const regExpText = chars.join("|");
console.log("regExpText:", JSON.stringify(regExpText));

const regexp = new RegExp(regExpText, "g");
console.log("regexp:", regexp);

// Test against actual en-dash
const testText = "– vs -";
console.log("Test text:", JSON.stringify(testText));

const matches = testText.match(regexp);
console.log("Matches:", matches);

const result = testText.replace(regexp, "REPLACED");
console.log("Result:", JSON.stringify(result));
