import {
	commands,
	ExtensionContext,
} from 'vscode';
import * as CaseConversion from "./modules/caseConversion";
import { experiment1, mySelectAll } from "./modules/experiments";

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

	// context.subscriptions.push(commands.registerCommand('vscode-texttoolbox.experiment1', () => { experiment1(); }));
	// context.subscriptions.push(commands.registerCommand('vscode-texttoolbox.mySelectAll', () => { mySelectAll(); }));

	context.subscriptions.push(commands.registerTextEditorCommand('vscode-texttoolbox.experiment1', () => { experiment1(); }));
	context.subscriptions.push(commands.registerTextEditorCommand('vscode-texttoolbox.mySelectAll', () => { mySelectAll(); }));
};


// this method is called when your extension is deactivated
export function deactivate() { }
