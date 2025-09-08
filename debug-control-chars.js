// Quick test to debug control character regex
const chars = [
    "(\u2013)", // en dash
    "(\u2014)", // em dash
];

const regExpText = chars.join("|");
console.log("Regex pattern:", regExpText);

const regexp = new RegExp(regExpText, "g");
console.log("Regex:", regexp);

const testText = "– vs -";
console.log("Test text:", testText);
console.log("Char codes:", testText.split('').map(c => c.charCodeAt(0).toString(16)));

const matches = testText.match(regexp);
console.log("Matches:", matches);

// Test replacement
const result = testText.replace(regexp, "");
console.log("Result after replacement:", JSON.stringify(result));
