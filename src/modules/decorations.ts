import { DecorationRenderOptions, Range, Selection, window, workspace, TextEditorDecorationType } from "vscode";
import { getActiveEditor, getLinesFromDocumentOrSelection, getTextFromSelection } from "./helpers";
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

class TTDecorationMatches {
    Range: Range;
    File: string;

    constructor(range: Range, file: string) {
        this.Range = range;
        this.File = file;
    }
}

/**
 * Interface for a decoration provider.
 *
 * @interface TTDecorators
 */
interface TTDecorators {
    HighlightText(pickDefaultDecorator: boolean, all?: boolean, rangeToHighlight?: Range): void;
    GetRangeToHighlight(): Range | undefined;
    RefreshHighlights(): void;
    RemoveHighlight(removeAll: boolean): void;
    FindMatches(matchCase: boolean): Promise<TTDecorationMatches[]>;
}

/**
 * Class to manage text highlight (decorations)
 *
 * @export
 * @class TTDecorations
 * @implements {TTDecorators}
 */
export default class TTDecorations implements TTDecorators {
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
    // async HighlightText(pickDefaultDecorator: boolean, rangeToHighlight: Range): Promise<void>;
    // async HighlightText(pickDefaultDecorator: boolean, all: boolean): Promise<void>;
    async HighlightText(pickDefaultDecorator: boolean, all?: boolean, rangeToHighlight?: Range): Promise<void> {
        const editor = getActiveEditor();
        if (!editor) {
            return;
        }

        let decoratorRenderOptions: DecorationRenderOptions | undefined;
        // default decorator or user input
        pickDefaultDecorator ? (decoratorRenderOptions = this.GetRandomHighlight()) : (decoratorRenderOptions = await this.AskForDecorationColor());

        if (!rangeToHighlight) {
            rangeToHighlight = this.GetRangeToHighlight();
        }
        if (!rangeToHighlight) {
            return;
        }

        let decorator: any;
        if (all) {
            let matches = await this.FindMatches();

            matches.forEach(async (m) => {
                decorator = new TTDecoration(m.Range, decoratorRenderOptions!, editor.document.uri.fsPath);
                this.Decorators.push(decorator);
            });
        } else {
            decorator = new TTDecoration(rangeToHighlight, decoratorRenderOptions!, editor.document.uri.fsPath);
        }

        this.Decorators.push(decorator);

        this.RefreshHighlights();
        return Promise.resolve();
    }

    /**
     * Get the range to highlight
     *
     * @return {*}  {(Range | undefined)}
     * @memberof TTDecorations
     */
    GetRangeToHighlight(): Range | undefined {
        const editor = getActiveEditor();
        if (!editor) {
            return;
        }

        let rangeToHighlight: Range;
        if (editor.selection.isEmpty) {
            rangeToHighlight = editor.document.getWordRangeAtPosition(editor.selection.active)!;
        } else {
            rangeToHighlight = new Range(editor.selection.start, editor.selection.end);
        }

        return rangeToHighlight;
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
            Promise.reject();
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
    RemoveHighlight(removeAll: boolean) {
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
            // todo: remove the decoration that was clicked on
            let rangeToRemove = this.GetRangeToHighlight()!;
            let decorationToRemove = this.FindDecoration(rangeToRemove);
            if (decorationToRemove) {
                decorationToRemove.Range = new Range(0, 0, 0, 0);
            }
            this.RefreshHighlights();
        }
    }

    /**
     * Find the decoration to remove
     *
     * @param {Range} range Range to find
     * @return {*}  {(TTDecoration | undefined)}
     * @memberof TTDecorations
     */
    FindDecoration(range: Range): TTDecoration | undefined {
        return this.Decorators.find((d) => d.Range.isEqual(range));
    }

    /**
     * Find word matches
     *
     * @return {*}
     * @memberof TTDecorations
     */
    async FindMatches(matchCase: boolean): Promise<TTDecorationMatches[]> {
        const editor = getActiveEditor();
        if (!editor) {
            return Promise.reject();
        }

        let range = this.GetRangeToHighlight();
        if (!range) {
            return Promise.reject();
        }

        let word = getTextFromSelection(editor, new Selection(range!.start, range!.end));
        if (!word) {
            return Promise.reject();
        }

        let matches: TTDecorationMatches[] = [];
        let lines = getLinesFromDocumentOrSelection(editor);
        lines?.forEach((line) => {
            let index = 0;
            matchCase ? line.text.indexOf(word!) : line.text.toLowerCase().indexOf(word!.toLowerCase());
            if (index > -1) {
                let rangeMatch = new Range(line.lineNumber, index, line.lineNumber, index + word!.length);
                matches.push(new TTDecorationMatches(rangeMatch, editor.document.uri.fsPath));
            }
        });

        return Promise.resolve(matches);
    }
}
