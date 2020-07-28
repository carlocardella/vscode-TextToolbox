import {
	commands,
	ExtensionContext,
} from 'vscode';
// import { convertToUppercase, convertToLowercase, convertToPascalCase } from "./modules/caseConversion";
import * as CaseConversion from "./modules/caseConversion";

export function activate(context: ExtensionContext) {
	console.log("vscode-text is active");

	context.subscriptions.push(commands.registerCommand('vscode-text.Uppercase', () => { CaseConversion.convertToUppercase(); }));
	context.subscriptions.push(commands.registerCommand('vscode-text.Lowercase', () => { CaseConversion.convertToLowercase(); }));
	context.subscriptions.push(commands.registerCommand('vscode-text.PascalCase', () => { CaseConversion.convertToPascalCase(); }));
};


// this method is called when your extension is deactivated
export function deactivate() { }
