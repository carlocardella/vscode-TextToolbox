# Change Log

All notable changes to the "vscode-TextToolbox" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

## [2.29.0] - 2025-09-30

### Added

* **Paste as Markdown Table** - Smart clipboard-to-table converter with automatic delimiter detection
  * Automatically detects common delimiters (tab, comma, semicolon, pipe, space) in clipboard content
  * Uses first row as table headers for optimal formatting
  * Inserts formatted Markdown table at cursor position
  * Supports all standard delimited data formats (CSV, TSV, PSV, etc.)
  * Perfect for quickly converting spreadsheet data, database exports, and tabular text into documentation
  * Intelligent parsing handles quoted fields and escaped characters
  * Real-time feedback shows detected delimiter and table dimensions

See the [list of open enhancements on GitHub](https://github.com/carlocardella/vscode-TextToolbox/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc+label%3Aenhancement)

## [2.28.1] - 2025-09-26

### Fixed

* **Publishing Issue Resolution** - Republished version 2.28.0 as 2.28.1 due to marketplace virus scan failure
* **Marketplace Availability** - Extension now properly available in VS Code Marketplace
* **No functional changes** - This is identical to version 2.28.0 content-wise

## [2.28.0] - 2025-09-26

### Added

* **Enhanced Base64/URL Encoding Tools** - Phase 1 implementation with developer-focused enhancements:
  * `Convert to URL-safe Base64` - Encode text to URL-safe Base64 format (replaces +/ with -_, removes padding)
  * `Convert from URL-safe Base64` - Decode URL-safe Base64 back to text with proper padding restoration
  * `Parse Query String to JSON` - Convert URL query strings to formatted JSON with duplicate key handling
  * **Enhanced Error Handling** - Improved error messages and validation for all encoding operations
  * **Developer Benefits**: Perfect for JWT tokens, API development, log analysis, and web-safe encoding
  * **Cross-platform Compatibility** - Proper line ending support for Windows/Linux/macOS
  * **Comprehensive Testing** - 399 passing tests including edge cases, Unicode support, and error scenarios

## [2.27.0] - 2025-09-25

### Added

* **Enhanced Sequence Generation** - Advanced pattern engine for powerful sequence insertion:
  * **Enhanced Prefix/Suffix Commands** - Existing prefix/suffix commands now offer "Advanced Patterns" option for pattern-based sequences
  * `Insert Sequence` - New dedicated sequence generation command using same pattern engine
  * **Enhanced Number Patterns** - `{n:start:step:format}` syntax with custom start values, step increments, and formatting
    * Multiple formats: `{n:10::hex}` (hexadecimal), `{n:10::binary}` (binary), `{n:10::octal}` (octal)
    * Custom increments: `{n:1:2}` generates 1,3,5,7,9... sequence
    * Start values: `{n:5}` begins numbering at 5
  * **Enhanced Letter Sequences** - Custom start positions for alphabet sequences
    * Lowercase: `{i:c}` starts at 'c' (c,d,e,f...)
    * Uppercase: `{I:Z}` starts at 'Z' (Z,AA,BB,CC...)
  * **Enhanced Roman Numerals** - Start value support for Roman numeral sequences
    * Lowercase: `{r:5}` starts at 'v' (v,vi,vii,viii...)
    * Uppercase: `{R:10}` starts at 'X' (X,XI,XII,XIII...)
  * **Complex Pattern Support** - Multiple patterns in single string: `Item {n:1:2} - {i:a} ({R:1})`
  * **Unified Pattern Engine** - Shared implementation between commands for consistency
  * **Backward Compatibility** - All existing patterns continue to work: `{n}`, `{i}`, `{I}`, `{r}`, `{R}`, `{date}`, `{time}`
  * **Comprehensive Testing** - 20+ test cases covering basic patterns, enhanced syntax, edge cases, and integration

* **Complete Data Format Converter Suite** - Comprehensive bidirectional format conversion tools:
  * `Convert JSON to YAML` - Transform JSON to YAML with formatting options (indentation, line width, sort keys)
  * `Convert YAML to JSON` - Convert YAML to JSON with indentation control and validation
  * `Convert JSON to CSV` - Export JSON arrays/objects to CSV with customizable delimiters and headers
  * `Convert Markdown to HTML` - Parse Markdown to HTML using markdown-it with table and code support
  * `Convert HTML to Markdown` - Convert HTML back to Markdown using Turndown with formatting preservation
  * `Convert JSON to TOML` - Transform JSON to TOML with structured formatting and type preservation
  * `Convert TOML to JSON` - Convert TOML configuration files to JSON format
  * `Convert XML to JSON` - Parse XML to JSON with configurable attribute handling and namespace support
  * `Convert JSON to XML` - Generate XML from JSON with customizable formatting and root elements
  * `Convert YAML to TOML` - Cross-format conversion between YAML and TOML configurations
  * `Convert TOML to YAML` - Transform TOML back to YAML with proper data type preservation
  * All converters include comprehensive error handling, validation, and user-configurable conversion options

* **Advanced List Converter** - Comprehensive suite of data transformation tools:
  * `Transpose Data` - Convert rows to columns with customizable delimiters (CSV, TSV, custom) - now includes directional variants:
    * `Transpose Data (Rows ↔ Columns)` - Bidirectional conversion 
    * `Transpose Data (Rows → Columns)` - Optimized for row-based data
    * `Transpose Data (Columns → Rows)` - Optimized for column-based data
  * `Reverse List Order` - Reverse the order of lines in your text
  * `Truncate Lines` - Limit line length with optional ellipsis indicators with enhanced ellipsis counting options
  * `Enhanced Remove Duplicates` - Advanced duplicate removal with keep first/last, case sensitivity, and whitespace trimming options
  * Enhanced `Prefix with...` and `Suffix with...` - Now support both simple text and advanced patterns ({n}, {i}, {date}, {time}, etc.)
  * **🆕 CSV ↔ Markdown Table Converter** - Bidirectional conversion between CSV and Markdown table formats:
    * `Convert CSV to Markdown Table` - Transform CSV data into formatted Markdown tables
    * `Convert Markdown Table to CSV` - Convert Markdown tables back to CSV format
    * Support for multiple delimiters (comma, semicolon, tab, pipe, custom)
    * Flexible header handling (first row, custom headers, default headers)
    * Proper CSV field escaping for special characters
    * Robust Markdown table parsing and validation

### Changed

* **Enhanced Prefix/Suffix Commands** - Now offer choice between simple text or advanced patterns with unified pattern engine
* **Improved Pattern Syntax** - Enhanced pattern processing with robust error handling and graceful fallbacks
* **Unified Command Architecture** - Both prefix/suffix and "Insert Sequence" commands share same pattern engine for consistency
* **Improved Truncate Functionality** - Users can now choose whether ellipsis (...) counts within max length or is additional
* **Cleaner Command Palette** - Removed "Advanced List Converter:" prefix from command titles for better user experience
* **Merged Duplicate Removal** - Combined regular and enhanced duplicate removal into unified commands
* **Streamlined Commands** - Removed redundant standalone "Advanced Prefix/Suffix" command (functionality accessible through basic prefix/suffix commands)

### Fixed

* **Test Suite Stability** - Fixed timeout issue in controlCharacters test suite with proper async handling
* **Pattern Engine Robustness** - Enhanced error handling for empty parameters in pattern syntax (e.g., `{n:}` now works correctly)
* **Regex Pattern Matching** - Improved pattern parsing to handle optional parameters gracefully

### Technical

* **387 Comprehensive Tests** - All tests passing with enhanced coverage for new sequence generation features
* **Enhanced Pattern Processing** - New `processEnhancedPattern()` and `formatNumber()` functions in advancedListConverter module
* **Type Safety** - Full TypeScript implementation with proper error handling and parameter validation
* **Modular Architecture** - Clean separation of pattern processing logic for maintainability and extensibility

## Log

## [2.26.0] - 2025-09-24

### Added

* **Complete Advanced List Converter Suite** - Comprehensive data transformation tools
* **Enhanced Prefix/Suffix Commands** - Unified commands supporting both simple text and advanced patterns
* **Directional Transpose Commands** - Separate commands for rows→columns and columns→rows conversion
* **Enhanced Truncate with Ellipsis Options** - User choice for ellipsis counting behavior

### Changed

* **Streamlined Command Experience** - Removed redundant standalone Advanced Prefix/Suffix command
* **Cleaner Command Palette** - Simplified command titles without "Advanced List Converter:" prefix
* **Merged Duplicate Commands** - Consolidated duplicate removal with enhanced options into regular commands
* **Improved User Workflow** - Single commands that offer choice between simple and advanced functionality

* **Unicode Control/Special Character Normalization**
  * Refined normalization algorithm: now maps Unicode control and special characters to their ASCII equivalents where possible, with fallback to configured replacement string or removal.
  * Expanded replacement map: includes curly quotes, diverse space characters, dashes, apostrophes, and more.
  * Defensive coding: all usages of `editor.options` are now guarded to prevent undefined errors in edge cases.
  * Comprehensive test coverage: updated and expanded tests for normalization and edge cases.
### Technical

* **347 Comprehensive Tests** - Full test coverage including 6 new CSV/Markdown conversion tests
* **TypeScript Compliance** - All new interfaces and implementations follow strict typing
* **Modular Architecture** - Clean separation of concerns with dedicated advancedListConverter module
* **Performance Optimized** - Efficient algorithms for data transformation and table parsing operations
* **Robust CSV Parsing** - Handles quoted fields, escaped characters, and irregular data structures
* **Smart Markdown Table Detection** - Validates table structure and provides clear error messages

## [2.25.0] - 2025-09-24

### Added

* **Crypto Tools** - Comprehensive cryptographic utilities for text processing:
  * `Generate Hash from Text` - Support for MD5, SHA1, SHA256, SHA224, SHA512, SHA384 hash algorithms
  * `Generate Bcrypt Hash` - Secure password hashing with configurable salt rounds (1-15)
  * `Compare Bcrypt Hash` - Verify plain text passwords against bcrypt hashes
  * `Generate HMAC` - Hash-based Message Authentication Code with SHA256, SHA1, SHA512, MD5 support
  * `Generate Secure Token` - Cryptographically secure random token generation (1-128 characters)
  * `Analyze Password Strength` - Comprehensive password security analysis with 100-point scoring system

### Changed

* **Improved Bundle Size** - Replaced crypto-browserify with crypto-js for better web compatibility and smaller bundle size
* **Enhanced Crypto Performance** - Streamlined cryptographic operations using a single, optimized library

### Removed

* **RIPEMD160 Hash Support** - Removed due to limited usage and compatibility constraints with web environments

## [2.24.1] - 2025-09-23

### Changed

* Optimized extension package size by removing unused assets (text_icon_regular.png, text_icon_reverse.png, text-tool.png)
* Enhanced webpack configuration for better production builds
* Updated .vscodeignore to exclude development files and unused assets
* Package size reduced from ~487KB to ~465KB (4.5% reduction)

## [2.24.0] - 2025-09-23

### Added

* `Slugify String (URL-safe)` - Convert text to URL-friendly slug format (e.g., "Hello World!" → "hello-world")
* `Obfuscate String` - Simple character shift obfuscation for text
* `Deobfuscate String` - Reverse obfuscation to restore original text
* `Generate Numeronym` - Create numeronyms from words (e.g., "internationalization" → "i18n")
* `Show Text Statistics` - Display detailed statistics about selected text or entire document
* `Show Text Statistics in New Editor` - Open text statistics in a new editor window
* `Invert Selection` - Select everything except the currently selected text

### Fixed

* Reviewed and fixed all test suites to ensure comprehensive coverage and reliability
* Fixed test assertion logic for selection inversion edge cases
* Enhanced test stability and error handling across all modules

## [2.22.0] - 2023-11-05

### Added

* `Insert UUID`

### Changed

* Updated Node modules

## [2.21.1] - 2023-04-22

### Fixed

* Fix padding commands
* Fix `Sort by length` commands

## [2.21.0] - 2023-04-21

### Added

* `Insert line separator...`

## [2.20.0] - 2023-04-13

### Added

* `Prefix with...`: prefix all selections with text entered by the user
* `Suffix with...`: suffix all selections with text entered by the user
* `Surround with...`: surround all selections with text entered by the user

## [2.19.2] - 2023-04-12

### Fixed

* [#44 Remove empty lines should remove a line if made only of whitespaces](https://github.com/carlocardella/vscode-TextToolbox/issues/44)

## [2.19.1] - 2023-02-21

### Changed

* Updated unicode chracters replacement map:
* `U+200b` gets replaced with an empty string
* `U+2014` gets replaced with a regular dash (`-`)

## [2.19.0] - 2023-02-17

### Changed

* Renamed `Remove control characters` to `Replace control characters`
  * Rather than just removing control and Unicode characters (e.g. Left Double Quotation Marks, `U+201C`), the command now replaces known characters with their ASCII equivalent

## [2.18.0] - 2023-02-01

### Added

* `Transform to Ordered List` now supports Roman numerals
  * `i.` => Roman lowercase.
  * `i)` => Roman lowercase)
  * `I.` => Roman UPPERCASE.
  * `I)` => Roman UPPERCASE)

## [2.17.0] - 2023-01-31

### Added

* [#17 Insert/transform lines in numbered list](https://github.com/carlocardella/vscode-TextToolbox/issues/17)
  * New command `Transform to Ordered List`
  * Currently supports the following ordered list types:
    * `1.` => number.
    * `1)` => number)
    * `a.` => lowercase.
    * `a)` => lowercase)
    * `A.` => UPPERCASE.
    * `A)` => UPPPERCASE)
  * Supports single and multiple selections
  * Supports multicursor
  * Supports infinite number of lines: ordered lists based on letters work similar to an Excel spreadsheet

## [2.16.0] - 2023-01-29

### Fixed

* [#39 Insert random with multi-line editing](https://github.com/carlocardella/vscode-TextToolbox/issues/39)

### Changed

* Updated `Insert GUID`, `Insert GUID all zeros`, `Insert currency...` commands to match the behavior of `Insert Random...`:
  * If multiple cursors are active, ask the user if to insert the same random value or unique random values at each cursor's position

## [2.15.0] - 2023-01-27

### Added

* `Cycle quotes`
  * If the cursor is positioned between quotes, replace those quotes cycling through other quote types:
    1. Double quotes: `" "`
    2. Single quotes: `' '`
    3. Backtick: `` ` ` ``
  * Default keybinding: `ctrl+shift+alt+,`
* `Cycle brackets`
  * If the cursor is positioned between brackets, replaces those brackets cycling through other bracket types:
    1. Round brackets: `( )`
    2. Square brackets: `[ ]`
    3. Curly brackets: `{ }`
    4. Angle brackets: `< >`
  * Default keybinding: `ctrl+shift+alt+/`

## [2.14.0] - 2023-01-27

### Added

* `Indent using 2 spaces`: change document indentation from 4 spaces or tabs to 2 spaces
* `Indent using 4 spaces`: change document intentation from 2 spaces or tabs to 4 spaces

### Changed

* Update the status bar behavior, `Lns: <number>` appears only when test has been selected in the editor

## [2.13.1] - 2023-01-25

### Fixed

* [#38 Unexpected behavior when no text is selected with JSON options](https://github.com/carlocardella/vscode-TextToolbox/issues/38)

## [2.13.0] - 2023-01-24

### Fixed

* [#33 Improve "Select text between..." commands](https://github.com/carlocardella/vscode-TextToolbox/issues/33)

## [2.12.0] - 2023-01-19

### Fixed

* [#34 Incorrect transformation to kebab](https://github.com/carlocardella/vscode-TextToolbox/issues/34)

### Changed

* Updated all transformation commands to handle mode case combinations

## [2.11.0] - 2023-01-12

### Fixed

* Move to a stable release the previous pre-release fixes:
  * [#26 Line ending handling with sort functions](https://github.com/carlocardella/vscode-TextToolbox/issues/26)
  * [#27 LF line endings break sort options on Windows](https://github.com/carlocardella/vscode-TextToolbox/issues/27)
  * [#28 Treatment of blank lines in Sort/Invert options](https://github.com/carlocardella/vscode-TextToolbox/issues/28)

## [2.10.5] - 2023-01-11

### Fixed

* [#28 Treatment of blank lines in Sort/Invert options](https://github.com/carlocardella/vscode-TextToolbox/issues/28)

## [2.10.4] - 2023-01-11

**This is a pre-release version**

### Fixed

* Fix another scenario that falls under [#26 Line ending handling with sort functions](https://github.com/carlocardella/vscode-TextToolbox/issues/26)

## [2.10.3] - 2023-01-10

**This is a pre-release version**

### Removed

* Removed redundant `Invert lines` command, use `Sort lines` => `reverse` instead

## [2.10.2] - 2023-01-09

**This is a pre-release version**

### Fixed

* [#26 Line ending handling with sort functions](https://github.com/carlocardella/vscode-TextToolbox/issues/26)
* [#27 LF line endings break sort options on Windows](https://github.com/carlocardella/vscode-TextToolbox/issues/27)

## [2.10.4] - 2023-01-11

**This is a pre-release version**

### Fixed

* Fix another scenario that falls under [#26 Line ending handling with sort functions](https://github.com/carlocardella/vscode-TextToolbox/issues/26)

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
