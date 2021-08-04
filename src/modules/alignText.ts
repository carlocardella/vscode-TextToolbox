import { TextEditor, TextLine, window } from "vscode";
import { getActiveEditor, getLinesFromSelection } from "./helpers";

/**
 * Asks the user which separator to use for the alignment. Default is comma (",").
 * @return {*}  {Promise<string>}
 * @async
 */
export async function aksForSeparator(): Promise<string> {
    const separator = await window.showInputBox({ ignoreFocusOut: true, value: ",", prompt: "Choose a separator" });
    if (!separator) {
        return Promise.reject("Operation cancelled by the user");
    }

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
    if (!lines) {
        return Promise.reject();
    }

    let elements: any[] = [];

    lines.forEach((line) => {
        let element = new LineElement(line, separator);
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
    lineElements.forEach((lineElement) => {
        lineElement.Elements.forEach((element) => {
            if (element.length > maxElementLength) {
                maxElementLength = element.length;
            }
        });
    });

    return Promise.resolve(maxElementLength);
}

export async function alignToSeparator(separator?: string): Promise<boolean> {
    if (!separator) {
        separator = await aksForSeparator();
    }
    if (!separator) {
        Promise.reject(false);
    }

    const editor = getActiveEditor();
    if (!editor) {
        return Promise.reject();
    }

    const columns = await getColumns(editor, separator);
    let newLineText: string = "";
    editor.edit((editBuilder) => {
        newLineText = padElements(columns, separator!);
        editBuilder.replace(editor.selection, newLineText);
    });

    return Promise.resolve(true);
}

async function getColumns(editor: TextEditor, separator: string): Promise<ColumnElement[]> {
    return new Promise<ColumnElement[]>(async (resolve, reject) => {
        let lines = await getLineElements(editor, separator);

        let columns: ColumnElement[] = [];
        let longestLineLength = getLongestLine(lines);

        for (let ii = 0; ii < longestLineLength; ii++) {
            let longestColumnElement = 0;
            let lineNumber = 0;
            lines.forEach((line) => {
                if (line.Elements[ii] && line.Elements[ii].length > longestColumnElement) {
                    longestColumnElement = line.Elements[ii].length;
                }
                lineNumber = line.LineNumber;
            });

            lines.forEach((line) => {
                columns.push(new ColumnElement(line.LineNumber, line.Elements[ii], longestColumnElement));
            });
        }

        resolve(columns);
    });
}

// function getColumnMaxLength(columnElements: string[]): number {
//     let longestElement = 0;

//     columnElements.forEach((element) => {
//         if (element.length > longestElement) {
//             longestElement = element.length;
//         }
//     });

//     return longestElement;
// }

function getLongestLine(lines: LineElement[]): number {
    let longestLine: number = 0;

    lines.forEach((line) => {
        if (line.Elements.length > longestLine) {
            longestLine = line.Elements.length;
        }
    });

    return longestLine;
}

function padElements(columns: ColumnElement[], separator: string): string {
    let newLineText: string = "";
    const lines = getLinesFromSelection(getActiveEditor()!);

    let paddedElement = "";
    for (let line of lines!) {
        let c = columns.filter((column) => column.LineNumber === line.lineNumber);
        // c.forEach((column) => {
        //     if (column.Text) {
        //         paddedElement = `${column.Text}${separator}`.padEnd(column.Length + 2, " ");
        //         newLineText += paddedElement;
        //     }
        // });

        let s = "";
        for (let ii = 0; ii < c.length; ii++) {
            if (c[ii].Text) {
                ii === c.length ? (s = "") : (s = separator);
                paddedElement = `${c[ii].Text}${s}`.padEnd(c[ii].Length + 2, " ");
                newLineText += paddedElement;
            }
        }

        newLineText += "\n";
    }

    return newLineText;
}

/**
 * LineElement type, used to describe line elements to pad and align
 * @param line {TextLine} TextLine type
 * @param separator {string} Separator to use split the line and extract the elements to align
 */
class LineElement {
    public LineNumber: number;
    public Text: TextLine;
    public Elements: string[];

    constructor(line: TextLine, separator: string) {
        this.LineNumber = line.lineNumber;
        this.Text = line;
        this.Elements = line.text.split(separator);
    }
}

/**
 * ColumnElement type, used to describe column elements to pad and align
 * @param Id: {number} Column index
 * @param Text: {string} Text to pad and align
 * @param Length: {number} Length of the column padded text
 * @class ColumnElement
 */
class ColumnElement {
    public LineNumber: number;
    public Text: string;
    public Length: number;

    constructor(lineNumber: number, text: string, length: number) {
        this.LineNumber = lineNumber;
        this.Text = text;
        this.Length = length;
    }
}
