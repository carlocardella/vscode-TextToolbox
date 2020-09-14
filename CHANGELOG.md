# **Change Log**

All notable changes to the "vscode-TextToolbox" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

* Align
  * to cursor
  * to text delimiter (csv)
  * as table
* Insert line numbers

## Log

### [0.6.0]

#### Updated

* Updated case conversions, now works on multiple selections

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
  * If there is no selection, the command inserts a string compreised of the selected character(s) and of the specified length

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
