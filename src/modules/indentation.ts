import { commands, Selection, TextEditor } from "vscode";

export enum IndentationType {
    Spaces = "spaces",
    Tabs = "tabs",
}

export function updateIndentation(editor: TextEditor, indentationType: IndentationType, indentationSize: number) {
    if (indentationSize === editor.options.tabSize) {
        return;
    }

    editor
        .edit((editBuilder) => {
            for (let lineNumber = 0; lineNumber < editor.document.lineCount; lineNumber++) {
                const line = editor.document.lineAt(lineNumber);

                if (indentationType === IndentationType.Spaces) {
                    editBuilder.replace(line.range, indentSpaces(line.text, indentationSize));
                }
            }
        })
        .then(() => {
            // remove the selection added by the replace call: https://github.com/microsoft/vscode/issues/124154
            editor.selection = new Selection(editor.selection.active, editor.selection.active);
        });

    editor.options.tabSize = indentationSize;
    editor.options.insertSpaces = indentationType === IndentationType.Spaces ? true : false;
}

function indentSpaces(line: string, indentSize: number): string {
    const leadingSpaces = new RegExp(/^\s*/).exec(line)?.at(0);
    const replaceRegExp = indentSize === 2 ? /[ ]{4}|\t/g : /[ ]{2}|\t/g;
    if (leadingSpaces) {
        const newLeadingSpaces = leadingSpaces.replace(replaceRegExp, "".padEnd(indentSize, " "));

        return newLeadingSpaces + line.replace(/^\s+/, "");
    }

    return line;
}

export function setEditorOptionsContext(editor: TextEditor) {
    commands.executeCommand("setContext", "tt.tabSize", editor!.options.tabSize);
    commands.executeCommand("setContext", "tt.insertSpaces", editor!.options.insertSpaces);
    // @update: https://github.com/microsoft/vscode/blob/main/src/vscode-dts/vscode.proposed.indentSize.d.ts
    // commands.executeCommand("setContext", "tt.indentSize", editor!.options.indentSize);
}
