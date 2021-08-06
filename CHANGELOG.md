# **Change Log**

All notable changes to the "vscode-TextToolbox" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

* Text manipulation
  * remove empty lines (end of file)
  * duplicate string (ask user how many times)
  * convert number, dec to hex and vice versa
  * Randomize selection (words in a selection)
  * Reverse selection (lines or words in selection)
  * Sort lines by length
  * Explore disabling italic (suggestion from https://github.com/microsoft/vscode/issues/25895#issuecomment-890614837)
   * for all emoji
   * based on theme
   * all
* Json
  * Validate
  * Escape
  * Unescape
  * Work on selection
  * Work on the entire file if file type is json or cjson
* Highlight
  * highlight word (and all occurrences)
  * highlight based on regex
  * ask the user for the highlight color
  * toggle/clear command in context menu
* Align:
  * to cursor
  * as table
  * align csv
* Filtering
  * improve `Filter lines, result in new editor`: regex search only of the search string begins with `/`, otherwise default to text search (return the entire line containing the match)
  * add original line numbers when opening a selection/filter in a new editor
  * count line occurrences
  * add config values for regex global switches, default /gi
  * Count duplicate lines, open in new document, sorted by count descending:

    ```text
      8: dup1
      4: dup2
      3: dup3
    ```

* Split
  * split clipboard
    * paste in place
    * paste in new editor
* Insert
  * Insert UUID (universally unique identifier)
  * Prefix lines with string
  * Suffix lines with string
  * insert date sequence
    * add option to use times 12/24 formats
  * famous excerpts, e.g. The Divine Comedy, Hamlet etc...
  * excerpts in languages other than English
  * randomByte
    * min
    * max
    * negative
    * prime
  * randomIntCustomRange
  * randomStringCustomLength
  * randomSampleFromInput
  * randomIban
  * insert multicursor should insert different strings, not the same repeated one
* Copy text
  * Copy without formatting
  * Copy with line numbers
  * Copy with metadata
* Other
  * if there is no selection update the entire line
  * remove control characters/bad characters on paste (with config toggle)
  * show progress bar for long operations (e.g. filters on large files)
* Encode/Decode
  * Base64
  * Html
  * Url
* Status bar
  * allow to update position without reloading the entire window

## Log

## [1.8.1] - 2021-08-05

### Fixed

* Align to cursor does not change the text near the cursor if there is no selection

## [1.8.0] - 2021-08-04

### Added

* `Align to separator`: align a selection in a CSV type, choose the type of separator to use
  * The default separator can be controlled by the setting `tt.alignTextDefaultSeparator`

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
* Added `Roundtrip` date format: `2021-05-31T16:53:38.954Z`: https://docs.microsoft.com/en-us/dotnet/standard/base-types/standard-date-and-time-format-strings#Roundtrip
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
    ```
    London,    Paris,     Rome
    Tokyo,     Singapore, Sydney
    ```
  * Align right: inserts padding spaces between text and separator
    ```
    London    ,Paris     ,Rome
    Tokyo     ,Singapore ,Sydney
    ```

## [0.10.1] - 2020-10-04

### Update

* Update readme and changelog

## [0.10.0] - 2020-10-04

### Added

* Highlight control characters
  * By default control characters are highlighted with a red box but color and border shape can be customized through `tt.decorateControlCharacters`
* Remove control characters
  * By default control characters are replaced with an empty string but this can be changed through `tt.replaceControlCharactersWith`.
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

### Updated

* Case conversion and Insert commands now work on multiple selections
* Renamed "Pad Right" and "Pad Left" to "Pad Selection Right" and "Pad Selection Left" respectively

## [0.5.0] - 2020-09-13

### Added

* Sort lines, ascending, descending or reverse the lines order
  * Update the current selection or entire document, or open the sorted lines in a new editor

### Updated

* Better handle configuration changes, react to the event only if `Text Toolbox` configuration is undated, ignore all other changes

## [0.4.0] - 2020-09-06

### Added

* Find text using RegEx or simple text match and open the result in a new Editor
  * By default the search uses RegEx: can be changed using `tt.filtersUseRegularExpressions`

## [0.3.0] - 2020-09-05

### Added

* Remove duplicate lines
* Remove duplicate lines, open result in new editor

### Fixed

* Fixed a bug with padding where the padded string length was incorrect

### Updated

* Updated tests, close the editors after every `Describe` rather than after every test

## [0.2.0] - 2020-08-30

### Updated

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
