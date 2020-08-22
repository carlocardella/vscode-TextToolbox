import * as assert from 'assert';
import * as guid from 'guid';
import { closeTextEditor, sleep, getDocumentText, createNewEmptyEditor } from '../../modules/helpers';
import { insertGUID } from '../../modules/insertText';
import { before, after, afterEach } from 'mocha';


suite('insertText', () => {
    before(() => {
        console.log('Starting insertText tests');
    });
    after(() => {
        console.log('All insertText tests done');
    });
    afterEach(() => {
        closeTextEditor();
    });

    test('Insert GUID', async () => {
        await createNewEmptyEditor();
        insertGUID();
        await sleep(200);

        let text = String(getDocumentText());
        assert.ok(guid.isGuid(text), `Value "${text}" is not a valid GUID`);
    });
});