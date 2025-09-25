import { window } from "vscode";
import * as yaml from "js-yaml";
import MarkdownIt from "markdown-it";
import TurndownService from "turndown";
import * as TOML from "@iarna/toml";
import * as xml2js from "xml2js";
import {
    createNewEditor,
    getDocumentTextOrSelection,
    getActiveEditor,
    getSelection,
} from "./helpers";

/**
 * Options for JSON to YAML conversion
 */
export interface JsonToYamlOptions {
    indent: number;
    openInNewEditor: boolean;
}

/**
 * Options for YAML to JSON conversion
 */
export interface YamlToJsonOptions {
    prettyPrint: boolean;
    indent: string | number;
    openInNewEditor: boolean;
}

/**
 * Options for JSON to CSV conversion
 */
export interface JsonToCsvOptions {
    delimiter: string;
    includeHeaders: boolean;
    openInNewEditor: boolean;
}

/**
 * Options for Markdown to HTML conversion
 */
export interface MarkdownToHtmlOptions {
    enableTypographer: boolean;
    enableLinkify: boolean;
    openInNewEditor: boolean;
}

/**
 * Options for HTML to Markdown conversion
 */
export interface HtmlToMarkdownOptions {
    headingStyle: 'atx' | 'setext';
    codeBlockStyle: 'indented' | 'fenced';
    openInNewEditor: boolean;
}

/**
 * Options for JSON to TOML conversion
 */
export interface JsonToTomlOptions {
    openInNewEditor: boolean;
}

/**
 * Options for TOML to JSON conversion
 */
export interface TomlToJsonOptions {
    prettyPrint: boolean;
    indent: string | number;
    openInNewEditor: boolean;
}

/**
 * Options for XML to JSON conversion
 */
export interface XmlToJsonOptions {
    prettyPrint: boolean;
    indent: string | number;
    explicitArray: boolean;
    openInNewEditor: boolean;
}

/**
 * Options for JSON to XML conversion
 */
export interface JsonToXmlOptions {
    rootName: string;
    openInNewEditor: boolean;
}

/**
 * Options for YAML to TOML conversion
 */
export interface YamlToTomlOptions {
    openInNewEditor: boolean;
}

/**
 * Options for TOML to YAML conversion
 */
export interface TomlToYamlOptions {
    openInNewEditor: boolean;
}

/**
 * Convert JSON to YAML format
 */
export async function jsonToYaml(options: JsonToYamlOptions): Promise<void> {
    const text = getDocumentTextOrSelection();
    if (!text) {
        window.showErrorMessage('No text selected or document is empty');
        return;
    }

    try {
        // Parse JSON
        const jsonData = JSON.parse(text);
        
        // Convert to YAML
        const yamlContent = yaml.dump(jsonData, {
            indent: typeof options.indent === 'string' ? 2 : options.indent, // yaml.dump only accepts number for indent
            lineWidth: -1, // No line wrapping
            noRefs: true,  // Don't use references
            sortKeys: false, // Preserve key order
        });

        if (options.openInNewEditor) {
            createNewEditor(yamlContent);
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
                editBuilder.replace(selection, yamlContent.trim());
            });
        }
    } catch (error) {
        window.showErrorMessage(`Failed to convert JSON to YAML: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Convert YAML to JSON format
 */
export async function yamlToJson(options: YamlToJsonOptions): Promise<void> {
    const text = getDocumentTextOrSelection();
    if (!text) {
        window.showErrorMessage('No text selected or document is empty');
        return;
    }

    try {
        // Parse YAML
        const yamlData = yaml.load(text);
        
        // Convert to JSON
        let jsonContent: string;
        if (options.prettyPrint) {
            // JSON.stringify accepts string | number for space parameter
            jsonContent = JSON.stringify(yamlData, null, options.indent);
        } else {
            jsonContent = JSON.stringify(yamlData);
        }

        if (options.openInNewEditor) {
            createNewEditor(jsonContent);
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
                editBuilder.replace(selection, jsonContent);
            });
        }
    } catch (error) {
        window.showErrorMessage(`Failed to convert YAML to JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Ask user for JSON to YAML conversion options
 */
export async function askForJsonToYamlOptions(): Promise<JsonToYamlOptions | undefined> {
    // Ask for YAML indentation
    const indentChoice = await window.showQuickPick([
        { label: '2 spaces', description: 'Standard YAML indentation', value: 2 },
        { label: '4 spaces', description: 'Extended YAML indentation', value: 4 },
        { label: '1 space', description: 'Minimal YAML indentation', value: 1 }
    ], {
        placeHolder: 'Choose YAML indentation'
    });

    if (!indentChoice) {
        return undefined;
    }

    // Ask where to show result
    const openInNewEditor = await window.showQuickPick([
        { label: 'Replace in current editor', description: 'Replace selected JSON with YAML', value: false },
        { label: 'Open in new editor', description: 'Keep original and open YAML in new tab', value: true }
    ], {
        placeHolder: 'Where to show the YAML output?'
    });

    if (openInNewEditor === undefined) {
        return undefined;
    }

    return {
        indent: indentChoice.value,
        openInNewEditor: openInNewEditor.value
    };
}

/**
 * Ask user for YAML to JSON conversion options
 */
export async function askForYamlToJsonOptions(): Promise<YamlToJsonOptions | undefined> {
    // Ask for JSON formatting
    const formatChoice = await window.showQuickPick([
        { label: 'Pretty printed', description: 'Formatted JSON with indentation', value: true },
        { label: 'Minified', description: 'Compact JSON without formatting', value: false }
    ], {
        placeHolder: 'Choose JSON format'
    });

    if (formatChoice === undefined) {
        return undefined;
    }

    let indent: string | number = 2;
    if (formatChoice.value) {
        // Ask for JSON indentation only if pretty printing
        const indentChoice = await window.showQuickPick([
            { label: '2 spaces', description: 'Standard JSON indentation', value: 2 },
            { label: '4 spaces', description: 'Extended JSON indentation', value: 4 },
            { label: '1 space', description: 'Minimal JSON indentation', value: 1 },
            { label: 'Tab', description: 'Tab character indentation', value: '\t' }
        ], {
            placeHolder: 'Choose JSON indentation'
        });

        if (!indentChoice) {
            return undefined;
        }
        indent = indentChoice.value;
    }

    // Ask where to show result
    const openInNewEditor = await window.showQuickPick([
        { label: 'Replace in current editor', description: 'Replace selected YAML with JSON', value: false },
        { label: 'Open in new editor', description: 'Keep original and open JSON in new tab', value: true }
    ], {
        placeHolder: 'Where to show the JSON output?'
    });

    if (openInNewEditor === undefined) {
        return undefined;
    }

    return {
        prettyPrint: formatChoice.value,
        indent: indent,
        openInNewEditor: openInNewEditor.value
    };
}

/**
 * Convert JSON to CSV format
 */
export async function jsonToCsv(options: JsonToCsvOptions): Promise<void> {
    const text = getDocumentTextOrSelection();
    if (!text) {
        window.showErrorMessage('No text selected or document is empty');
        return;
    }

    try {
        // Parse JSON
        const jsonData = JSON.parse(text);
        
        // Handle different JSON structures
        let csvContent: string;
        
        if (Array.isArray(jsonData)) {
            // Handle array of objects
            if (jsonData.length === 0) {
                csvContent = '';
            } else if (typeof jsonData[0] === 'object' && jsonData[0] !== null) {
                // Array of objects - convert to CSV table
                csvContent = convertObjectArrayToCsv(jsonData, options);
            } else {
                // Array of primitives - single column
                const headers = options.includeHeaders ? ['Value'] : [];
                const rows = jsonData.map(item => [String(item)]);
                csvContent = createCsvContent(headers, rows, options.delimiter);
            }
        } else if (typeof jsonData === 'object' && jsonData !== null) {
            // Single object - convert to key-value pairs
            const headers = options.includeHeaders ? ['Key', 'Value'] : [];
            const rows = Object.entries(jsonData).map(([key, value]) => [
                key,
                typeof value === 'object' ? JSON.stringify(value) : String(value)
            ]);
            csvContent = createCsvContent(headers, rows, options.delimiter);
        } else {
            // Primitive value
            csvContent = String(jsonData);
        }

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
    } catch (error) {
        window.showErrorMessage(`Failed to convert JSON to CSV: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Convert array of objects to CSV format
 */
function convertObjectArrayToCsv(objects: any[], options: JsonToCsvOptions): string {
    if (objects.length === 0) {
        return '';
    }
    
    // Get all unique keys from all objects
    const allKeys = new Set<string>();
    objects.forEach(obj => {
        if (typeof obj === 'object' && obj !== null) {
            Object.keys(obj).forEach(key => allKeys.add(key));
        }
    });
    
    const headers = Array.from(allKeys);
    const rows = objects.map(obj => {
        return headers.map(key => {
            const value = obj?.[key];
            if (value === undefined || value === null) {
                return '';
            }
            return typeof value === 'object' ? JSON.stringify(value) : String(value);
        });
    });
    
    return createCsvContent(
        options.includeHeaders ? headers : [],
        rows,
        options.delimiter
    );
}

/**
 * Create CSV content from headers and rows
 */
function createCsvContent(headers: string[], rows: string[][], delimiter: string): string {
    const lines: string[] = [];
    
    // Add headers if provided
    if (headers.length > 0) {
        lines.push(headers.map(header => escapeCsvField(header, delimiter)).join(delimiter));
    }
    
    // Add data rows
    rows.forEach(row => {
        lines.push(row.map(field => escapeCsvField(field, delimiter)).join(delimiter));
    });
    
    return lines.join('\n');
}

/**
 * Escape CSV field if it contains delimiter, quotes, or newlines
 */
function escapeCsvField(field: string, delimiter: string): string {
    // If field contains delimiter, quotes, or newlines, wrap in quotes and escape internal quotes
    if (field.includes(delimiter) || field.includes('"') || field.includes('\n') || field.includes('\r')) {
        return '"' + field.replace(/"/g, '""') + '"';
    }
    return field;
}

/**
 * Ask user for JSON to CSV conversion options
 */
export async function askForJsonToCsvOptions(): Promise<JsonToCsvOptions | undefined> {
    // Ask for delimiter
    const delimiterChoice = await window.showQuickPick([
        { label: 'Comma (,)', description: 'Standard CSV format', value: ',' },
        { label: 'Semicolon (;)', description: 'European CSV format', value: ';' },
        { label: 'Tab', description: 'Tab-separated values (TSV)', value: '\t' },
        { label: 'Pipe (|)', description: 'Pipe-separated values', value: '|' },
        { label: 'Custom...', description: 'Enter custom delimiter', value: 'custom' }
    ], {
        placeHolder: 'Choose CSV delimiter'
    });

    if (!delimiterChoice) {
        return undefined;
    }

    let delimiter = delimiterChoice.value;
    if (delimiter === 'custom') {
        const customDelimiter = await window.showInputBox({
            prompt: 'Enter custom delimiter',
            placeHolder: 'e.g., |, ;, :'
        });
        if (!customDelimiter) {
            return undefined;
        }
        delimiter = customDelimiter;
    }

    // Ask about headers
    const includeHeaders = await window.showQuickPick([
        { label: 'Include Headers', description: 'Add column headers to CSV', value: true },
        { label: 'No Headers', description: 'Data only, no headers', value: false }
    ], {
        placeHolder: 'Include headers in CSV?'
    });

    if (includeHeaders === undefined) {
        return undefined;
    }

    // Ask about output location
    const openInNewEditor = await window.showQuickPick([
        { label: 'Replace Selection', description: 'Replace selected text with CSV', value: false },
        { label: 'Open in New Editor', description: 'Open CSV in a new editor tab', value: true }
    ], {
        placeHolder: 'Where to output the CSV?'
    });

    if (openInNewEditor === undefined) {
        return undefined;
    }

    return {
        delimiter: delimiter,
        includeHeaders: includeHeaders.value,
        openInNewEditor: openInNewEditor.value
    };
}

/**
 * Convert Markdown to HTML format
 */
export async function markdownToHtml(options: MarkdownToHtmlOptions): Promise<void> {
    const text = getDocumentTextOrSelection();
    if (!text) {
        window.showErrorMessage('No text selected or document is empty');
        return;
    }

    try {
        // Create markdown-it instance with options
        const md = new MarkdownIt({
            html: true,        // Enable HTML tags in source
            xhtmlOut: true,    // Use '/' to close single tags (<br />)
            breaks: false,     // Convert '\n' in paragraphs into <br>
            linkify: options.enableLinkify,      // Autoconvert URL-like text to links
            typographer: options.enableTypographer  // Enable some language-neutral replacement + quotes beautification
        });

        // Convert to HTML
        const htmlContent = md.render(text);

        if (options.openInNewEditor) {
            createNewEditor(htmlContent);
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
                editBuilder.replace(selection, htmlContent);
            });
        }
    } catch (error) {
        window.showErrorMessage(`Failed to convert Markdown to HTML: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Convert HTML to Markdown format
 */
export async function htmlToMarkdown(options: HtmlToMarkdownOptions): Promise<void> {
    const text = getDocumentTextOrSelection();
    if (!text) {
        window.showErrorMessage('No text selected or document is empty');
        return;
    }

    try {
        // Create turndown service with options
        const turndownService = new TurndownService({
            headingStyle: options.headingStyle,
            codeBlockStyle: options.codeBlockStyle,
            hr: '---',
            bulletListMarker: '-',
            emDelimiter: '*',
            strongDelimiter: '**'
        });

        // Add custom rule to use single space after list markers
        turndownService.addRule('listItem', {
            filter: 'li',
            replacement: function (content, node, options) {
                content = content
                    .replace(/^\n+/, '') // remove leading newlines
                    .replace(/\n+$/, '\n') // replace trailing newlines with just a single one
                    .replace(/\n/gm, '\n    '); // indent
                var prefix = options.bulletListMarker + ' ';
                return prefix + content + (node.nextSibling && !/\n$/.test(content) ? '\n' : '');
            }
        });

        // Convert to Markdown
        const markdownContent = turndownService.turndown(text);

        if (options.openInNewEditor) {
            createNewEditor(markdownContent);
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
                editBuilder.replace(selection, markdownContent);
            });
        }
    } catch (error) {
        window.showErrorMessage(`Failed to convert HTML to Markdown: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Ask user for Markdown to HTML conversion options
 */
export async function askForMarkdownToHtmlOptions(): Promise<MarkdownToHtmlOptions | undefined> {
    // Ask about typographer
    const typographer = await window.showQuickPick([
        { label: 'Enable Typographer', description: 'Smart quotes, dashes, and other typographic replacements', value: true },
        { label: 'Disable Typographer', description: 'Keep original characters', value: false }
    ], {
        placeHolder: 'Enable typographic replacements?'
    });

    if (typographer === undefined) {
        return undefined;
    }

    // Ask about linkify
    const linkify = await window.showQuickPick([
        { label: 'Auto-link URLs', description: 'Convert URL-like text to clickable links', value: true },
        { label: 'Keep URLs as text', description: 'Don\'t automatically convert URLs to links', value: false }
    ], {
        placeHolder: 'Auto-convert URLs to links?'
    });

    if (linkify === undefined) {
        return undefined;
    }

    // Ask about output location
    const openInNewEditor = await window.showQuickPick([
        { label: 'Replace Selection', description: 'Replace selected text with HTML', value: false },
        { label: 'Open in New Editor', description: 'Open HTML in a new editor tab', value: true }
    ], {
        placeHolder: 'Where to output the HTML?'
    });

    if (openInNewEditor === undefined) {
        return undefined;
    }

    return {
        enableTypographer: typographer.value,
        enableLinkify: linkify.value,
        openInNewEditor: openInNewEditor.value
    };
}

/**
 * Ask user for HTML to Markdown conversion options
 */
export async function askForHtmlToMarkdownOptions(): Promise<HtmlToMarkdownOptions | undefined> {
    // Ask about heading style
    const headingStyle = await window.showQuickPick([
        { label: 'ATX Style (###)', description: 'Use # symbols for headings', value: 'atx' as const },
        { label: 'Setext Style', description: 'Use underlines for headings (H1/H2 only)', value: 'setext' as const }
    ], {
        placeHolder: 'Choose heading style'
    });

    if (!headingStyle) {
        return undefined;
    }

    // Ask about code block style
    const codeBlockStyle = await window.showQuickPick([
        { label: 'Fenced (```)', description: 'Use triple backticks for code blocks', value: 'fenced' as const },
        { label: 'Indented', description: 'Use 4-space indentation for code blocks', value: 'indented' as const }
    ], {
        placeHolder: 'Choose code block style'
    });

    if (!codeBlockStyle) {
        return undefined;
    }

    // Ask about output location
    const openInNewEditor = await window.showQuickPick([
        { label: 'Replace Selection', description: 'Replace selected text with Markdown', value: false },
        { label: 'Open in New Editor', description: 'Open Markdown in a new editor tab', value: true }
    ], {
        placeHolder: 'Where to output the Markdown?'
    });

    if (openInNewEditor === undefined) {
        return undefined;
    }

    return {
        headingStyle: headingStyle.value,
        codeBlockStyle: codeBlockStyle.value,
        openInNewEditor: openInNewEditor.value
    };
}

/**
 * Convert JSON to TOML format
 */
export async function jsonToToml(options: JsonToTomlOptions): Promise<void> {
    const text = getDocumentTextOrSelection();
    if (!text) {
        window.showErrorMessage('No text selected or document is empty');
        return;
    }

    try {
        // Parse JSON
        const jsonData = JSON.parse(text);
        
        // Convert to TOML
        const tomlContent = TOML.stringify(jsonData);

        if (options.openInNewEditor) {
            createNewEditor(tomlContent);
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
                editBuilder.replace(selection, tomlContent);
            });
        }
    } catch (error) {
        window.showErrorMessage(`Failed to convert JSON to TOML: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Convert TOML to JSON format
 */
export async function tomlToJson(options: TomlToJsonOptions): Promise<void> {
    const text = getDocumentTextOrSelection();
    if (!text) {
        window.showErrorMessage('No text selected or document is empty');
        return;
    }

    try {
        // Parse TOML
        const tomlData = TOML.parse(text);
        
        // Convert to JSON
        let jsonContent: string;
        if (options.prettyPrint) {
            jsonContent = JSON.stringify(tomlData, null, options.indent);
        } else {
            jsonContent = JSON.stringify(tomlData);
        }

        if (options.openInNewEditor) {
            createNewEditor(jsonContent);
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
                editBuilder.replace(selection, jsonContent);
            });
        }
    } catch (error) {
        window.showErrorMessage(`Failed to convert TOML to JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Ask user for JSON to TOML conversion options
 */
export async function askForJsonToTomlOptions(): Promise<JsonToTomlOptions | undefined> {
    // Ask about output location
    const openInNewEditor = await window.showQuickPick([
        { label: 'Replace Selection', description: 'Replace selected text with TOML', value: false },
        { label: 'Open in New Editor', description: 'Open TOML in a new editor tab', value: true }
    ], {
        placeHolder: 'Where to output the TOML?'
    });

    if (openInNewEditor === undefined) {
        return undefined;
    }

    return {
        openInNewEditor: openInNewEditor.value
    };
}

/**
 * Ask user for TOML to JSON conversion options
 */
export async function askForTomlToJsonOptions(): Promise<TomlToJsonOptions | undefined> {
    // Ask for pretty printing
    const formatChoice = await window.showQuickPick([
        { label: 'Pretty Print', description: 'Format JSON with indentation and line breaks', value: true },
        { label: 'Compact', description: 'Minified JSON on a single line', value: false }
    ], {
        placeHolder: 'Choose JSON formatting'
    });

    if (!formatChoice) {
        return undefined;
    }

    let indent: string | number = 2;
    if (formatChoice.value) {
        // Ask for JSON indentation only if pretty printing
        const indentChoice = await window.showQuickPick([
            { label: '2 spaces', description: 'Standard JSON indentation', value: 2 },
            { label: '4 spaces', description: 'Extended JSON indentation', value: 4 },
            { label: '1 space', description: 'Minimal JSON indentation', value: 1 },
            { label: 'Tab', description: 'Tab character indentation', value: '\t' }
        ], {
            placeHolder: 'Choose JSON indentation'
        });

        if (!indentChoice) {
            return undefined;
        }
        indent = indentChoice.value;
    }

    // Ask about output location
    const openInNewEditor = await window.showQuickPick([
        { label: 'Replace Selection', description: 'Replace selected text with JSON', value: false },
        { label: 'Open in New Editor', description: 'Open JSON in a new editor tab', value: true }
    ], {
        placeHolder: 'Where to output the JSON?'
    });

    if (openInNewEditor === undefined) {
        return undefined;
    }

    return {
        prettyPrint: formatChoice.value,
        indent: indent,
        openInNewEditor: openInNewEditor.value
    };
}

/**
 * Convert XML to JSON format
 */
export async function xmlToJson(options: XmlToJsonOptions): Promise<void> {
    const text = getDocumentTextOrSelection();
    if (!text) {
        window.showErrorMessage('No text selected or document is empty');
        return;
    }

    try {
        // Create XML parser with options
        const parser = new xml2js.Parser({
            explicitArray: options.explicitArray,
            ignoreAttrs: false,
            mergeAttrs: false
        });

        // Parse XML to JavaScript object
        const xmlData = await parser.parseStringPromise(text);
        
        // Convert to JSON
        let jsonContent: string;
        if (options.prettyPrint) {
            jsonContent = JSON.stringify(xmlData, null, options.indent);
        } else {
            jsonContent = JSON.stringify(xmlData);
        }

        if (options.openInNewEditor) {
            createNewEditor(jsonContent);
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
                editBuilder.replace(selection, jsonContent);
            });
        }
    } catch (error) {
        window.showErrorMessage(`Failed to convert XML to JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Convert JSON to XML format
 */
export async function jsonToXml(options: JsonToXmlOptions): Promise<void> {
    const text = getDocumentTextOrSelection();
    if (!text) {
        window.showErrorMessage('No text selected or document is empty');
        return;
    }

    try {
        // Parse JSON
        const jsonData = JSON.parse(text);
        
        // Create XML builder
        const builder = new xml2js.Builder({
            rootName: options.rootName,
            xmldec: { version: '1.0', encoding: 'UTF-8' }
        });

        // Convert to XML
        const xmlContent = builder.buildObject(jsonData);

        if (options.openInNewEditor) {
            createNewEditor(xmlContent);
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
                editBuilder.replace(selection, xmlContent);
            });
        }
    } catch (error) {
        window.showErrorMessage(`Failed to convert JSON to XML: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Ask user for XML to JSON conversion options
 */
export async function askForXmlToJsonOptions(): Promise<XmlToJsonOptions | undefined> {
    // Ask for pretty printing
    const formatChoice = await window.showQuickPick([
        { label: 'Pretty Print', description: 'Format JSON with indentation and line breaks', value: true },
        { label: 'Compact', description: 'Minified JSON on a single line', value: false }
    ], {
        placeHolder: 'Choose JSON formatting'
    });

    if (!formatChoice) {
        return undefined;
    }

    let indent: string | number = 2;
    if (formatChoice.value) {
        // Ask for JSON indentation only if pretty printing
        const indentChoice = await window.showQuickPick([
            { label: '2 spaces', description: 'Standard JSON indentation', value: 2 },
            { label: '4 spaces', description: 'Extended JSON indentation', value: 4 },
            { label: '1 space', description: 'Minimal JSON indentation', value: 1 },
            { label: 'Tab', description: 'Tab character indentation', value: '\t' }
        ], {
            placeHolder: 'Choose JSON indentation'
        });

        if (!indentChoice) {
            return undefined;
        }
        indent = indentChoice.value;
    }

    // Ask about array handling
    const explicitArray = await window.showQuickPick([
        { label: 'Always Arrays', description: 'Always put child nodes in arrays (even single children)', value: true },
        { label: 'Smart Arrays', description: 'Only use arrays for multiple children', value: false }
    ], {
        placeHolder: 'How to handle XML child elements?'
    });

    if (explicitArray === undefined) {
        return undefined;
    }

    // Ask about output location
    const openInNewEditor = await window.showQuickPick([
        { label: 'Replace Selection', description: 'Replace selected text with JSON', value: false },
        { label: 'Open in New Editor', description: 'Open JSON in a new editor tab', value: true }
    ], {
        placeHolder: 'Where to output the JSON?'
    });

    if (openInNewEditor === undefined) {
        return undefined;
    }

    return {
        prettyPrint: formatChoice.value,
        indent: indent,
        explicitArray: explicitArray.value,
        openInNewEditor: openInNewEditor.value
    };
}

/**
 * Ask user for JSON to XML conversion options
 */
export async function askForJsonToXmlOptions(): Promise<JsonToXmlOptions | undefined> {
    // Ask for root element name
    const rootName = await window.showInputBox({
        prompt: 'Enter XML root element name',
        placeHolder: 'e.g., root, data, document',
        value: 'root'
    });

    if (!rootName) {
        return undefined;
    }

    // Ask about output location
    const openInNewEditor = await window.showQuickPick([
        { label: 'Replace Selection', description: 'Replace selected text with XML', value: false },
        { label: 'Open in New Editor', description: 'Open XML in a new editor tab', value: true }
    ], {
        placeHolder: 'Where to output the XML?'
    });

    if (openInNewEditor === undefined) {
        return undefined;
    }

    return {
        rootName: rootName,
        openInNewEditor: openInNewEditor.value
    };
}

/**
 * Convert YAML to TOML format
 */
export async function yamlToToml(options: YamlToTomlOptions): Promise<void> {
    const text = getDocumentTextOrSelection();
    if (!text) {
        window.showErrorMessage('No text selected or document is empty');
        return;
    }

    try {
        // Parse YAML to JavaScript object
        const yamlData = yaml.load(text);
        
        // Convert to TOML
        const tomlContent = TOML.stringify(yamlData as TOML.JsonMap);

        if (options.openInNewEditor) {
            createNewEditor(tomlContent);
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
                editBuilder.replace(selection, tomlContent);
            });
        }
    } catch (error) {
        window.showErrorMessage(`Failed to convert YAML to TOML: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Convert TOML to YAML format
 */
export async function tomlToYaml(options: TomlToYamlOptions): Promise<void> {
    const text = getDocumentTextOrSelection();
    if (!text) {
        window.showErrorMessage('No text selected or document is empty');
        return;
    }

    try {
        // Parse TOML to JavaScript object
        const tomlData = TOML.parse(text);
        
        // Convert to YAML
        const yamlContent = yaml.dump(tomlData, {
            indent: 2,
            lineWidth: -1,
            noRefs: true,
            sortKeys: false
        });

        if (options.openInNewEditor) {
            createNewEditor(yamlContent);
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
                editBuilder.replace(selection, yamlContent);
            });
        }
    } catch (error) {
        window.showErrorMessage(`Failed to convert TOML to YAML: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Ask user for YAML to TOML conversion options
 */
export async function askForYamlToTomlOptions(): Promise<YamlToTomlOptions | undefined> {
    // Ask about output location
    const openInNewEditor = await window.showQuickPick([
        { label: 'Replace Selection', description: 'Replace selected text with TOML', value: false },
        { label: 'Open in New Editor', description: 'Open TOML in a new editor tab', value: true }
    ], {
        placeHolder: 'Where to output the TOML?'
    });

    if (openInNewEditor === undefined) {
        return undefined;
    }

    return {
        openInNewEditor: openInNewEditor.value
    };
}

/**
 * Ask user for TOML to YAML conversion options
 */
export async function askForTomlToYamlOptions(): Promise<TomlToYamlOptions | undefined> {
    // Ask about output location
    const openInNewEditor = await window.showQuickPick([
        { label: 'Replace Selection', description: 'Replace selected text with YAML', value: false },
        { label: 'Open in New Editor', description: 'Open YAML in a new editor tab', value: true }
    ], {
        placeHolder: 'Where to output the YAML?'
    });

    if (openInNewEditor === undefined) {
        return undefined;
    }

    return {
        openInNewEditor: openInNewEditor.value
    };
}