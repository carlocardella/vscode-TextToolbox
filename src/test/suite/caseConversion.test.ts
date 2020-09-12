import * as assert from 'assert';
import { after, before, describe } from 'mocha';
import { sleep, createNewEditor, selectAllText, closeTextEditor, getDocumentTextOrSelection } from '../../modules/helpers';
import { convertToUppercase, convertToLowercase, convertToCapitalCase, convertToDotCase, convertToPascalCase, convertToCamelCase, convertToParamCase, convertToNoCase, convertToHarderCase, convertToConstantCase, convertToPathCase, convertToSentenceCase, convertToSnakeCase } from '../../modules/caseConversion';

suite('caseConversion', () => {
	before(() => {
		console.log('Starting insertText tests');
	});
	after(async () => {
		await sleep(500);
		await closeTextEditor(true);
		console.log('All insertText tests done');
	});

	describe("Case Conversion", () => {
		test('Convert to UPPERCASE', async () => {
			await createNewEditor("test document");
			await selectAllText();
			convertToUppercase();
			await sleep(500);
			console.log(getDocumentTextOrSelection());
			assert.deepStrictEqual(getDocumentTextOrSelection(), 'TEST DOCUMENT');
		});

		test('Convert to lowercase', async () => {
			await createNewEditor("test document");
			await selectAllText();
			convertToUppercase();
			convertToLowercase();
			console.log(getDocumentTextOrSelection());
			assert.deepStrictEqual(getDocumentTextOrSelection(), 'test document');
		});

		test('Convert to Capital Case', async () => {
			await createNewEditor("test document");
			await selectAllText();
			convertToCapitalCase();
			await sleep(500);
			console.log(getDocumentTextOrSelection());
			assert.deepStrictEqual(getDocumentTextOrSelection(), 'Test Document');
		});

		test('Convert to PascalCase', async () => {
			await createNewEditor("test document");
			await selectAllText();
			convertToPascalCase();
			await sleep(500);
			console.log(getDocumentTextOrSelection());
			assert.deepStrictEqual(getDocumentTextOrSelection(), 'TestDocument');
		});

		test('Convert to camelCase', async () => {
			await createNewEditor("test document");
			await selectAllText();
			convertToCamelCase();
			await sleep(500);
			console.log(getDocumentTextOrSelection());
			assert.deepStrictEqual(getDocumentTextOrSelection(), 'testDocument');
		});

		test('Convert to CONSTANT_CASE', async () => {
			await createNewEditor("test document");
			await selectAllText();
			convertToConstantCase();
			await sleep(500);
			console.log(getDocumentTextOrSelection());
			assert.deepStrictEqual(getDocumentTextOrSelection(), 'TEST_DOCUMENT');
		});

		test('Convert to dot.case', async () => {
			await createNewEditor("test document");
			await selectAllText();
			convertToDotCase();
			await sleep(500);
			console.log(getDocumentTextOrSelection());
			assert.deepStrictEqual(getDocumentTextOrSelection(), 'test.document');
		});

		test('Convert to header_case', async () => {
			await createNewEditor("test document");
			await selectAllText();
			convertToHarderCase();
			await sleep(500);
			console.log(getDocumentTextOrSelection());
			assert.deepStrictEqual(getDocumentTextOrSelection(), 'Test-Document');
		});

		test('Convert to no case', async () => {
			await createNewEditor("test document");
			await selectAllText();
			convertToNoCase();
			await sleep(500);
			console.log(getDocumentTextOrSelection());
			assert.deepStrictEqual(getDocumentTextOrSelection(), 'test document');
		});

		test('Convert to param_case', async () => {
			await createNewEditor("test document");
			await selectAllText();
			convertToParamCase();
			await sleep(500);
			console.log(getDocumentTextOrSelection());
			assert.deepStrictEqual(getDocumentTextOrSelection(), 'test-document');
		});

		test('Convert to path/case', async () => {
			await createNewEditor("test document");
			await selectAllText();
			convertToPathCase();
			await sleep(500);
			console.log(getDocumentTextOrSelection());
			assert.deepStrictEqual(getDocumentTextOrSelection(), 'test/document');
		});

		test('Convert to Sentence case', async () => {
			await createNewEditor("test document");
			await selectAllText();
			convertToSentenceCase();
			await sleep(500);
			console.log(getDocumentTextOrSelection());
			assert.deepStrictEqual(getDocumentTextOrSelection(), 'Test document');
		});

		test('Convert to snake_case', async () => {
			await createNewEditor("test document");
			await selectAllText();
			convertToSnakeCase();
			await sleep(500);
			console.log(getDocumentTextOrSelection());
			assert.deepStrictEqual(getDocumentTextOrSelection(), 'test_document');
		});
	});
});