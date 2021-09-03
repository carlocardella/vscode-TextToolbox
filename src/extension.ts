import { commands, ExtensionContext, window, workspace } from "vscode";
import * as CaseConversion from "./modules/caseConversion";
import * as InsertText from "./modules/insertText";
import * as StatusBarSelection from "./modules/statusBarSelection";
import * as FilterText from "./modules/filterText";
import * as SortLines from "./modules/sortText";
import * as ControlCharacters from "./modules/controlCharacters";
import * as Helpers from "./modules/helpers";
import * as TextManipulation from "./modules/textManipulation";
import * as Json from "./modules/json";
import * as AlignText from "./modules/alignText";
import TTDecorations from "./modules/decorations";

export function activate(context: ExtensionContext) {
    console.log("vscode-texttoolbox is active");

    // case conversions
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.PascalCase", () => {
            CaseConversion.convertSelection(CaseConversion.caseConversions.pascalCase);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.CamelCase", () => {
            CaseConversion.convertSelection(CaseConversion.caseConversions.camelCase);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.ConstantCase", () => {
            CaseConversion.convertSelection(CaseConversion.caseConversions.constantCase);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.DotCase", () => {
            CaseConversion.convertSelection(CaseConversion.caseConversions.dotCase);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.HeaderCase", () => {
            CaseConversion.convertSelection(CaseConversion.caseConversions.headerCase);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.KebabCase", () => {
            CaseConversion.convertSelection(CaseConversion.caseConversions.kebabCase);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.SentenceCase", () => {
            CaseConversion.convertSelection(CaseConversion.caseConversions.sentenceCase);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.SnakeCase", () => {
            CaseConversion.convertSelection(CaseConversion.caseConversions.snakeCase);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.InvertCase", () => {
            CaseConversion.convertSelection(CaseConversion.caseConversions.invertCase);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.PathCase", () => {
            CaseConversion.convertSelection(CaseConversion.caseConversions.pathCase);
        })
    );

    // insert text
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.InsertGUID", () => {
            InsertText.insertGUID();
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.InsertGuidAllZeros", () => {
            InsertText.insertGUID(true);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.InsertDate", () => {
            InsertText.pickDateTime();
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.PickRandom", () => {
            InsertText.pickRandom();
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.PadSelectionRight", () => {
            InsertText.padSelection(InsertText.padDirection.right);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.PadSelectionLeft", () => {
            InsertText.padSelection(InsertText.padDirection.left);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.InsertLineNumbers", () => {
            InsertText.insertLineNumbers();
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.InsertSequenceNumbers", () => {
            InsertText.insertSequence(InsertText.sequenceType.Numbers);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.InsertLoremIpsum", () => {
            InsertText.insertLoremIpsum();
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.InsertCurrency", () => {
            InsertText.insertCurrency();
        })
    );

    // filter text
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.RemoveAllEmptyLines", () => {
            FilterText.removeEmptyLines(false);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.RemoveRedundantEmptyLines", () => {
            FilterText.removeEmptyLines(true);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.RemoveDuplicateLines", () => {
            FilterText.removeDuplicateLines(false);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.RemoveDuplicateLinesResultInNewEditor", () => {
            FilterText.removeDuplicateLines(true);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.FilterLinesUsingRegExpOrString", () => {
            FilterText.filterLinesUsingRegExpOrString(true);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.OpenSelectionInNewEditor", () => {
            FilterText.openSelectionInNewEditor();
        })
    );

    // sort text
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.SortLinesResultInNewEditor", () => {
            SortLines.askForSortDirection(true);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.SortLines", () => {
            SortLines.askForSortDirection();
        })
    );

    // text manipulations
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.TrimLineOrSelection", () => {
            TextManipulation.trimLineOrSelection();
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.SplitSelection", () => {
            TextManipulation.splitSelection(false);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.SplitSelectionOpenInNewEditor", () => {
            TextManipulation.splitSelection(true);
        })
    );

    // json
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.StringifyJson", () => {
            Json.stringifyJson(false);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.FixJson", () => {
            Json.stringifyJson(true);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.MinifyJson", () => {
            Json.minifyJson();
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.EscapeWin32PathInJson", () => {
            Json.escapeWin32PathInJson();
        })
    );

    // path transformation
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.TransformPathToPosix", () => {
            TextManipulation.transformPath(TextManipulation.pathTransformationType.posix);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.TransformPathToWin32", () => {
            TextManipulation.transformPath(TextManipulation.pathTransformationType.win32);
        })
    );

    // align
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.AlignToSeparator", () => {
            AlignText.alignToSeparator();
        })
    );

    // highlight
    let decorations: TTDecorations;
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.HighlightText", () => {
            if (!decorations) {
                decorations = new TTDecorations();
            }
            decorations.HighlightText(true);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.HighlightAllMatchesCaseSensitive", () => {
            if (!decorations) {
                decorations = new TTDecorations();
            }
            decorations.HighlightText(true, {allMatches: true, matchCase: true});
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.HighlightAllMatchesCaseInsensitive", () => {
            if (!decorations) {
                decorations = new TTDecorations();
            }
            decorations.HighlightText(true, { allMatches: true, matchCase: false });
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.HighlightWithRegExp", () => {
            if (!decorations) {
                decorations = new TTDecorations();
            }
            decorations.HighlightText(true, {regex: true});
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.HighlightAllMatchesWithColor", () => {
            if (!decorations) {
                decorations = new TTDecorations();
            }
            decorations.HighlightText(false);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.HighlightWithColor", () => {
            if (!decorations) {
                decorations = new TTDecorations();
            }
            decorations.HighlightText(false);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.RemoveAllHighlights", () => {
            if (!decorations) {
                decorations = new TTDecorations();
            }
            decorations.RemoveHighlight(true);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.RemoveHighlight", () => {
            if (!decorations) {
                decorations = new TTDecorations();
            }
            decorations.RemoveHighlight(false);
        })
    );

    // events
    window.onDidChangeActiveTextEditor(
        (editor) => {
            if (editor) {
                ControlCharacters.decorateControlCharacters(editor);
                if (decorations) {
                    decorations.RefreshHighlights();
                }
            }
        },
        null,
        context.subscriptions
    );
    workspace.onDidChangeTextDocument(
        (event) => {
            let activeEditor = Helpers.getActiveEditor();
            if (activeEditor) {
                ControlCharacters.decorateControlCharacters(activeEditor);
            }

            if (decorations) {
                decorations.RefreshHighlights();
            }

            // todo: https://github.com/Microsoft/vscode/issues/30066
            // if (workspace.getConfiguration().get('TextToolbox.removeControlCharactersOnPaste')) {
            // 	ControlCharacters.removeControlCharacters(getActiveEditor());
            // }
        },
        null,
        context.subscriptions
    );

    // control characters
    context.subscriptions.push(
        workspace.onDidChangeConfiguration((e) => {
            if (e.affectsConfiguration("TextToolbox.decorateControlCharacters")) {
                const editor = Helpers.getActiveEditor();
                if (editor) {
                    ControlCharacters.decorateControlCharacters(editor, true);
                }
            }
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.RemoveControlCharacters", () => {
            ControlCharacters.removeControlCharacters();
        })
    );

    // status bar selection
    if (workspace.getConfiguration().get("TextToolbox.enableStatusBarWordLineCount")) {
        StatusBarSelection.createStatusBarItem(context);
    }
}

// this method is called when your extension is deactivated
export function deactivate() {
    StatusBarSelection.disposeStatusBarItem();
}
