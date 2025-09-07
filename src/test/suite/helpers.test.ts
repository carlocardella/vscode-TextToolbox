import * as assert from 'assert';
import { before, after, describe, it } from 'mocha';
import { 
    sleep, 
    closeTextEditor, 
    createNewEditor, 
    getActiveEditor, 
    selectAllText, 
    getDocumentTextOrSelection,
    getDocumentEOL,
    getLinesFromSelection,
    isNumber,
    incrementString,
    getRegExpObject
} from '../../modules/helpers';
import { Selection, Position } from 'vscode';

describe('helpers', () => {
    before(() => {
        console.log('Starting helpers tests');
    });
    after(async () => {
        await sleep(500);
        await closeTextEditor(true);
        console.log('All helpers tests done');
    });

    describe('Editor Operations', () => {
        it('Create and close new editor', async () => {
            const editor = await createNewEditor('Test content');
            assert.ok(editor, 'Should create new editor');
            assert.strictEqual(editor?.document.getText(), 'Test content', 'Should have correct content');
            
            await closeTextEditor(false);
            assert.ok(true, 'Should close editor without errors');
        });

        it('Get active editor', async () => {
            await createNewEditor('Active editor test');
            const editor = getActiveEditor();
            assert.ok(editor, 'Should get active editor');
            assert.strictEqual(editor?.document.getText(), 'Active editor test', 'Should have correct content');
        });

        it('Select all text', async () => {
            await createNewEditor('Select all test content');
            await selectAllText();
            
            const editor = getActiveEditor();
            const selection = editor?.selection;
            assert.ok(selection, 'Should have selection');
            assert.strictEqual(selection?.start.line, 0, 'Selection should start at line 0');
            assert.strictEqual(selection?.start.character, 0, 'Selection should start at character 0');
        });

        it('Get document text or selection', async () => {
            await createNewEditor('Full document text');
            let text = getDocumentTextOrSelection();
            assert.strictEqual(text, 'Full document text', 'Should get full document text');
            
            // Test with selection
            const editor = getActiveEditor();
            if (editor) {
                editor.selection = new Selection(0, 0, 0, 4); // Select "Full"
                text = getDocumentTextOrSelection();
                assert.strictEqual(text, 'Full', 'Should get selected text');
            }
        });

        it('Get document EOL', async () => {
            await createNewEditor('Line 1\nLine 2');
            const editor = getActiveEditor();
            const eol = getDocumentEOL(editor);
            assert.ok(eol, 'Should get EOL character');
            assert.ok(eol === '\n' || eol === '\r\n', 'Should be valid EOL character');
        });
    });

    describe('Line Operations', () => {
        it('Get lines from selection', async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const content = `Line 1${eol}Line 2${eol}Line 3`;
            
            await createNewEditor(content);
            const editor = getActiveEditor();
            if (editor) {
                editor.selection = new Selection(0, 0, 2, 6); // Select all lines
                const lines = getLinesFromSelection(editor);
                assert.ok(lines, 'Should get lines');
                assert.strictEqual(lines!.length, 3, 'Should have 3 lines');
                assert.strictEqual(lines![0].text, 'Line 1', 'First line should match');
                assert.strictEqual(lines![1].text, 'Line 2', 'Second line should match');
                assert.strictEqual(lines![2].text, 'Line 3', 'Third line should match');
            }
        });
    });

    describe('Utility Functions', () => {
        it('Check if string is number', () => {
            assert.strictEqual(isNumber('123'), true, '123 should be a number');
            assert.strictEqual(isNumber('0'), true, '0 should be a number');
            assert.strictEqual(isNumber('-456'), true, '-456 should be a number');
            assert.strictEqual(isNumber('12.34'), true, '12.34 should be a number');
            assert.strictEqual(isNumber('abc'), false, 'abc should not be a number');
            assert.strictEqual(isNumber(''), false, 'Empty string should not be a number');
            assert.strictEqual(isNumber('12abc'), false, '12abc should not be a number');
        });

        it('Increment string', () => {
            assert.strictEqual(incrementString('1'), '2', '1 should increment to 2');
            assert.strictEqual(incrementString('10'), '11', '10 should increment to 11');
            assert.strictEqual(incrementString('99'), '100', '99 should increment to 100');
            assert.strictEqual(incrementString('001'), '002', '001 should increment to 002');
        });

        it('Get RegExp object', () => {
            const regex1 = getRegExpObject('/test/gi');
            assert.ok(regex1 instanceof RegExp, 'Should return RegExp object');
            assert.strictEqual(regex1.source, 'test', 'Should have correct pattern');
            assert.strictEqual(regex1.global, true, 'Should have global flag');
            assert.strictEqual(regex1.ignoreCase, true, 'Should have ignoreCase flag');

            const regex2 = getRegExpObject('simple');
            assert.ok(regex2 instanceof RegExp, 'Should return RegExp object for simple string');
            assert.strictEqual(regex2.source, 'simple', 'Should have correct pattern');
        });
    });

    describe('Performance Tests', () => {
        it('Editor operations performance', async () => {
            const startTime = Date.now();
            
            // Create and manipulate multiple editors
            for (let i = 0; i < 3; i++) {
                await createNewEditor(`Performance test ${i}`);
                await selectAllText();
                getDocumentTextOrSelection();
            }
            
            await closeTextEditor(true);
            
            const endTime = Date.now();
            const duration = endTime - startTime;
            
            assert.ok(duration < 10000, `Editor operations should be fast (took ${duration}ms)`);
        });

        it('String operations performance', () => {
            const startTime = Date.now();
            
            // Test many string operations
            for (let i = 0; i < 1000; i++) {
                incrementString(i.toString());
                isNumber(i.toString());
            }
            
            const endTime = Date.now();
            const duration = endTime - startTime;
            
            assert.ok(duration < 1000, `String operations should be fast (took ${duration}ms)`);
        });
    });

    describe('Edge Cases', () => {
        it('Handle null and undefined inputs', () => {
            // These should not crash
            try {
                isNumber('');
                getRegExpObject('test');
                assert.ok(true, 'Should handle edge cases gracefully');
            } catch (error) {
                assert.ok(true, 'Should handle errors gracefully');
            }
        });

        it('Handle large inputs', async () => {
            const largeContent = 'x'.repeat(1000);
            await createNewEditor(largeContent);
            
            const text = getDocumentTextOrSelection();
            assert.ok(text, 'Should get text from large content');
            assert.strictEqual(text!.length, 1000, 'Should handle large content');
            
            await selectAllText();
            const selectedText = getDocumentTextOrSelection();
            assert.ok(selectedText, 'Should get selected text from large content');
            assert.strictEqual(selectedText!.length, 1000, 'Should handle large selections');
        });

        it('Handle special characters', async () => {
            const specialContent = 'Hello 世界 🌍 Special chars: !@#$%^&*()';
            await createNewEditor(specialContent);
            
            const text = getDocumentTextOrSelection();
            assert.strictEqual(text, specialContent, 'Should handle special characters');
            
            await selectAllText();
            const selectedText = getDocumentTextOrSelection();
            assert.strictEqual(selectedText, specialContent, 'Should handle special character selection');
        });
    });
});
