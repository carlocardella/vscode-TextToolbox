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

    /**
     * Creates an instance of TTDecoration.
     * @param {Range} range Range to decorate
     * @param {DecorationRenderOptions} decoratorRenderOptions Decoration render options
     * @memberof TTDecoration
     */
    constructor(range: Range, decoratorRenderOptions: DecorationRenderOptions) {
        this.Range = range;
        this.DecorationType = window.createTextEditorDecorationType(decoratorRenderOptions!);

        const chance = new Chance();
        this.Index = chance.guid();
    }
}

/**
 * Interface for a decoration provider.
 *
 * @interface TTDecorators
 */
interface TTDecorators {
    HighlightText(pickDefaultDecorator: boolean, rangeOrSelection?: Range): void;
    GetRangeToHighlight(): Range | undefined;
    RefreshHighlights(): void;
    RemoveHighlight(removeAll: boolean): void;
    FindMatches(): Promise<Range[] | undefined>;
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
    async HighlightText(pickDefaultDecorator: boolean, rangeToHighlight?: Range) {
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

        let decorator = new TTDecoration(rangeToHighlight, decoratorRenderOptions!);

        this.Decorators.push(decorator);

        this.RefreshHighlights();
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

    async FindMatches(): Promise<Range[] | undefined> {
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

        let matches: Range[] = [];
        let lines = getLinesFromDocumentOrSelection(editor, range);
        let text = lines?.forEach((line) => {
            if (line.text.indexOf(word!) > -1) {
                matches.push(new Range(line.lineNumber, line.text.indexOf(word!), line.lineNumber, line.text.indexOf(word!) + word!.length));
            }
        });

        Promise.resolve(matches);
    }
}
