import * as assert from "assert";
import * as vscode from "vscode";
import {
    IndentationType,
    updateIndentation,
    setEditorOptionsContext
} from "../../modules/indentation";

describe("Indentation Module", () => {
    let editor: vscode.TextEditor;
    let document: vscode.TextDocument;

    beforeEach(async () => {
        // Create a document with various indentation scenarios
        const content = [
            "function example() {",
            "    let variable = 'value';", // 4 spaces
            "\tlet tabbed = 'tab';", // 1 tab
            "  let twoSpaces = 'two';", // 2 spaces
            "        let eightSpaces = 'eight';", // 8 spaces
            "    if (condition) {", // 4 spaces
            "        return true;", // 8 spaces
            "\t\treturn false;", // 2 tabs
            "    }", // 4 spaces
            "}", // no indentation
            "", // empty line
            "// Comment line",
            "    // Indented comment"
        ].join("\n");

        document = await vscode.workspace.openTextDocument({
            content: content,
            language: "javascript"
        });
        editor = await vscode.window.showTextDocument(document);
    });

    afterEach(async () => {
        await vscode.commands.executeCommand("workbench.action.closeActiveEditor");
    });

    describe("IndentationType enum", () => {
        it("should have correct enum values", () => {
            assert.strictEqual(IndentationType.Spaces, "spaces");
            assert.strictEqual(IndentationType.Tabs, "tabs");
        });
    });

    describe("updateIndentation", () => {
        it("should convert tabs to 2 spaces", async () => {
            // Set initial tab size
            if (editor.options) {
                editor.options.tabSize = 4;
                editor.options.insertSpaces = false;
            }

            updateIndentation(editor, IndentationType.Spaces, 2);

            // Wait for edit to complete
            await new Promise(resolve => setTimeout(resolve, 100));

            const newContent = editor.document.getText();
            const lines = newContent.split("\n");

            // Check that tabs were converted to 2 spaces
            assert.ok(lines[2].startsWith("  let tabbed"), "Tab should be converted to 2 spaces");
            assert.ok(lines[7].startsWith("    return false"), "Double tab should be converted to 4 spaces");
            
            // Verify editor options were updated
            if (editor.options) {
                assert.strictEqual(editor.options.tabSize, 2);
                assert.strictEqual(editor.options.insertSpaces, true);
            }
        });

        it("should convert tabs to 4 spaces", async () => {
            if (editor.options) {
                editor.options.tabSize = 2;
                editor.options.insertSpaces = false;
            }

            updateIndentation(editor, IndentationType.Spaces, 4);

            await new Promise(resolve => setTimeout(resolve, 100));

            const newContent = editor.document.getText();
            const lines = newContent.split("\n");

            // Check that tabs were converted to 4 spaces
            assert.ok(lines[2].startsWith("    let tabbed"), "Tab should be converted to 4 spaces");
            assert.ok(lines[7].startsWith("        return false"), "Double tab should be converted to 8 spaces");
            
            if (editor.options) {
                assert.strictEqual(editor.options.tabSize, 4);
                assert.strictEqual(editor.options.insertSpaces, true);
            }
        });

        it("should convert 4 spaces to 2 spaces", async () => {
            if (editor.options) {
                editor.options.tabSize = 4;
                editor.options.insertSpaces = true;
            }

            updateIndentation(editor, IndentationType.Spaces, 2);

            await new Promise(resolve => setTimeout(resolve, 100));

            const newContent = editor.document.getText();
            const lines = newContent.split("\n");

            // Check that 4 spaces were converted to 2 spaces
            assert.ok(lines[1].startsWith("  let variable"), "4 spaces should be converted to 2 spaces");
            assert.ok(lines[5].startsWith("  if (condition)"), "4 spaces should be converted to 2 spaces");
            assert.ok(lines[6].startsWith("    return true"), "8 spaces should be converted to 4 spaces");
            
            if (editor.options) {
                assert.strictEqual(editor.options.tabSize, 2);
                assert.strictEqual(editor.options.insertSpaces, true);
            }
        });

        it("should convert 2 spaces to 4 spaces", async () => {
            if (editor.options) {
                editor.options.tabSize = 2;
                editor.options.insertSpaces = true;
            }

            updateIndentation(editor, IndentationType.Spaces, 4);

            await new Promise(resolve => setTimeout(resolve, 100));

            const newContent = editor.document.getText();
            const lines = newContent.split("\n");

            // Check that 2 spaces were converted to 4 spaces
            assert.ok(lines[3].startsWith("    let twoSpaces"), "2 spaces should be converted to 4 spaces");
            
            if (editor.options) {
                assert.strictEqual(editor.options.tabSize, 4);
                assert.strictEqual(editor.options.insertSpaces, true);
            }
        });

        it("should not change anything when indentation size matches current tab size", async () => {
            const originalContent = editor.document.getText();
            if (editor.options) {
                editor.options.tabSize = 4;
            }

            updateIndentation(editor, IndentationType.Spaces, 4);

            await new Promise(resolve => setTimeout(resolve, 100));

            const newContent = editor.document.getText();
            assert.strictEqual(newContent, originalContent, "Content should remain unchanged");
        });

        it("should handle mixed indentation correctly", async () => {
            if (editor.options) {
                editor.options.tabSize = 4;
            }
            editor.options.insertSpaces = false;

            updateIndentation(editor, IndentationType.Spaces, 2);

            await new Promise(resolve => setTimeout(resolve, 100));

            const newContent = editor.document.getText();
            const lines = newContent.split("\n");

            // Verify all different indentation types were handled
            assert.ok(lines[1].startsWith("  let variable"), "4 spaces -> 2 spaces");
            assert.ok(lines[2].startsWith("  let tabbed"), "1 tab -> 2 spaces");
            assert.ok(lines[3].startsWith("  let twoSpaces"), "2 spaces -> 2 spaces");
            assert.ok(lines[4].startsWith("    let eightSpaces"), "8 spaces -> 4 spaces");
        });

        it("should preserve selection correctly", async () => {
            const initialSelection = editor.selection;
            
            updateIndentation(editor, IndentationType.Spaces, 2);

            await new Promise(resolve => setTimeout(resolve, 100));

            // Check that selection was reset to cursor position
            assert.ok(editor.selection.isEmpty, "Selection should be empty (cursor only)");
            assert.ok(editor.selection.active.isEqual(editor.selection.anchor), "Active and anchor should be the same");
        });

        it("should handle empty lines correctly", async () => {
            updateIndentation(editor, IndentationType.Spaces, 2);

            await new Promise(resolve => setTimeout(resolve, 100));

            const lines = editor.document.getText().split("\n");
            
            // Empty line should remain empty
            assert.strictEqual(lines[10], "", "Empty line should remain empty");
        });

        it("should handle lines with only whitespace", async () => {
            // Create a document with whitespace-only lines
            const contentWithWhitespace = [
                "function test() {",
                "    let x = 1;",
                "    ", // line with 4 spaces only
                "\t", // line with tab only
                "}"
            ].join("\n");

            const docWithWhitespace = await vscode.workspace.openTextDocument({
                content: contentWithWhitespace,
                language: "javascript"
            });
            const editorWithWhitespace = await vscode.window.showTextDocument(docWithWhitespace);

            updateIndentation(editorWithWhitespace, IndentationType.Spaces, 2);

            await new Promise(resolve => setTimeout(resolve, 100));

            const lines = editorWithWhitespace.document.getText().split("\n");
            
            // Whitespace-only lines should be converted too
            assert.strictEqual(lines[2], "  ", "Whitespace-only line should be converted");
            assert.strictEqual(lines[3], "  ", "Tab-only line should be converted");
        });

        it("should update tab options for tabs indentation type", () => {
            editor.options.tabSize = 4;
            editor.options.insertSpaces = true;

            updateIndentation(editor, IndentationType.Tabs, 2);

            assert.strictEqual(editor.options.tabSize, 2);
            assert.strictEqual(editor.options.insertSpaces, false);
        });
    });

    describe("setEditorOptionsContext", () => {
        it("should execute setContext commands for tab size and insert spaces", () => {
            editor.options.tabSize = 4;
            editor.options.insertSpaces = true;

            // This function executes VS Code commands, we can't easily test the exact calls
            // but we can verify it doesn't throw errors
            assert.doesNotThrow(() => {
                setEditorOptionsContext(editor);
            });
        });

        it("should handle tab indentation settings without errors", () => {
            editor.options.tabSize = 2;
            editor.options.insertSpaces = false;

            assert.doesNotThrow(() => {
                setEditorOptionsContext(editor);
            });
        });

        it("should handle undefined editor gracefully", () => {
            // This test checks that the function doesn't crash with undefined
            assert.doesNotThrow(() => {
                setEditorOptionsContext(undefined as any);
            });
        });

        it("should work with different tab size values", () => {
            const tabSizes = [1, 2, 4, 8];
            
            tabSizes.forEach(tabSize => {
                editor.options.tabSize = tabSize;
                editor.options.insertSpaces = true;
                
                assert.doesNotThrow(() => {
                    setEditorOptionsContext(editor);
                }, `Should handle tab size ${tabSize} without errors`);
            });
        });
    });

    describe("Integration tests", () => {
        it("should handle complex indentation scenarios", async () => {
            // Create a complex document with nested structures
            const complexContent = [
                "class Example {",
                "\tconstructor() {", // 1 tab
                "\t\tthis.value = {", // 2 tabs
                "\t\t\tproperty: 'value',", // 3 tabs
                "\t\t\tnested: {", // 3 tabs
                "\t\t\t\tdeep: true", // 4 tabs
                "\t\t\t}", // 3 tabs
                "\t\t};", // 2 tabs
                "\t}", // 1 tab
                "", // empty line
                "\tmethod() {", // 1 tab
                "\t\tif (condition) {", // 2 tabs
                "\t\t\treturn this.value;", // 3 tabs
                "\t\t}", // 2 tabs
                "\t}", // 1 tab
                "}"
            ].join("\n");

            const complexDoc = await vscode.workspace.openTextDocument({
                content: complexContent,
                language: "typescript"
            });
            const complexEditor = await vscode.window.showTextDocument(complexDoc);

            // Convert tabs to 2 spaces
            updateIndentation(complexEditor, IndentationType.Spaces, 2);

            await new Promise(resolve => setTimeout(resolve, 150));

            const lines = complexEditor.document.getText().split("\n");

            // Verify the complex nested structure is properly converted
            assert.ok(lines[1].startsWith("  constructor()"), "1 tab -> 2 spaces");
            assert.ok(lines[2].startsWith("    this.value"), "2 tabs -> 4 spaces");
            assert.ok(lines[3].startsWith("      property:"), "3 tabs -> 6 spaces");
            assert.ok(lines[5].startsWith("        deep:"), "4 tabs -> 8 spaces");
            assert.ok(lines[12].startsWith("      return"), "3 tabs -> 6 spaces");

            // Verify editor options
            assert.strictEqual(complexEditor.options.tabSize, 2);
            assert.strictEqual(complexEditor.options.insertSpaces, true);
        });

        it("should maintain code functionality after indentation changes", async () => {
            // Create a simple function and verify it still works after indentation change
            const functionContent = [
                "function add(a, b) {",
                "    return a + b;",
                "}",
                "",
                "const result = add(2, 3);"
            ].join("\n");

            const funcDoc = await vscode.workspace.openTextDocument({
                content: functionContent,
                language: "javascript"
            });
            const funcEditor = await vscode.window.showTextDocument(funcDoc);

            updateIndentation(funcEditor, IndentationType.Spaces, 2);

            await new Promise(resolve => setTimeout(resolve, 100));

            const newContent = funcEditor.document.getText();
            
            // Verify the function structure is maintained
            assert.ok(newContent.includes("function add(a, b) {"));
            assert.ok(newContent.includes("  return a + b;"));
            assert.ok(newContent.includes("}"));
            assert.ok(newContent.includes("const result = add(2, 3);"));
        });

        it("should work with different programming languages", async () => {
            const pythonContent = [
                "def fibonacci(n):",
                "    if n <= 1:",
                "        return n",
                "    else:",
                "        return fibonacci(n-1) + fibonacci(n-2)"
            ].join("\n");

            const pythonDoc = await vscode.workspace.openTextDocument({
                content: pythonContent,
                language: "python"
            });
            const pythonEditor = await vscode.window.showTextDocument(pythonDoc);

            updateIndentation(pythonEditor, IndentationType.Spaces, 2);

            await new Promise(resolve => setTimeout(resolve, 100));

            const lines = pythonEditor.document.getText().split("\n");
            
            // Python typically uses 4 spaces, but we're converting to 2
            assert.ok(lines[1].startsWith("  if n <= 1:"));
            assert.ok(lines[2].startsWith("    return n"));
            assert.ok(lines[4].startsWith("    return fibonacci"));
        });
    });

    describe("Performance tests", () => {
        it("should handle large files efficiently", async function() {
            this.timeout(5000);

            // Create a large file with many indented lines
            const largeContent = Array.from({length: 1000}, (_, i) => {
                const indentLevel = i % 10;
                const indent = "\t".repeat(indentLevel);
                return `${indent}line ${i} with ${indentLevel} tabs`;
            }).join("\n");

            const largeDoc = await vscode.workspace.openTextDocument({
                content: largeContent,
                language: "plaintext"
            });
            const largeEditor = await vscode.window.showTextDocument(largeDoc);

            const start = Date.now();
            updateIndentation(largeEditor, IndentationType.Spaces, 2);
            
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const duration = Date.now() - start;
            assert.ok(duration < 2000, `Large file processing took ${duration}ms, should be under 2000ms`);

            // Verify some lines were properly converted
            const lines = largeEditor.document.getText().split("\n");
            assert.ok(lines[1].startsWith("  line 1"), "Line with 1 tab should have 2 spaces");
            assert.ok(lines[5].startsWith("          line 5"), "Line with 5 tabs should have 10 spaces");
        });

        it("should handle rapid successive indentation changes", async function() {
            this.timeout(3000);

            const start = Date.now();

            // Perform multiple indentation changes rapidly
            updateIndentation(editor, IndentationType.Spaces, 2);
            await new Promise(resolve => setTimeout(resolve, 50));
            
            updateIndentation(editor, IndentationType.Spaces, 4);
            await new Promise(resolve => setTimeout(resolve, 50));
            
            updateIndentation(editor, IndentationType.Spaces, 2);
            await new Promise(resolve => setTimeout(resolve, 50));
            
            const duration = Date.now() - start;
            assert.ok(duration < 1000, `Rapid indentation changes took ${duration}ms, should be under 1000ms`);

            // Verify final state
            assert.strictEqual(editor.options.tabSize, 2);
            assert.strictEqual(editor.options.insertSpaces, true);
        });
    });

    describe("Edge cases", () => {
        it("should handle documents with only empty lines", async () => {
            const emptyLinesContent = "\n\n\n\n\n";
            
            const emptyDoc = await vscode.workspace.openTextDocument({
                content: emptyLinesContent,
                language: "plaintext"
            });
            const emptyEditor = await vscode.window.showTextDocument(emptyDoc);

            assert.doesNotThrow(() => {
                updateIndentation(emptyEditor, IndentationType.Spaces, 2);
            });

            await new Promise(resolve => setTimeout(resolve, 100));

            const newContent = emptyEditor.document.getText();
            assert.strictEqual(newContent, emptyLinesContent, "Empty lines should remain unchanged");
        });

        it("should handle single character lines", async () => {
            const singleCharContent = [
                "{",
                "\ta",
                "\tb",
                "}"
            ].join("\n");

            const singleCharDoc = await vscode.workspace.openTextDocument({
                content: singleCharContent,
                language: "plaintext"
            });
            const singleCharEditor = await vscode.window.showTextDocument(singleCharDoc);

            updateIndentation(singleCharEditor, IndentationType.Spaces, 2);

            await new Promise(resolve => setTimeout(resolve, 100));

            const lines = singleCharEditor.document.getText().split("\n");
            assert.ok(lines[1].startsWith("  a"));
            assert.ok(lines[2].startsWith("  b"));
        });

        it("should handle lines with special characters", async () => {
            const specialContent = [
                "// Special chars: äöü",
                "\t// Umlauts: ßØ",
                "\t/* Block comment */",
                "\t// Emoji: 🚀 ⭐ 💻"
            ].join("\n");

            const specialDoc = await vscode.workspace.openTextDocument({
                content: specialContent,
                language: "javascript"
            });
            const specialEditor = await vscode.window.showTextDocument(specialDoc);

            updateIndentation(specialEditor, IndentationType.Spaces, 2);

            await new Promise(resolve => setTimeout(resolve, 100));

            const lines = specialEditor.document.getText().split("\n");
            assert.ok(lines[1].includes("Umlauts: ßØ"));
            assert.ok(lines[3].includes("🚀 ⭐ 💻"));
            assert.ok(lines[1].startsWith("  // Umlauts"));
        });
    });
});
