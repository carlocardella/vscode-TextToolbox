# VSCode Text Toolbox

![.github/workflows/BuildAndPublish.yml](https://github.com/carlocardella/vscode-TextToolbox/workflows/.github/workflows/BuildAndPublish.yml/badge.svg?branch=master)
![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/carlocardella.vscode-texttoolbox)
![Visual Studio Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/carlocardella.vscode-texttoolbox)
![Visual Studio Marketplace Downloads](https://img.shields.io/visual-studio-marketplace/d/carlocardella.vscode-texttoolbox)
![Visual Studio Marketplace Rating](https://img.shields.io/visual-studio-marketplace/r/carlocardella.vscode-texttoolbox)
[![GitHub issues](https://img.shields.io/github/issues/carlocardella/vscode-TextToolbox.svg)](https://github.com/carlocardella/vscode-TextToolbox/issues)
[![GitHub license](https://img.shields.io/github/license/carlocardella/vscode-TextToolbox.svg)](https://github.com/carlocardella/vscode-TextToolbox/blob/master/LICENSE.md)
[![Twitter](https://img.shields.io/twitter/url/https/github.com/carlocardella/vscode-TextToolbox.svg?style=social)](https://twitter.com/intent/tweet?text=Wow:&url=https%3A%2F%2Fgithub.com%2Fcarlocardella%2Fvscode-TextToolbox)

Collection of tools for text manipulation, filtering, sorting etc...

The marketplace has a number of great extensions for text manipulation, I installed a few of them to cover the entire range of actions I normally use, unfortunately that means there is some overlapping between them, basically the same action is contributed by multiple extensions (case conversion, for example). That is what motivated me to build this extension: I like the idea to have a single extension for all those operations and without duplicates; plus, it is a good pastime 😊.

Please open an issue to leave a comment, report a bug, request a feature etc... (you know the drill).

### Workspace Trust

The extension does not require any special permission, therefore is enabled to run in an [Untrusted Workspace](https://github.com/microsoft/vscode/issues/120251)

## Current list of commands

* UPPERCASE
  * Lorem ipsum dolor sit amet => LOREM IPSUM DOLOR SIT AMET
* lowercase
  * Lorem ipsum dolor sit amet => lorem ipsum dolor sit amet
* PascalCase
  * Lorem ipsum dolor sit amet => LoremIpsumDolorSitAmet
* Capital Case
  * Lorem ipsum dolor sit amet => Lorem Ipsum Dolor Sit Amet
* camelCase
  * Lorem ipsum dolor sit amet => loremIpsumDolorSitAmet
* CONSTANT_CASE
  * Lorem ipsum dolor sit amet => LOREM_IPSUM_DOLOR_SIT_AMET
* dot.case
  * Lorem ipsum dolor sit amet => lorem.ipsum.dolor.sit.amet
* Harder-Case
  * Lorem ipsum dolor sit amet => Lorem-Ipsum-Dolor-Sit-Amet
* no case
  * Lorem ipsum dolor sit amet => lorem ipsum dolor sit amet
* param-case
  * Lorem ipsum dolor sit amet => lorem-ipsum-dolor-sit-amet
* Sentence case
  * Lorem ipsum dolor sit amet => Lorem ipsum dolor sit amet
* snake_case
  * Lorem ipsum dolor sit amet => lorem_ipsum_dolor_sit_amet
* Insert GUID
  * 14854fc2-f782-5136-aebb-a121b9ba6af1
* Insert GUID all zeros
  * 00000000-0000-0000-0000-000000000000
* Insert Date
  * DATE_SHORT => 8/25/2020
  * TIME_SIMPLE => 5:34 PM
  * TIME_WITH_SECONDS => 5:34:45 PM
  * DATETIME_SHORT => 8/25/2020, 5:34 PM
  * DATE_HUGE => Tuesday, August 25, 2020
  * SORTABLE => 2020-08-25T17:34:58
  * UNIVERSAL_SORTABLE => 2020-08-26T00:35:01Z
  * ISO8601 => 2020-08-25T17:35:05.818-07:00
  * ISO8601_DATE => 2020-08-25
  * ISO8601_TIME => 17:35:05.818-07:00
  * RFC2822 => Tue, 25 Aug 2020 17:35:10 -0700
  * HTTP => Wed, 26 Aug 2020 00:35:13 GMT
  * DATETIME_SHORT_WITH_SECONDS => 8/25/2020, 5:35:17 PM
  * DATETIME_FULL_WITH_SECONDS => August 25, 2020, 5:35 PM PDT
  * UNIX_SECONDS => 1598402124
  * UNIX_MILLISECONDS =>/598402132390
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
  * URL => http://fuk.si/ek
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
* Pad Selection Right
* Pad Selection Left
* Remove all empty lines
  * remove all empty lines from the current document
* Remove redundant empty line
  * remove all redundant empty lines from the current document: reduces multiple empty lines to one
* Remove duplicate lines
* Remove duplicate lines, result in new Editor
* Filter lines, result in new Editor
  * use RegExp (default) or set `tt.filtersUseRegularExpressions` to `false` to use simple string match instead
  * RegExp allow for a more targeted search; use global flags to fine tune your search. RegExp must use forward slashes (`/`) to delimit the expression and the global flags (optional): `/<expression>/flags`
    * `/\d.*/gm`
  * string match allows to find all lines containing the string you are looking for, the string must match exactly
* Sort lines
  * Ascending
  * Descending
  * Reverse
* Open selection(s) in new editor
* Insert line numbers
* Insert numbers sequence
* Highlight control characters
  * By default control characters are highlighted with a red box but color and border shape can be customized through `tt.decorateControlCharacters`
* Remove control characters
  * By default control characters are replaced with an empty string but this can be changed through `tt.replaceControlCharactersWith`.
  * Removes control characters from the current selection(s) or from the entire document if no text is selected
* Split selection based on delimiter
  * Split and open in new editor
<!-- * Align text to a delimiter (can be used to align CSV elements)
  * Align left (default): inserts padding spaces after the separator
    ```
    London,    Paris,     Rome      
    Tokyo,     Singapore, Syndey     
    ```
  * Align right: inserts padding spaces between text and separator
    ```
    London    ,Paris     ,Rome      
    Tokyo     ,Singapore ,Syndey    
    ``` -->

* Stringify Json
* Fix and Format Json
* Minify Json

### Thanks to:

Text Toolbox is freely inspired by these fine extensions:

* [gurayyarar DummyTextGenerator](https://github.com/gurayyarar/DummyTextGenerator)
* [qcz vscode-text-power-tools](https://github.com/qcz/vscode-text-power-tools)
* [tomoki1207 selectline-statusbar](https://github.com/tomoki1207/selectline-statusbar)
* [adamwalzer string-converter](https://github.com/adamwalzer/string-converter)
* [Tyriar vscode-sort-lines](https://github.com/Tyriar/vscode-sort-lines)
* [rpeshkov vscode-text-tables](https://github.com/rpeshkov/vscode-text-tables)
* [wmaurer vscode-change-case](https://github.com/wmaurer/vscode-change-case)
* [volkerdobler insertnums](https://github.com/volkerdobler/insertnums)
* [WengerK vscode-highlight-bad-chars](https://github.com/WengerK/vscode-highlight-bad-chars)
* [nhoizey vscode-gremlins](https://github.com/nhoizey/vscode-gremlins)
