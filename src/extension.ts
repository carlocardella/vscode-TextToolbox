import { commands, ExtensionContext, window, workspace, env, Uri } from "vscode";
import * as CaseConversion from "./modules/caseConversion";
import * as InsertText from "./modules/insertText";
import * as StatusBarSelection from "./modules/statusBarSelection";
import * as FilterText from "./modules/filterText";
import * as SortLines from "./modules/sortText";
import * as ControlCharacters from "./modules/controlCharacters";
import * as Helpers from "./modules/helpers";
import * as TextManipulation from "./modules/textManipulation";
import * as Json from "./modules/json";
import * as AlignText from "./modules/alignText";
import TTDecorations from "./modules/decorations";
import { tabOut, toggleTabOut } from "./modules/tabOut";
import * as Delimiters from "./modules/delimiters";
import * as path from "path";
import { REGEX_VALIDATE_EMAIL } from "./modules/filterText";
import * as Indentation from "./modules/indentation";
import { delimiterTypes } from "./modules/delimiters";
import * as StringUtilities from "./modules/stringUtilities";
import * as CryptoTools from "./modules/cryptoTools";
import * as AdvancedListConverter from "./modules/advancedListConverter";
import * as DataFormatConverter from "./modules/dataFormatConverter";

export function activate(context: ExtensionContext) {
    console.log("vscode-texttoolbox is active");

    // case conversions
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.PascalCase", () => {
            CaseConversion.convertSelection(CaseConversion.caseConversions.pascalCase);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.CamelCase", () => {
            CaseConversion.convertSelection(CaseConversion.caseConversions.camelCase);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.ConstantCase", () => {
            CaseConversion.convertSelection(CaseConversion.caseConversions.constantCase);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.DotCase", () => {
            CaseConversion.convertSelection(CaseConversion.caseConversions.dotCase);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.HeaderCase", () => {
            CaseConversion.convertSelection(CaseConversion.caseConversions.headerCase);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.KebabCase", () => {
            CaseConversion.convertSelection(CaseConversion.caseConversions.kebabCase);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.SentenceCase", () => {
            CaseConversion.convertSelection(CaseConversion.caseConversions.sentenceCase);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.SnakeCase", () => {
            CaseConversion.convertSelection(CaseConversion.caseConversions.snakeCase);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.InvertCase", () => {
            CaseConversion.convertSelection(CaseConversion.caseConversions.invertCase);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.PathCase", () => {
            CaseConversion.convertSelection(CaseConversion.caseConversions.pathCase);
        })
    );

    // insert text
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.InsertUUID", async () => {
            const editor = Helpers.getActiveEditor();
            if (!editor) {
                return;
            }

            const selections = editor.selections;
            let uniqueValues: string | undefined = "";
            if (selections.length > 1) {
                uniqueValues = await window.showQuickPick(["Yes", "No"], {
                    canPickMany: false,
                    ignoreFocusOut: true,
                    title: `Insert unique UUIDs at each cursor position?`,
                });
            }
            const uniqueRandomValues = uniqueValues === "Yes" ? true : false;

            InsertText.insertUUID(uniqueRandomValues);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.InsertGUID", async () => {
            const editor = Helpers.getActiveEditor();
            if (!editor) {
                return;
            }

            const selections = editor.selections;
            let uniqueValues: string | undefined = "";
            if (selections.length > 1) {
                uniqueValues = await window.showQuickPick(["Yes", "No"], {
                    canPickMany: false,
                    ignoreFocusOut: true,
                    title: `Insert unique GUIDs at each cursor position?`,
                });
            }
            const uniqueRandomValues = uniqueValues === "Yes" ? true : false;

            InsertText.insertGUID(uniqueRandomValues, false);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.InsertGuidAllZeros", () => {
            InsertText.insertGUID(false, true);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.InsertDate", () => {
            InsertText.pickDateTime();
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.PickRandom", async () => {
            const pick = await InsertText.pickRandom();

            let length: string | undefined = "0";
            if (pick === InsertText.randomTypes.PARAGRAPH) {
                length = await window.showInputBox({
                    ignoreFocusOut: true,
                    title: "How many paragraphs do you want to insert?",
                    value: "5",
                    prompt: "Insert the number of paragraphs",
                });
            }
            if (pick === InsertText.randomTypes.HASH) {
                length = await window.showInputBox({
                    ignoreFocusOut: true,
                    title: "Insert the hash length",
                    value: "32",
                    prompt: "Hash length",
                });
            }
            if (pick) {
                const editor = Helpers.getActiveEditor();
                if (!editor) {
                    return;
                }

                const selections = editor.selections;
                let uniqueValues: string | undefined = "";
                if (selections.length > 1) {
                    uniqueValues = await window.showQuickPick(["Yes", "No"], {
                        canPickMany: false,
                        ignoreFocusOut: true,
                        title: `Insert unique ${pick} at each cursor position?`,
                    });
                }
                const uniqueRandomValues = uniqueValues === "Yes" ? true : false;

                await InsertText.insertRandom(pick, parseInt(length!), uniqueRandomValues);
            }
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.PadSelectionRight", () => {
            InsertText.padSelection(InsertText.padDirection.right);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.PadSelectionLeft", () => {
            InsertText.padSelection(InsertText.padDirection.left);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.InsertLineNumbers", () => {
            InsertText.insertLineNumbers();
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.InsertSequenceNumbers", () => {
            InsertText.insertSequence(InsertText.sequenceType.Numbers);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.InsertLoremIpsum", () => {
            InsertText.insertLoremIpsum();
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.InsertCurrency", () => {
            InsertText.insertCurrency();
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.DuplicateTab", () => {
            InsertText.duplicateTab();
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.PrefixWith", () => {
            InsertText.surroundText(InsertText.SurroundAction.Prefix);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.SuffixWith", () => {
            InsertText.surroundText(InsertText.SurroundAction.Suffix);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.SurroundWith", () => {
            InsertText.surroundText(InsertText.SurroundAction.Surround);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.InsertLineSeparator", () => {
            InsertText.InsertLineSeparator();
        })
    );

    // filter text
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.RemoveAllEmptyLines", () => {
            FilterText.removeEmptyLines(false);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.RemoveRedundantEmptyLines", () => {
            FilterText.removeEmptyLines(true);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.RemoveDuplicateLines", async () => {
            const options = await AdvancedListConverter.askForDuplicateOptions();
            if (options) {
                await AdvancedListConverter.enhancedRemoveDuplicates(options, false);
            }
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.RemoveDuplicateLinesResultInNewEditor", async () => {
            const options = await AdvancedListConverter.askForDuplicateOptions();
            if (options) {
                await AdvancedListConverter.enhancedRemoveDuplicates(options, true);
            }
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.FilterLinesUsingRegExpOrString", () => {
            FilterText.filterLinesUsingRegExpOrString(true);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.OpenSelectionInNewEditor", () => {
            FilterText.openSelectionInNewEditor();
        })
    );

    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.OpenPathOrUrlUnderCursor", async () => {
            const editor = Helpers.getActiveEditor();
            if (!editor) {
                return;
            }

            let textBetweenSpaces = FilterText.getTextBetweenSpaces(editor);
            if (textBetweenSpaces) {
                // URL
                if (textBetweenSpaces.startsWith("http") || textBetweenSpaces.startsWith("www.")) {
                    if (!textBetweenSpaces.startsWith("http")) {
                        textBetweenSpaces = "https://" + textBetweenSpaces;
                    }
                    env.openExternal(Uri.parse(textBetweenSpaces));
                    return;
                }

                // Email
                if (textBetweenSpaces.match(REGEX_VALIDATE_EMAIL)) {
                    if (!textBetweenSpaces.startsWith("http")) {
                        textBetweenSpaces = "mailto://" + textBetweenSpaces;
                    }
                    env.openExternal(Uri.parse(textBetweenSpaces));
                    return;
                }

                // File system path
                let userPathUri = Uri.file(textBetweenSpaces);
                await workspace.fs.stat(userPathUri).then(
                    (stat: any) => {
                        commands.executeCommand("vscode.open", userPathUri);
                    },
                    (err: any) => {
                        // if the path does not exist, check if it is a path relative to the open document
                        let folder = path.dirname(editor.document.uri.fsPath);
                        if (folder) {
                            userPathUri = Uri.joinPath(Uri.file(folder), textBetweenSpaces!);
                            workspace.fs.stat(userPathUri).then((stat: any) => {
                                commands.executeCommand("vscode.open", userPathUri);
                            });
                        }
                    }
                );
            }
        })
    );

    // sort text
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.SortLinesResultInNewEditor", async () => {
            let sortDirection = await SortLines.askForSortDirection();
            if (sortDirection) {
                SortLines.sortLines(sortDirection, true);
            }
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.SortLines", async () => {
            let sortDirection = await SortLines.askForSortDirection();
            if (sortDirection) {
                SortLines.sortLines(sortDirection, false);
            }
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.SortLinesByLengthResultInNewEditor", async () => {
            let sortDirection = await SortLines.askForSortDirection();
            if (sortDirection) {
                SortLines.sortLinesByLength(sortDirection, true);
            }
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.SortLinesByLength", async () => {
            let sortDirection = await SortLines.askForSortDirection();
            if (sortDirection) {
                SortLines.sortLinesByLength(sortDirection, false);
            }
        })
    );

    // text manipulations
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.TrimLineOrSelection", () => {
            TextManipulation.trimLineOrSelection();
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.SplitSelection", () => {
            TextManipulation.splitSelection(false);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.SplitSelectionOpenInNewEditor", () => {
            TextManipulation.splitSelection(true);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.ConvertDecimalToHexadecimal", () => {
            TextManipulation.convertSelection(TextManipulation.conversionType.decToHex);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.ConvertHexadecimalToDecimal", () => {
            TextManipulation.convertSelection(TextManipulation.conversionType.hexToDec);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.convertFromBase64", () => {
            TextManipulation.convertSelection(TextManipulation.conversionType.fromBase64);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.convertToBase64", () => {
            TextManipulation.convertSelection(TextManipulation.conversionType.toBase64);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.fromHTML", () => {
            TextManipulation.convertSelection(TextManipulation.conversionType.fromHTML);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.toHTML", () => {
            TextManipulation.convertSelection(TextManipulation.conversionType.toHTML);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.encodeUri", () => {
            TextManipulation.convertSelection(TextManipulation.conversionType.encodeUri);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.decodeUri", () => {
            TextManipulation.convertSelection(TextManipulation.conversionType.decodeUri);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.decodeJWTToken", () => {
            TextManipulation.convertSelection(TextManipulation.conversionType.JWTDecode);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.indentUsingTwoSpaces", () => {
            // prettier-ignore
            Indentation.updateIndentation(
                Helpers.getActiveEditor()!,
                Indentation.IndentationType.Spaces,
                2
            );
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.indentUsingFourSpaces", () => {
            // prettier-ignore
            Indentation.updateIndentation(
                Helpers.getActiveEditor()!,
                Indentation.IndentationType.Spaces,
                4
            );
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.transformToOrderedList", async () => {
            await TextManipulation.transformToOrderedList();
        })
    );

    // delimiters
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.SelectTextBetweenQuotes", () => {
            Delimiters.selectTextBetweenDelimiters(Delimiters.delimiterTypes.quote);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.SelectTextBetweenBrackets", () => {
            Delimiters.selectTextBetweenDelimiters(Delimiters.delimiterTypes.bracket);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.CycleBrackets", () => {
            Delimiters.cycleDelimiters(delimiterTypes.bracket);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.RemoveBrackets", () => {
            Delimiters.removeDelimiters(Delimiters.delimiterTypes.bracket);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.RemoveQuotes", () => {
            Delimiters.removeDelimiters(Delimiters.delimiterTypes.quote);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.CycleQuotes", () => {
            Delimiters.cycleDelimiters(Delimiters.delimiterTypes.quote);
        })
    );

    // json
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.StringifyJson", () => {
            Json.stringifyJson(false);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.FixJson", () => {
            Json.stringifyJson(true);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.MinifyJson", () => {
            Json.minifyJson();
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.EscapeWin32PathInJson", () => {
            Json.escapeWin32PathInJson();
        })
    );

    // path transformation
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.TransformPathToPosix", () => {
            TextManipulation.transformPath(TextManipulation.pathTransformationType.posix);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.TransformPathToWin32", () => {
            TextManipulation.transformPath(TextManipulation.pathTransformationType.win32);
        })
    );

    // align
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.AlignToSeparator", () => {
            AlignText.alignText();
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.AlignAsTable", () => {
            AlignText.alignText(undefined, true);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.AlignAsTableWithHeaders", () => {
            AlignText.alignText(undefined, true, true);
        })
    );

    // highlight
    let decorations: TTDecorations;
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.HighlightText", () => {
            if (!decorations) {
                decorations = new TTDecorations();
            }
            decorations.HighlightText(true);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.HighlightTextWithColor", () => {
            if (!decorations) {
                decorations = new TTDecorations();
            }
            decorations.HighlightText(false);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.HighlightAllMatchesCaseSensitive", () => {
            if (!decorations) {
                decorations = new TTDecorations();
            }
            decorations.HighlightText(true, { allMatches: true, matchCase: true });
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.HighlightAllMatchesCaseInsensitive", () => {
            if (!decorations) {
                decorations = new TTDecorations();
            }
            decorations.HighlightText(true, { allMatches: true, matchCase: false });
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.HighlightAllMatchesCaseSensitiveWithColor", () => {
            if (!decorations) {
                decorations = new TTDecorations();
            }
            decorations.HighlightText(false, { allMatches: true, matchCase: true });
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.HighlightAllMatchesCaseInsensitiveWithColor", () => {
            if (!decorations) {
                decorations = new TTDecorations();
            }
            decorations.HighlightText(false, { allMatches: true, matchCase: false });
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.HighlightWithRegExp", () => {
            if (!decorations) {
                decorations = new TTDecorations();
            }
            decorations.HighlightText(true, { regex: true });
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.HighlightWithRegExpWithColor", () => {
            if (!decorations) {
                decorations = new TTDecorations();
            }
            decorations.HighlightText(false, { regex: true });
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.RemoveAllHighlights", () => {
            if (!decorations) {
                decorations = new TTDecorations();
            }
            decorations.RemoveHighlight(true);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.RemoveHighlight", () => {
            if (!decorations) {
                decorations = new TTDecorations();
            }
            decorations.RemoveHighlight(false);
        })
    );

    // tabOut
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.TabOut", () => {
            tabOut();
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.ToggleTabOut", () => {
            toggleTabOut();
        })
    );

    // events
    window.onDidChangeActiveTextEditor(
        (editor: any) => {
            if (editor) {
                ControlCharacters.decorateControlCharacters(editor);
                if (decorations) {
                    decorations.RefreshHighlights();
                }
            }
        },
        null,
        context.subscriptions
    );
    workspace.onDidChangeTextDocument(
        (event: any) => {
            let activeEditor = Helpers.getActiveEditor();
            if (activeEditor) {
                ControlCharacters.decorateControlCharacters(activeEditor);
            }

            if (decorations) {
                decorations.RefreshHighlights();
            }

            // set context values for indentation commands (guard if no active editor yet)
            if (activeEditor && activeEditor.options) {
                commands.executeCommand("setContext", "tt.tabSize", activeEditor.options.tabSize);
                commands.executeCommand("setContext", "tt.insertSpaces", activeEditor.options.insertSpaces);
                commands.executeCommand("setContext", "tt.insertSpaces", activeEditor.options.insertSpaces);
            }
        },
        null,
        context.subscriptions
    );

    // string utilities
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.SlugifyString", () => {
            StringUtilities.applyStringUtility(StringUtilities.stringUtilityType.slugify);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.ObfuscateString", () => {
            StringUtilities.applyStringUtility(StringUtilities.stringUtilityType.obfuscate);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.DeobfuscateString", () => {
            StringUtilities.applyStringUtility(StringUtilities.stringUtilityType.deobfuscate);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.GenerateNumeronym", () => {
            StringUtilities.applyStringUtility(StringUtilities.stringUtilityType.numeronym);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.ShowTextStatistics", () => {
            StringUtilities.showTextStatistics();
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.InvertSelection", () => {
            StringUtilities.invertSelection();
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.ShowTextStatisticsInNewEditor", () => {
            StringUtilities.showTextStatisticsInNewEditor();
        })
    );

    // crypto tools
    context.subscriptions.push(
        commands.registerCommand("vscode-texttoolbox.GenerateHashFromText", () => {
            CryptoTools.generateHashFromText();
        })
    );
    context.subscriptions.push(
        commands.registerCommand("vscode-texttoolbox.GenerateBcryptHash", () => {
            CryptoTools.generateBcryptHash();
        })
    );
    context.subscriptions.push(
        commands.registerCommand("vscode-texttoolbox.CompareBcryptHash", () => {
            CryptoTools.compareBcryptHash();
        })
    );
    context.subscriptions.push(
        commands.registerCommand("vscode-texttoolbox.GenerateHMAC", () => {
            CryptoTools.generateHMAC();
        })
    );
    context.subscriptions.push(
        commands.registerCommand("vscode-texttoolbox.GenerateToken", () => {
            CryptoTools.generateToken();
        })
    );
    context.subscriptions.push(
        commands.registerCommand("vscode-texttoolbox.AnalyzePasswordStrength", () => {
            CryptoTools.analyzePasswordStrength();
        })
    );

    // advanced list converter
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.TransposeData", async () => {
            const delimiter = await AdvancedListConverter.askForTransposeDelimiter();
            if (delimiter !== undefined) {
                await AdvancedListConverter.transposeData(delimiter, false);
            }
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.TransposeDataInNewEditor", async () => {
            const delimiter = await AdvancedListConverter.askForTransposeDelimiter();
            if (delimiter !== undefined) {
                await AdvancedListConverter.transposeData(delimiter, true);
            }
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.TransposeRowsToColumns", async () => {
            await AdvancedListConverter.transposeRowsToColumns(false);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.TransposeRowsToColumnsInNewEditor", async () => {
            await AdvancedListConverter.transposeRowsToColumns(true);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.TransposeColumnsToRows", async () => {
            await AdvancedListConverter.transposeColumnsToRows(false);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.TransposeColumnsToRowsInNewEditor", async () => {
            await AdvancedListConverter.transposeColumnsToRows(true);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.ReverseListOrder", () => {
            AdvancedListConverter.reverseListOrder(false);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.ReverseListOrderInNewEditor", () => {
            AdvancedListConverter.reverseListOrder(true);
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.TruncateLines", async () => {
            const options = await AdvancedListConverter.askForTruncateOptions();
            if (options) {
                await AdvancedListConverter.truncateLines(options);
            }
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.CsvToMarkdownTable", async () => {
            const options = await AdvancedListConverter.askForCsvToMarkdownOptions();
            if (options) {
                await AdvancedListConverter.csvToMarkdownTable(options);
            }
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.MarkdownTableToCsv", async () => {
            const options = await AdvancedListConverter.askForMarkdownToCsvOptions();
            if (options) {
                await AdvancedListConverter.markdownTableToCsv(options);
            }
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.JsonToYaml", async () => {
            const options = await DataFormatConverter.askForJsonToYamlOptions();
            if (options) {
                await DataFormatConverter.jsonToYaml(options);
            }
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.YamlToJson", async () => {
            const options = await DataFormatConverter.askForYamlToJsonOptions();
            if (options) {
                await DataFormatConverter.yamlToJson(options);
            }
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.JsonToCsv", async () => {
            const options = await DataFormatConverter.askForJsonToCsvOptions();
            if (options) {
                await DataFormatConverter.jsonToCsv(options);
            }
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.MarkdownToHtml", async () => {
            const options = await DataFormatConverter.askForMarkdownToHtmlOptions();
            if (options) {
                await DataFormatConverter.markdownToHtml(options);
            }
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.HtmlToMarkdown", async () => {
            const options = await DataFormatConverter.askForHtmlToMarkdownOptions();
            if (options) {
                await DataFormatConverter.htmlToMarkdown(options);
            }
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.JsonToToml", async () => {
            const options = await DataFormatConverter.askForJsonToTomlOptions();
            if (options) {
                await DataFormatConverter.jsonToToml(options);
            }
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.TomlToJson", async () => {
            const options = await DataFormatConverter.askForTomlToJsonOptions();
            if (options) {
                await DataFormatConverter.tomlToJson(options);
            }
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.XmlToJson", async () => {
            const options = await DataFormatConverter.askForXmlToJsonOptions();
            if (options) {
                await DataFormatConverter.xmlToJson(options);
            }
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.JsonToXml", async () => {
            const options = await DataFormatConverter.askForJsonToXmlOptions();
            if (options) {
                await DataFormatConverter.jsonToXml(options);
            }
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.YamlToToml", async () => {
            const options = await DataFormatConverter.askForYamlToTomlOptions();
            if (options) {
                await DataFormatConverter.yamlToToml(options);
            }
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.TomlToYaml", async () => {
            const options = await DataFormatConverter.askForTomlToYamlOptions();
            if (options) {
                await DataFormatConverter.tomlToYaml(options);
            }
        })
    );

    // control characters
    context.subscriptions.push(
        workspace.onDidChangeConfiguration((e: any) => {
            if (e.affectsConfiguration("TextToolbox.decorateControlCharacters")) {
                const editor = Helpers.getActiveEditor();
                if (editor) {
                    ControlCharacters.decorateControlCharacters(editor, true);
                }
            }
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.RemoveControlCharacters", () => {
            ControlCharacters.replaceControlCharacters();
        })
    );
    
    // Advanced sequence generation commands
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.AdvancedPrefixSuffix", async () => {
            const options = await AdvancedListConverter.askForPrefixSuffixPattern();
            if (options) {
                await AdvancedListConverter.advancedPrefixSuffix(options.pattern, options.type, false);
            }
        })
    );
    context.subscriptions.push(
        commands.registerTextEditorCommand("vscode-texttoolbox.InsertSequence", async () => {
            const pattern = await window.showInputBox({
                prompt: 'Enter sequence pattern (Enhanced: {n:start:step:format}, {i:start}, {r:start}, etc.)',
                placeHolder: 'e.g., "{n}", "{n:10:5:03d}", "{i:c}", "{R:5}"',
                value: '{n}'
            });
            
            if (pattern) {
                await AdvancedListConverter.advancedPrefixSuffix(pattern, 'prefix', false);
            }
        })
    );

    // status bar selection
    if (workspace.getConfiguration().get("TextToolbox.enableStatusBarWordLineCount")) {
        StatusBarSelection.createStatusBarItem(context);
    }
}

// this method is called when your extension is deactivated
export function deactivate() {
    StatusBarSelection.disposeStatusBarItem();
}
