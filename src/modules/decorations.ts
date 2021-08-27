import { DecorationOptions, DecorationRenderOptions, Range, window, workspace } from "vscode";
import { getActiveEditor } from "./helpers";
import { Chance } from "chance";

/**
 * Interface for a decoration provider.
 *
 * @interface TTDecorators
 */
interface TTDecorators {
    HighlightText(pickDefaultDecorator: boolean, rangeOrSelection?: Range): void;
    RefreshHighlights(): void;
    AskForDecorationColor(): Promise<DecorationRenderOptions | undefined>;
    RemoveHighlight(): void;
}

/**
 * Class to manage text highlight (decorations)
 *
 * @export
 * @class TTDecorations
 * @implements {TTDecorators}
 */
export default class TTDecorations implements TTDecorators {
    public Decorators: any[] = [];
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
    async HighlightText(pickDefaultDecorator: boolean, rangeOrSelection?: Range) {
        const editor = getActiveEditor();
        if (!editor) {
            return;
        }

        let decoratorRenderOptions: DecorationRenderOptions | undefined;
        // default decorator or user input
        pickDefaultDecorator ? (decoratorRenderOptions = this.GetRandomHighlight()) : (decoratorRenderOptions = await this.AskForDecorationColor());

        // let rangeToDecorate: Range | undefined = undefined;
        if (!rangeOrSelection) {
            if (editor.selection.isEmpty) {
                rangeOrSelection = editor.document.getWordRangeAtPosition(editor.selection.active);
            } else {
                rangeOrSelection = new Range(editor.selection.start, editor.selection.end);
            }
        }

        let decorator = {
            renderOptions: window.createTextEditorDecorationType(decoratorRenderOptions!),
            range: rangeOrSelection,
        } as DecorationOptions;

        this.Decorators.push(decorator);

        this.RefreshHighlights();
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
                editor.setDecorations(d.renderOptions, [d.range]);
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
    async AskForDecorationColor(): Promise<DecorationRenderOptions | undefined> {
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
     * Remove all decorations
     *
     * @return {*}
     * @memberof TTDecorations
     */
    RemoveHighlight() {
        const editor = getActiveEditor();
        if (!editor) {
            return;
        }

        this.Decorators.forEach((d) => {
            d.range = new Range(0, 0, 0, 0); // empty range removes the decorator
        });

        this.RefreshHighlights();
        this.Decorators = [];
    }
}
