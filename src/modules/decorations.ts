import { DecorationOptions, DecorationRenderOptions, Range, window, workspace } from "vscode";
import { getActiveEditor } from "./helpers";
import { Chance } from "chance";

interface TTDecorators {}
export default class TTDecorations implements TTDecorators {
    public Decorators: any[] = [];
    private config = workspace.getConfiguration("TextToolbox");

    constructor() {}

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

    private GetRandomDecorator(): DecorationRenderOptions {
        const chance = new Chance();
        let decorationColors = this.config.get<DecorationRenderOptions[]>("decorationDefaults")!;
        return chance.pickone(decorationColors);
    }

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

    RemoveDecoration() {
        const editor = getActiveEditor();
        if (!editor) {
            return;
        }

        this.Decorators.forEach((d) => {
            // d.renderOptions = window.createTextEditorDecorationType({}),
            editor.setDecorations(d.renderOptions, []);
        });

        this.RefreshDecorations();
        this.Decorators = [];
    }
}
