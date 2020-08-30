# VSCode Text Toolbox

![.github/workflows/BuildAndPublish.yml](https://github.com/carlocardella/vscode-TextToolbox/workflows/.github/workflows/BuildAndPublish.yml/badge.svg?branch=master)
[![Version](https://vsmarketplacebadge.apphb.com/version/vscode-TextToolbox.svg)](https://marketplace.visualstudio.com/items?itemName=vscode-TextToolbox)
[![Installs](https://vsmarketplacebadge.apphb.com/installs/vscode-TextToolbox.svg)](https://marketplace.visualstudio.com/items?itemName=vscode-TextToolbox)
[![Rating](https://vsmarketplacebadge.apphb.com/rating/vscode-TextToolbox.svg)](#)
[![GitHub issues](https://img.shields.io/github/issues/carlocardella/vscode-TextToolbox.svg)](https://github.com/carlocardella/vscode-TextToolbox/issues)
[![GitHub license](https://img.shields.io/github/license/carlocardella/vscode-TextToolbox.svg)](https://github.com/carlocardella/vscode-TextToolbox/blob/master/LICENSE.md)
[![Twitter](https://img.shields.io/twitter/url/https/github.com/carlocardella/vscode-TextToolbox.svg?style=social)](https://twitter.com/intent/tweet?text=Wow:&url=https%3A%2F%2Fgithub.com%2Fcarlocardella%2Fvscode-TextToolbox)

Collection of tools for text manipulation, filtering, sorting etc...

The marketplace has a number of great extensions for text manipulation, I installed a few of them to cover the entire range of actions I normally use, unfortunately that means there is some overlapping between them, basically the same action is contributed by multiple extensions (case conversion, for example). That is what motivated me to build this extension: I like the idea to have a single extension for all those operations and without duplicates; plus, it is a good pastime 😊.

## Current list of commands

* Uppercase
  * Lorem ipsum dolor sit amet => LOREM IPSUM DOLOR SIT AMET
* Lowercase
  * Lorem ipsum dolor sit amet => lorem ipsum dolor sit amet
* PascalCase
  * Lorem ipsum dolor sit amet => LoremIpsumDolorSitAmet
* CapitalCase
  * Lorem ipsum dolor sit amet => Lorem Ipsum Dolor Sit Amet
* CamelCase
  * Lorem ipsum dolor sit amet => loremIpsumDolorSitAmet
* ConstantCase
  * Lorem ipsum dolor sit amet => LOREM_IPSUM_DOLOR_SIT_AMET
* DotCase
  * Lorem ipsum dolor sit amet => lorem.ipsum.dolor.sit.amet
* HarderCase
  * Lorem ipsum dolor sit amet => Lorem-Ipsum-Dolor-Sit-Amet
* NoCase
  * Lorem ipsum dolor sit amet => lorem ipsum dolor sit amet
* ParamCase
  * Lorem ipsum dolor sit amet => lorem-ipsum-dolor-sit-amet
* SentenceCase
  * Lorem ipsum dolor sit amet => Lorem ipsum dolor sit amet
* SnakeCase
  * Lorem ipsum dolor sit amet => lorem_ipsum_dolor_sit_amet
* InsertGUID
  * 14854fc2-f782-5136-aebb-a121b9ba6af1
* InsertDate
  * DATE_SHORT => 8/25/2020
  * TIME_SIMPLE => 5:34 PM
  * TIME_WITH_SECONDS => 5:34:45 PM
  * DATETIME_SHORT => 8/25/2020, 5:34 PM
  * DATE_HUGE => Tuesday, August 25, 2020
  * SORTABLE => 2020-08-25T17:34:58
  * UNIVERSAL_SORTABLE => 2020-08-26T00:35:01Z
  * ISO8601 => 2020-08-25T17:35:05.818-07:00
  * RFC2822 => Tue, 25 Aug 2020 17:35:10 -0700
  * HTTP => Wed, 26 Aug 2020 00:35:13 GMT
  * DATETIME_SHORT_WITH_SECONDS => 8/25/2020, 5:35:17 PM
  * DATETIME_FULL_WITH_SECONDS => August 25, 2020, 5:35 PM PDT
  * UNIX_SECONDS => 1598402124
  * UNIX_MILLISECONDS =>/598402132390
* PickRandom
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
  * COUNTRY => SV
  * PHONE => (923) 447-6974
  * ZIP_CODE => 35691
  * STATE => WI
  * STREET => Pase Manor
  * TIMEZONE => Kamchatka Standard Time
  * PARAGRAPH => Cij wam lijoso fa molah il nasiskil ho andot akbuh uku zikahek. Ji balsiffe puzmaano nuug bofevu ra tehar heuwa zorjul hej na heci aka webo lorresu uwage uhe nirsiam.
  * HASH => 61960319307b5f8d298141627
* Pad
* RemoveAllEmptyLines
  * remove all empty lines from the current document
* RemoveRedundantEmptyLine
  * remove all redundant empty lines from the current document: reduces multiple empty lines to one

### Thanks to...

Text Toolbox is freely inspired fromby these fine extensions:

* [gurayyarar DummyTextGenerator](https://github.com/gurayyarar/DummyTextGenerator)
* [qcz vscode-text-power-tools](https://github.com/qcz/vscode-text-power-tools)
* [tomoki1207 selectline-statusbar](https://github.com/tomoki1207/selectline-statusbar)
* [adamwalzer string-converter](https://github.com/adamwalzer/string-converter)
* [Tyriar vscode-sort-lines](https://github.com/Tyriar/vscode-sort-lines)
* [rpeshkov vscode-text-tables](https://github.com/rpeshkov/vscode-text-tables)