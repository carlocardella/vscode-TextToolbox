import { DecorationRenderOptions, Range, Selection, window, workspace, TextEditorDecorationType, Position } from "vscode";
import { getActiveEditor, getLinesFromDocumentOrSelection, getTextFromSelection, getRegExpObject } from "./helpers";
import { Chance } from "chance";

/**
 * TTDecoration type
 *
 * @class TTDecoration
 */
class TTDecoration {
    public Range: Range;
    public DecorationType: TextEditorDecorationType;
    public Index: any;
    public File: string;

    /**
     * Creates an instance of TTDecoration.
     * @param {Range} range Range to decorate
     * @param {DecorationRenderOptions} decoratorRenderOptions Decoration render options
     * @memberof TTDecoration
     */
    constructor(range: Range, decoratorRenderOptions: DecorationRenderOptions, file: string) {
        this.Range = range;
        this.DecorationType = window.createTextEditorDecorationType(decoratorRenderOptions!);
        this.File = file;

        const chance = new Chance();
        this.Index = chance.guid();
    }
}

class TTDecorationRange {
    Range: Range;
    File: string;

    constructor(range: Range, file: string) {
        this.Range = range;
        this.File = file;
    }
}

interface IRangeToHighlightSettings {
    allMatches?: boolean;
    matchCase?: boolean;
    regex?: boolean;
}

/**
 * Interface for a decoration provider.
 *
 * @interface TTDecorators
 */
interface IDecorators {
    // HighlightText(pickDefaultDecorator: boolean, rangeToHighlight: Range[]): void;
    // RefreshHighlights(): void;
    // RemoveHighlight(removeAll: boolean): void;
    // GetRangeToHighlight(matchCase: boolean, regex?: RegExp): Promise<TTDecorationRange[]>;
}

/**
 * Class to manage text highlight (decorations)
 *
 * @export
 * @class TTDecorations
 * @implements {IDecorators}
 */
export default class TTDecorations implements IDecorators {
    public Decorators: TTDecoration[] = [];
    private config = workspace.getConfiguration("TextToolbox");

    /**
     * Creates an instance of TTDecorations.
     * @memberof TTDecorations
     */
    constructor() {}

    /**
     * Highlight the current word or selection
     *
     * @param {boolean} pickDefaultDecorator Pick a random decorator from the list of available decorators in Settings or ask the user for a color
     * @return {*}
     * @memberof TTDecorations
     */
    async HighlightText(pickDefaultDecorator: boolean, settings?: IRangeToHighlightSettings, rangeToHighlight?: TTDecorationRange[]): Promise<void> {
        const editor = getActiveEditor();
        if (!editor) {
            return;
        }

        let decoratorRenderOptions: DecorationRenderOptions | undefined;
        // default decorator or user input
        pickDefaultDecorator ? (decoratorRenderOptions = this.GetRandomHighlight()) : (decoratorRenderOptions = await this.AskForDecorationColor());

        let decorator: any;
        if (!rangeToHighlight) {
            rangeToHighlight = await this.GetRangeToHighlight(settings);
        }

        rangeToHighlight?.forEach((range) => {
            decorator = new TTDecoration(range.Range, decoratorRenderOptions!, editor.document.uri.fsPath);
            this.Decorators.push(decorator);
        });

        this.RefreshHighlights();
        return Promise.resolve();
    }

    /**
     * Refresh the existing decorations
     *
     * @return {*}
     * @memberof TTDecorations
     */
    RefreshHighlights() {
        const editor = getActiveEditor();
        if (!editor) {
            return;
        }

        if (this.Decorators) {
            this.Decorators.forEach((d) => {
                editor.setDecorations(d.DecorationType, [d.Range]);
            });
        }
    }

    /**
     * Get a random decorator from the list of available decorators in Settings
     *
     * @private
     * @return {*}  {DecorationRenderOptions}
     * @memberof TTDecorations
     */
    private GetRandomHighlight(): DecorationRenderOptions {
        const chance = new Chance();
        let decorationColors = this.config.get<DecorationRenderOptions[]>("decorationDefaults")!;
        return chance.pickone(decorationColors);
    }

    /**
     * Ask for decoration color
     *
     * @return {*}  {(Promise<DecorationRenderOptions | undefined>)}
     * @memberof TTDecorations
     */
    private async AskForDecorationColor(): Promise<DecorationRenderOptions | undefined> {
        const userColor = await window.showInputBox({ ignoreFocusOut: true, prompt: "Enter a color. Accepted formats: color name, hex, rgba" });
        if (!userColor) {
            return Promise.reject();
        }

        const userDecoration: DecorationRenderOptions = {
            backgroundColor: userColor,
        };
        return Promise.resolve(userDecoration);
    }

    /**
     * Remove decorations
     *
     * @return {*}
     * @memberof TTDecorations
     */
    async RemoveHighlight(removeAll: boolean) {
        const editor = getActiveEditor();
        if (!editor) {
            return;
        }

        if (removeAll) {
            this.Decorators.forEach((d) => {
                d.Range = new Range(0, 0, 0, 0); // empty range removes the decorator
            });
            this.RefreshHighlights();
            this.Decorators = [];
        } else {
            let rangeToRemove = await this.GetRangeToHighlight();
            if (rangeToRemove) {
                let decorationToRemove = this.FindDecoration(rangeToRemove[0].Range); // todo: remove multiple highlights?
                if (decorationToRemove) {
                    decorationToRemove.Range = new Range(0, 0, 0, 0);
                }
                this.RefreshHighlights();
            }
        }
    }

    /**
     * Find an existing decoration
     *
     * @param {Range} range Range to find
     * @return {*}  {(TTDecoration | undefined)}
     * @memberof TTDecorations
     */
    FindDecoration(range: Range, cursorPosition?: Position): TTDecoration | undefined {
        let match: TTDecoration | undefined;

        if (range) {
            match = this.Decorators.find((d) => d.Range.isEqual(range));

            if (!match) {
                let editor = getActiveEditor();
                match = this.Decorators.find((d) => d.Range.contains(editor!.selection.active));
            }
        }

        return match;
    }

    /**
     * Find word matches
     *
     * @return {*}
     * @memberof TTDecorations
     */
    async GetRangeToHighlight(settings?: IRangeToHighlightSettings): Promise<TTDecorationRange[] | undefined> {
        const editor = getActiveEditor();
        if (!editor) {
            return Promise.reject("error"); // fix: undefined?
        }

        let rangeToHighlight: Range[] = [];

        if (!settings?.regex) {
            if (editor.selection.isEmpty) {
                // https://code.visualstudio.com/api/references/vscode-api#TextDocument
                // By default words are defined by common separators, like space, -, _, etc. In addition, per language custom [word definitions] can be defined
                // note: if the cursor is at the end of line after a word separator (e.g. a comma), getWordRangeAtPosition() returns null therefore Highlight() or RemoveHighlight() will not work. This is by design
                let range = editor.document.getWordRangeAtPosition(editor.selection.active);
                if (range) {
                    rangeToHighlight.push(range);
                }
            } else {
                rangeToHighlight.push(new Range(editor.selection.start, editor.selection.end));
            }
        }

        let word: any;
        if (settings?.regex) {
            // search by regex
            word = await this.AskForRegEx();
        } else {
            // search by selection or cursor position
            if (rangeToHighlight.length > 0) {
                word = getTextFromSelection(editor, new Selection(rangeToHighlight[0].start, rangeToHighlight[0].end));
            }
        }

        if (word === undefined) {
            return Promise.reject(); // fix: undefined?
        }

        let matches: TTDecorationRange[] = [];
        let lines = getLinesFromDocumentOrSelection(editor);
        if (settings?.regex) {
            lines?.forEach((line) => {
                let regExpMatches = line.text.match(word);
                // there might be multiple matches in a line
                let index = 0;
                regExpMatches?.forEach((regExpMatch) => {
                    index = line.text.indexOf(regExpMatch, index);
                    if (index > -1) {
                        let rangeMatch = new Range(line.lineNumber, index, line.lineNumber, index + regExpMatch!.length);
                        matches.push(new TTDecorationRange(rangeMatch, editor.document.uri.fsPath));
                    }
                });
            });
        } else if (settings?.allMatches) {
            lines?.forEach((line) => {
                let index = 0;
                settings?.matchCase ? (index = line.text.indexOf(word!)) : (index = line.text.toLowerCase().indexOf(word!.toLowerCase()));
                if (index > -1) {
                    let rangeMatch = new Range(line.lineNumber, index, line.lineNumber, index + word!.length);
                    matches.push(new TTDecorationRange(rangeMatch, editor.document.uri.fsPath));
                }
            });
        }

        rangeToHighlight.forEach((range) => {
            matches.push(new TTDecorationRange(range, editor.document.uri.fsPath));
        });

        return Promise.resolve(matches);
    }

    private async AskForRegEx(): Promise<RegExp | undefined> {
        const regex = await window.showInputBox({ ignoreFocusOut: true, prompt: "Regular Expression to search the document" });
        if (!regex) {
            return Promise.reject();
        }

        let regExp = getRegExpObject(regex);
        return Promise.resolve(new RegExp(regExp));
    }
}
