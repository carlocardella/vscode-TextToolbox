import * as assert from 'assert';
import { before, after, describe, it } from 'mocha';
import { 
    sleep, 
    closeTextEditor, 
    createNewEditor, 
    getActiveEditor, 
    selectAllText, 
    getDocumentTextOrSelection
} from '../../modules/helpers';
import { 
    stringUtilityType,
    applyStringUtility,
    slugifyString,
    obfuscateString,
    deobfuscateString,
    generateNumeronym,
    calculateTextStatistics,
    showTextStatistics,
    showTextStatisticsInNewEditor,
    invertSelection,
    TextStatistics
} from '../../modules/stringUtilities';
import { Selection, Position } from 'vscode';

describe("stringUtilities", () => {
    before(() => {
        console.log('Starting stringUtilities tests');
    });
    after(async () => {
        await sleep(500);
        await closeTextEditor(true);
        console.log('All stringUtilities tests done');
    });

    describe("String Slugification", () => {
        it("Should convert text to URL-friendly slug", () => {
            const input = "Hello World! This is a Test.";
            const expected = "hello-world-this-is-a-test";
            const result = slugifyString(input);
            assert.strictEqual(result, expected);
        });

        it("Should handle special characters", () => {
            const input = "My@Special#String$With%Characters";
            const expected = "myspecialstringwithcharacters";
            const result = slugifyString(input);
            assert.strictEqual(result, expected);
        });

        it("Should handle multiple spaces", () => {
            const input = "Multiple   Spaces    Between   Words";
            const expected = "multiple-spaces-between-words";
            const result = slugifyString(input);
            assert.strictEqual(result, expected);
        });

        it("Should use custom separator", () => {
            const input = "Hello World Test";
            const expected = "hello_world_test";
            const result = slugifyString(input, '_');
            assert.strictEqual(result, expected);
        });

        it("Should handle empty string", () => {
            const input = "";
            const expected = "";
            const result = slugifyString(input);
            assert.strictEqual(result, expected);
        });

        it("Should trim leading and trailing separators", () => {
            const input = "  Hello World  ";
            const expected = "hello-world";
            const result = slugifyString(input);
            assert.strictEqual(result, expected);
        });
    });

    describe("String Obfuscation", () => {
        it("Should obfuscate string with default shift", () => {
            const input = "Hello World";
            const result = obfuscateString(input);
            // Should be different from input
            assert.notStrictEqual(result, input);
            // Should be same length
            assert.strictEqual(result.length, input.length);
        });

        it("Should deobfuscate back to original", () => {
            const input = "Hello World! 123";
            const obfuscated = obfuscateString(input);
            const deobfuscated = deobfuscateString(obfuscated);
            assert.strictEqual(deobfuscated, input);
        });

        it("Should handle custom shift values", () => {
            const input = "Test String";
            const shift = 5;
            const obfuscated = obfuscateString(input, shift);
            const deobfuscated = deobfuscateString(obfuscated, shift);
            assert.strictEqual(deobfuscated, input);
        });

        it("Should handle non-printable characters", () => {
            const input = "Hello\\nWorld\\t";
            const obfuscated = obfuscateString(input);
            const deobfuscated = deobfuscateString(obfuscated);
            assert.strictEqual(deobfuscated, input);
        });

        it("Should handle empty string", () => {
            const input = "";
            const obfuscated = obfuscateString(input);
            const deobfuscated = deobfuscateString(obfuscated);
            assert.strictEqual(obfuscated, "");
            assert.strictEqual(deobfuscated, "");
        });
    });

    describe("Numeronym Generator", () => {
        it("Should generate numeronym for internationalization", () => {
            const input = "internationalization";
            const expected = "i18n";
            const result = generateNumeronym(input);
            assert.strictEqual(result, expected);
        });

        it("Should generate numeronym for localization", () => {
            const input = "localization";
            const expected = "l10n";
            const result = generateNumeronym(input);
            assert.strictEqual(result, expected);
        });

        it("Should generate numeronym for accessibility", () => {
            const input = "accessibility";
            const expected = "a11y";
            const result = generateNumeronym(input);
            assert.strictEqual(result, expected);
        });

        it("Should handle short words", () => {
            const input = "hi";
            const expected = "hi";
            const result = generateNumeronym(input);
            assert.strictEqual(result, expected);
        });

        it("Should handle three character words", () => {
            const input = "the";
            const expected = "the";
            const result = generateNumeronym(input);
            assert.strictEqual(result, expected);
        });

        it("Should handle four character words", () => {
            const input = "test";
            const expected = "t2t";
            const result = generateNumeronym(input);
            assert.strictEqual(result, expected);
        });

        it("Should handle whitespace", () => {
            const input = "  testing  ";
            const expected = "t5g";
            const result = generateNumeronym(input);
            assert.strictEqual(result, expected);
        });
    });

    describe("Text Statistics Calculation", () => {
        it("Should calculate basic text statistics", () => {
            const input = "Hello world! This is a test.";
            const stats = calculateTextStatistics(input);
            
            assert.strictEqual(stats.characters, 28);
            assert.strictEqual(stats.charactersNoSpaces, 23);
            assert.strictEqual(stats.words, 6);
            assert.strictEqual(stats.sentences, 2);
            assert.strictEqual(stats.paragraphs, 1);
            assert.strictEqual(stats.lines, 1);
            assert.strictEqual(stats.readingTimeMinutes, 1);
        });

        it("Should handle multiple sentences", () => {
            const input = "First sentence. Second sentence! Third sentence?";
            const stats = calculateTextStatistics(input);
            
            assert.strictEqual(stats.sentences, 3);
            assert.strictEqual(stats.words, 6);
        });

        it("Should handle multiple paragraphs", () => {
            const input = "First paragraph.\n\nSecond paragraph.\n\nThird paragraph.";
            const stats = calculateTextStatistics(input);
            
            assert.strictEqual(stats.paragraphs, 3);
        });

        it("Should handle multiple lines", () => {
            const input = "Line 1\nLine 2\nLine 3";
            const stats = calculateTextStatistics(input);
            
            assert.strictEqual(stats.lines, 3);
            assert.strictEqual(stats.words, 6);
        });

        it("Should handle empty text", () => {
            const input = "";
            const stats = calculateTextStatistics(input);
            
            assert.strictEqual(stats.characters, 0);
            assert.strictEqual(stats.charactersNoSpaces, 0);
            assert.strictEqual(stats.words, 0);
            assert.strictEqual(stats.sentences, 0);
            assert.strictEqual(stats.paragraphs, 0);
            assert.strictEqual(stats.lines, 1); // Empty string splits to one empty line
            assert.strictEqual(stats.readingTimeMinutes, 0); // Math.ceil(0/200) = 0
        });

        it("Should calculate reading time for longer text", () => {
            // Create text with approximately 400 words
            const words = new Array(400).fill("word").join(" ");
            const stats = calculateTextStatistics(words);
            
            assert.strictEqual(stats.words, 400);
            assert.strictEqual(stats.readingTimeMinutes, 2); // 400 words / 200 wpm = 2 minutes
        });

        it("Should handle special characters in word count", () => {
            const input = "Hello, world! How are you? I'm fine.";
            const stats = calculateTextStatistics(input);
            
            assert.strictEqual(stats.words, 7); // "Hello,", "world!", "How", "are", "you?", "I'm", "fine."
        });

        it("Should calculate bytes correctly for UTF-8", () => {
            const input = "Hello 世界"; // Contains Unicode characters
            const stats = calculateTextStatistics(input);
            
            // "Hello " = 6 bytes, "世" = 3 bytes, "界" = 3 bytes, total = 12 bytes
            assert.strictEqual(stats.bytes, 12);
        });
    });

    describe("String Utility Application", () => {
        it("Should apply slugify transformation to selection", async () => {
            const text = "Hello World! Test String.";
            const expected = "hello-world-test-string";

            await createNewEditor(text);
            await selectAllText();
            await applyStringUtility(stringUtilityType.slugify);
            await sleep(100);

            const actual = getDocumentTextOrSelection();
            assert.strictEqual(actual, expected);
        });

        it("Should apply obfuscation transformation to selection", async () => {
            const text = "Test String";

            await createNewEditor(text);
            await selectAllText();
            await applyStringUtility(stringUtilityType.obfuscate);
            await sleep(100);

            const actual = getDocumentTextOrSelection();
            // Should be different from original
            assert.notStrictEqual(actual, text);
            // Should be same length
            if (actual) {
                assert.strictEqual(actual.length, text.length);
            }
        });

        it("Should apply deobfuscation transformation", async () => {
            const originalText = "Test String";
            const obfuscatedText = obfuscateString(originalText);

            await createNewEditor(obfuscatedText);
            await selectAllText();
            await applyStringUtility(stringUtilityType.deobfuscate);
            await sleep(100);

            const actual = getDocumentTextOrSelection();
            assert.strictEqual(actual, originalText);
        });

        it("Should apply numeronym transformation to selection", async () => {
            const text = "internationalization";
            const expected = "i18n";

            await createNewEditor(text);
            await selectAllText();
            await applyStringUtility(stringUtilityType.numeronym);
            await sleep(100);

            const actual = getDocumentTextOrSelection();
            assert.strictEqual(actual, expected);
        });

        it("Should handle multiple selections", async () => {
            const text = "Hello World and Test String";

            await createNewEditor(text);
            const editor = getActiveEditor();
            if (editor) {
                // Select "Hello" and "Test"
                editor.selections = [
                    new Selection(0, 0, 0, 5),   // "Hello"
                    new Selection(0, 16, 0, 20)  // "Test"
                ];

                await applyStringUtility(stringUtilityType.slugify);
                await sleep(500);

                const actual = editor.document.getText();
                // The transformation should have been applied to the selected text
                // Expected result: "hello World and test String"
                assert.ok(actual, "Should have actual content");
                if (actual) {
                    assert.ok(actual.includes("hello"), "Should contain slugified 'Hello' -> 'hello'");
                    assert.ok(actual.includes("test"), "Should contain slugified 'Test' -> 'test'");
                }
            }
        });
    });

    describe("Text Statistics Display", () => {
        it("Should show text statistics for selection", async () => {
            const text = "Hello world! This is a test.";

            await createNewEditor(text);
            await selectAllText();
            
            // This would normally show a dialog, but we can't easily test that
            // Just ensure the function doesn't throw
            await showTextStatistics();
            
            // Test passes if no exception is thrown
            assert.ok(true);
        });

        it("Should show text statistics in new editor", async () => {
            const text = "Hello world! This is a test.";

            await createNewEditor(text);
            await selectAllText();
            
            await showTextStatisticsInNewEditor();
            await sleep(500);
            
            // Check if a new editor was created with statistics
            const editor = getActiveEditor();
            if (editor) {
                const statsContent = editor.document.getText();
                assert.ok(statsContent.includes("Statistics"));
                assert.ok(statsContent.includes("Characters:"));
                assert.ok(statsContent.includes("Words:"));
            }
        });
    });

    describe("Edge Cases", () => {
        it("Should handle Unicode characters in slugify", () => {
            const input = "Café & Restaurant Zürich";
            const result = slugifyString(input);
            assert.strictEqual(result, "caf-restaurant-zrich");
        });

        it("Should handle numeric strings", () => {
            const input = "123 456 789";
            const result = slugifyString(input);
            assert.strictEqual(result, "123-456-789");
        });

        it("Should handle mixed content", () => {
            const input = "API v2.1 (Beta) - Test!";
            const result = slugifyString(input);
            assert.strictEqual(result, "api-v21-beta-test");
        });

        it("Should handle very long strings", () => {
            const longString = "a".repeat(1000);
            const result = slugifyString(longString);
            assert.strictEqual(result.length, 1000);
            assert.strictEqual(result, longString);
        });
    });

    describe("Selection Inversion", () => {
        it("Should invert single line selection", async () => {
            const testText = "Line one\nLine two\nLine three";
            await createNewEditor(testText);
            await sleep(100);
            
            const editor = getActiveEditor();
            if (editor) {
                // Select "Line two" (middle line)
                const startPos = new Position(1, 0); // Start of line 2
                const endPos = new Position(1, 8); // End of "Line two"
                editor.selection = new Selection(startPos, endPos);
                
                // Apply invert selection
                invertSelection();
                
                // Should have two selections: before and after the original selection
                assert.strictEqual(editor.selections.length, 2);
                
                // First selection should be from start of document to start of "Line two"
                const firstSelection = editor.selections[0];
                assert.strictEqual(firstSelection.start.line, 0);
                assert.strictEqual(firstSelection.start.character, 0);
                assert.strictEqual(firstSelection.end.line, 1);
                assert.strictEqual(firstSelection.end.character, 0);
                
                // Second selection should be from end of "Line two" to end of document
                const secondSelection = editor.selections[1];
                assert.strictEqual(secondSelection.start.line, 1);
                assert.strictEqual(secondSelection.start.character, 8);
                assert.strictEqual(secondSelection.end.line, 2);
                assert.strictEqual(secondSelection.end.character, 10);
            } else {
                assert.fail("Editor should be available");
            }
            
            await closeTextEditor();
        });

        it("Should invert partial line selection", async () => {
            const testText = "The quick brown fox jumps over the lazy dog";
            await createNewEditor(testText);
            await sleep(100);
            
            const editor = getActiveEditor();
            if (editor) {
                // Select "brown fox" in the middle
                const startPos = new Position(0, 10); // Start of "brown"
                const endPos = new Position(0, 19); // End of "fox"
                editor.selection = new Selection(startPos, endPos);
                
                // Apply invert selection
                invertSelection();
                
                // Should have two selections: before and after "brown fox"
                assert.strictEqual(editor.selections.length, 2);
                
                // First selection should be from start to "brown"
                const firstSelection = editor.selections[0];
                assert.strictEqual(firstSelection.start.line, 0);
                assert.strictEqual(firstSelection.start.character, 0);
                assert.strictEqual(firstSelection.end.line, 0);
                assert.strictEqual(firstSelection.end.character, 10);
                
                // Second selection should be from end of "fox" to end
                const secondSelection = editor.selections[1];
                assert.strictEqual(secondSelection.start.line, 0);
                assert.strictEqual(secondSelection.start.character, 19);
                assert.strictEqual(secondSelection.end.line, 0);
                assert.strictEqual(secondSelection.end.character, 43);
            } else {
                assert.fail("Editor should be available");
            }
            
            await closeTextEditor();
        });

        it("Should handle multiple selections", async () => {
            const testText = "First line\nSecond line\nThird line\nFourth line";
            await createNewEditor(testText);
            await sleep(100);
            
            const editor = getActiveEditor();
            if (editor) {
                // Select multiple parts: "irst" (not at start) and "hird" (not at start)
                const firstSelection = new Selection(new Position(0, 1), new Position(0, 5)); // "irst"
                const secondSelection = new Selection(new Position(2, 1), new Position(2, 5)); // "hird"
                editor.selections = [firstSelection, secondSelection];
                
                // Apply invert selection
                invertSelection();
                
                // Should have three selections: 
                // 1. From start of document (0,0) to start of "irst" (0,1)
                // 2. From end of "irst" (0,5) to start of "hird" (2,1) 
                // 3. From end of "hird" (2,5) to end of document
                assert.strictEqual(editor.selections.length, 3);
            } else {
                assert.fail("Editor should be available");
            }
            
            await closeTextEditor();
        });

        it("Should handle selection at start of document", async () => {
            const testText = "First line\nSecond line\nThird line";
            await createNewEditor(testText);
            await sleep(100);
            
            const editor = getActiveEditor();
            if (editor) {
                // Select "First" at the very beginning
                const startPos = new Position(0, 0);
                const endPos = new Position(0, 5);
                editor.selection = new Selection(startPos, endPos);
                
                // Apply invert selection
                invertSelection();
                
                // Should have one selection: from end of "First" to end of document
                assert.strictEqual(editor.selections.length, 1);
                
                const selection = editor.selections[0];
                assert.strictEqual(selection.start.line, 0);
                assert.strictEqual(selection.start.character, 5);
            } else {
                assert.fail("Editor should be available");
            }
            
            await closeTextEditor();
        });

        it("Should handle selection at end of document", async () => {
            const testText = "First line\nSecond line\nThird line";
            await createNewEditor(testText);
            await sleep(100);
            
            const editor = getActiveEditor();
            if (editor) {
                // Select "line" at the very end
                const startPos = new Position(2, 6);
                const endPos = new Position(2, 10);
                editor.selection = new Selection(startPos, endPos);
                
                // Apply invert selection
                invertSelection();
                
                // Should have one selection: from start of document to start of "line"
                assert.strictEqual(editor.selections.length, 1);
                
                const selection = editor.selections[0];
                assert.strictEqual(selection.start.line, 0);
                assert.strictEqual(selection.start.character, 0);
                assert.strictEqual(selection.end.line, 2);
                assert.strictEqual(selection.end.character, 6);
            } else {
                assert.fail("Editor should be available");
            }
            
            await closeTextEditor();
        });
    });
});
