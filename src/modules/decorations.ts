import { DecorationOptions, DecorationRenderOptions, Range, window, workspace } from "vscode";
import { getActiveEditor } from "./helpers";
import { Chance } from "chance";

/**
 * Interface for a decoration provider.
 *
 * @interface TTDecorators
 */
interface TTDecorators { }

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

    constructor() {}

    /**
     * Highlight the current word or selection
     *
     * @param {boolean} pickDefaultDecorator Pick a random decorator from the list of available decorators in Settings or ask the user for a color
     * @return {*} 
     * @memberof TTDecorations
     */
    async HighlightText(pickDefaultDecorator: boolean) {
        const editor = getActiveEditor();
        if (!editor) {
            return;
        }

        let decoratorRenderOptions: DecorationRenderOptions | undefined;
        // default decorator or user input
        pickDefaultDecorator ? (decoratorRenderOptions = this.GetRandomDecorator()) : (decoratorRenderOptions = await this.AskForDecorationColor());

        let rangeToDecorate: Range | undefined = undefined;
        if (editor.selection.isEmpty) {
            rangeToDecorate = editor.document.getWordRangeAtPosition(editor.selection.active);
        } else {
            rangeToDecorate = new Range(editor.selection.start, editor.selection.end);
        }

        let decorator = {
            renderOptions: window.createTextEditorDecorationType(decoratorRenderOptions!),
            range: rangeToDecorate,
        } as DecorationOptions;

        this.Decorators.push(decorator);

        this.RefreshDecorations();
    }

    /**
     * Refresh the existing decorations
     *
     * @return {*} 
     * @memberof TTDecorations
     */
    RefreshDecorations() {
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
    private GetRandomDecorator(): DecorationRenderOptions {
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
    RemoveDecoration() {
        const editor = getActiveEditor();
        if (!editor) {
            return;
        }

        this.Decorators.forEach((d) => {
            d.range = new Range(0, 0, 0, 0); // empty range removes the decorator
        });

        this.RefreshDecorations();
        this.Decorators = [];
    }
}
