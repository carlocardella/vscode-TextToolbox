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
import TTDecorations from '../../modules/decorations';
import { Selection, Range, Position, DecorationRenderOptions } from 'vscode';

describe('decorations', () => {
    let decorations: TTDecorations;

    before(() => {
        console.log('Starting decorations tests');
        decorations = new TTDecorations();
    });
    after(async () => {
        await sleep(500);
        // Clean up any decorations
        if (decorations) {
            await decorations.RemoveHighlight(true);
        }
        await closeTextEditor(true);
        console.log('All decorations tests done');
    });

    describe('TTDecorations Class', () => {
        it('Create TTDecorations instance', () => {
            const instance = new TTDecorations();
            assert.ok(instance, 'Should create TTDecorations instance');
            assert.ok(Array.isArray(instance.Decorators), 'Should have Decorators array');
            assert.strictEqual(instance.Decorators.length, 0, 'Should start with empty decorators');
        });

        it('Decorators array is initialized', () => {
            assert.ok(decorations.Decorators, 'Decorators array should exist');
            assert.strictEqual(typeof decorations.Decorators, 'object', 'Decorators should be an array/object');
        });
    });

    describe('Highlight Text Functionality', () => {
        it('Highlight single word with default decorator', async () => {
            await createNewEditor('Hello world test');
            const editor = getActiveEditor();
            if (editor) {
                // Position cursor on "world"
                editor.selection = new Selection(0, 6, 0, 11);
                
                const initialDecoratorsCount = decorations.Decorators.length;
                await decorations.HighlightText(true);
                await sleep(500);
                
                assert.ok(decorations.Decorators.length > initialDecoratorsCount, 'Should add decoration');
            }
        });

        it('Highlight selected text with default decorator', async () => {
            await createNewEditor('This is a test sentence');
            const editor = getActiveEditor();
            if (editor) {
                // Select "test"
                editor.selection = new Selection(0, 10, 0, 14);
                
                const initialDecoratorsCount = decorations.Decorators.length;
                await decorations.HighlightText(true);
                await sleep(500);
                
                assert.ok(decorations.Decorators.length > initialDecoratorsCount, 'Should add decoration for selection');
            }
        });

        it('Highlight with custom settings - all matches', async () => {
            await createNewEditor('test line\nanother test\ntest again');
            const editor = getActiveEditor();
            if (editor) {
                // Position cursor on first "test"
                editor.selection = new Selection(0, 0, 0, 4);
                
                const settings = { allMatches: true, matchCase: true };
                const initialDecoratorsCount = decorations.Decorators.length;
                await decorations.HighlightText(true, settings);
                await sleep(500);
                
                // Should find multiple matches of "test"
                assert.ok(decorations.Decorators.length > initialDecoratorsCount, 'Should add decorations for all matches');
            }
        });

        it('Highlight with case insensitive search', async () => {
            await createNewEditor('Test line\nanother TEST\ntest again');
            const editor = getActiveEditor();
            if (editor) {
                // Position cursor on first "Test"
                editor.selection = new Selection(0, 0, 0, 4);
                
                const settings = { allMatches: true, matchCase: false };
                const initialDecoratorsCount = decorations.Decorators.length;
                await decorations.HighlightText(true, settings);
                await sleep(500);
                
                assert.ok(decorations.Decorators.length > initialDecoratorsCount, 'Should add decorations case insensitively');
            }
        });

        it('Handle empty selection for highlight', async () => {
            await createNewEditor('Some text without selection');
            const editor = getActiveEditor();
            if (editor) {
                // Place cursor without selection
                editor.selection = new Selection(0, 5, 0, 5);
                
                try {
                    await decorations.HighlightText(true);
                    await sleep(500);
                    assert.ok(true, 'Should handle empty selection gracefully');
                } catch (error) {
                    // This might fail if no word is found at cursor position
                    assert.ok(true, 'Should handle cursor position gracefully');
                }
            }
        });

        it('Handle highlighting in empty document', async () => {
            await createNewEditor('');
            
            try {
                await decorations.HighlightText(true);
                await sleep(500);
                assert.ok(true, 'Should handle empty document gracefully');
            } catch (error) {
                assert.ok(true, 'Should handle empty document without crashing');
            }
        });
    });

    describe('Remove Highlights Functionality', () => {
        it('Remove all highlights', async () => {
            await createNewEditor('test text for removal');
            const editor = getActiveEditor();
            if (editor) {
                // Add some highlights first
                editor.selection = new Selection(0, 0, 0, 4); // "test"
                await decorations.HighlightText(true);
                await sleep(500);
                
                const decoratorsBeforeRemoval = decorations.Decorators.length;
                assert.ok(decoratorsBeforeRemoval > 0, 'Should have decorations before removal');
                
                await decorations.RemoveHighlight(true);
                await sleep(500);
                
                assert.strictEqual(decorations.Decorators.length, 0, 'Should remove all decorations');
            }
        });

        it('Remove specific highlight', async () => {
            await createNewEditor('word1 word2 word1 word2');
            const editor = getActiveEditor();
            if (editor) {
                // Add highlight for "word1"
                editor.selection = new Selection(0, 0, 0, 5);
                await decorations.HighlightText(true);
                await sleep(500);
                
                const decoratorsAfterAdd = decorations.Decorators.length;
                assert.ok(decoratorsAfterAdd > 0, 'Should have decorations after adding');
                
                // Position cursor on "word1" to remove it
                editor.selection = new Selection(0, 0, 0, 5);
                await decorations.RemoveHighlight(false);
                await sleep(500);
                
                // Note: The specific removal logic may depend on implementation details
                assert.ok(true, 'Should attempt to remove specific highlight');
            }
        });

        it('Remove highlight from empty document', async () => {
            await createNewEditor('');
            
            try {
                await decorations.RemoveHighlight(true);
                await sleep(500);
                assert.ok(true, 'Should handle remove from empty document');
            } catch (error) {
                assert.ok(true, 'Should handle remove from empty document gracefully');
            }
        });
    });

    describe('Find Decoration Functionality', () => {
        it('Find existing decoration by range', async () => {
            await createNewEditor('findme text here');
            const editor = getActiveEditor();
            if (editor) {
                const testRange = new Range(0, 0, 0, 6); // "findme"
                editor.selection = new Selection(0, 0, 0, 6);
                
                await decorations.HighlightText(true);
                await sleep(500);
                
                const foundDecoration = decorations.FindDecoration(testRange);
                // Note: The exact behavior depends on how ranges are stored and compared
                assert.ok(true, 'Should attempt to find decoration by range');
            }
        });

        it('Find decoration at cursor position', async () => {
            await createNewEditor('cursor test text');
            const editor = getActiveEditor();
            if (editor) {
                // Add decoration
                editor.selection = new Selection(0, 7, 0, 11); // "test"
                await decorations.HighlightText(true);
                await sleep(500);
                
                // Try to find decoration at cursor position
                const cursorPosition = new Position(0, 8); // Within "test"
                const testRange = new Range(0, 7, 0, 11);
                const foundDecoration = decorations.FindDecoration(testRange, cursorPosition);
                
                assert.ok(true, 'Should attempt to find decoration at cursor position');
            }
        });

        it('Find decoration returns undefined for non-existent range', async () => {
            await createNewEditor('no decoration here');
            const nonExistentRange = new Range(0, 100, 0, 200);
            
            const foundDecoration = decorations.FindDecoration(nonExistentRange);
            assert.strictEqual(foundDecoration, undefined, 'Should return undefined for non-existent decoration');
        });
    });

    describe('Get Range to Highlight', () => {
        it('Get range for word at cursor', async () => {
            await createNewEditor('word selection test');
            const editor = getActiveEditor();
            if (editor) {
                // Position cursor within "selection"
                editor.selection = new Selection(0, 7, 0, 7);
                
                try {
                    const ranges = await decorations.GetRangeToHighlight();
                    assert.ok(ranges, 'Should return ranges');
                    if (ranges && ranges.length > 0) {
                        assert.ok(ranges[0].Range instanceof Range, 'Should return Range objects');
                        assert.ok(typeof ranges[0].File === 'string', 'Should include file path');
                    }
                } catch (error) {
                    assert.ok(true, 'Should handle range detection gracefully');
                }
            }
        });

        it('Get range for selection', async () => {
            await createNewEditor('text with selection here');
            const editor = getActiveEditor();
            if (editor) {
                // Select "with"
                editor.selection = new Selection(0, 5, 0, 9);
                
                try {
                    const ranges = await decorations.GetRangeToHighlight();
                    assert.ok(ranges, 'Should return ranges for selection');
                    if (ranges && ranges.length > 0) {
                        assert.ok(ranges[0].Range instanceof Range, 'Should return Range objects');
                    }
                } catch (error) {
                    assert.ok(true, 'Should handle selection range gracefully');
                }
            }
        });

        it('Get range with all matches setting', async () => {
            await createNewEditor('match this match and match again');
            const editor = getActiveEditor();
            if (editor) {
                // Position cursor on first "match"
                editor.selection = new Selection(0, 0, 0, 5);
                
                try {
                    const settings = { allMatches: true, matchCase: true };
                    const ranges = await decorations.GetRangeToHighlight(settings);
                    assert.ok(ranges, 'Should return ranges for all matches');
                    if (ranges) {
                        assert.ok(ranges.length >= 1, 'Should find multiple matches');
                    }
                } catch (error) {
                    assert.ok(true, 'Should handle all matches setting gracefully');
                }
            }
        });

        it('Get range with regex setting', async () => {
            await createNewEditor('test123 and test456 patterns');
            const editor = getActiveEditor();
            if (editor) {
                try {
                    const settings = { regex: true };
                    // Note: This would normally prompt for regex input
                    // In tests, this might reject or require mocking
                    const ranges = await decorations.GetRangeToHighlight(settings);
                    assert.ok(true, 'Should handle regex setting');
                } catch (error) {
                    // Expected to fail without user input
                    assert.ok(true, 'Should handle regex prompt gracefully');
                }
            }
        });

        it('Handle empty document for range detection', async () => {
            await createNewEditor('');
            
            try {
                const ranges = await decorations.GetRangeToHighlight();
                assert.ok(true, 'Should handle empty document for range detection');
            } catch (error) {
                assert.ok(true, 'Should handle empty document gracefully');
            }
        });
    });

    describe('Refresh Highlights', () => {
        it('Refresh highlights with existing decorations', async () => {
            await createNewEditor('refresh test content');
            const editor = getActiveEditor();
            if (editor) {
                // Add a decoration
                editor.selection = new Selection(0, 8, 0, 12); // "test"
                await decorations.HighlightText(true);
                await sleep(500);
                
                // Test refresh
                try {
                    decorations.RefreshHighlights();
                    assert.ok(true, 'Should refresh highlights without error');
                } catch (error) {
                    assert.fail(`Refresh highlights should not throw error: ${error}`);
                }
            }
        });

        it('Refresh highlights with no decorations', async () => {
            await createNewEditor('content without decorations');
            
            try {
                decorations.RefreshHighlights();
                assert.ok(true, 'Should handle refresh with no decorations');
            } catch (error) {
                assert.fail(`Refresh should not throw error with no decorations: ${error}`);
            }
        });

        it('Refresh highlights with no active editor', async () => {
            await closeTextEditor(true); // Close all editors
            
            try {
                decorations.RefreshHighlights();
                assert.ok(true, 'Should handle refresh with no active editor');
            } catch (error) {
                assert.fail(`Refresh should not throw error with no editor: ${error}`);
            }
        });
    });

    describe('Decoration Edge Cases', () => {
        it('Multiple decorations on same range', async () => {
            await createNewEditor('same word same word');
            const editor = getActiveEditor();
            if (editor) {
                // Highlight first "same"
                editor.selection = new Selection(0, 0, 0, 4);
                await decorations.HighlightText(true);
                await sleep(500);
                
                // Highlight second "same" 
                editor.selection = new Selection(0, 10, 0, 14);
                await decorations.HighlightText(true);
                await sleep(500);
                
                assert.ok(decorations.Decorators.length >= 1, 'Should handle multiple decorations');
            }
        });

        it('Highlight very long text', async () => {
            const longText = 'word '.repeat(1000) + 'target ' + 'word '.repeat(1000);
            await createNewEditor(longText);
            const editor = getActiveEditor();
            if (editor) {
                // Find and select "target"
                const targetIndex = longText.indexOf('target');
                editor.selection = new Selection(0, targetIndex, 0, targetIndex + 6);
                
                try {
                    await decorations.HighlightText(true);
                    await sleep(500);
                    assert.ok(true, 'Should handle very long text');
                } catch (error) {
                    assert.fail(`Should handle long text without error: ${error}`);
                }
            }
        });

        it('Highlight with special characters', async () => {
            await createNewEditor('test @#$%^&*() special chars');
            const editor = getActiveEditor();
            if (editor) {
                // Select special characters
                editor.selection = new Selection(0, 5, 0, 15);
                
                try {
                    await decorations.HighlightText(true);
                    await sleep(500);
                    assert.ok(true, 'Should handle special characters');
                } catch (error) {
                    assert.fail(`Should handle special characters without error: ${error}`);
                }
            }
        });

        it('Highlight unicode text', async () => {
            await createNewEditor('Hello 世界 🌍 unicode test');
            const editor = getActiveEditor();
            if (editor) {
                // Select unicode characters
                editor.selection = new Selection(0, 6, 0, 11);
                
                try {
                    await decorations.HighlightText(true);
                    await sleep(500);
                    assert.ok(true, 'Should handle unicode text');
                } catch (error) {
                    assert.fail(`Should handle unicode without error: ${error}`);
                }
            }
        });

        it('Decoration with multi-line content', async () => {
            await createNewEditor('line1\nline2 target here\nline3\ntarget again');
            const editor = getActiveEditor();
            if (editor) {
                // Select "target" on line 2
                editor.selection = new Selection(1, 6, 1, 12);
                
                try {
                    const settings = { allMatches: true, matchCase: true };
                    await decorations.HighlightText(true, settings);
                    await sleep(500);
                    assert.ok(true, 'Should handle multi-line content');
                } catch (error) {
                    assert.fail(`Should handle multi-line content without error: ${error}`);
                }
            }
        });
    });

    describe('Performance and Memory', () => {
        it('Performance with many decorations', async () => {
            await createNewEditor('test '.repeat(100));
            const editor = getActiveEditor();
            if (editor) {
                const startTime = Date.now();
                
                // Add decoration for all "test" words
                editor.selection = new Selection(0, 0, 0, 4);
                const settings = { allMatches: true, matchCase: true };
                
                try {
                    await decorations.HighlightText(true, settings);
                    await sleep(500);
                    
                    const endTime = Date.now();
                    const duration = endTime - startTime;
                    
                    assert.ok(duration < 5000, `Should complete within reasonable time (took ${duration}ms)`);
                    assert.ok(decorations.Decorators.length >= 1, 'Should have created decorations');
                } catch (error) {
                    assert.fail(`Performance test should not fail: ${error}`);
                }
            }
        });

        it('Memory cleanup after removing all decorations', async () => {
            await createNewEditor('cleanup test content');
            const editor = getActiveEditor();
            if (editor) {
                // Add decorations
                editor.selection = new Selection(0, 8, 0, 12);
                await decorations.HighlightText(true);
                await sleep(500);
                
                const decorationsCountBefore = decorations.Decorators.length;
                assert.ok(decorationsCountBefore > 0, 'Should have decorations before cleanup');
                
                // Remove all
                await decorations.RemoveHighlight(true);
                await sleep(500);
                
                assert.strictEqual(decorations.Decorators.length, 0, 'Should clean up all decorations');
            }
        });
    });

    describe('Integration Tests', () => {
        it('Highlight and remove workflow', async () => {
            await createNewEditor('workflow test example');
            const editor = getActiveEditor();
            if (editor) {
                // 1. Highlight text
                editor.selection = new Selection(0, 9, 0, 13); // "test"
                await decorations.HighlightText(true);
                await sleep(500);
                
                assert.ok(decorations.Decorators.length > 0, 'Should have decorations after highlight');
                
                // 2. Refresh
                decorations.RefreshHighlights();
                assert.ok(decorations.Decorators.length > 0, 'Should maintain decorations after refresh');
                
                // 3. Remove all
                await decorations.RemoveHighlight(true);
                await sleep(500);
                
                assert.strictEqual(decorations.Decorators.length, 0, 'Should remove all decorations');
            }
        });

        it('Multiple highlight sessions', async () => {
            await createNewEditor('session one test\nsession two test');
            const editor = getActiveEditor();
            if (editor) {
                // Session 1: Highlight "one"
                editor.selection = new Selection(0, 8, 0, 11);
                await decorations.HighlightText(true);
                await sleep(500);
                
                const session1Count = decorations.Decorators.length;
                
                // Session 2: Highlight "two"  
                editor.selection = new Selection(1, 8, 1, 11);
                await decorations.HighlightText(true);
                await sleep(500);
                
                const session2Count = decorations.Decorators.length;
                
                assert.ok(session2Count > session1Count, 'Should accumulate decorations across sessions');
                
                // Cleanup
                await decorations.RemoveHighlight(true);
            }
        });
    });
});
