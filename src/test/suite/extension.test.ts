import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as CaseConversion from '../../modules/caseConversion';
import { before, after, describe } from 'mocha';
import { createTextEditor, sleep } from "../../modules/helpers";
import { hasUncaughtExceptionCaptureCallback } from 'process';

const testFolderLocation = '/../../../src/test/suite/testdocument.txt';


suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	describe('Chance casing', function () {

		test('UPPERCASE', () => {
			// return createNewEditor().then(() => {
			// 	vscode.commands.executeCommand('editor.action.selectAll');
			// }).then(() => {
			// 	CaseConversion.convertToUppercase();
			// });
			vscode.workspace.openTextDocument({ content: "test document", language: "" }).then((doc) => {
				vscode.window.showTextDocument(doc);
			}).then(() => {
				vscode.commands.executeCommand('editor.action.selectAll');
			}).then(() => {
				CaseConversion.convertToUppercase();
			}).then(() => {
				let newString = vscode.window.activeTextEditor?.document.getText();
				// assert(newString, "pippo");
				// assert.strictEqual(newString, "TESTuu DOCUMENT");
				vscode.commands.executeCommand('workbench.action.closeActiveEditor');
			});
		});

		// test('should convert a string to UPPERCASE', function () {
		// 	return createNewEditor().then(() => {
		// 		vscode.commands.executeCommand('editor.action.selectAll');
		// 		CaseConversion.convertToUppercase();
		// 		let newString = vscode.window.activeTextEditor?.document.getText();
		// 		return assert.strictEqual(newString, "TESTuu DOCUMENT");
		// 		vscode.commands.executeCommand('workbench.action.closeActiveEditor');
		// 	});
		// });

		// test('should convert a string to lowercase', () => {
		// 	return createNewEditor().then(() => {
		// 		vscode.commands.executeCommand('editor.action.selectAll');
		// 		CaseConversion.convertToLowercase();
		// 		let newString = vscode.window.activeTextEditor?.document.getText();
		// 		assert.strictEqual(newString, "test document");
		// 		vscode.commands.executeCommand('workbench.action.closeActiveEditor');
		// 	});
		// });

		// test('should convert a string to PascalCase', () => {
		// 	return createNewEditor().then(() => {
		// 		vscode.commands.executeCommand('editor.action.selectAll');
		// 		CaseConversion.convertToPascalCase();
		// 		let newString = vscode.window.activeTextEditor?.document.getText();
		// 		assert.strictEqual(newString, "TestDocument");
		// 		vscode.commands.executeCommand('workbench.action.closeActiveEditor');
		// 	});
		// });

		// test('should convert a string to Capital Case', () => {
		// 	return createNewEditor().then(() => {
		// 		vscode.commands.executeCommand('editor.action.selectAll');
		// 		CaseConversion.convertToCapitalCase();
		// 		let newString = vscode.window.activeTextEditor?.document.getText();
		// 		assert.strictEqual(newString, "Test Document");
		// 		vscode.commands.executeCommand('workbench.action.closeActiveEditor');
		// 	});
		// });

		// test('should convert a string to camel Case', () => {
		// 	return createNewEditor().then(() => {
		// 		vscode.commands.executeCommand('editor.action.selectAll');
		// 		CaseConversion.convertToCamelCase();
		// 		let newString = vscode.window.activeTextEditor?.document.getText();
		// 		assert.strictEqual(newString, "test Document");
		// 		vscode.commands.executeCommand('workbench.action.closeActiveEditor');
		// 	});
		// });

		// test('should convert a string to CONSTANT_CASE', () => {
		// 	return createNewEditor().then(() => {
		// 		vscode.commands.executeCommand('editor.action.selectAll');
		// 		CaseConversion.convertToConstantCase();
		// 		let newString = vscode.window.activeTextEditor?.document.getText();
		// 		assert.strictEqual(newString, "TEST_DOCUMENT");
		// 		vscode.commands.executeCommand('workbench.action.closeActiveEditor');
		// 	});
		// });

		// test('should convert a string to dot.case', () => {
		// 	return createNewEditor().then(() => {
		// 		vscode.commands.executeCommand('editor.action.selectAll');
		// 		CaseConversion.convertToDotCase();
		// 		let newString = vscode.window.activeTextEditor?.document.getText();
		// 		assert.strictEqual(newString, "test.document");
		// 		vscode.commands.executeCommand('workbench.action.closeActiveEditor');
		// 	});
		// });

		// test('should convert a string to Harder-Case', () => {
		// 	return createNewEditor().then(() => {
		// 		vscode.commands.executeCommand('editor.action.selectAll');
		// 		CaseConversion.convertToHarderCase();
		// 		let newString = vscode.window.activeTextEditor?.document.getText();
		// 		assert.strictEqual(newString, "Test-Document");
		// 		vscode.commands.executeCommand('workbench.action.closeActiveEditor');
		// 	});
		// });

		// test('should convert a string to no case', () => {
		// 	return createNewEditor().then(() => {
		// 		vscode.commands.executeCommand('editor.action.selectAll');
		// 		CaseConversion.convertToNoCase();
		// 		let newString = vscode.window.activeTextEditor?.document.getText();
		// 		assert.strictEqual(newString, "test document");
		// 		vscode.commands.executeCommand('workbench.action.closeActiveEditor');
		// 	});
		// });

		// test('should convert a string to param-case', () => {
		// 	return createNewEditor().then(() => {
		// 		vscode.commands.executeCommand('editor.action.selectAll');
		// 		CaseConversion.convertToParamCase();
		// 		let newString = vscode.window.activeTextEditor?.document.getText();
		// 		assert.strictEqual(newString, "test-document");
		// 		vscode.commands.executeCommand('workbench.action.closeActiveEditor');
		// 	});
		// });

		// test('should convert a string to Sencente case', () => {
		// 	return createNewEditor().then(() => {
		// 		vscode.commands.executeCommand('editor.action.selectAll');
		// 		CaseConversion.convertToSentenceCase();
		// 		let newString = vscode.window.activeTextEditor?.document.getText();
		// 		assert.strictEqual(newString, "Test document");
		// 		vscode.commands.executeCommand('workbench.action.closeActiveEditor');
		// 	});
		// });

		// test('should convert a string to snake_case', () => {
		// 	return createNewEditor().then(() => {
		// 		vscode.commands.executeCommand('editor.action.selectAll');
		// 		CaseConversion.convertToSnakeCase();
		// 		let newString = vscode.window.activeTextEditor?.document.getText();
		// 		assert.equal(newString, "test_document");
		// 		vscode.commands.executeCommand('workbench.action.closeActiveEditor');
		// 	});
		// });

	});
});