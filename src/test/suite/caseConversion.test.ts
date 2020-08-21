import * as assert from 'assert';
import { after, before, afterEach } from 'mocha';
import * as vscode from 'vscode';
import { createTextEditor, sleep, createNewEditor, getDocumentText, selectAllText, closeTextEditor } from '../../modules/helpers';
import { convertToUppercase, convertToLowercase, convertToCapitalCase, convertToDotCase, convertToPascalCase, convertToCamelCase, convertToParamCase, convertToNoCase, convertToHarderCase, convertToConstantCase, convertToPathCase, convertToSentenceCase, convertToSnakeCase } from '../../modules/caseConversion';

suite('caseConversion', () => {
	before(() => {
		console.log('Starting casaeConversion tests');
	});
	after(() => {
		console.log('All caseConversion tests done');
	});
	afterEach(() => {
		closeTextEditor();
	});


	test('Convert to UPPERCASE', async () => {
		await createNewEditor();
		await vscode.commands.executeCommand('editor.action.selectAll');
		convertToUppercase();
		await sleep(200);
		console.log(getDocumentText());
		assert.deepStrictEqual(getDocumentText(), 'TEST DOCUMENT');
	});

	test('Convert to lowercase', async () => {
		await createNewEditor();
		selectAllText();
		convertToUppercase();
		selectAllText();
		convertToLowercase();
		console.log(getDocumentText());
		assert.deepStrictEqual(getDocumentText(), 'test document');
	});

	test('Convert to Capital Case', async () => {
		await createNewEditor();
		await vscode.commands.executeCommand('editor.action.selectAll');
		convertToCapitalCase();
		await sleep(200);
		console.log(getDocumentText());
		assert.deepStrictEqual(getDocumentText(), 'Test Document');
	});

	test('Convert to PascalCase', async () => {
		await createNewEditor();
		await vscode.commands.executeCommand('editor.action.selectAll');
		convertToPascalCase();
		await sleep(200);
		console.log(getDocumentText());
		assert.deepStrictEqual(getDocumentText(), 'TestDocument');
	});

	test('Convert to camelCase', async () => {
		await createNewEditor();
		await vscode.commands.executeCommand('editor.action.selectAll');
		convertToCamelCase();
		await sleep(200);
		console.log(getDocumentText());
		assert.deepStrictEqual(getDocumentText(), 'testDocument');
	});

	test('Convert to CONSTANT_CASE', async () => {
		await createNewEditor();
		await vscode.commands.executeCommand('editor.action.selectAll');
		convertToConstantCase();
		await sleep(200);
		console.log(getDocumentText());
		assert.deepStrictEqual(getDocumentText(), 'TEST_DOCUMENT');
	});

	test('Convert to dot.case', async () => {
		await createNewEditor();
		await vscode.commands.executeCommand('editor.action.selectAll');
		convertToDotCase();
		await sleep(200);
		console.log(getDocumentText());
		assert.deepStrictEqual(getDocumentText(), 'test.document');
	});

	test('Convert to header_case', async () => {
		await createNewEditor();
		await vscode.commands.executeCommand('editor.action.selectAll');
		convertToHarderCase();
		await sleep(200);
		console.log(getDocumentText());
		assert.deepStrictEqual(getDocumentText(), 'Test-Document');
	});

	test('Convert to no case', async () => {
		await createNewEditor();
		await vscode.commands.executeCommand('editor.action.selectAll');
		convertToNoCase();
		await sleep(200);
		console.log(getDocumentText());
		assert.deepStrictEqual(getDocumentText(), 'test document');
	});

	test('Convert to param_case', async () => {
		await createNewEditor();
		await vscode.commands.executeCommand('editor.action.selectAll');
		convertToParamCase();
		await sleep(200);
		console.log(getDocumentText());
		assert.deepStrictEqual(getDocumentText(), 'test-document');
	});

	test('Convert to path/case', async () => {
		await createNewEditor();
		await vscode.commands.executeCommand('editor.action.selectAll');
		convertToPathCase();
		await sleep(200);
		console.log(getDocumentText());
		assert.deepStrictEqual(getDocumentText(), 'test/document');
	});

	test('Convert to Sentence case', async () => {
		await createNewEditor();
		await vscode.commands.executeCommand('editor.action.selectAll');
		convertToSentenceCase();
		await sleep(200);
		console.log(getDocumentText());
		assert.deepStrictEqual(getDocumentText(), 'Test document');
	});

	test('Convert to snake_case', async () => {
		await createNewEditor();
		await vscode.commands.executeCommand('editor.action.selectAll');
		convertToSnakeCase();
		await sleep(200);
		console.log(getDocumentText());
		assert.deepStrictEqual(getDocumentText(), 'test_document');
	});
});