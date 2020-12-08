import { TextEditor, TextLine, window, workspace } from "vscode";
import { getActiveEditor, getLinesFromSelection } from './helpers';


/**
 * Asks the user which separator to use for the alignment. Default is comma (",").
 * @return {*}  {Promise<string>}
 * @async
 */
export async function aksForSeparator(): Promise<string> {
    const separator = await window.showInputBox({ ignoreFocusOut: true, value: ",", prompt: "Choose a separator" });
    if (!separator) { return Promise.reject("Operation cancelled by the user"); }

    return Promise.resolve(separator);
}

/**
 * Returns a lineElements array from the selection; each lineElement is a tuple [TextLine, string[]]
 * @param {TextEditor} editor The active text editor to use to get the selections from
 * @param {string} separator the separator character to use to split each line and retrieve its elements
 * @return {*}  {Promise<object[]>}
 * @async
 */
async function getLineElements(editor: TextEditor, separator: string): Promise<LineElement[]> {
    const lines = getLinesFromSelection(editor);
    if (!lines) { return Promise.reject(); }

    let elements: any[] = [];

    lines.forEach(line => {
        let element = new LineElement(line, line.text.split(separator));
        elements.push(element);
    });

    return Promise.resolve(elements);
}

/**
 * Returns the length of the longest element; it can be used to pad other string elements
 * @param {LineElement[]} lineElements Array of line elements to measure and retrieve the max length from
 * @return {*}  {Promise<number>}
 * @async
 */
async function getElementMaxLength(lineElements: LineElement[]): Promise<number> {
    let maxElementLength: number = 0;
    lineElements.forEach(lineElement => {
        lineElement.Elements.forEach(element => {
            if (element.length > maxElementLength) { maxElementLength = element.length; };
        });
    });

    return Promise.resolve(maxElementLength);
}

/**
 * 
 * @return {*}  {Promise<boolean>}
 * @async
 */
export async function alignToSeparator(separator?: string): Promise<boolean> {
    if (!separator) { separator = await aksForSeparator(); }
    const editor = getActiveEditor();
    if (!editor) { return Promise.reject(); };
    const lineElements = await getLineElements(editor, separator);
    const elementMaxLength = await getElementMaxLength(lineElements);

    let newLineText: string = "";
    editor.edit(editBuilder => {
        lineElements.forEach(async elements => {
            newLineText = padElement(elements.Elements, separator!, elementMaxLength);
            editBuilder.replace(elements.Line.range, newLineText);
        });
    });

    return Promise.resolve(true);
}

/**
 * Build the lines of text joining the relevant elements with proper separator and padding
 * @param {string[]} elements Elements array to pad and join
 * @param {string} separator Separator to use to rebuild the padded element
 * @param {number} length Length of the resulting padded line
 * @return {*}  {Promise<string>}
 * @async
 */
function padElement(elements: string[], separator: string, length: number): string {
    let newLineText: string = "";
    let newText: string[] = [];
    let joinSeparator: string = "";
    let alignment = workspace.getConfiguration("tt").textElementAlignment;

    let elementsLength = elements.length;
    let i = 0;
    elements.forEach(element => {
        i++;
        newLineText = element;
        if (alignment === "left" && i < elementsLength) { newLineText = newLineText + separator; };
        newLineText = newLineText.padEnd(length + 1, " ");
        newText.push(newLineText);
    });

    alignment === "right" ? joinSeparator = separator : joinSeparator = " ";
    return newText.join(joinSeparator);
}

/**
 * LineElement type, used to describe line elements to pad and align
 * @param line {TextLine} TextLine type
 * @param elements {string[]} Elements composing a text line, split by separator
 */
class LineElement {
    public Line!: TextLine;
    public Elements!: string[];

    constructor(line?: TextLine, elements?: string[]) {
        if (line) { this.Line = line; }
        if (elements) { this.Elements = elements; }
    }
}