# VSCode Text Toolbox

![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/carlocardella.vscode-texttoolbox)
![Visual Studio Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/carlocardella.vscode-texttoolbox)
![Visual Studio Marketplace Downloads](https://img.shields.io/visual-studio-marketplace/d/carlocardella.vscode-texttoolbox)
![Visual Studio Marketplace Rating](https://img.shields.io/visual-studio-marketplace/r/carlocardella.vscode-texttoolbox)
[![GitHub issues](https://img.shields.io/github/issues/carlocardella/vscode-TextToolbox.svg)](https://github.com/carlocardella/vscode-TextToolbox/issues)
[![GitHub license](https://img.shields.io/github/license/carlocardella/vscode-TextToolbox.svg)](https://github.com/carlocardella/vscode-TextToolbox/blob/master/LICENSE.md)
[![Twitter](https://img.shields.io/twitter/url/https/github.com/carlocardella/vscode-TextToolbox.svg?style=social)](https://twitter.com/intent/tweet?text=Wow:&url=https%3A%2F%2Fgithub.com%2Fcarlocardella%2Fvscode-TextToolbox)
<!-- [![Open in Visual Studio Code](https://open.vscode.dev/badges/open-in-vscode.svg)](https://open.vscode.dev/carlocardella/vscode-texttoolbox) -->

[Download for VS Code](https://marketplace.visualstudio.com/items?itemName=CarloCardella.vscode-texttoolbox)

[Download for VS Codium](https://open-vsx.org/extension/carlocardella/vscode-texttoolbox)

Collection of tools for text manipulation, filtering, sorting etc...

The [VS Code Marketplace](https://marketplace.visualstudio.com/vscode) has a number of great extensions for text manipulation, I installed a few of them to cover the entire range of actions I normally use, unfortunately that means there is some overlapping between them, basically the same action is contributed by multiple extensions (case conversion, for example). That is what motivated me to build this extension: I like the idea to have a single extension for all those operations and without duplicates; plus, it is a good pastime 😊.

Please open an issue to leave a comment, report a bug, request a feature etc... (you know the drill).

## Workspace Trust

The extension does not require any special permission, therefore is enabled to run in an [Untrusted Workspace](https://github.com/microsoft/vscode/issues/120251)

## Visual Studio Code for the Web

Text-Toolbox works in [Visual Studio Code for the Web](https://code.visualstudio.com/docs/editor/vscode-web) (<https://github.dev> and <https://vscode.dev>)

## Current list of commands

Notable absents: `Convert to Uppercase` and `Convert to Lowercase` have been removed in favor of the built-in commands in VScode.
Likewise, `Convert to CapitalCase` has been removed in favor of the built-in VSCode command `Transform to Title Case`.

### Text conversions

* PascalCase
  * Lorem ipsum dolor sit amet => LoremIpsumDolorSitAmet
* camelCase
  * Lorem ipsum dolor sit amet => loremIpsumDolorSitAmet
* CONSTANT_CASE
  * Lorem ipsum dolor sit amet => LOREM_IPSUM_DOLOR_SIT_AMET
* HEADER-CASE
  * Lorem ipsum dolor sit amet => LOREM-IPSUM-DOLOR-SIT-AMET
* dot.case
  * Lorem ipsum dolor sit amet => lorem.ipsum.dolor.sit.amet
* kebab-case
  * Lorem ipsum dolor sit amet => lorem-ipsum-dolor-sit-amet
* path/case
  * Lorem ipsum dolor sit amet => lorem/ipsum/dolor/sit/amet  
* Sentence case
  * Lorem ipsum dolor sit amet => Lorem ipsum dolor sit amet
* snake_case
  * Lorem ipsum dolor sit amet => lorem_ipsum_dolor_sit_amet
* Invert case
  * Lorem Ipsum Dolor Sit Amet => lOREM iPSUM dOLOR sIT aMET
* Convert path string to posix format
* Convert path string to win32 format
* Convert integer to hexadecimal
* Convert hexadecimal to integer
* HTML encode/decide
* Uri encode/decode
* Base64 encode
  * Convert text to Base64 encoding
* Base64 decode  
  * Convert Base64 back to text
* Base64 URL-safe encode
  * Convert text to URL-safe Base64 format (replaces +/ with -_, removes padding)
  * Perfect for JWT tokens, web URLs, and API communication
* Base64 URL-safe decode
  * Convert URL-safe Base64 back to text with proper padding restoration
* Parse query string to JSON
  * Convert URL query strings to formatted JSON objects
  * Handles duplicate keys (creates arrays) and URL decoding
  * Supports query strings with or without leading ?
* Decode JWT token

### String utilities

* Slugify String (URL-safe)
  * Hello World! Test String => hello-world-test-string
* Obfuscate String
  * Apply simple character shift obfuscation to text
* Deobfuscate String  
  * Reverse obfuscation to restore original text
* Generate Numeronym
  * internationalization => i18n
  * localization => l10n
  * accessibility => a11y
* Show Text Statistics
  * Display detailed statistics about selected text or entire document (characters, words, sentences, paragraphs, lines, bytes, estimated reading time)
* Show Text Statistics in New Editor
  * Open text statistics in a new editor window

### Crypto Tools

* Generate Hash from Text
  * MD5 - Message Digest 5 hash algorithm
  * SHA1 - Secure Hash Algorithm 1
  * SHA256 - Secure Hash Algorithm 256-bit
  * SHA224 - Secure Hash Algorithm 224-bit  
  * SHA512 - Secure Hash Algorithm 512-bit
  * SHA384 - Secure Hash Algorithm 384-bit
* Generate Bcrypt Hash
  * Secure password hashing using bcrypt with configurable salt rounds (1-15)
  * Industry standard for password storage
* Compare Bcrypt Hash
  * Verify if a plain text password matches a bcrypt hash
  * Useful for password validation
* Generate HMAC
  * HMAC-SHA256 - Hash-based Message Authentication Code with SHA256
  * HMAC-SHA1 - Hash-based Message Authentication Code with SHA1
  * HMAC-SHA512 - Hash-based Message Authentication Code with SHA512
  * HMAC-MD5 - Hash-based Message Authentication Code with MD5
  * Requires secret key input for authentication
* Generate Secure Token
  * Generate cryptographically secure random tokens
  * Configurable length (1-128 characters)
  * Supports hexadecimal and base64 encoding formats
* Analyze Password Strength
  * Comprehensive password strength analysis
  * Checks length, character variety, common patterns
  * Provides security recommendations and strength score

### Advanced List Converter

* Transpose Data
  * **Bidirectional**: Convert rows to columns and vice versa
  * **Rows → Columns**: Optimized for converting row-based data (like CSV records) to column format
  * **Columns → Rows**: Optimized for converting column-based data (like headers with values) to row format
  * Support for CSV (comma-separated), TSV (tab-separated), and custom delimiters
  * Handles irregular data with different column counts gracefully
  * Perfect for data transformation and analysis tasks
* Reverse List Order
  * Reverse the order of lines in your selection or document
  * Preserves empty lines in their relative positions
  * Different from sorting - maintains original line content
* Truncate Lines
  * Limit each line to a specified maximum length
  * Optional ellipsis (...) to indicate truncated content
  * Useful for formatting consistency and data cleanup

* Truncate Lines with Enhanced Ellipsis Options
  * Choose whether ellipsis (...) counts within max length or is additional
  * Better control over exact line truncation behavior
  * Maintain formatting consistency while preserving content intent
* Enhanced Remove Duplicates
  * Advanced duplicate removal with flexible options
  * Keep first or last occurrence of duplicates
  * Case-sensitive or case-insensitive comparison
  * Option to trim whitespace before comparison
* **Enhanced Prefix/Suffix Commands**
  * Choose between simple text or advanced patterns when adding prefix/suffix
  * Enhanced pattern engine with advanced syntax: `{n:start:step:format}`
  * Multiple number formats: hex, binary, octal
  * Custom start values and step increments for all sequence types
  * Enhanced letter and Roman numeral sequences
  * Complex pattern combinations in single string
  * Full backward compatibility with existing patterns: `{date}`, `{time}`, `{line}`
* **CSV ↔ Markdown Table Converter**
  * **CSV to Markdown**: Convert CSV data to formatted Markdown tables
  * **Markdown to CSV**: Convert Markdown tables back to CSV format
  * Support for multiple delimiters (comma, semicolon, tab, pipe, custom)
  * Flexible header options: use first row, specify custom headers, or generate defaults
  * Proper CSV field escaping for special characters (commas, quotes, newlines)
  * Robust Markdown table parsing with validation
  * Perfect for documentation, data analysis, and format conversion workflows

### Data Format Converters

Complete suite of bidirectional data format converters with advanced options:

* **JSON ↔ YAML Converter**
  * **JSON to YAML**: Convert JSON to YAML with formatting options
    * Configurable indentation (2, 4, 8 spaces or tabs)
    * Line width control for better readability
    * Option to sort object keys alphabetically
  * **YAML to JSON**: Convert YAML to JSON with validation
    * Indentation control (2, 4, 8 spaces or tabs)
    * Comprehensive error handling for malformed YAML
* **JSON ↔ TOML Converter**
  * **JSON to TOML**: Transform JSON to TOML configuration format
  * **TOML to JSON**: Convert TOML back to JSON with type preservation
  * Handles complex nested structures and arrays
  * Maintains data type integrity across conversions
* **XML ↔ JSON Converter**
  * **XML to JSON**: Parse XML to JSON with flexible options
    * Configurable attribute prefix (default: `@`)
    * Text node naming (default: `#text`)
    * Support for CDATA sections and namespaces
  * **JSON to XML**: Generate XML from JSON structure
    * Customizable root element name
    * Proper XML formatting with indentation
    * Handles arrays and nested objects
* **Markdown ↔ HTML Converter**
  * **Markdown to HTML**: Parse Markdown using markdown-it parser
    * Support for tables, code blocks, and formatting
    * GitHub Flavored Markdown compatibility
    * Configurable HTML rendering options
  * **HTML to Markdown**: Convert HTML back to Markdown using Turndown
    * Preserves formatting and structure
    * Handles tables, lists, and code blocks
    * Clean Markdown output
* **YAML ↔ TOML Converter**
  * **YAML to TOML**: Cross-format configuration conversion
  * **TOML to YAML**: Transform TOML to YAML format
  * Proper data type preservation between formats
  * Handles configuration-specific structures
* **JSON → CSV Converter**
  * Convert JSON arrays or objects to CSV format
  * Customizable delimiters (comma, semicolon, tab, pipe, custom)
  * Flexible header handling options
  * Nested object flattening with dot notation
  * Proper CSV field escaping for special characters

All converters include:
* Comprehensive error handling and validation
* User-configurable conversion options
* Context menu integration for selected text
* Command palette access for full document conversion

### Selection

* Invert Selection
  * Select everything except the currently selected text
  * Example: If you select line 2 in a 3-line document, this command will select lines 1 and 3

### Insert text

* Insert UUID
  * 0d7196e1-df50-ea89-b518-9335ecc62a20
* Insert GUID
  * 14854fc2-f782-5136-aebb-a121b9ba6af1
* Insert GUID all zeros
  * 00000000-0000-0000-0000-000000000000
* Insert Date
  * DATE_SHORT => 8/25/2020
  * DATE_LONG => Tuesday, August 25, 2020
  * TIME_SIMPLE => 5:34 PM
  * TIME_WITH_SECONDS => 5:34:45 PM
  * DATETIME_SHORT => 8/25/2020, 5:34 PM
  * DATETIME_SHORT_WITH_SECONDS => 8/25/2020, 5:35:17 PM
  * DATETIME_FULL_WITH_SECONDS => August 25, 2020, 5:35 PM PDT
  * DATETIME_HUGE => Sunday, May 30, 2021, 5:59 PM PDT
  * SORTABLE => 2020-08-25T17:34:58
  * UNIVERSAL_SORTABLE => 2020-08-26T00:35:01Z
  * ROUNDTRIP => 2021-05-31T00:52:12.057Z
  * ISO8601 => 2020-08-25T17:35:05.818-07:00
  * ISO8601_DATE => 2020-08-25
  * ISO8601_TIME => 17:35:05.818-07:00
  * RFC2822 => Tue, 25 Aug 2020 17:35:10 -0700
  * HTTP => Wed, 26 Aug 2020 00:35:13 GMT
  * UNIX_SECONDS => 1598402124
  * UNIX_MILLISECONDS =>1598402132390
* Insert Random
  * IPV4 => 123.75.174.203
  * IPV6 => 7c50:a61a:5ee0:4562:0dda:b41d:114b:71e0
  * NUMBER => 6739440105947136
  * PERSON_NAME
    * random => May Osborne
    * male => Jeffery Ramos
    * female => Theresa Boone
  * SSN => 956-68-2442
  * PROFESSION => Senior Art Director
  * ANIMAL => Grison
  * COMPANY => SBC Communications Inc
  * DOMAIN => cuzkiwpi.sy
  * EMAIL => uve@muvkefcib.cd
  * COLOR
    * hex => #4461ae
    * rgb => rgb(87,199,246)
  * TWITTER => @zatbiini
  * URL => <http://fuk.si/ek>
  * CITY => Ecicezjev
  * ADDRESS => 1784 Kaolo Grove
  * COUNTRY => IT
  * COUNTRY_FULL_NAME => Italy
  * PHONE => (923) 447-6974
  * ZIP_CODE => 35691
  * STATE => WA
  * STATE_FULL_NAME => Washington
  * STREET => Pase Manor
  * TIMEZONE => Kamchatka Standard Time
  * PARAGRAPH => Cij wam lijoso fa molah il nasiskil ho andot akbuh uku zikahek. Ji balsiffe puzmaano nuug bofevu ra tehar heuwa zorjul hej na heci aka webo lorresu uwage uhe nirsiam.
  * HASH => 61960319307b5f8d298141627
* Insert Lorem Ipsum
  * Paragraphs
  * Sentences
  * Words
* Insert random number
* Insert random currency amount
  * US Dollar

### Enhanced Sequence Generation

Powerful pattern-based sequence insertion with advanced syntax for numbering, lettering, and formatting:

* **Enhanced Prefix/Suffix Commands** - Choose "Advanced Patterns" option when using prefix/suffix commands for pattern-based sequences
* **Insert Sequence** - Dedicated sequence generation command using the same powerful pattern engine

#### Pattern Syntax Examples:

**Enhanced Number Patterns:**
* `{n}` - Basic numbers: 1, 2, 3, 4...
* `{n:5}` - Start at 5: 5, 6, 7, 8...
* `{n:1:2}` - Step by 2: 1, 3, 5, 7...
* `{n:10::hex}` - Hexadecimal: a, b, c, d...
* `{n:1::binary}` - Binary: 1, 10, 11, 100...
* `{n:8::octal}` - Octal: 10, 11, 12, 13...

**Enhanced Letter Sequences:**
* `{i}` - Basic lowercase: a, b, c, d...
* `{I}` - Basic uppercase: A, B, C, D...
* `{i:c}` - Start at 'c': c, d, e, f...
* `{I:Z}` - Start at 'Z': Z, AA, BB, CC...

**Enhanced Roman Numerals:**
* `{r}` - Basic lowercase Roman: i, ii, iii, iv...
* `{R}` - Basic uppercase Roman: I, II, III, IV...
* `{r:5}` - Start at 5: v, vi, vii, viii...
* `{R:10}` - Start at 10: X, XI, XII, XIII...

**Complex Patterns:**
* `Item {n:1:2} - {i:a} ({R:1})` - Mixed patterns: "Item 1 - a (I)", "Item 3 - b (II)"...
* `{date} - Line {n}` - Date with numbering: "9/25/2025 - Line 1", "9/25/2025 - Line 2"...

**Features:**
* **Unified Pattern Engine** - Same powerful engine for both Prefix/Suffix and Insert Sequence commands
* **Backward Compatibility** - All existing patterns continue to work: `{date}`, `{time}`, `{line}`
* **Robust Error Handling** - Graceful fallbacks for invalid parameters
* **Multiple Formats** - Support for hex, binary, octal number formatting
* **Flexible Start Points** - Begin sequences at any number or letter
* **Complex Combinations** - Mix multiple patterns in a single string
  * Euro
  * British Pound
  * Japanese Yen
  * Chinese Yuan
  * Indian Rupee
  * Mexican Peso
  * Israeli New Shequel
  * Bitcoin
  * South Korean Won
  * South African Rand
  * Swiss Franc
* Insert line numbers
* Insert numbers sequence
* Pad Selection Right
* Pad Selection Left
* Prefix with... (Enhanced with advanced pattern support)
* Suffix with... (Enhanced with advanced pattern support)
* Surround with...
* Insert line separator...

_Note_: If multiple cursors are active, ask the user if to insert the same random value or unique random values at each cursor's position

### Enhanced Prefix/Suffix

The `Prefix with...` and `Suffix with...` commands now offer both simple text and advanced pattern support:

**Simple Text Mode:**
* Enter plain text to add to each line
* Traditional behavior for basic prefix/suffix operations

**Advanced Pattern Mode:**
* Pattern-based line numbering and formatting:
  * `{n}` - Sequential numbers (1, 2, 3, ...)
  * `{i}` - Lowercase letters (a, b, c, ..., z, aa, ab, ...)
  * `{I}` - Uppercase letters (A, B, C, ..., Z, AA, AB, ...)
  * `{r}` - Roman numerals lowercase (i, ii, iii, iv, ...)
  * `{R}` - Roman numerals uppercase (I, II, III, IV, ...)
  * `{line}` - Line numbers from document
  * `{date}` - Current date
  * `{time}` - Current time
* Support for complex patterns with multiple placeholders
* Ideal for creating numbered lists, documentation, and structured content

### Filter

* Filter lines, result in new Editor
  * use RegExp (default) or set `TextToolbox.filtersUseRegularExpressions` to `false` to use simple string match instead
  * RegExp allow for a more targeted search; use global flags to fine tune your search. RegExp must use forward slashes (`/`) to delimit the expression and the global flags (optional): `/<expression>/flags`
    * `/\d.*/gm`
  * string match allows to find all lines containing the string you are looking for, the string must match exactly

### Open

* Open under cursor
  * Position the cursor on a file path, URL or email address and open it with `alt+o` on Windows (`cmd+o` on Mac)

### Remove

* Remove all empty lines
  * remove all empty lines from the current document
* Remove redundant empty line
  * remove all redundant empty lines from the current document: reduces multiple empty lines to one
* Remove duplicate lines
  * Advanced options: keep first/last occurrence, case sensitivity, trim whitespace
* Remove duplicate lines, result in new Editor
  * Same advanced options available
* Remove brackets
* Remove quotes
* Cycle brackets
* Cycle quotes

### Sort

* Sort lines
  * Ascending
  * Descending
  * Reverse
* Sort lines by length
  * Ascending
  * Descending
  * Reverse

### Control characters

* Highlight control characters
  * By default control characters are highlighted with a red box but color and border shape can be customized through `TextToolbox.decorateControlCharacters`
* Remove control characters
  * By default control characters are replaced with an empty string but this can be changed through `TextToolbox.replaceControlCharactersWith`.
  * Removes control characters from the current selection(s) or from the entire document if no text is selected

### Split

* Split selection based on delimiter
  * Split and open in new editor

### Json

* Stringify Json
* Fix and Format Json
* Minify Json
* Fix Win32 path in Json

### Highlight text

* Highlight
* Highlight with color...
* Highlight all matches, case sensitive
* Highlight all matches, case insensitive
* Highlight all matches, case sensitive, with color...
* Highlight all matches, case insensitive, with color...
* Highlight with RegExp
* Highlight with RegExp with color...
* Remove all highlights
* Remove highlight

_Note_: In this release, highlights and decorations are persisted as long as the VSCode instance is running but are not restored if VSCode is restarted. Persistence across restarts will be added in a future release.

### Align

* Align as table
  * Formats a CSV selection as a markdown style table: does not need to be a markdown file, but the table is formatted using the markdown stile
* Align as table with headers
  * Uses the first line in the CSV selection as table headers, markdown style
* Align to separator

Align commands can use RegExp to identify the separator; for example you can use `\s` for space and `\t` for tabs

### Tab Out

* Toggle Tab Out
* Tab Out of brackets, quotes and some punctuation
  * _Note_: Tab Out is always disabled it the cursor is at the beginning of a line (position 0) to allow to indent its text
* Enable or disable the feature for all languages with `TextToolbox.tabOut.enabled`: default `true`
* Show or hide a message in the Status Bar when Tab Out is enabled with `TextToolbox.tabOut.showInStatusBar`: default `true`
* Control which characters (brackets, quotes etc.) can be _tabbed out_ of
* Choose for which language types Tab Out is enabled, with `TextToolbox.tabOut.enabledLanguages`: default `*` (enabled for all languages)
* Choose for which language types Tab Out is disabled, with `TextToolbox.tabOut.disableLanguages`: default empty, meaning Tab Out is not explicitly disabled for any language
  * You can combine `TextToolbox.tabOut.disableLanguages` and `TextToolbox.tabOut.enableLanguages` to fine-tune how Tab Out should work: for example you can enable Tab Out for all language types except `plaintext` with:
  
  ```json
  {
    "TextToolbox.tabOut.enableLanguages": ["*"],
    "TextToolbox.tabOut.disableLanguages": ["plaintext"]
  }
  ```

### Indentation

* Indent using 2 spaces
* Indent using 4 spaces

### Ordered List

* Transform to Ordered List
  * Currently supports the following ordered list types:
    * `1.` => number.
    * `1)` => number)
    * `a.` => lowercase.
    * `a)` => lowercase)
    * `A.` => UPPERCASE.
    * `A)` => UPPPERCASE)
    * `i.` => Roman lowercase.
    * `i)` => Roman lowercase)
    * `I.` => Roman UPPERCASE.
    * `I)` => Roman UPPERCASE)

### Others

* Open selection(s) in new editor
* Duplicate tab (open the current document's text in a new unsaved document)
* Select brackets content
* Select quotes content

### Status Bar

* Show the number of lines in a selection
* Show the number of words in a selection or the number of words in the document if there is no selection
* Show the cursor position (active offset)
* Show if Tab Out is enabled for the document

## My other extensions

* [Virtual Repos](https://github.com/carlocardella/vscode-VirtualRepos): Virtual Repos is a Visual Studio Code extension that allows to open and edit a remote repository (e.g. on GitHub) without cloning, committing or pushing your changes. It all happens automatically
* [Virtual Gists](https://github.com/carlocardella/vscode-VirtualGists): Virtual Gists is a Visual Studio Code extension that allows to open and edit a remote gist (e.g. on GitHub) without cloning, committing or pushing your changes. It all happens automatically
* [Virtual Git](https://github.com/carlocardella/vscode-VirtualGit): VSCode extension path with my extensions to work with virtual repositories and gists based on a virtual file system
<!-- * [Text Toolbox](https://github.com/carlocardella/vscode-TextToolbox): Collection of tools for text manipulation, filtering, sorting etc... -->
* [File System Toolbox](https://github.com/carlocardella/vscode-FileSystemToolbox): VSCode extension to work with the file system, path auto-complete on any file type
* [Changelog Manager](https://github.com/carlocardella/vscode-ChangelogManager): VSCode extension, helps to build a changelog for your project, either in markdown or plain text files. The changelog format follows Keep a changelog
* [Hogwarts colors for Visual Studio Code](https://github.com/carlocardella/hogwarts-colors-for-vscode): Visual Studio theme colors inspired by Harry Potter, Hogwarts and Hogwarts Houses colors and banners

## Acknowledgements

Text Toolbox is freely inspired by these fine extensions:

* [gurayyarar DummyTextGenerator](https://marketplace.visualstudio.com/items?itemName=gurayyarar.dummytextgenerator)
* [qcz vscode-text-power-tools](https://marketplace.visualstudio.com/items?itemName=qcz.text-power-tools)
* [tomoki1207 selectline-statusbar](https://marketplace.visualstudio.com/items?itemName=tomoki1207.selectline-statusbar)
* [adamwalzer string-converter](https://marketplace.visualstudio.com/items?itemName=adamwalzer.string-converter)
* [Tyriar vscode-sort-lines](https://marketplace.visualstudio.com/items?itemName=Tyriar.sort-lines)
* [rpeshkov vscode-text-tables](https://marketplace.visualstudio.com/items?itemName=RomanPeshkov.vscode-text-tables)
* [wmaurer vscode-change-case](https://github.com/wmaurer/vscode-change-case)
* [volkerdobler insertnums](https://marketplace.visualstudio.com/items?itemName=volkerdobler.insertnums)
* [WengerK vscode-highlight-bad-chars](https://marketplace.visualstudio.com/items?itemName=wengerk.highlight-bad-chars#overview)
* [nhoizey vscode-gremlins](https://marketplace.visualstudio.com/items?itemName=nhoizey.gremlins)
* [Pustelto Bracketeer](https://marketplace.visualstudio.com/items?itemName=pustelto.bracketeer)
* [albertromkes tabout](https://github.com/albertromkes/tabout)
* [Compulim indent4to2](https://marketplace.visualstudio.com/items?itemName=Compulim.indent4to2)
