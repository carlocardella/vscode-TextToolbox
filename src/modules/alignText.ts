import { TextEditor, TextLine, window, workspace } from "vscode";
import { getActiveEditor, getLinesFromSelection } from "./helpers";

/**
 * Asks the user which separator to use for the alignment. Default is comma (",").
 * @return {*}  {Promise<string>}
 * @async
 */
export async function aksForSeparator(): Promise<string> {
    const config = workspace.getConfiguration().get<string>("TextToolbox.alignTextDefaultSeparator");
    const separator = await window.showInputBox({ ignoreFocusOut: true, value: config, prompt: "Choose a separator" });
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

/**
 * Align the text in the active editor
 * @export
 * @param {string} [separator] The separator to use to align the text
 * @return {*}  {Promise<boolean>}
 */
export function alignText(separator?: string, formatTable?: boolean, withHeaders?: boolean): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
        if (!separator) {
            separator = await aksForSeparator();
        }
        if (!separator) {
            return reject(false);
        }

        const editor = getActiveEditor();
        if (!editor) {
            return reject(false);
        }

        if (editor.selection.isEmpty) {
            return reject(false);
        }

        // fix: ^ rejected promise not handled within 1 second

        const columns = await getColumns(editor, separator);
        let newLineText: string = "";
        editor.edit((editBuilder) => {
            formatTable ? (newLineText = padAsTable(columns, withHeaders)) : (newLineText = padToSeparator(columns, separator!));
            editBuilder.replace(editor.selection, newLineText);
        });

        return resolve(true);
    });
}

/**
 * Returns an array of ColumnElements, each ColumnElement is a tuple [LineNumber, Length, Text].
 * LineNumber indicates to which line number each column belongs to.
 * Length indicates the max length of the column: this is used to pad shorter columns.
 * Text is the string contained in that particular cell (Column at LineNumber)
 * @param {TextEditor} editor The text editor to use to get the selections from
 * @param {string} separator The separator to use to split each line and retrieve its elements
 * @return {*}  {Promise<ColumnElement[]>}
 */
async function getColumns(editor: TextEditor, separator: string): Promise<ColumnElement[]> {
    return new Promise<ColumnElement[]>(async (resolve, reject) => {
        let lines = await getLineElements(editor, separator);

        let columns: ColumnElement[] = [];
        let longestLineLength = getLongestLine(lines);

        // fix: bad alignment and lost column if one of the tokens is empty
        // e.g.
        // asd, asd, asd, asd
        // asd, asd,, asd
        // asd, asd, asd, asd

        for (let ii = 0; ii < longestLineLength; ii++) {
            let longestColumnElement = 0;
            // let lineNumber = 0;
            lines.forEach((line) => {
                if (line.Elements[ii] && line.Elements[ii].length > longestColumnElement) {
                    longestColumnElement = line.Elements[ii].length;
                }
                // lineNumber = line.LineNumber;
            });

            lines.forEach((line) => {
                columns.push(new ColumnElement(line.LineNumber, line.Elements[ii], longestColumnElement));
            });
        }

        resolve(columns);
    });
}

/**
 * Get the longest line (in term of number of elements) from the lineElements array
 * @param {LineElement[]} lines Array of line elements to measure and retrieve the max length from
 * @return {*}  {number}
 */
function getLongestLine(lines: LineElement[]): number {
    let longestLine: number = 0;

    lines.forEach((line) => {
        if (line.Elements.length > longestLine) {
            longestLine = line.Elements.length;
        }
    });

    return longestLine;
}

/**
 * Build the aligned text from the columnElements array
 * @param {ColumnElement[]} columns Array of column elements to build the aligned text from
 * @param {string} separator The separator to use to build the aligned text
 * @return {*}  {string}
 */
function padToSeparator(columns: ColumnElement[], separator: string): string {
    let newLineText: string = "";
    const lines = getLinesFromSelection(getActiveEditor()!);

    let paddedElement = "";
    for (let line of lines!) {
        let c = columns.filter((column) => column.LineNumber === line.lineNumber);

        for (let ii = 0; ii < c.length; ii++) {
            let paddedElement = "";

            if (c[ii].Text) {
                if (ii === c.length - 1) {
                    paddedElement = `${c[ii].Text}`.padEnd(c[ii].Length + 1, " ");
                } else {
                    separator = separator === "\\s" || separator === "\\t" ? " " : separator; // @hack
                    paddedElement = `${c[ii].Text}${separator}`.padEnd(c[ii].Length + 2, " ");
                }
            } else {
                paddedElement = separator;
            }
            newLineText += paddedElement;
        }

        newLineText += "\n";
    }

    return newLineText;
}

/**
 * Build the aligned text from the columnElements array, formatted as a markdown table
 * @param {ColumnElement[]} columns Array of column elements to build the aligned text from
 * @param {(boolean | undefined)} withHeaders If true, the first line will be formatted as a table header
 * @return {*}  {string}
 */
function padAsTable(columns: ColumnElement[], withHeaders: boolean | undefined): string {
    const lines = getLinesFromSelection(getActiveEditor()!);
    let sSeparator = "| ";
    let rSeparator = " |";
    let newLineText = "";

    for (let line of lines!) {
        let c = columns.filter((column) => column.LineNumber === line.lineNumber);

        for (let ii = 0; ii < c.length; ii++) {
            let paddedElement = "";
            let text = "";
            c[ii].Text ? (text = c[ii].Text) : (text = "");

            if (ii === c.length - 1) {
                paddedElement = `${sSeparator}${text}`.padEnd(c[ii].Length + 2, " ") + rSeparator;
            } else {
                paddedElement = `${sSeparator}${text}`.padEnd(c[ii].Length + 3, " ");
            }
            newLineText += paddedElement;
        }
        newLineText += "\n";

        // add headers separator row
        if (withHeaders && line.lineNumber === 0) {
            for (let ii = 0; ii < c.length; ii++) {
                let paddedElement = "";
                if (ii === c.length - 1) {
                    paddedElement = `|${"".padEnd(c[ii].Length + 2, "-")}` + "|";
                } else {
                    paddedElement = `|${"".padEnd(c[ii].Length + 2, "-")}`;
                }
                newLineText += paddedElement;
            }
            newLineText += "\n";
        }
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
        separator = separator === "\\t" ? "\\s" : separator; // @hack: fix tab separator
        this.Elements = line.text.split(new RegExp(separator)).filter((e) => e);
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
