import * as assert from 'assert';
import * as vscode from 'vscode';
import * as AdvancedListConverter from '../../modules/advancedListConverter';

suite('Advanced Pattern Engine Tests', () => {
    
    /**
     * Helper function to test pattern processing
     */
    function testPattern(pattern: string, lineIndex: number, expected: string) {
        const result = AdvancedListConverter.processEnhancedPattern(pattern, lineIndex);
        assert.strictEqual(result, expected, `Pattern: "${pattern}", Line: ${lineIndex}`);
    }

    suite('Basic Patterns (Backward Compatibility)', () => {
        test('Basic number pattern {n}', () => {
            testPattern('{n}', 0, '1');
            testPattern('{n}', 1, '2');
            testPattern('{n}', 4, '5');
        });

        test('Basic lowercase letters {i}', () => {
            testPattern('{i}', 0, 'a');
            testPattern('{i}', 1, 'b');
            testPattern('{i}', 25, 'z');
            testPattern('{i}', 26, 'a'); // Should cycle
        });

        test('Basic uppercase letters {I}', () => {
            testPattern('{I}', 0, 'A');
            testPattern('{I}', 1, 'B');
            testPattern('{I}', 25, 'Z');
            testPattern('{I}', 26, 'A'); // Should cycle
        });

        test('Basic Roman numerals {r} and {R}', () => {
            testPattern('{r}', 0, 'i');
            testPattern('{r}', 1, 'ii');
            testPattern('{r}', 3, 'iv');
            testPattern('{R}', 0, 'I');
            testPattern('{R}', 1, 'II');
            testPattern('{R}', 3, 'IV');
        });

        test('Date and time patterns', () => {
            const now = new Date();
            testPattern('{date}', 0, now.toLocaleDateString());
            testPattern('{time}', 0, now.toLocaleTimeString());
            testPattern('{line}', 0, '1');
            testPattern('{line}', 4, '5');
        });
    });

    suite('Enhanced Number Patterns', () => {
        test('Number with start value {n:start}', () => {
            testPattern('{n:10}', 0, '10');
            testPattern('{n:10}', 1, '11');
            testPattern('{n:10}', 4, '14');
        });

        test('Number with start and step {n:start:step}', () => {
            testPattern('{n:5:5}', 0, '5');
            testPattern('{n:5:5}', 1, '10');
            testPattern('{n:5:5}', 2, '15');
        });

        test('Number with formatting {n:start:step:format}', () => {
            testPattern('{n:1:1:03d}', 0, '001');
            testPattern('{n:1:1:03d}', 9, '010');
            testPattern('{n:1:1:05d}', 0, '00001');
        });

        test('Number with hex formatting', () => {
            testPattern('{n:10:1:02x}', 0, '0a');
            testPattern('{n:10:1:02x}', 5, '0f');
            testPattern('{n:255:1:02x}', 0, 'ff');
        });

        test('Number with binary formatting', () => {
            testPattern('{n:5:1:04b}', 0, '0101');
            testPattern('{n:5:1:04b}', 1, '0110');
        });

        test('Number with octal formatting', () => {
            testPattern('{n:8:1:03o}', 0, '010');
            testPattern('{n:8:1:03o}', 1, '011');
        });
    });

    suite('Enhanced Letter Patterns', () => {
        test('Lowercase letters with start {i:start}', () => {
            testPattern('{i:c}', 0, 'c');
            testPattern('{i:c}', 1, 'd');
            testPattern('{i:c}', 2, 'e');
            testPattern('{i:z}', 1, 'a'); // Should wrap around
        });

        test('Uppercase letters with start {I:start}', () => {
            testPattern('{I:C}', 0, 'C');
            testPattern('{I:C}', 1, 'D');
            testPattern('{I:C}', 2, 'E');
            testPattern('{I:Z}', 1, 'A'); // Should wrap around
        });
    });

    suite('Enhanced Roman Numeral Patterns', () => {
        test('Roman numerals with start {r:start}', () => {
            testPattern('{r:5}', 0, 'v');
            testPattern('{r:5}', 1, 'vi');
            testPattern('{r:5}', 4, 'ix');
        });

        test('Uppercase Roman numerals with start {R:start}', () => {
            testPattern('{R:5}', 0, 'V');
            testPattern('{R:5}', 1, 'VI');
            testPattern('{R:5}', 4, 'IX');
        });
    });

    suite('Complex Patterns', () => {
        test('Multiple patterns in single string', () => {
            testPattern('{n:1:1:02d}. Item {I:A}: {r:1}', 0, '01. Item A: i');
            testPattern('{n:1:1:02d}. Item {I:A}: {r:1}', 1, '02. Item B: ii');
            testPattern('{n:1:1:02d}. Item {I:A}: {r:1}', 2, '03. Item C: iii');
        });

        test('Mixed basic and enhanced patterns', () => {
            testPattern('{n} - {n:10:5} - {i}', 0, '1 - 10 - a');
            testPattern('{n} - {n:10:5} - {i}', 1, '2 - 15 - b');
            testPattern('{n} - {n:10:5} - {i}', 2, '3 - 20 - c');
        });
    });

    suite('Edge Cases and Error Handling', () => {
        test('Invalid format should fallback gracefully', () => {
            testPattern('{n:1:1:invalid}', 0, '1'); // Should fallback to simple string
            testPattern('{n:1:1:xyz}', 1, '2');
        });

        test('Missing parameters should use defaults', () => {
            testPattern('{n:}', 0, '1'); // Empty start should default
            testPattern('{n::}', 0, '1'); // Empty start and step
        });

        test('Non-numeric parameters should handle gracefully', () => {
            testPattern('{n:abc}', 0, '1'); // Non-numeric start should default
            testPattern('{n:5:xyz}', 0, '5'); // Non-numeric step should default
        });
    });

    suite('Integration Tests', () => {
        test('Pattern processing in prefix context', async () => {
            // Create a mock document with multiple lines
            const testText = 'Line 1\nLine 2\nLine 3';
            
            // We would need to test the full advancedPrefixSuffix function here
            // For now, we can test individual pattern processing
        });

        test('Pattern processing in suffix context', async () => {
            // Similar integration test for suffix functionality
        });
    });
});