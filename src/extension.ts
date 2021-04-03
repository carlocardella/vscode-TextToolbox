import { commands, ExtensionContext, window, workspace } from 'vscode';
import * as CaseConversion from "./modules/caseConversion";
import * as InsertText from "./modules/insertText";
import * as StatusBarSelection from './modules/statusBarSelection';
import * as FilterText from './modules/filterText';
import * as SortLines from './modules/sortText';
import * as ControlCharacters from './modules/controlCharacters';
import * as Helpers from './modules/helpers';
import * as AlignText from './modules/alignText';
import * as SplitText from './modules/splitText';


export function activate(context: ExtensionContext) {
	console.log("vscode-texttoolbox is active");

	// case conversions
	context.subscriptions.push(commands.registerTextEditorCommand('vscode-texttoolbox.Uppercase', () => { CaseConversion.convertToUppercase(); }));
	context.subscriptions.push(commands.registerTextEditorCommand('vscode-texttoolbox.Lowercase', () => { CaseConversion.convertToLowercase(); }));
	context.subscriptions.push(commands.registerTextEditorCommand('vscode-texttoolbox.PascalCase', () => { CaseConversion.convertToPascalCase(); }));
	context.subscriptions.push(commands.registerTextEditorCommand('vscode-texttoolbox.CapitalCase', () => { CaseConversion.convertToCapitalCase(); }));
	context.subscriptions.push(commands.registerTextEditorCommand('vscode-texttoolbox.CamelCase', () => { CaseConversion.convertToCamelCase(); }));
	context.subscriptions.push(commands.registerTextEditorCommand('vscode-texttoolbox.ConstantCase', () => { CaseConversion.convertToConstantCase(); }));
	context.subscriptions.push(commands.registerTextEditorCommand('vscode-texttoolbox.DotCase', () => { CaseConversion.convertToDotCase(); }));
	context.subscriptions.push(commands.registerTextEditorCommand('vscode-texttoolbox.HarderCase', () => { CaseConversion.convertToHarderCase(); }));
	context.subscriptions.push(commands.registerTextEditorCommand('vscode-texttoolbox.NoCase', () => { CaseConversion.convertToNoCase(); }));
	context.subscriptions.push(commands.registerTextEditorCommand('vscode-texttoolbox.ParamCase', () => { CaseConversion.convertToParamCase(); }));
	context.subscriptions.push(commands.registerTextEditorCommand('vscode-texttoolbox.SentenceCase', () => { CaseConversion.convertToSentenceCase(); }));
	context.subscriptions.push(commands.registerTextEditorCommand('vscode-texttoolbox.SnakeCase', () => { CaseConversion.convertToSnakeCase(); }));

	// insert text
	context.subscriptions.push(commands.registerTextEditorCommand('vscode-texttoolbox.InsertGUID', () => { InsertText.insertGUID(); }));
	context.subscriptions.push(commands.registerTextEditorCommand('vscode-texttoolbox.InsertDate', () => { InsertText.pickDateTime(); }));
	context.subscriptions.push(commands.registerTextEditorCommand('vscode-texttoolbox.PickRandom', () => { InsertText.pickRandom(); }));
	context.subscriptions.push(commands.registerTextEditorCommand('vscode-texttoolbox.PadSelectionRight', () => { InsertText.padSelection(InsertText.padDirection.right); }));
	context.subscriptions.push(commands.registerTextEditorCommand('vscode-texttoolbox.PadSelectionLeft', () => { InsertText.padSelection(InsertText.padDirection.left); }));
	context.subscriptions.push(commands.registerTextEditorCommand('vscode-texttoolbox.InsertLineNumbers', () => { InsertText.insertLineNumbers(); }));
	context.subscriptions.push(commands.registerTextEditorCommand('vscode-texttoolbox.InsertSequenceNumbers', () => { InsertText.insertSequence(InsertText.sequenceType.Numbers); }));

	// filter text
	context.subscriptions.push(commands.registerTextEditorCommand('vscode-texttoolbox.RemoveAllEmptyLines', () => { FilterText.removeEmptyLines(false); }));
	context.subscriptions.push(commands.registerTextEditorCommand('vscode-texttoolbox.RemoveRedundantEmptyLines', () => { FilterText.removeEmptyLines(true); }));
	context.subscriptions.push(commands.registerTextEditorCommand('vscode-texttoolbox.RemoveDuplicateLines', () => { FilterText.removeDuplicateLines(false); }));
	context.subscriptions.push(commands.registerTextEditorCommand('vscode-texttoolbox.RemoveDuplicateLinesResultInNewEditor', () => { FilterText.removeDuplicateLines(true); }));
	context.subscriptions.push(commands.registerTextEditorCommand('vscode-texttoolbox.FilterLinesUsingRegExpOrString', () => { FilterText.filterLinesUsingRegExpOrString(true); }));
	context.subscriptions.push(commands.registerTextEditorCommand('vscode-texteditor.OpenSelectionInNewEditor', () => { FilterText.openSelectionInNewEditor(); }));

	// sort text
	context.subscriptions.push(commands.registerTextEditorCommand('vscode-texteditor.SortLinesResultInNewEditor', () => { SortLines.askForSortDirection(true); }));
	context.subscriptions.push(commands.registerTextEditorCommand('vscode-texteditor.SortLines', () => { SortLines.askForSortDirection(); }));

	// align
	context.subscriptions.push(commands.registerTextEditorCommand('vscode-texttoolbox.AlignToSeparator', () => { AlignText.alignToSeparator(); }));

	// split text
	context.subscriptions.push(commands.registerTextEditorCommand('vscode-texttoolbox.SplitText', () => { SplitText.splitText(false); }));
	context.subscriptions.push(commands.registerTextEditorCommand('vscode-texttoolbox.SplitTextOpenInNewEditor', () => { SplitText.splitText(true); }));
	
	// control characters
	window.onDidChangeActiveTextEditor(editor => {
		if (editor) { ControlCharacters.decorateControlCharacters(editor); }
	}, null, context.subscriptions);
	workspace.onDidChangeTextDocument(event => {
		let activeEditor = Helpers.getActiveEditor();
		if (activeEditor) { ControlCharacters.decorateControlCharacters(activeEditor); }
	}, null, context.subscriptions);
	context.subscriptions.push(workspace.onDidChangeConfiguration(e => {
		if (e.affectsConfiguration("tt.decorateControlCharacters")) {
			const editor = Helpers.getActiveEditor();
			if (editor) { ControlCharacters.decorateControlCharacters(editor, true); }
		}
	}));
	context.subscriptions.push(commands.registerTextEditorCommand('vscode-texteditor.RemoveControlCharacters', () => { ControlCharacters.removeControlCharacters(); }));


	// status bar selection
	if (workspace.getConfiguration().get('tt.enableStatusBarWordLineCount')) {
		StatusBarSelection.createStatusBarItem(context);
	}
};


// this method is called when your extension is deactivated
export function deactivate() {
	StatusBarSelection.disposeStatusBarItem();
}
