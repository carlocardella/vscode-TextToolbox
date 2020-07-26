import {
	commands,
	ExtensionContext,
} from 'vscode';
import { convertToUppercase, convertToLowercase } from "./modules/caseConversion";

export function activate(context: ExtensionContext) {
	console.log("vscode-text is active");

	// context.subscriptions.push(commands.registerCommand("Text Toolbox: UPPERCASE", () => { convertToUppercase(); }));

	context.subscriptions.push(commands.registerCommand('vscode-text.Uppercase', () => {
		convertToUppercase();
	}));
	context.subscriptions.push(commands.registerCommand('vscode-text.Lowercase', () => {
		convertToLowercase();
	}));
};


// this method is called when your extension is deactivated
export function deactivate() { }
