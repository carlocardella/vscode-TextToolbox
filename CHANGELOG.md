<!-- markdownlint-disable-file -->
# **Change Log**

All notable changes to the "vscode-TextToolbox" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

See the [list of open enhancements on GitHub](https://github.com/carlocardella/vscode-TextToolbox/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc+label%3Aenhancement)

## Log

## [2.10.3] - 2023-01-10

**This is a pre-release version**

### Removed

* Removed redundant `Invert lines` command, use `Sort lines` => `reverse` instead

## [2.10.2] - 2023-01-09

**This is a pre-release version**

### Fixed

* [#26 Line ending handling with sort functions](https://github.com/carlocardella/vscode-TextToolbox/issues/26)
* [#27 LF line endings break sort options on Windows](https://github.com/carlocardella/vscode-TextToolbox/issues/27)

## [2.10.1] - 2022-12-28

### Fixed

* [#21 Uncaught errors thrown when frontmost file changes](https://github.com/carlocardella/vscode-TextToolbox/issues/21)

## [2.10.0] - 2022-12-26

### Changed

* Removed edit commands from the context menu for readonly editors

## [2.9.0] - 2022-12-16

### Added

* `Open under cursor`
  * Position the cursor on a file path and open it in a new editor
  * Open URLs in your default browser
  * Open a new email in your default email client
  * Default keybinding: 
    * `alt+o` on Windows
    * `cmd+o` on Mac

## [2.8.2] - 2022-11-06

### Changed

* New icon! 😄

## [2.8.1] - 2022-10-22

### Added

* Added `Toggle Tab Out` command to easily enable/disable TabOut for all language types
* Added double quotes (`"`) as character to tab out from

### Changed

* The "TabOut" label on the Status Bar is updated right after `TextToolbox.tabOut.enabled` is updated, or after running `Toggle Tab Out`

## [2.8.0] - 2022-10-21

### Added

* Added the ability to tab out of brackets, quotes and other some punctuation, inspired by [TabOut](https://marketplace.visualstudio.com/items?itemName=albert.TabOut)
  * You can choose to enable or disable the feature entires, or to enable it for selected language types only

## [2.7.4] - 2022-09-01

### Fixed

* Re-publish preview package

## [2.7.3] - 2022-08-31

### Fixed

* Ensure the Status Bar item is shown even if the active editor has no selection

## [2.7.2] - 2022-08-31

### Changed

* Updated the StatusBar item, if the active editor has a selection, show its word count rather than the count for tho whole document

## [2.7.1] - 2022-08-24

### Changed

* Selection align commands (`Align as table` and `Align to separator`) can use RegExp for space (`\s`) and tab (`\t`) as separator

## [2.7.0] - 2022-08-15

This is a **pre-release** version

### Added

* `Select text between brackets`
  * Default keybinding: `ctrl+shift+alt+b`
* `Select text between quotes`
  * Default keybinding: `ctrl+shift+alt+f`
* `Remove brackets`
  * Removes the brackets _around_ the current selection or cursor position
  * Default keybinding: `ctrl+shift+alt+;`
* `Remove quotes`
  * Removes the quotes _around_ the current selection or cursor position
  * Default keybinding: `ctrl+shift+alt+'`

Quotes include single (`'`), double (`"`) and backtick (`` ` ``)

Brackets include round (`()`), square (`[]`), curly (`{}`) and angle (`<>`)

**Note**: These commands are in preview, they may still be a bit rough around the edges (there may be bugs in certain edge cases), please double-check the selected text before taking any destructive actions.

### Changed

* Increased VSCode minimum version to `1.63`, needed to support pre-release extension versions.

## [2.6.0] - 2022-07-31

### Added

* `Decode JWT token`
* `Convert to and from Base64`
* `HTML encode/decode`
* `Uri encode/decode`

## [2.5.0] - 2022-07-24

### Added

* `Sort lines by length`
* `Convert integer to hexadecimal`
* `Convert hexadecimal to integer`

## [2.4.0] - 2022-04-17

### Changed

* Text-Toolbox now works in [Visual Studio Code for Web](https://code.visualstudio.com/docs/editor/vscode-web) (https://github.dev and https://vscode.dev)

## [2.3.0] - 2022-03-20

### Added

* Show the cursor position (offset) on the Status Bar
* Added `Invert lines` command: inverts lines in the active selection or the entire document, if there is no selection
  * Does not support multiple selections

## [2.2.1] - 2022-02-19

### Fixed

* `Align as table` and `Align as table with headers` now properly handle the selection and does not erroneously delete it

## [2.2.0] - 2022-02-11

### Added

* `Duplicate tab`: open the curren document's text in a new, unsaved document (tab)
* The extension is now available for [VS Codium](https://vscodium.com/) from [Open VSX Registry](https://open-vsx.org/extension/carlocardella/vscode-texttoolbox)

### Changed

* Update node modules

## [2.1.0] - 2021-11-08

### Added

Align a CSV file or selection as a markdown table, no matter the actual file language

* `Align as table`

```text
| asdfasdfasd | fadfasdfasdfasdf | adsfadf | asdf  | asdfa | df            |    |   |    |         |
| asdasdfa    | sdfasdfa         | sdf     | adsf  | asd   | fasdfasdfadsf |    |   |    |         |
| asd         | sdfasdfa         | dsf     | asdfa | sdf   | as            | df | a | df | adfadfa |
```

* `Align as table with headers`

```text
| asdfasdfasd | fadfasdfasdfasdf | adsfadf | asdf  | asdfa | df            |    |   |    |         |
|-------------|------------------|---------|-------|-------|---------------|----|---|----|---------|
| asdasdfa    | sdfasdfa         | sdf     | adsf  | asd   | fasdfasdfadsf |    |   |    |         |
| asd         | sdfasdfa         | dsf     | asdfa | sdf   | as            | df | a | df | adfadfa |
```

### Changed

* If a CSV selection has records with different length, the command `Align to separator` now fills the missing records (columns) as empty separators

*old behavior*

```text
asdfasdfasd, fadfasdfasdfasdf, adsfadf, asdf,  asdfa, df,            
asdasdfa,    sdfasdfa,         sdf,     adsf,  asd,   fasdfasdfadsf, 
asd,         sdfasdfa,         dsf,     asdfa, sdf,   as,            df, a, df, adfadfa  
```

*new behavior*

```text
asdfasdfasd, fadfasdfasdfasdf, adsfadf, asdf,  asdfa, df,            ,,,,
asdasdfa,    sdfasdfa,         sdf,     adsf,  asd,   fasdfasdfadsf, ,,,,
asd,         sdfasdfa,         dsf,     asdfa, sdf,   as,            df, a, df, adfadfa 
```

## [2.0.0] - 2021-09-03

### Added

* `Fix Win32 path in Json`: transforms:

```json
{
    "path": "\Temp\Myfolder\myFile.txt"
}
```

to:

```json
{
    "path": "\\Temp\\Myfolder\\myFile.txt"
}
```

* Highlight word or selection:
  * `Highlight`
  * `Highlight with color...`
  * `Highlight all matches, case sensitive`
  * `Highlight all matches, case insensitive`
  * `Highlight all matches, case sensitive, with color...`
  * `Highlight all matches, case insensitive, with color...`
  * `Highlight with RegExp`
  * `Highlight with RegExp with color...`
  * `Remove all highlights`
  * `Remove highlight`

### Fixed

* Fixed a case where "Remove control characters" was inserting "undefined" when replacing control characters with empty strings

## [1.9.0] - 2021-08-08

### Changed

* Update commands and context menu labels: `TT:` replaced by `Text Toolbox:`

## [1.8.1] - 2021-08-05

### Fixed

* Align to cursor does not change the text near the cursor if there is no selection

## [1.8.0] - 2021-08-04

### Added

* `Align to separator`: align a selection in a CSV type, choose the type of separator to use
  * The default separator can be controlled by the setting `TextToolbox.alignTextDefaultSeparator`

### Changed

* Consolidated some context menu commands

## [1.7.1] - 2021-07-12

### Fixed

* Fixed editor context submenu items

## [1.7.0] - 2021-07-12

### Added

* Added `TT: HEADER-CASE` text conversion
* Enabled editor context menu commands

### Removed

* Removed `No Case` conversion
* Removed dependency from `change-case` NPM package, using a slim custom class instead

### Changed

* Renamed `TT: param-case` to `TT: kebab-case`

### Fixed

* Conversions to Pascal Case and Camel Case properly convert the first word in a multiline selection

## [1.6.0] - 2021-07-06

### Changed

* Case conversions work with multiple selections
* `Insert` commands new replace the existing selection (if any), otherwise insert new text starting at the cursor's location (supports multi-election and multi-cursor)

### Added

* Added `Invert case` command

## [1.5.0] - 2021-06-29

### Changed

* `Insert` commands overrite the existing selection (if there is one) instead of appending to it

## [1.4.1] - 2021-06-13

### Changed

* Updated `Transform path to Win32`: in a json document use double backslashes

## [1.4.0] - 2021-06-05

### Removed

* Removed `Convert to Uppercase` in favor of the built-in VSCode command
* Removed `Convert to Lowercase` in favor of the built-in VSCode command
* Removed `Convert to CapitalCase` in favor of the built-in VSCode command `Transform to Title Case`

## [1.3.0] - 2021-05-31

### Added

* Convert path string to posix format
* Convert path string to win32 format
* Added `Roundtrip` date format: `2021-05-31T16:53:38.954Z`: [Roudtrip DateTime Format](https://docs.microsoft.com/en-us/dotnet/standard/base-types/standard-date-and-time-format-strings#Roundtrip)
* Added `DATETIME_HUGE` date format: `Monday, May 31, 2021, 9:55 AM PDT`

### Changed

* Sorted DateTime formats, grouped similar formats closer together

## [1.2.0] - 2021-05-28

### Added

* Added support to run in an Untrusted Workspace in extension manifest
* Stringify JSON
* Fix JSON
* Minify JSON

## [1.1.1] - 2021-05-10

### Added

* Split selection and open the resulting text in a new editor

## [1.1.0] - 2021-05-09

### Added

* Split selection based on delimiter

### Changed

* Improved the `Sort` commands, remove empty lines from the sorted output

## [1.0.0] - 2021-04-25

### Changed

* Updated the `Insert Date` picker, show a sample date formatted according to the selection
* Updated the `Insert Random` picker, show a sample string based on the selection
* Update the `Insert Currency` picker, show a sample string based on the selection

### Added

* `Insert Currency`
  * Added `Israeli New Shequel`
  * Added `Bitcoin`
  * Added `South Korean Won`
  * Added `South African Rand`
  * Added `Swiss Franc`

## [0.13.0] - 2021-04-25

### Changed

* The extension is no longer loaded at startup

### Added

* Insert `Lorem Ipsum` Paragraphs, Sentences or Words
* Insert random Number
* Insert random Currency amount

### Fixed

* Fixed sort selection on Mac and Linux

## [0.12.0] - 2021-04-18

### Removed

* Temporarily removed the `Align` command, it was not behaving as intended and I am working on a new implementation. I will add `Align` back when ready.

### Added

* Insert GUID all zeros
  * Supports multicursor
* Trim lines or selections

### Fixed

* `Open Selection in New Editor`: no longer opens an empty editor if there is no selection
* Fixed sort commands

## [0.11.0] - 2020-10-11

### Added

* Align text to separator (can be used to align CSV elements):
  * Align left (default): inserts padding spaces after the separator

    ```text
    London,    Paris,     Rome
    Tokyo,     Singapore, Sydney
    ```

  * Align right: inserts padding spaces between text and separator
  
    ```text
    London    ,Paris     ,Rome
    Tokyo     ,Singapore ,Sydney
    ```

## [0.10.1] - 2020-10-04

### Changed

* Update readme and changelog

## [0.10.0] - 2020-10-04

### Added

* Highlight control characters
  * By default control characters are highlighted with a red box but color and border shape can be customized through `TextToolbox.decorateControlCharacters`
* Remove control characters
  * By default control characters are replaced with an empty string but this can be changed through `TextToolbox.replaceControlCharactersWith`.
  * Removes control characters from the current selection(s) or from the entire document if no text is selected

## [0.9.0] - 2020-09-28

### Fixed

* The StatusBar item with lines and words count is readonly, disabled the click event
* Insert numbers sequence: the user can choose the starting index and length, this inserts the needed amount of lines

## [0.8.0] - 2020-09-26

### Added

* Insert line numbers

## [0.7.0] - 2020-09-25

### Added

* Open selection(s) in new editor

### Fixed

* Fixed a bug where multiline random inserts were failing if the command needed to prompt the user for a choise. The affected commands were PERSON_NAME, COLOR, PARAGRAPH and HASH

## [0.6.0] - 2020-09-24

### Changedd

* Case conversion and Insert commands now work on multiple selections
* Renamed "Pad Right" and "Pad Left" to "Pad Selection Right" and "Pad Selection Left" respectively

## [0.5.0] - 2020-09-13

### Added

* Sort lines, ascending, descending or reverse the lines order
  * Update the current selection or entire document, or open the sorted lines in a new editor

### Changedd

* Better handle configuration changes, react to the event only if `Text Toolbox` configuration is undated, ignore all other changes

## [0.4.0] - 2020-09-06

### Added

* Find text using RegEx or simple text match and open the result in a new Editor
  * By default the search uses RegEx: can be changed using `TextToolbox.filtersUseRegularExpressions`

## [0.3.0] - 2020-09-05

### Added

* Remove duplicate lines
* Remove duplicate lines, open result in new editor

### Fixed

* Fixed a bug with padding where the padded string length was incorrect

### Changedd

* Updated tests, close the editors after every `Describe` rather than after every test

## [0.2.0] - 2020-08-30

### Changedd

* Updated padding, split the previous command in `PadRight` and `PadLeft`.
  * If there is a selection, the string is padded up to the length specified
  * If there is no selection, the command inserts a string comprised of the selected character(s) and of the specified length

* Updated CHANGELOG and README

### Added

* `ISO8601_DATE`
* `ISO8601_TIME`
* `STATE_FULL_NAME`
* `COUNTRY_FULL_NAME`

## [0.1.2] - 2020-08-30

* Updated README, CHANGELOG

## [0.1.1] - 2020-08-30

* Package with Webpack

## [0.1.0] - 2020-08-29

* First preview release published
