import { commands, Selection, window, workspace } from "vscode";
import { getActiveEditor, getCursorPosition } from "./helpers";

/**
 * Check if tabOut is enabled; this includes if tabOut is allowed for the active document's language type
 *
 * @returns {boolean}
 */
function isTabOutEnabled(): boolean {
    // is tabOut enabled?
    if (!workspace.getConfiguration().get<boolean>("TextToolbox.tabOut.enabled")) {
        return false;
    }

    // is the current language type excluded?
    const excludedLanguages = workspace.getConfiguration().get<string[]>("TextToolbox.tabOut.disableLanguages");
    const currentLanguage = getActiveEditor()?.document.languageId;
    if (excludedLanguages?.includes(currentLanguage!)) {
        return false;
    }

    // is the current language type included?
    const includedLanguages = workspace.getConfiguration().get<string[]>("TextToolbox.tabOut.enabledLanguages");
    if (!includedLanguages?.includes(currentLanguage!) && !includedLanguages?.includes("*")) {
        return false;
    }

    return true;
}

/**
 * Check if we should tabOut
 *
 * @returns {boolean}
 */
function shouldTabOut(): boolean {
    if (!isTabOutEnabled()) {
        return false;
    }

    const editor = getActiveEditor();
    if (!editor) {
        return false;
    }

    let cursorPosition = getCursorPosition(editor);
    if (cursorPosition[0].character === 0) {
        // do not tabOut if the cursor is at the beginning of the line, this is used for indentation
        return false;
    }

    // is the next character in the tabOut list?
    const tabOutList = workspace.getConfiguration().get<string[]>("TextToolbox.tabOut.characters");
    const nextCharacter = editor.document.lineAt(cursorPosition[0].line).text[cursorPosition[0].character];
    if (!tabOutList?.includes(nextCharacter)) {
        return false;
    }

    return true;
}

/**
 * Tab Out
 *
 * @export
 * @returns {*}
 */
export function tabOut() {
    if (!isTabOutEnabled()) {
        commands.executeCommand("tab");
        return;
    }

    if (!shouldTabOut()) {
        commands.executeCommand("tab");
        return;
    }

    // new cursor position
    const editor = getActiveEditor();
    if (!editor) {
        return;
    }

    let cursorPosition = getCursorPosition(editor);
    let newPosition = cursorPosition[0].with(cursorPosition[0].line, cursorPosition[0].character + 1);
    let newSelection = new Selection(newPosition, newPosition);
    return (window.activeTextEditor!.selection = newSelection);
}

/**
 * Toggle tabOut enabled
 *
 * @export
 */
export function toggleTabOut() { 
    const tabOutEnabled = workspace.getConfiguration("TextToolbox.tabOut");
    tabOutEnabled.update("enabled", !tabOutEnabled.get("enabled"), true);
}