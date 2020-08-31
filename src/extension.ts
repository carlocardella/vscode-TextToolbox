import { commands, ExtensionContext, workspace } from 'vscode';
import * as CaseConversion from "./modules/caseConversion";
import * as InsertText from "./modules/insertText";
import * as StatusBarSelection from './modules/statusBarSelection';
import * as FilterText from './modules/filterText';


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
	context.subscriptions.push(commands.registerTextEditorCommand('vscode-texttoolbox.PadRight', () => { InsertText.askForPadDetails(InsertText.padDirection.right); }));
	context.subscriptions.push(commands.registerTextEditorCommand('vscode-texttoolbox.PadLeft', () => { InsertText.askForPadDetails(InsertText.padDirection.left); }));

	// filter text
	context.subscriptions.push(commands.registerTextEditorCommand('vscode-texttoolbox.RemoveAllEmptyLines', () => { FilterText.removeEmptyLines(false); }));
	context.subscriptions.push(commands.registerTextEditorCommand('vscode-texttoolbox.RemoveRedundantEmptyLines', () => { FilterText.removeEmptyLines(true); }));

	// status bar selection
	if (workspace.getConfiguration().get('tt.enableStatusBarWordLineCount')) {
		StatusBarSelection.createStatusBarItem(context);
	}
};


// this method is called when your extension is deactivated
export function deactivate() {
	StatusBarSelection.disposeStatusBarItem();
}
