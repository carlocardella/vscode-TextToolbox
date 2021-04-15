# **Change Log**

All notable changes to the "vscode-TextToolbox" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

* Text manipulation
  * escape (json)
  * unescape (json)
  * remove empty lines (end of file)
  * trim
  * duplicate string (ask user how many times)
  * convert number, dec to hex and vice versa
* Highlight
  * highlight word (and all occurrences)
  * highlight based on regex
  * ask the user for the highlight color
  * toggle/clear command in context menu
* Align:
  * to cursor
  * as table
  * improve csv alignment, reduce empty space where possible
* Filtering
  * improve `Filter lines, result in new editor`: regex search only of the search string begins with `/`, otherwise default to text search (return the entire line containing the match)
  * add original line numbers when opening a selection/filter in a new editor
  * count line occurrences
  * add config values for regex global switches, default /gi
* Sorting
  * align csv
* Split
  * split based on delimiter
  * split selection
    * replace selection
    * open in new editor
  * split clipboard
    * paste in place
    * paste in new editor
* Insert
  * insert date sequence
    * DateTime `round-trip` format: https://docs.microsoft.com/en-us/dotnet/standard/base-types/standard-date-and-time-format-strings#Roundtrip
    * improve command picker, show date format preview
    * add option to use times 12/24 formats
  * Lorem Ipsum
    * other famous excerpts, e.g. The Divine Comedy, Hamlet etc...
    * excerpts in languages other than English
  * randomByte
    * min
    * max
    * negative
    * prime
  * currency
    * dollars
    * euros
    * british pound
    * yen
    * yuan
  * randomIntCustomRange
  * randomStringCustomLength
  * randomSampleFromInput
  * randomIban
  * insert multicursor should insert different strings, not the same repeated one
* Other
  * if there is no selection update the entire line
  * remove control characters/bad characters
    * on paste (with config toggle)
    * show progress bar for long operations (e.g. large files)
* Status bar
  * allow to update position without reloading the entire window
* Package
  * find the minimum required vscode version
  * update extension

## Log

## [0.12.0] - 2021-04-04

### Removed

* Temporarily removed the `Align` command, it was not behaving as intended and I am working on a new implementation. I will add `Align` back when ready.

### Added

* Insert GUID all zeros
  * Supports multicursor

### [0.11.0] - 2020-10-11

#### Added

* Align text to separator (can be used to align CSV elements):
  * Align left (default): inserts padding spaces after the separator
    ```
    London,    Paris,     Rome
    Tokyo,     Singapore, Syndey
    ```
  * Align right: inserts padding spaces between text and separator
    ```
    London    ,Paris     ,Rome
    Tokyo     ,Singapore ,Syndey
    ```

### [0.10.1] - 2020-10-04

#### Update

* Update readme and changelog

### [0.10.0] - 2020-10-04

#### Added

* Highlight control characters
  * By default control characters are highlighted with a red box but color and border shape can be customized through `tt.decorateControlCharacters`
* Remove control characters
  * By default control characters are replaced with an empty string but this can be changed through `tt.replaceControlCharactersWith`.
  * Removes control characters from the current selection(s) or from the entire document if no text is selected

### [0.9.0] - 2020-09-28

#### Fixed

* The StatusBar item with lines and words count is readonly, disabled the click event
* Insert numbers sequence: the user can choose the starting index and length, this inserts the needed amount of lines

### [0.8.0] - 2020-09-26

#### Added

* Insert line numbers

### [0.7.0] - 2020-09-25

#### Added

* Open selection(s) in new editor

#### Fixed

* Fixed a bug where multiline random inserts were failing if the command needed to prompt the user for a choise. The affected commands were PERSON_NAME, COLOR, PARAGRAPH and HASH

### [0.6.0] - 2020-09-24

#### Updated

* Case conversion and Insert commands now work on multiple selections
* Renamed "Pad Right" and "Pad Left" to "Pad Selection Right" and "Pad Selection Left" respectively

### [0.5.0] - 2020-09-13

#### Added

* Sort lines, ascending, descending or reverse the lines order
  * Update the current selection or entire document, or open the sorted lines in a new editor

#### Updated

* Better handle configuration changes, react to the event only if `Text Toolbox` configuration is undated, ignore all other changes

### [0.4.0] - 2020-09-06

#### Added

* Find text using RegEx or simple text match and open the result in a new Editor
  * By default the search uses RegEx: can be changed using `tt.filtersUseRegularExpressions`

### [0.3.0] - 2020-09-05

#### Added

* Remove duplicate lines
* Remove duplicate lines, open result in new editor

#### Fixed

* Fixed a bug with padding where the padded string length was incorrect

#### Updated

* Updated tests, close the editors after every `Describe` rather than after every test

### [0.2.0] - 2020-08-30

#### Updated

* Updated padding, split the previous command in `PadRight` and `PadLeft`.
  * If there is a selection, the string is padded up to the length specified
  * If there is no selection, the command inserts a string comprised of the selected character(s) and of the specified length

* Updated CHANGELOG and README

#### Added

* `ISO8601_DATE`
* `ISO8601_TIME`
* `STATE_FULL_NAME`
* `COUNTRY_FULL_NAME`

### [0.1.2] - 2020-08-30

* Updated README, CHANGELOG

### [0.1.1] - 2020-08-30

* Package with Webpack

### [0.1.0] - 2020-08-29

* First preview release published
