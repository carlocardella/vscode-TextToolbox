import * as assert from "assert";
import { before, after, describe } from "mocha";
import { sleep, createNewEditor, selectAllText, getDocumentTextOrSelection, closeTextEditor, linesToLine, getActiveEditor, getDocumentEOL } from "../../modules/helpers";
import { 
    transposeData,
    transposeRowsToColumnsWithDelimiter,
    transposeColumnsToRowsWithDelimiter,
    reverseListOrder,
    truncateLines,
    enhancedRemoveDuplicates,
    advancedPrefixSuffix,
    DuplicateRemovalOptions,
    TruncateOptions
} from "../../modules/advancedListConverter";

describe("advancedListConverter", () => {
    before(() => {
        console.log("Starting advancedListConverter tests");
    });
    after(async () => {
        await sleep(500);
        await closeTextEditor(true);
        console.log("All advancedListConverter tests done");
    });

    describe("Transpose Data", () => {
        it("Transpose CSV data with comma delimiter", async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const csvData = `Name,Age,City${eol}John,25,New York${eol}Jane,30,Boston${eol}Bob,35,Chicago`;
            const expectedTransposed = `Name,John,Jane,Bob${eol}Age,25,30,35${eol}City,New York,Boston,Chicago`;
            
            await createNewEditor(csvData);
            await selectAllText();
            await transposeData(',', false);
            await sleep(500);

            let result = getDocumentTextOrSelection();
            assert.strictEqual(result, expectedTransposed);
        });

        it("Transpose TSV data with tab delimiter", async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const tsvData = `Name\tAge\tCity${eol}John\t25\tNew York${eol}Jane\t30\tBoston`;
            const expectedTransposed = `Name\tJohn\tJane${eol}Age\t25\t30${eol}City\tNew York\tBoston`;
            
            await createNewEditor(tsvData);
            await selectAllText();
            await transposeData('\t', false);
            await sleep(500);

            let result = getDocumentTextOrSelection();
            assert.strictEqual(result, expectedTransposed);
        });

        it("Transpose irregular data (different column counts)", async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const irregularData = `A,B,C${eol}1,2${eol}X,Y,Z,W`;
            const expectedTransposed = `A,1,X${eol}B,2,Y${eol}C,,Z${eol},,W`;
            
            await createNewEditor(irregularData);
            await selectAllText();
            await transposeData(',', false);
            await sleep(500);

            let result = getDocumentTextOrSelection();
            assert.strictEqual(result, expectedTransposed);
        });

        it("Transpose single column data", async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const singleColumn = `Line1${eol}Line2${eol}Line3`;
            const expectedTransposed = `Line1,Line2,Line3`;
            
            await createNewEditor(singleColumn);
            await selectAllText();
            await transposeData(',', false);
            await sleep(500);

            let result = getDocumentTextOrSelection();
            assert.strictEqual(result, expectedTransposed);
        });

        it("Handle empty lines in transpose", async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const dataWithEmpty = `A,B${eol}${eol}1,2${eol}X,Y`;
            const expectedTransposed = `A,1,X${eol}B,2,Y`;
            
            await createNewEditor(dataWithEmpty);
            await selectAllText();
            await transposeData(',', false);
            await sleep(500);

            let result = getDocumentTextOrSelection();
            assert.strictEqual(result, expectedTransposed);
        });
    });

    describe("Directional Transpose", () => {
        it("Transpose rows to columns (wrapper function)", async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const csvData = `Name,Age,City${eol}John,25,NYC${eol}Jane,30,LA`;
            const expectedTransposed = `Name,John,Jane${eol}Age,25,30${eol}City,NYC,LA`;
            
            await createNewEditor(csvData);
            await selectAllText();
            await transposeRowsToColumnsWithDelimiter(',', false);
            await sleep(500);

            let result = getDocumentTextOrSelection();
            assert.strictEqual(result, expectedTransposed);
        });

        it("Transpose columns to rows (wrapper function)", async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const columnData = `Name,John,Jane${eol}Age,25,30${eol}City,NYC,LA`;
            const expectedTransposed = `Name,Age,City${eol}John,25,NYC${eol}Jane,30,LA`;
            
            await createNewEditor(columnData);
            await selectAllText();
            await transposeColumnsToRowsWithDelimiter(',', false);
            await sleep(500);

            let result = getDocumentTextOrSelection();
            assert.strictEqual(result, expectedTransposed);
        });
    });

    describe("Reverse List Order", () => {
        it("Reverse simple list", async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const originalList = `First${eol}Second${eol}Third${eol}Fourth`;
            const expectedReversed = `Fourth${eol}Third${eol}Second${eol}First`;
            
            await createNewEditor(originalList);
            await selectAllText();
            await reverseListOrder(false);
            await sleep(500);

            let result = getDocumentTextOrSelection();
            assert.strictEqual(result, expectedReversed);
        });

        it("Reverse list with empty lines", async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const listWithEmpty = `Line1${eol}${eol}Line2${eol}Line3${eol}`;
            const expectedReversed = `${eol}Line3${eol}Line2${eol}${eol}Line1`;
            
            await createNewEditor(listWithEmpty);
            await selectAllText();
            await reverseListOrder(false);
            await sleep(500);

            let result = getDocumentTextOrSelection();
            assert.strictEqual(result, expectedReversed);
        });

        it("Reverse single line", async () => {
            await createNewEditor();
            const singleLine = `OnlyLine`;
            
            await createNewEditor(singleLine);
            await selectAllText();
            await reverseListOrder(false);
            await sleep(500);

            let result = getDocumentTextOrSelection();
            assert.strictEqual(result, singleLine);
        });
    });

    describe("Truncate Lines", () => {
        it("Truncate lines with ellipsis", async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const longLines = `This is a very long line that should be truncated${eol}Short${eol}Another very long line that exceeds the limit`;
            const options: TruncateOptions = {
                maxLength: 20,
                addEllipsis: true,
                openInNewEditor: false
            };
            const expectedTruncated = `This is a very lo...${eol}Short${eol}Another very long...`;
            
            await createNewEditor(longLines);
            await selectAllText();
            await truncateLines(options);
            await sleep(500);

            let result = getDocumentTextOrSelection();
            assert.strictEqual(result, expectedTruncated);
        });

        it("Truncate lines without ellipsis", async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const longLines = `This is a very long line${eol}Short line${eol}Another long line`;
            const options: TruncateOptions = {
                maxLength: 15,
                addEllipsis: false,
                openInNewEditor: false
            };
            const expectedTruncated = `This is a very ${eol}Short line${eol}Another long li`;
            
            await createNewEditor(longLines);
            await selectAllText();
            await truncateLines(options);
            await sleep(500);

            let result = getDocumentTextOrSelection();
            assert.strictEqual(result, expectedTruncated);
        });

        it("Handle lines shorter than max length", async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const shortLines = `Short${eol}Line${eol}Test`;
            const options: TruncateOptions = {
                maxLength: 20,
                addEllipsis: true,
                openInNewEditor: false
            };
            
            await createNewEditor(shortLines);
            await selectAllText();
            await truncateLines(options);
            await sleep(500);

            let result = getDocumentTextOrSelection();
            assert.strictEqual(result, shortLines);
        });

        it("Handle edge case with max length smaller than ellipsis", async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const longLine = `Very long line`;
            const options: TruncateOptions = {
                maxLength: 2,
                addEllipsis: true,
                openInNewEditor: false
            };
            const expectedResult = `...`;
            
            await createNewEditor(longLine);
            await selectAllText();
            await truncateLines(options);
            await sleep(500);

            let result = getDocumentTextOrSelection();
            assert.strictEqual(result, expectedResult);
        });
    });

    describe("Enhanced Remove Duplicates", () => {
        it("Remove duplicates keeping first occurrence", async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const duplicateLines = `Apple${eol}Banana${eol}Apple${eol}Cherry${eol}Banana${eol}Date`;
            const options: DuplicateRemovalOptions = {
                keepFirst: true,
                caseSensitive: true,
                trimWhitespace: false
            };
            const expectedResult = `Apple${eol}Banana${eol}Cherry${eol}Date`;
            
            await createNewEditor(duplicateLines);
            await selectAllText();
            await enhancedRemoveDuplicates(options, false);
            await sleep(500);

            let result = getDocumentTextOrSelection();
            assert.strictEqual(result, expectedResult);
        });

        it("Remove duplicates keeping last occurrence", async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const duplicateLines = `Apple${eol}Banana${eol}Apple${eol}Cherry${eol}Banana${eol}Date`;
            const options: DuplicateRemovalOptions = {
                keepFirst: false,
                caseSensitive: true,
                trimWhitespace: false
            };
            const expectedResult = `Apple${eol}Cherry${eol}Banana${eol}Date`;
            
            await createNewEditor(duplicateLines);
            await selectAllText();
            await enhancedRemoveDuplicates(options, false);
            await sleep(500);

            let result = getDocumentTextOrSelection();
            assert.strictEqual(result, expectedResult);
        });

        it("Remove duplicates case insensitive", async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const duplicateLines = `Apple${eol}BANANA${eol}apple${eol}Cherry${eol}banana${eol}Date`;
            const options: DuplicateRemovalOptions = {
                keepFirst: true,
                caseSensitive: false,
                trimWhitespace: false
            };
            const expectedResult = `Apple${eol}BANANA${eol}Cherry${eol}Date`;
            
            await createNewEditor(duplicateLines);
            await selectAllText();
            await enhancedRemoveDuplicates(options, false);
            await sleep(500);

            let result = getDocumentTextOrSelection();
            assert.strictEqual(result, expectedResult);
        });

        it("Remove duplicates with whitespace trimming", async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const duplicateLines = `  Apple  ${eol}Banana${eol}Apple${eol}  Cherry  ${eol}Cherry${eol}Date`;
            const options: DuplicateRemovalOptions = {
                keepFirst: true,
                caseSensitive: true,
                trimWhitespace: true
            };
            const expectedResult = `  Apple  ${eol}Banana${eol}  Cherry  ${eol}Date`;
            
            await createNewEditor(duplicateLines);
            await selectAllText();
            await enhancedRemoveDuplicates(options, false);
            await sleep(500);

            let result = getDocumentTextOrSelection();
            assert.strictEqual(result, expectedResult);
        });

        it("Handle complex duplicate scenario", async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const complexDuplicates = `  apple  ${eol}APPLE${eol}  APPLE  ${eol}Banana${eol}apple${eol}Cherry`;
            const options: DuplicateRemovalOptions = {
                keepFirst: false,
                caseSensitive: false,
                trimWhitespace: true
            };
            // Since keepFirst: false, we keep the LAST occurrence of each duplicate
            // The last "apple" variant is "apple" (5th line), so it appears after Banana
            const expectedResult = `Banana${eol}apple${eol}Cherry`;
            
            await createNewEditor(complexDuplicates);
            await selectAllText();
            await enhancedRemoveDuplicates(options, false);
            await sleep(500);

            let result = getDocumentTextOrSelection();
            assert.strictEqual(result, expectedResult);
        });
    });

    describe("Advanced Prefix/Suffix", () => {
        it("Add numbered prefix", async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const originalLines = `First item${eol}Second item${eol}Third item`;
            const expectedResult = `1. First item${eol}2. Second item${eol}3. Third item`;
            
            await createNewEditor(originalLines);
            await selectAllText();
            await advancedPrefixSuffix('{n}. ', 'prefix', false);
            await sleep(500);

            let result = getDocumentTextOrSelection();
            assert.strictEqual(result, expectedResult);
        });

        it("Add lowercase letter prefix", async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const originalLines = `First${eol}Second${eol}Third`;
            const expectedResult = `a) First${eol}b) Second${eol}c) Third`;
            
            await createNewEditor(originalLines);
            await selectAllText();
            await advancedPrefixSuffix('{i}) ', 'prefix', false);
            await sleep(500);

            let result = getDocumentTextOrSelection();
            assert.strictEqual(result, expectedResult);
        });

        it("Add uppercase letter prefix", async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const originalLines = `Item${eol}Thing${eol}Object`;
            const expectedResult = `A. Item${eol}B. Thing${eol}C. Object`;
            
            await createNewEditor(originalLines);
            await selectAllText();
            await advancedPrefixSuffix('{I}. ', 'prefix', false);
            await sleep(500);

            let result = getDocumentTextOrSelection();
            assert.strictEqual(result, expectedResult);
        });

        it("Add Roman numeral prefix (lowercase)", async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const originalLines = `Chapter${eol}Section${eol}Part`;
            const expectedResult = `i. Chapter${eol}ii. Section${eol}iii. Part`;
            
            await createNewEditor(originalLines);
            await selectAllText();
            await advancedPrefixSuffix('{r}. ', 'prefix', false);
            await sleep(500);

            let result = getDocumentTextOrSelection();
            assert.strictEqual(result, expectedResult);
        });

        it("Add Roman numeral prefix (uppercase)", async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const originalLines = `Book${eol}Volume${eol}Edition`;
            const expectedResult = `I. Book${eol}II. Volume${eol}III. Edition`;
            
            await createNewEditor(originalLines);
            await selectAllText();
            await advancedPrefixSuffix('{R}. ', 'prefix', false);
            await sleep(500);

            let result = getDocumentTextOrSelection();
            assert.strictEqual(result, expectedResult);
        });

        it("Add line number suffix", async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const originalLines = `First line${eol}Second line${eol}Third line`;
            const expectedResult = `First line (line 1)${eol}Second line (line 2)${eol}Third line (line 3)`;
            
            await createNewEditor(originalLines);
            await selectAllText();
            await advancedPrefixSuffix(' (line {line})', 'suffix', false);
            await sleep(500);

            let result = getDocumentTextOrSelection();
            assert.strictEqual(result, expectedResult);
        });

        it("Test date and time patterns", async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const originalLines = `Task 1${eol}Task 2`;
            
            await createNewEditor(originalLines);
            await selectAllText();
            await advancedPrefixSuffix('{date} - ', 'prefix', false);
            await sleep(500);

            let result = getDocumentTextOrSelection();
            assert.ok(result, 'Result should not be undefined');
            const lines = result!.split(eol);
            
            // Check that date pattern was replaced (should not contain {date})
            assert.ok(!lines[0].includes('{date}'), 'Date pattern should be replaced');
            assert.ok(!lines[1].includes('{date}'), 'Date pattern should be replaced');
            
            // Check that lines start with date and contain original content
            assert.ok(lines[0].includes('Task 1'), 'Should contain original content');
            assert.ok(lines[1].includes('Task 2'), 'Should contain original content');
        });

        it("Handle cycling letters beyond 26", async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            // Create 28 lines to test cycling
            const lines = Array.from({length: 28}, (_, i) => `Item ${i + 1}`);
            const originalLines = lines.join(eol);
            
            await createNewEditor(originalLines);
            await selectAllText();
            await advancedPrefixSuffix('{i}. ', 'prefix', false);
            await sleep(500);

            let result = getDocumentTextOrSelection();
            assert.ok(result, 'Result should not be undefined');
            const resultLines = result!.split(eol);
            
            // Check first few lines
            assert.ok(resultLines[0].startsWith('a. '), 'First line should start with a.');
            assert.ok(resultLines[25].startsWith('z. '), '26th line should start with z.');
            assert.ok(resultLines[26].startsWith('a. '), '27th line should cycle back to a.');
            assert.ok(resultLines[27].startsWith('b. '), '28th line should be b.');
        });

        it("Test complex pattern with multiple placeholders", async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const originalLines = `Task${eol}Goal${eol}Objective`;
            
            await createNewEditor(originalLines);
            await selectAllText();
            await advancedPrefixSuffix('[{n}] {I}: ', 'prefix', false);
            await sleep(500);

            let result = getDocumentTextOrSelection();
            assert.ok(result, 'Result should not be undefined');
            const expectedStart1 = '[1] A: Task';
            const expectedStart2 = '[2] B: Goal';
            const expectedStart3 = '[3] C: Objective';
            
            const lines = result!.split(eol);
            assert.strictEqual(lines[0], expectedStart1);
            assert.strictEqual(lines[1], expectedStart2);
            assert.strictEqual(lines[2], expectedStart3);
        });
    });

    describe("Edge Cases and Error Handling", () => {
        it("Handle empty document for transpose", async () => {
            await createNewEditor();
            await createNewEditor('');
            await selectAllText();
            
            // Should not throw error and should handle gracefully
            await transposeData(',', false);
            await sleep(500);

            let result = getDocumentTextOrSelection();
            assert.strictEqual(result, '');
        });

        it("Handle empty document for reverse", async () => {
            await createNewEditor();
            await createNewEditor('');
            await selectAllText();
            
            await reverseListOrder(false);
            await sleep(500);

            let result = getDocumentTextOrSelection();
            assert.strictEqual(result, '');
        });

        it("Handle single empty line for all functions", async () => {
            await createNewEditor();
            const eol = getDocumentEOL(getActiveEditor());
            const emptyLine = `${eol}`;
            
            await createNewEditor(emptyLine);
            await selectAllText();
            await reverseListOrder(false);
            await sleep(500);

            let result = getDocumentTextOrSelection();
            assert.strictEqual(result, emptyLine);
        });
    });
});