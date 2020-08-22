import * as assert from 'assert';
import { after, before, afterEach } from 'mocha';
import { sleep, createNewEditor, getDocumentText, selectAllText, closeTextEditor } from '../../modules/helpers';
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
		await selectAllText();
		convertToUppercase();
		await sleep(200);
		console.log(getDocumentText());
		assert.deepStrictEqual(getDocumentText(), 'TEST DOCUMENT');
	});

	test('Convert to lowercase', async () => {
		await createNewEditor();
		await selectAllText();
		convertToUppercase();
		convertToLowercase();
		console.log(getDocumentText());
		assert.deepStrictEqual(getDocumentText(), 'test document');
	});

	test('Convert to Capital Case', async () => {
		await createNewEditor();
		await selectAllText();
		convertToCapitalCase();
		await sleep(200);
		console.log(getDocumentText());
		assert.deepStrictEqual(getDocumentText(), 'Test Document');
	});

	test('Convert to PascalCase', async () => {
		await createNewEditor();
		await selectAllText();
		convertToPascalCase();
		await sleep(200);
		console.log(getDocumentText());
		assert.deepStrictEqual(getDocumentText(), 'TestDocument');
	});

	test('Convert to camelCase', async () => {
		await createNewEditor();
		await selectAllText();
		convertToCamelCase();
		await sleep(200);
		console.log(getDocumentText());
		assert.deepStrictEqual(getDocumentText(), 'testDocument');
	});

	test('Convert to CONSTANT_CASE', async () => {
		await createNewEditor();
		await selectAllText();
		convertToConstantCase();
		await sleep(200);
		console.log(getDocumentText());
		assert.deepStrictEqual(getDocumentText(), 'TEST_DOCUMENT');
	});

	test('Convert to dot.case', async () => {
		await createNewEditor();
		await selectAllText();
		convertToDotCase();
		await sleep(200);
		console.log(getDocumentText());
		assert.deepStrictEqual(getDocumentText(), 'test.document');
	});

	test('Convert to header_case', async () => {
		await createNewEditor();
		await selectAllText();
		convertToHarderCase();
		await sleep(200);
		console.log(getDocumentText());
		assert.deepStrictEqual(getDocumentText(), 'Test-Document');
	});

	test('Convert to no case', async () => {
		await createNewEditor();
		await selectAllText();
		convertToNoCase();
		await sleep(200);
		console.log(getDocumentText());
		assert.deepStrictEqual(getDocumentText(), 'test document');
	});

	test('Convert to param_case', async () => {
		await createNewEditor();
		await selectAllText();
		convertToParamCase();
		await sleep(200);
		console.log(getDocumentText());
		assert.deepStrictEqual(getDocumentText(), 'test-document');
	});

	test('Convert to path/case', async () => {
		await createNewEditor();
		await selectAllText();
		convertToPathCase();
		await sleep(200);
		console.log(getDocumentText());
		assert.deepStrictEqual(getDocumentText(), 'test/document');
	});

	test('Convert to Sentence case', async () => {
		await createNewEditor();
		await selectAllText();
		convertToSentenceCase();
		await sleep(200);
		console.log(getDocumentText());
		assert.deepStrictEqual(getDocumentText(), 'Test document');
	});

	test('Convert to snake_case', async () => {
		await createNewEditor();
		await selectAllText();
		convertToSnakeCase();
		await sleep(200);
		console.log(getDocumentText());
		assert.deepStrictEqual(getDocumentText(), 'test_document');
	});
});