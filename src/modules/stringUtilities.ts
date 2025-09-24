import { window, Range, Selection } from "vscode";
import { getActiveEditor, getTextFromSelection, createNewEditor } from "./helpers";

/**
 * String utility functions for advanced text manipulation and transformation
 */

/**
 * Enum for string transformation types
 * @export
 * @enum {string}
 */
export enum stringUtilityType {
    "slugify" = "slugify",
    "obfuscate" = "obfuscate",
    "deobfuscate" = "deobfuscate",
    "numeronym" = "numeronym",
    "textStats" = "textStats",
    "invertSelection" = "invertSelection",
}

/**
 * Interface for text statistics
 */
export interface TextStatistics {
    characters: number;
    charactersNoSpaces: number;
    words: number;
    sentences: number;
    paragraphs: number;
    lines: number;
    bytes: number;
    readingTimeMinutes: number;
}

/**
 * Convert a string to a URL-friendly slug
 * @param text The text to slugify
 * @param separator The separator to use (default: '-')
 * @returns Slugified string
 */
export function slugifyString(text: string, separator: string = '-'): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        // Replace spaces with separator
        .replace(/\s+/g, separator)
        // Remove special characters except letters, numbers, and separators
        .replace(/[^\w\-]+/g, '')
        // Replace multiple separators with single separator
        .replace(new RegExp(`\\${separator}+`, 'g'), separator)
        // Remove separator from start and end
        .replace(new RegExp(`^\\${separator}+|\\${separator}+$`, 'g'), '');
}

/**
 * Simple obfuscation function that makes text shareable without revealing content
 * Uses a basic character shifting method that can be reversed
 * @param text The text to obfuscate
 * @param shift The shift amount (default: 3)
 * @returns Obfuscated string
 */
export function obfuscateString(text: string, shift: number = 3): string {
    return text.split('').map(char => {
        const code = char.charCodeAt(0);
        // Only shift printable ASCII characters (32-126)
        if (code >= 32 && code <= 126) {
            const shifted = ((code - 32 + shift) % 95) + 32;
            return String.fromCharCode(shifted);
        }
        return char;
    }).join('');
}

/**
 * Reverse the obfuscation process
 * @param text The obfuscated text
 * @param shift The shift amount used for obfuscation (default: 3)
 * @returns Deobfuscated string
 */
export function deobfuscateString(text: string, shift: number = 3): string {
    return text.split('').map(char => {
        const code = char.charCodeAt(0);
        // Only shift printable ASCII characters (32-126)
        if (code >= 32 && code <= 126) {
            const shifted = ((code - 32 - shift + 95) % 95) + 32;
            return String.fromCharCode(shifted);
        }
        return char;
    }).join('');
}

/**
 * Generate a numeronym from a string (e.g., "internationalization" -> "i18n")
 * @param text The text to convert to numeronym
 * @returns Numeronym string
 */
export function generateNumeronym(text: string): string {
    const trimmed = text.trim();
    if (trimmed.length <= 3) {
        return trimmed; // Too short for numeronym
    }
    
    const first = trimmed.charAt(0);
    const last = trimmed.charAt(trimmed.length - 1);
    const middle = trimmed.length - 2;
    
    return `${first}${middle}${last}`;
}

/**
 * Calculate comprehensive text statistics
 * @param text The text to analyze
 * @returns TextStatistics object with various metrics
 */
export function calculateTextStatistics(text: string): TextStatistics {
    const lines = text.split(/\r?\n/);
    
    // Character counts
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    
    // Word count (split by whitespace, filter out empty strings)
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).filter(word => word.length > 0).length;
    
    // Sentence count (split by sentence endings, filter out empty strings)
    const sentences = text.trim() === '' ? 0 : text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0).length;
    
    // Paragraph count (split by double line breaks, filter out empty paragraphs)
    const paragraphs = text.trim() === '' ? 0 : text.split(/\n\s*\n/).filter(para => para.trim().length > 0).length;
    
    // Bytes (UTF-8 encoding)
    const bytes = new TextEncoder().encode(text).length;
    
    // Reading time estimation (average 200 words per minute)
    const readingTimeMinutes = Math.ceil(words / 200);
    
    return {
        characters,
        charactersNoSpaces,
        words,
        sentences,
        paragraphs,
        lines: lines.length,
        bytes,
        readingTimeMinutes
    };
}

/**
 * Apply string utility transformation to selected text
 * @param utilityType The type of transformation to apply
 */
export async function applyStringUtility(utilityType: stringUtilityType): Promise<void> {
    const editor = getActiveEditor();
    if (!editor) {
        window.showErrorMessage("No active editor found");
        return;
    }

    const selections = editor.selections;
    if (!selections || selections.length === 0) {
        window.showErrorMessage("No text selected");
        return;
    }

    try {
        await editor.edit(editBuilder => {
            selections.forEach(selection => {
                const text = getTextFromSelection(editor, selection);
                if (!text) {
                    return;
                }

                let transformedText: string;
                
                switch (utilityType) {
                    case stringUtilityType.slugify:
                        transformedText = slugifyString(text);
                        editBuilder.replace(selection, transformedText);
                        break;
                        
                    case stringUtilityType.obfuscate:
                        transformedText = obfuscateString(text);
                        editBuilder.replace(selection, transformedText);
                        break;
                        
                    case stringUtilityType.deobfuscate:
                        transformedText = deobfuscateString(text);
                        editBuilder.replace(selection, transformedText);
                        break;
                        
                    case stringUtilityType.numeronym:
                        transformedText = generateNumeronym(text);
                        editBuilder.replace(selection, transformedText);
                        break;
                        
                    default:
                        window.showErrorMessage(`Unknown utility type: ${utilityType}`);
                }
            });
        });
    } catch (error) {
        window.showErrorMessage(`Error applying string utility: ${error}`);
    }
}

/**
 * Show text statistics for selected text or entire document
 */
export async function showTextStatistics(): Promise<void> {
    const editor = getActiveEditor();
    if (!editor) {
        window.showErrorMessage("No active editor found");
        return;
    }

    let text: string;
    const selection = editor.selection;
    
    if (selection.isEmpty) {
        // Use entire document if no selection
        text = editor.document.getText();
    } else {
        // Use selected text
        text = getTextFromSelection(editor, selection) || '';
    }

    const stats = calculateTextStatistics(text);
    
    const scope = selection.isEmpty ? "Document" : "Selection";
    const message = `${scope} Statistics:
    
Characters: ${stats.characters.toLocaleString()}
Characters (no spaces): ${stats.charactersNoSpaces.toLocaleString()}
Words: ${stats.words.toLocaleString()}
Sentences: ${stats.sentences.toLocaleString()}
Paragraphs: ${stats.paragraphs.toLocaleString()}
Lines: ${stats.lines.toLocaleString()}
Bytes: ${stats.bytes.toLocaleString()}
Estimated reading time: ${stats.readingTimeMinutes} minute${stats.readingTimeMinutes !== 1 ? 's' : ''}`;

    window.showInformationMessage(message, { modal: true });
}

/**
 * Show text statistics in a new editor window
 */
export async function showTextStatisticsInNewEditor(): Promise<void> {
    const editor = getActiveEditor();
    if (!editor) {
        window.showErrorMessage("No active editor found");
        return;
    }

    let text: string;
    const selection = editor.selection;
    
    if (selection.isEmpty) {
        // Use entire document if no selection
        text = editor.document.getText();
    } else {
        // Use selected text
        text = getTextFromSelection(editor, selection) || '';
    }

    const stats = calculateTextStatistics(text);
    
    const scope = selection.isEmpty ? "Document" : "Selection";
    const statsText = `${scope} Statistics
${'='.repeat(scope.length + 11)}

Characters: ${stats.characters.toLocaleString()}
Characters (no spaces): ${stats.charactersNoSpaces.toLocaleString()}
Words: ${stats.words.toLocaleString()}
Sentences: ${stats.sentences.toLocaleString()}
Paragraphs: ${stats.paragraphs.toLocaleString()}
Lines: ${stats.lines.toLocaleString()}
Bytes: ${stats.bytes.toLocaleString()}
Estimated reading time: ${stats.readingTimeMinutes} minute${stats.readingTimeMinutes !== 1 ? 's' : ''}

Analyzed at: ${new Date().toLocaleString()}
`;

    await createNewEditor(statsText);
}

/**
 * Invert the current selection in the editor
 * This means selecting everything except the currently selected text
 */
export function invertSelection(): void {
    const editor = getActiveEditor();
    if (!editor) {
        window.showErrorMessage("No active editor found");
        return;
    }

    const document = editor.document;
    const currentSelections = editor.selections;
    
    // If no text is selected, show a message
    if (currentSelections.length === 1 && currentSelections[0].isEmpty) {
        window.showErrorMessage("No text selected to invert");
        return;
    }

    // Create new selections that encompass everything except the current selections
    const newSelections: Selection[] = [];
    
    // Sort selections by start position to process them in order
    const sortedSelections = [...currentSelections].sort((a, b) => 
        a.start.line - b.start.line || a.start.character - b.start.character
    );

    // Start of document to first selection
    if (sortedSelections.length > 0) {
        const documentStart = document.positionAt(0);
        const firstSelectionStart = sortedSelections[0].start;
        
        if (!documentStart.isEqual(firstSelectionStart)) {
            newSelections.push(new Selection(documentStart, firstSelectionStart));
        }
    }

    // Between selections
    for (let i = 0; i < sortedSelections.length - 1; i++) {
        const currentEnd = sortedSelections[i].end;
        const nextStart = sortedSelections[i + 1].start;
        
        if (!currentEnd.isEqual(nextStart)) {
            newSelections.push(new Selection(currentEnd, nextStart));
        }
    }

    // Last selection to end of document
    if (sortedSelections.length > 0) {
        const lastSelectionEnd = sortedSelections[sortedSelections.length - 1].end;
        const documentEnd = document.positionAt(document.getText().length);
        
        if (!lastSelectionEnd.isEqual(documentEnd)) {
            newSelections.push(new Selection(lastSelectionEnd, documentEnd));
        }
    }

    // Apply the new selections
    if (newSelections.length > 0) {
        editor.selections = newSelections;
        
        // Reveal the first selection to user
        if (newSelections[0]) {
            editor.revealRange(newSelections[0]);
        }
    } else {
        window.showInformationMessage("No inverted selection possible - current selection covers the entire document");
    }
}
