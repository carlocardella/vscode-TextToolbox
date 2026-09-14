import { window, Selection, env } from "vscode";
import {
    createNewEditor,
    getDocumentTextOrSelection,
    getSelection,
    getActiveEditor,
    getDocumentEOL,
    getLinesFromSelection,
} from "./helpers";

/**
 * Options for enhanced duplicate removal
 */
export interface DuplicateRemovalOptions {
    keepFirst: boolean;           // true = keep first occurrence, false = keep last
    caseSensitive: boolean;       // true = case sensitive comparison
    trimWhitespace: boolean;      // true = trim whitespace before comparison
}

/**
 * Options for truncating lines
 */
export interface TruncateOptions {
    maxLength: number;
    addEllipsis: boolean;
    ellipsisCountsInLength: boolean;  // true = ellipsis counts toward maxLength, false = ellipsis is additional
    openInNewEditor: boolean;
}

/**
 * Options for CSV to Markdown table conversion
 */
export interface CsvToMarkdownOptions {
    delimiter: string;
    useFirstRowAsHeaders: boolean;
    customHeaders?: string[];
    openInNewEditor: boolean;
}

/**
 * Options for Markdown table to CSV conversion
 */
export interface MarkdownToCsvOptions {
    delimiter: string;
    includeHeaders: boolean;
    openInNewEditor: boolean;
}

/**
 * Advanced prefix/suffix pattern types
 */
export enum PatternType {
    NUMBER = 'n',              // {n} = 1, 2, 3, ...
    LOWERCASE_LETTER = 'i',    // {i} = a, b, c, ...
    UPPERCASE_LETTER = 'I',    // {I} = A, B, C, ...
    LOWERCASE_ROMAN = 'r',     // {r} = i, ii, iii, ...
    UPPERCASE_ROMAN = 'R',     // {R} = I, II, III, ...
    DATE = 'date',             // {date} = current date
    TIME = 'time',             // {time} = current time
    LINE = 'line'              // {line} = line number
}

/**
 * Transpose data by converting rows to columns and vice versa
 * Supports CSV, TSV, and custom delimiter formats
 * @param delimiter The delimiter to use for splitting (default: tab)
 * @param openInNewEditor Whether to open result in new editor
 */
export async function transposeData(delimiter: string = '\t', openInNewEditor: boolean = false): Promise<void> {
    const text = getDocumentTextOrSelection();
    if (!text) {
        window.showErrorMessage('No text selected or document is empty');
        return;
    }

    const eol = getDocumentEOL(getActiveEditor());
    const lines = text.split(eol).filter(line => line.trim() !== '');
    
    if (lines.length === 0) {
        window.showErrorMessage('No data to transpose');
        return;
    }

    // Split each line by delimiter
    const matrix: string[][] = lines.map(line => line.split(delimiter));
    
    // Find the maximum number of columns
    const maxColumns = Math.max(...matrix.map(row => row.length));
    
    // Pad shorter rows with empty strings
    matrix.forEach(row => {
        while (row.length < maxColumns) {
            row.push('');
        }
    });

    // Transpose the matrix
    const transposed: string[][] = [];
    for (let col = 0; col < maxColumns; col++) {
        const newRow: string[] = [];
        for (let row = 0; row < matrix.length; row++) {
            newRow.push(matrix[row][col]);
        }
        transposed.push(newRow);
    }

    // Convert back to text
    const result = transposed.map(row => row.join(delimiter)).join(eol);

    if (openInNewEditor) {
        createNewEditor(result);
    } else {
        const editor = getActiveEditor();
        if (!editor) {
            return;
        }
        
        const selection = getSelection(editor);
        if (!selection) {
            return;
        }

        editor.edit((editBuilder) => {
            editBuilder.replace(selection, result);
        });
    }
}

/**
 * Transpose data from rows to columns
 * Optimized for row-based data (like CSV with multiple records)
 * @param openInNewEditor Whether to open result in new editor
 */
export async function transposeRowsToColumns(openInNewEditor: boolean = false): Promise<void> {
    const delimiter = await askForTransposeDelimiter();
    if (delimiter !== undefined) {
        await transposeData(delimiter, openInNewEditor);
    }
}

/**
 * Transpose data from columns to rows  
 * Optimized for column-based data (like headers with values below)
 * @param openInNewEditor Whether to open result in new editor
 */
export async function transposeColumnsToRows(openInNewEditor: boolean = false): Promise<void> {
    const delimiter = await askForTransposeDelimiter();
    if (delimiter !== undefined) {
        await transposeData(delimiter, openInNewEditor);
    }
}

/**
 * Transpose data from rows to columns with specified delimiter (for testing)
 * @param delimiter The delimiter to use
 * @param openInNewEditor Whether to open result in new editor
 */
export async function transposeRowsToColumnsWithDelimiter(delimiter: string, openInNewEditor: boolean = false): Promise<void> {
    await transposeData(delimiter, openInNewEditor);
}

/**
 * Transpose data from columns to rows with specified delimiter (for testing)
 * @param delimiter The delimiter to use
 * @param openInNewEditor Whether to open result in new editor
 */
export async function transposeColumnsToRowsWithDelimiter(delimiter: string, openInNewEditor: boolean = false): Promise<void> {
    await transposeData(delimiter, openInNewEditor);
}

/**
 * Reverse the order of lines in the selection or document
 * @param openInNewEditor Whether to open result in new editor
 */
export async function reverseListOrder(openInNewEditor: boolean = false): Promise<void> {
    const text = getDocumentTextOrSelection();
    if (!text) {
        window.showErrorMessage('No text selected or document is empty');
        return;
    }

    const eol = getDocumentEOL(getActiveEditor());
    const lines = text.split(eol);
    
    // Reverse the array of lines
    const reversedLines = lines.reverse();
    const result = reversedLines.join(eol);

    if (openInNewEditor) {
        createNewEditor(result);
    } else {
        const editor = getActiveEditor();
        if (!editor) {
            return;
        }
        
        const selection = getSelection(editor);
        if (!selection) {
            return;
        }

        editor.edit((editBuilder) => {
            editBuilder.replace(selection, result);
        });
    }
}

/**
 * Truncate each line to a specified maximum length
 * @param options Truncate options including max length and ellipsis
 */
export async function truncateLines(options: TruncateOptions): Promise<void> {
    const text = getDocumentTextOrSelection();
    if (!text) {
        window.showErrorMessage('No text selected or document is empty');
        return;
    }

    const eol = getDocumentEOL(getActiveEditor());
    const lines = text.split(eol);
    
    const truncatedLines = lines.map(line => {
        if (line.length <= options.maxLength) {
            return line;
        }
        
        if (!options.addEllipsis) {
            return line.substring(0, options.maxLength);
        }
        
        const ellipsis = '...';
        let maxContentLength: number;
        
        if (options.ellipsisCountsInLength) {
            // Ellipsis counts within max length: content + "..." = maxLength
            maxContentLength = options.maxLength - ellipsis.length;
            if (maxContentLength <= 0) {
                return ellipsis.substring(0, options.maxLength);
            }
        } else {
            // Ellipsis is additional: content = maxLength, total = maxLength + 3
            maxContentLength = options.maxLength;
        }
        
        return line.substring(0, maxContentLength) + ellipsis;
    });

    const result = truncatedLines.join(eol);

    if (options.openInNewEditor) {
        createNewEditor(result);
    } else {
        const editor = getActiveEditor();
        if (!editor) {
            return;
        }
        
        const selection = getSelection(editor);
        if (!selection) {
            return;
        }

        editor.edit((editBuilder) => {
            editBuilder.replace(selection, result);
        });
    }
}

/**
 * Enhanced duplicate removal with advanced options
 * @param options Options for duplicate removal behavior
 * @param openInNewEditor Whether to open result in new editor
 */
export async function enhancedRemoveDuplicates(options: DuplicateRemovalOptions, openInNewEditor: boolean = false): Promise<void> {
    const text = getDocumentTextOrSelection();
    if (!text) {
        window.showErrorMessage('No text selected or document is empty');
        return;
    }

    const eol = getDocumentEOL(getActiveEditor());
    const lines = text.split(eol);
    
    // Process lines based on options
    const processedLines = lines.map(line => {
        let processed = line;
        
        if (options.trimWhitespace) {
            processed = processed.trim();
        }
        
        if (!options.caseSensitive) {
            processed = processed.toLowerCase();
        }
        
        return processed;
    });

    // Track seen lines and their original indices
    const seen = new Set<string>();
    const result: string[] = [];
    
    if (options.keepFirst) {
        // Keep first occurrence of each duplicate
        for (let i = 0; i < lines.length; i++) {
            const processed = processedLines[i];
            if (!seen.has(processed)) {
                seen.add(processed);
                result.push(lines[i]);
            }
        }
    } else {
        // Keep last occurrence of each duplicate
        // Process in reverse to identify last occurrences
        const lastOccurrences = new Set<number>();
        const seenReverse = new Set<string>();
        
        for (let i = lines.length - 1; i >= 0; i--) {
            const processed = processedLines[i];
            if (!seenReverse.has(processed)) {
                seenReverse.add(processed);
                lastOccurrences.add(i);
            }
        }
        
        // Build result in original order
        for (let i = 0; i < lines.length; i++) {
            if (lastOccurrences.has(i)) {
                result.push(lines[i]);
            }
        }
    }

    const resultText = result.join(eol);

    if (openInNewEditor) {
        createNewEditor(resultText);
    } else {
        const editor = getActiveEditor();
        if (!editor) {
            return;
        }
        
        const selection = getSelection(editor);
        if (!selection) {
            return;
        }

        editor.edit((editBuilder) => {
            editBuilder.replace(selection, resultText);
        });
    }
}

/**
 * Convert Roman numerals (basic implementation for small numbers)
 */
function toRoman(num: number, uppercase: boolean = true): string {
    const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
    const letters = uppercase ? 
        ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'] :
        ['m', 'cm', 'd', 'cd', 'c', 'xc', 'l', 'xl', 'x', 'ix', 'v', 'iv', 'i'];
    
    let result = '';
    for (let i = 0; i < values.length; i++) {
        while (num >= values[i]) {
            result += letters[i];
            num -= values[i];
        }
    }
    return result;
}

/**
 * Enhanced pattern processor with extended syntax support
 * Supports: {n:start:step:format}, {i:start}, {I:start}, etc.
 * @internal - exported for testing purposes
 */
export function processEnhancedPattern(pattern: string, lineIndex: number): string {
    let processedPattern = pattern;
    const now = new Date();
    
    // Enhanced number patterns: {n}, {n:start}, {n:start:step}, {n:start:step:format}
    processedPattern = processedPattern.replace(/\{n(?::(\d*))?(?::(\d*))?(?::([^}]+))?\}/g, (match, start = '1', step = '1', format) => {
        const startNum = parseInt(start || '1', 10);
        const stepNum = parseInt(step || '1', 10);
        const value = startNum + (lineIndex * stepNum);
        
        if (format) {
            return formatNumber(value, format);
        }
        return value.toString();
    });
    
    // Enhanced letter patterns: {i}, {i:start}, {I}, {I:start}
    processedPattern = processedPattern.replace(/\{i(?::([a-z]))?\}/g, (match, startChar = 'a') => {
        const startCode = startChar.charCodeAt(0) - 97; // Convert to 0-based index
        const letterIndex = (startCode + lineIndex) % 26;
        return String.fromCharCode(97 + letterIndex);
    });
    
    processedPattern = processedPattern.replace(/\{I(?::([A-Z]))?\}/g, (match, startChar = 'A') => {
        const startCode = startChar.charCodeAt(0) - 65; // Convert to 0-based index
        const letterIndex = (startCode + lineIndex) % 26;
        return String.fromCharCode(65 + letterIndex);
    });
    
    // Enhanced Roman patterns: {r}, {r:start}, {R}, {R:start}
    processedPattern = processedPattern.replace(/\{r(?::(\d*))?\}/g, (match, start = '1') => {
        const startNum = parseInt(start || '1', 10);
        const value = startNum + lineIndex;
        return toRoman(value, false);
    });
    
    processedPattern = processedPattern.replace(/\{R(?::(\d*))?\}/g, (match, start = '1') => {
        const startNum = parseInt(start || '1', 10);
        const value = startNum + lineIndex;
        return toRoman(value, true);
    });
    
    // Legacy simple patterns (for backward compatibility)
    processedPattern = processedPattern.replace(/\{date\}/g, now.toLocaleDateString());
    processedPattern = processedPattern.replace(/\{time\}/g, now.toLocaleTimeString());
    processedPattern = processedPattern.replace(/\{line\}/g, (lineIndex + 1).toString());
    
    return processedPattern;
}

/**
 * Format number with padding and base conversion
 * Supports formats like: 05d (5 digits with leading zeros), 04x (4 digit hex), etc.
 * @internal - exported for testing purposes
 */
export function formatNumber(value: number, format: string): string {
    // Parse format: [padding][width][type]
    const formatMatch = format.match(/^0?(\d+)?([dxob]?)$/);
    
    if (!formatMatch) {
        return value.toString(); // Fallback to simple string
    }
    
    const [, width, type] = formatMatch;
    const widthNum = width ? parseInt(width, 10) : 0;
    
    let result: string;
    
    switch (type) {
        case 'x':
            result = value.toString(16);
            break;
        case 'X':
            result = value.toString(16).toUpperCase();
            break;
        case 'o':
            result = value.toString(8);
            break;
        case 'b':
            result = value.toString(2);
            break;
        case 'd':
        default:
            result = value.toString(10);
            break;
    }
    
    // Apply padding if width specified and format starts with 0
    if (widthNum > 0 && format.startsWith('0')) {
        result = result.padStart(widthNum, '0');
    }
    
    return result;
}

/**
 * Advanced prefix/suffix operations with pattern support
 * @param pattern The pattern string containing placeholders
 * @param type Whether to add as prefix or suffix
 * @param openInNewEditor Whether to open result in new editor
 */
export async function advancedPrefixSuffix(pattern: string, type: 'prefix' | 'suffix', openInNewEditor: boolean = false): Promise<void> {
    const text = getDocumentTextOrSelection();
    if (!text) {
        window.showErrorMessage('No text selected or document is empty');
        return;
    }

    const eol = getDocumentEOL(getActiveEditor());
    const lines = text.split(eol);
    
    const result: string[] = [];
    const now = new Date();
    
    for (let i = 0; i < lines.length; i++) {
        // Use enhanced pattern processing
        const processedPattern = processEnhancedPattern(pattern, i);
        
        // Apply prefix or suffix
        if (type === 'prefix') {
            result.push(processedPattern + lines[i]);
        } else {
            result.push(lines[i] + processedPattern);
        }
    }

    const resultText = result.join(eol);

    if (openInNewEditor) {
        createNewEditor(resultText);
    } else {
        const editor = getActiveEditor();
        if (!editor) {
            return;
        }
        
        const selection = getSelection(editor);
        if (!selection) {
            return;
        }

        editor.edit((editBuilder) => {
            editBuilder.replace(selection, resultText);
        });
    }
}

/**
 * Convert CSV data to Markdown table format
 * @param options Options for CSV conversion including delimiter and header handling
 */
export async function csvToMarkdownTable(options: CsvToMarkdownOptions): Promise<void> {
    const text = getDocumentTextOrSelection();
    if (!text) {
        window.showErrorMessage('No text selected or document is empty');
        return;
    }

    const eol = getDocumentEOL(getActiveEditor());
    const lines = text.split(eol).filter(line => line.trim().length > 0);
    
    if (lines.length === 0) {
        window.showErrorMessage('No data found to convert');
        return;
    }

    // Parse CSV data
    const rows = lines.map(line => parseCSVLine(line, options.delimiter));
    
    if (rows.length === 0) {
        window.showErrorMessage('Unable to parse CSV data');
        return;
    }

    // Determine headers
    let headers: string[];
    let dataRows: string[][];

    if (options.useFirstRowAsHeaders) {
        headers = rows[0];
        dataRows = rows.slice(1);
    } else if (options.customHeaders && options.customHeaders.length > 0) {
        headers = options.customHeaders;
        dataRows = rows;
    } else {
        // Generate default headers (Column 1, Column 2, etc.)
        const maxColumns = Math.max(...rows.map(row => row.length));
        headers = Array.from({ length: maxColumns }, (_, i) => `Column ${i + 1}`);
        dataRows = rows;
    }

    // Ensure all data rows have the same number of columns as headers
    const normalizedDataRows = dataRows.map(row => {
        const normalizedRow = [...row];
        while (normalizedRow.length < headers.length) {
            normalizedRow.push('');
        }
        return normalizedRow.slice(0, headers.length);
    });

    // Create Markdown table
    const markdownTable = createMarkdownTable(headers, normalizedDataRows);

    if (options.openInNewEditor) {
        createNewEditor(markdownTable);
    } else {
        const editor = getActiveEditor();
        if (!editor) {
            return;
        }
        
        const selection = getSelection(editor);
        if (!selection) {
            return;
        }

        editor.edit((editBuilder) => {
            editBuilder.replace(selection, markdownTable);
        });
    }
}

/**
 * Parse a CSV line respecting quotes and escaped delimiters
 */
function parseCSVLine(line: string, delimiter: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    let i = 0;

    while (i < line.length) {
        const char = line[i];
        const nextChar = line[i + 1];

        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                // Escaped quote
                current += '"';
                i += 2;
            } else {
                // Toggle quote state
                inQuotes = !inQuotes;
                i++;
            }
        } else if (char === delimiter && !inQuotes) {
            // Delimiter outside quotes
            result.push(current.trim());
            current = '';
            i++;
        } else {
            current += char;
            i++;
        }
    }

    // Add the last field
    result.push(current.trim());
    
    return result;
}

/**
 * Create a Markdown table from headers and data rows
 */
function createMarkdownTable(headers: string[], dataRows: string[][]): string {
    if (headers.length === 0) {
        return '';
    }

    // Calculate column widths for better formatting
    const columnWidths = headers.map(header => header.length);
    
    dataRows.forEach(row => {
        row.forEach((cell, index) => {
            if (index < columnWidths.length) {
                columnWidths[index] = Math.max(columnWidths[index], cell.length);
            }
        });
    });

    // Ensure minimum width of 3 for separator row
    columnWidths.forEach((width, index) => {
        columnWidths[index] = Math.max(width, 3);
    });

    // Create header row
    const headerRow = '| ' + headers.map((header, index) => 
        header.padEnd(columnWidths[index])
    ).join(' | ') + ' |';

    // Create separator row
    const separatorRow = '| ' + columnWidths.map(width => 
        '-'.repeat(width)
    ).join(' | ') + ' |';

    // Create data rows
    const tableDataRows = dataRows.map(row => 
        '| ' + row.map((cell, index) => 
            cell.padEnd(columnWidths[index])
        ).join(' | ') + ' |'
    );

    return [headerRow, separatorRow, ...tableDataRows].join('\n');
}

/**
 * Ask user for transpose delimiter with common options
 */
export async function askForTransposeDelimiter(): Promise<string | undefined> {
    const delimiter = await window.showQuickPick([
        { label: 'Tab', description: 'Tab character (\\t)', detail: 'Most common for TSV files', value: '\t' },
        { label: 'Comma', description: 'Comma (,)', detail: 'Most common for CSV files', value: ',' },
        { label: 'Space', description: 'Single space', detail: 'Space-separated values', value: ' ' },
        { label: 'Semicolon', description: 'Semicolon (;)', detail: 'Alternative CSV delimiter', value: ';' },
        { label: 'Pipe', description: 'Pipe character (|)', detail: 'Pipe-separated values', value: '|' },
        { label: 'Custom...', description: 'Enter custom delimiter', value: 'custom' }
    ], {
        placeHolder: 'Select delimiter for transpose operation',
        matchOnDescription: true
    });

    if (!delimiter) {
        return undefined;
    }

    if (delimiter.value === 'custom') {
        return await window.showInputBox({
            prompt: 'Enter custom delimiter',
            placeHolder: 'e.g., ::, --, etc.'
        });
    }

    return delimiter.value;
}

/**
 * Ask user for truncate options
 */
export async function askForTruncateOptions(): Promise<TruncateOptions | undefined> {
    const maxLengthInput = await window.showInputBox({
        prompt: 'Enter maximum line length',
        placeHolder: 'e.g., 50, 100, 200',
        validateInput: (value) => {
            const num = parseInt(value);
            if (isNaN(num) || num <= 0) {
                return 'Please enter a positive number';
            }
            return null;
        }
    });

    if (!maxLengthInput) {
        return undefined;
    }

    const maxLength = parseInt(maxLengthInput);

    const addEllipsis = await window.showQuickPick([
        { label: 'Yes', description: 'Add "..." to truncated lines', value: true },
        { label: 'No', description: 'Cut off without indication', value: false }
    ], {
        placeHolder: 'Add ellipsis (...) to truncated lines?'
    });

    if (addEllipsis === undefined) {
        return undefined;
    }

    let ellipsisCountsInLength = true;
    if (addEllipsis.value) {
        const ellipsisOption = await window.showQuickPick([
            { label: 'Ellipsis counts within max length', description: 'Total line length = max length (including "...")', value: true },
            { label: 'Ellipsis is additional', description: 'Content = max length + "..." (3 extra chars)', value: false }
        ], {
            placeHolder: 'How should ellipsis (...) count toward the length limit?'
        });

        if (ellipsisOption === undefined) {
            return undefined;
        }
        ellipsisCountsInLength = ellipsisOption.value;
    }

    const openInNewEditor = await window.showQuickPick([
        { label: 'Replace in current editor', description: 'Modify current selection', value: false },
        { label: 'Open in new editor', description: 'Keep original and open result in new tab', value: true }
    ], {
        placeHolder: 'Where to show the result?'
    });

    if (openInNewEditor === undefined) {
        return undefined;
    }

    return {
        maxLength,
        addEllipsis: addEllipsis.value,
        ellipsisCountsInLength,
        openInNewEditor: openInNewEditor.value
    };
}

/**
 * Ask user for duplicate removal options
 */
export async function askForDuplicateOptions(): Promise<DuplicateRemovalOptions | undefined> {
    const keepFirst = await window.showQuickPick([
        { label: 'Keep First', description: 'Keep the first occurrence of duplicates', value: true },
        { label: 'Keep Last', description: 'Keep the last occurrence of duplicates', value: false }
    ], {
        placeHolder: 'Which occurrence of duplicates to keep?'
    });

    if (keepFirst === undefined) {
        return undefined;
    }

    const caseSensitive = await window.showQuickPick([
        { label: 'Case Sensitive', description: '"Hello" and "hello" are different', value: true },
        { label: 'Case Insensitive', description: '"Hello" and "hello" are the same', value: false }
    ], {
        placeHolder: 'How to handle case differences?'
    });

    if (caseSensitive === undefined) {
        return undefined;
    }

    const trimWhitespace = await window.showQuickPick([
        { label: 'Trim Whitespace', description: 'Remove leading/trailing spaces before comparing', value: true },
        { label: 'Keep Whitespace', description: 'Include whitespace in comparison', value: false }
    ], {
        placeHolder: 'How to handle whitespace?'
    });

    if (trimWhitespace === undefined) {
        return undefined;
    }

    return {
        keepFirst: keepFirst.value,
        caseSensitive: caseSensitive.value,
        trimWhitespace: trimWhitespace.value
    };
}

/**
 * Ask user for prefix/suffix pattern
 */
export async function askForPrefixSuffixPattern(): Promise<{ pattern: string; type: 'prefix' | 'suffix' } | undefined> {
    const type = await window.showQuickPick([
        { label: 'Prefix', description: 'Add pattern at the beginning of each line', value: 'prefix' as const },
        { label: 'Suffix', description: 'Add pattern at the end of each line', value: 'suffix' as const }
    ], {
        placeHolder: 'Add as prefix or suffix?'
    });

    if (!type) {
        return undefined;
    }

    const pattern = await window.showInputBox({
        prompt: 'Enter pattern (Enhanced: {n:start:step:format}, {i:start}, {r:start}, etc.)',
        placeHolder: 'e.g., "{n}. ", "{n:10:5:03d} ", "{i:c} ", "{R:1} "',
        value: type.value === 'prefix' ? '{n}. ' : ' - {date}'
    });

    if (!pattern) {
        return undefined;
    }

    return {
        pattern,
        type: type.value
    };
}

/**
 * Ask user for CSV to Markdown table conversion options
 */
export async function askForCsvToMarkdownOptions(): Promise<CsvToMarkdownOptions | undefined> {
    // Ask for delimiter
    const delimiter = await window.showQuickPick([
        { label: 'Comma (,)', description: 'Standard CSV format', value: ',' },
        { label: 'Semicolon (;)', description: 'European CSV format', value: ';' },
        { label: 'Tab', description: 'Tab-separated values (TSV)', value: '\t' },
        { label: 'Pipe (|)', description: 'Pipe-separated values', value: '|' },
        { label: 'Custom...', description: 'Enter your own delimiter', value: 'custom' }
    ], {
        placeHolder: 'Choose the delimiter used in your CSV data'
    });

    if (!delimiter) {
        return undefined;
    }

    let finalDelimiter = delimiter.value;
    if (delimiter.value === 'custom') {
        const customDelimiter = await window.showInputBox({
            prompt: 'Enter the custom delimiter',
            placeHolder: 'e.g., ":", " ", "||"',
            validateInput: (value) => {
                if (!value || value.length === 0) {
                    return 'Delimiter cannot be empty';
                }
                return null;
            }
        });

        if (!customDelimiter) {
            return undefined;
        }
        finalDelimiter = customDelimiter;
    }

    // Ask about headers
    const headerOption = await window.showQuickPick([
        { label: 'Use first row as headers', description: 'First row contains column names', value: 'first-row' },
        { label: 'Enter custom headers', description: 'Specify your own column names', value: 'custom' },
        { label: 'Generate default headers', description: 'Use "Column 1", "Column 2", etc.', value: 'default' }
    ], {
        placeHolder: 'How do you want to handle table headers?'
    });

    if (!headerOption) {
        return undefined;
    }

    let useFirstRowAsHeaders = false;
    let customHeaders: string[] | undefined;

    if (headerOption.value === 'first-row') {
        useFirstRowAsHeaders = true;
    } else if (headerOption.value === 'custom') {
        const headersInput = await window.showInputBox({
            prompt: 'Enter column headers separated by commas',
            placeHolder: 'e.g., "Name, Age, Email, Department"',
            validateInput: (value) => {
                if (!value || value.trim().length === 0) {
                    return 'Headers cannot be empty';
                }
                return null;
            }
        });

        if (!headersInput) {
            return undefined;
        }

        customHeaders = headersInput.split(',').map(header => header.trim());
    }

    // Ask where to show result
    const openInNewEditor = await window.showQuickPick([
        { label: 'Replace in current editor', description: 'Replace selected text with Markdown table', value: false },
        { label: 'Open in new editor', description: 'Keep original and open result in new tab', value: true }
    ], {
        placeHolder: 'Where to show the Markdown table?'
    });

    if (openInNewEditor === undefined) {
        return undefined;
    }

    return {
        delimiter: finalDelimiter,
        useFirstRowAsHeaders,
        customHeaders,
        openInNewEditor: openInNewEditor.value
    };
}

/**
 * Parse a Markdown table into headers and data rows
 */
function parseMarkdownTable(markdownTable: string): { headers: string[], dataRows: string[][] } | null {
    const lines = markdownTable.trim().split('\n').map(line => line.trim());
    
    if (lines.length < 2) {
        return null; // Need at least header and separator rows
    }

    // Find header row (first row that looks like a table row)
    let headerRowIndex = -1;
    let separatorRowIndex = -1;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.startsWith('|') && line.endsWith('|')) {
            if (headerRowIndex === -1) {
                headerRowIndex = i;
            } else if (separatorRowIndex === -1) {
                // Check if this looks like a separator row (contains mainly dashes, colons, spaces, and pipes)
                const content = line.slice(1, -1); // Remove outer pipes
                if (/^[\s\-:|]+$/.test(content) && content.includes('-')) {
                    separatorRowIndex = i;
                    break;
                }
            }
        }
    }

    if (headerRowIndex === -1 || separatorRowIndex === -1) {
        return null; // Not a valid Markdown table
    }

    // Parse header row
    const headerLine = lines[headerRowIndex];
    const headers = headerLine
        .slice(1, -1) // Remove leading and trailing |
        .split('|')
        .map(cell => cell.trim());

    // Parse data rows (everything after separator row)
    const dataRows: string[][] = [];
    for (let i = separatorRowIndex + 1; i < lines.length; i++) {
        const line = lines[i];
        if (line.startsWith('|') && line.endsWith('|')) {
            const cells = line
                .slice(1, -1) // Remove leading and trailing |
                .split('|')
                .map(cell => cell.trim());
            
            // Pad or truncate cells to match header count
            while (cells.length < headers.length) {
                cells.push('');
            }
            cells.length = headers.length;
            
            dataRows.push(cells);
        }
    }

    return { headers, dataRows };
}

/**
 * Create CSV from table headers and data rows
 */
function createCsvFromTable(headers: string[], dataRows: string[][], delimiter: string, includeHeaders: boolean): string {
    const csvRows: string[] = [];
    
    // Add headers if requested
    if (includeHeaders) {
        csvRows.push(headers.map(header => escapeCsvField(header, delimiter)).join(delimiter));
    }
    
    // Add data rows
    dataRows.forEach(row => {
        csvRows.push(row.map(cell => escapeCsvField(cell, delimiter)).join(delimiter));
    });
    
    return csvRows.join('\n');
}

/**
 * Escape a CSV field if it contains the delimiter, quotes, or newlines
 */
function escapeCsvField(field: string, delimiter: string): string {
    if (field.includes(delimiter) || field.includes('"') || field.includes('\n') || field.includes('\r')) {
        // Escape quotes by doubling them and wrap in quotes
        return '"' + field.replace(/"/g, '""') + '"';
    }
    return field;
}

/**
 * Convert a Markdown table to CSV format
 */
export async function markdownTableToCsv(options: MarkdownToCsvOptions): Promise<void> {
    const text = getDocumentTextOrSelection();
    if (!text) {
        window.showErrorMessage('No text selected or document is empty');
        return;
    }

    // Parse the Markdown table
    const parsed = parseMarkdownTable(text);
    if (!parsed) {
        window.showErrorMessage('Selected text does not contain a valid Markdown table');
        return;
    }

    // Convert to CSV
    const csvContent = createCsvFromTable(parsed.headers, parsed.dataRows, options.delimiter, options.includeHeaders);

    if (options.openInNewEditor) {
        createNewEditor(csvContent);
    } else {
        const editor = getActiveEditor();
        if (!editor) {
            return;
        }
        
        const selection = getSelection(editor);
        if (!selection) {
            return;
        }

        editor.edit((editBuilder) => {
            editBuilder.replace(selection, csvContent);
        });
    }
}

/**
 * Ask user for Markdown table to CSV conversion options
 */
export async function askForMarkdownToCsvOptions(): Promise<MarkdownToCsvOptions | undefined> {
    // Ask for delimiter
    const delimiter = await window.showQuickPick([
        { label: 'Comma (,)', description: 'Standard CSV format', value: ',' },
        { label: 'Semicolon (;)', description: 'European CSV format', value: ';' },
        { label: 'Tab', description: 'Tab-separated values (TSV)', value: '\t' },
        { label: 'Pipe (|)', description: 'Pipe-separated values', value: '|' },
        { label: 'Custom...', description: 'Enter your own delimiter', value: 'custom' }
    ], {
        placeHolder: 'Choose the delimiter for your CSV output'
    });

    if (!delimiter) {
        return undefined;
    }

    let finalDelimiter = delimiter.value;
    if (delimiter.value === 'custom') {
        const customDelimiter = await window.showInputBox({
            prompt: 'Enter the custom delimiter',
            placeHolder: 'e.g., ":", " ", "||"',
            validateInput: (value) => {
                if (!value || value.length === 0) {
                    return 'Delimiter cannot be empty';
                }
                return null;
            }
        });

        if (!customDelimiter) {
            return undefined;
        }
        finalDelimiter = customDelimiter;
    }

    // Ask about including headers
    const includeHeaders = await window.showQuickPick([
        { label: 'Include headers', description: 'First row will contain column names', value: true },
        { label: 'Data only', description: 'Export only data rows', value: false }
    ], {
        placeHolder: 'Include table headers in CSV output?'
    });

    if (includeHeaders === undefined) {
        return undefined;
    }

    // Ask where to show result
    const openInNewEditor = await window.showQuickPick([
        { label: 'Replace in current editor', description: 'Replace selected table with CSV', value: false },
        { label: 'Open in new editor', description: 'Keep original and open CSV in new tab', value: true }
    ], {
        placeHolder: 'Where to show the CSV output?'
    });

    if (openInNewEditor === undefined) {
        return undefined;
    }

    return {
        delimiter: finalDelimiter,
        includeHeaders: includeHeaders.value,
        openInNewEditor: openInNewEditor.value
    };
}

/**
 * Interface for clipboard table data
 */
interface ClipboardTableData {
    delimiter: string;
    headers: string[];
    dataRows: string[][];
}

/**
 * Detect the most likely delimiter from a set of delimiters
 */
function detectDelimiter(text: string): string {
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    if (lines.length === 0) {
        return ','; // Default to comma
    }

    // Common delimiters in order of preference
    const delimiters = ['\t', ',', ';', '|', ' '];
    const delimiterCounts: { [key: string]: number } = {};

    // Count occurrences of each delimiter across all lines
    delimiters.forEach(delimiter => {
        const counts = lines.map(line => (line.split(delimiter).length - 1));
        
        // Check if the delimiter consistently appears across lines
        const firstLineCount = counts[0];
        const consistentCount = counts.every(count => count === firstLineCount && count > 0);
        
        if (consistentCount) {
            delimiterCounts[delimiter] = firstLineCount;
        } else {
            delimiterCounts[delimiter] = 0;
        }
    });

    // Find the delimiter with the highest consistent count
    let bestDelimiter = ',';
    let maxCount = 0;
    
    Object.entries(delimiterCounts).forEach(([delimiter, count]) => {
        if (count > maxCount) {
            maxCount = count;
            bestDelimiter = delimiter;
        }
    });

    return bestDelimiter;
}

/**
 * Parse clipboard content and extract table data with detected delimiter
 */
function parseClipboardTableData(text: string): ClipboardTableData | null {
    if (!text || text.trim().length === 0) {
        return null;
    }

    const delimiter = detectDelimiter(text);
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    
    if (lines.length === 0) {
        return null;
    }

    // Parse all lines using the detected delimiter
    const allRows = lines.map(line => parseCSVLine(line, delimiter));
    
    if (allRows.length === 0) {
        return null;
    }

    // Use first row as headers
    const headers = allRows[0];
    const dataRows = allRows.slice(1);

    return {
        delimiter,
        headers,
        dataRows
    };
}

/**
 * Paste clipboard content as a Markdown table
 * Automatically detects delimiter and uses first row as headers
 */
export async function pasteAsMarkdownTable(): Promise<void> {
    try {
        // Read clipboard content
        const clipboardText = await env.clipboard.readText();
        
        if (!clipboardText || clipboardText.trim().length === 0) {
            window.showErrorMessage('Clipboard is empty or contains no text');
            return;
        }

        // Parse clipboard content
        const tableData = parseClipboardTableData(clipboardText);
        
        if (!tableData) {
            window.showErrorMessage('Unable to parse clipboard content as table data');
            return;
        }

        // Create Markdown table
        const markdownTable = createMarkdownTable(tableData.headers, tableData.dataRows);
        
        if (!markdownTable) {
            window.showErrorMessage('Failed to create Markdown table');
            return;
        }

        // Insert at cursor position
        const editor = getActiveEditor();
        if (!editor) {
            window.showErrorMessage('No active editor');
            return;
        }

        const position = editor.selection.active;
        
        editor.edit((editBuilder) => {
            editBuilder.insert(position, markdownTable);
        });

        // Show success message with detected delimiter info
        const delimiterName = tableData.delimiter === '\t' ? 'Tab' : 
                             tableData.delimiter === ',' ? 'Comma' :
                             tableData.delimiter === ';' ? 'Semicolon' :
                             tableData.delimiter === '|' ? 'Pipe' :
                             tableData.delimiter === ' ' ? 'Space' :
                             `"${tableData.delimiter}"`;
        
        window.showInformationMessage(
            `Pasted as Markdown table (${tableData.headers.length} columns, ${tableData.dataRows.length} rows, delimiter: ${delimiterName})`
        );

    } catch (error) {
        window.showErrorMessage(`Failed to paste as Markdown table: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}