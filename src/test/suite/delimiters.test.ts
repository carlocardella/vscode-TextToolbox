import * as assert from "assert";
import { after, before, describe } from "mocha";
import { EOL } from "os";
import { alignText } from "../../modules/alignText";
import { closeTextEditor, sleep, createNewEditor, selectAllText, getDocumentTextOrSelection } from "../../modules/helpers";

suite("delimiters", () => {
    before(() => {
        console.log("Starting delimiters tests");
    });
    after(async () => {
        await sleep(500);
        await closeTextEditor(true);
        console.log("All delimiters tests done");
    });

    describe.skip("Select text between quotes", () => {

    });
});
