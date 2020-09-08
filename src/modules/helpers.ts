import { commands, Range, Selection, TextEditor, window, workspace } from 'vscode';
import * as os from 'os';


function validateEditor() {
    const editor = window.activeTextEditor;
    if (!editor) { return; }
}

export function validateSelection() {
    validateEditor();

    const selections = window.activeTextEditor?.selections;
    if (!selections) { return; }

    if (selections?.length < 1) {
        window.showWarningMessage("You must select some text first");
        return;
    }
}

export function getActiveSelection(editor: TextEditor): Selection {
    return editor.selection;
}

export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

export function closeAllEditors(): Promise<void> {
    return new Promise(resolve => {
        commands.executeCommand("workbench.action.closeAllEditors").then(() => {
            resolve();
        });
    });
}

export function selectAllText(): Thenable<unknown> {
    return commands.executeCommand('editor.action.selectAll');
}

export function getDocumentText(): string | undefined {
    return window.activeTextEditor?.document.getText();
}

export function getDocumentTextOrSelection(): string | undefined {
    const editor = getActiveEditor()!;
    const selection = editor!.selection;

    if (selection.isEmpty) {
        return getDocumentText();
    }
    else {
        return getTextFromSelection(editor, selection);
    }
}

export function getSelectionOrFullDocument(editor: TextEditor): Selection {
    if (editor.selection.isEmpty) {
        let selection: Selection;

        const lineCount = editor.document.lineCount;
        selection = new Selection(0, 0, lineCount, editor.document.lineAt(lineCount - 1).text.length);
        return selection;
    }

    return editor.selection;
}

export function getTextFromSelection(editor: TextEditor, selection: Selection): string | undefined {
    return editor.document.getText(new Range(selection.start, selection.end));
}

export function getActiveEditor(): TextEditor | undefined {
    return window.activeTextEditor;
}

// used for tests
export function createNewEditor(text?: string): PromiseLike<TextEditor> {
    return new Promise((resolve, reject) => {
        workspace.openTextDocument({ content: text, language: "plaintext", preview: false } as any).then(
            (doc) => {
                resolve(window.showTextDocument(doc));
            },
            (err) => reject(err)
        );
    });
}

// close active text editor in tests
export function closeTextEditor() {
    commands.executeCommand('workbench.action.closeActiveEditor');
}

export function prependZeroes(n: number) {
    if (n <= 9) { return '0' + n; }
    return n;
}

export function findLinesMatchingRegEx(searchString: string | undefined): string[] | undefined {
    if (!searchString) { return; }

    let text: string | any = [];

    const regExpFlags = searchString.match("(?!.*\/).*")![0] || undefined;
    const regExpString = searchString.match("(?<=\/)(.*?)(?=\/)")![0];
    const regExp = new RegExp(regExpString, regExpFlags);

    let match;
    if (!regExpFlags || regExpFlags?.indexOf("g") < 0) {
        match = regExp.exec(getDocumentTextOrSelection()!);
        if (match) { text.push(match[0]); }
    }
    else if (regExpFlags || regExpFlags.indexOf("g") >= 0) {
        while (match = regExp.exec(getDocumentTextOrSelection()!)) {
            text.push(match[0]);
        }
    }

    return text;
}

export function findLinesMatchingString(searchString: string): string[] | undefined {
    if (!searchString) { return; }
    let text: string[] | undefined = [];

    text = getDocumentTextOrSelection()?.split(os.EOL); // TODO: getLines
    if (!text) { return; }
    text = text.filter(line => line.indexOf(searchString) >= 0);

    return text;
}

export async function getLines(text: string | Selection): Promise<string[] | undefined> {
    if (!text) { return; }
    let lines;

    if (typeof text === "string") {
        lines = text.split(os.EOL);
    }

    return Promise.resolve(lines);
}
