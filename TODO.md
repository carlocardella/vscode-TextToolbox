# Text Toolbox Enhancement TODO

## Overview

The goal is to extend the current Text Toolbox Advanced Sequence Generation ✅ **COMPLETED v2.27.0**

**Status**: ✅ **COMPLETED** - Enhanced pattern engine with unified approach implemented September 2025

### Implementation Summary:
✅ **Unified Approach Implemented**: Both "Advanced Prefix/Suffix" and "Insert Sequence" commands share the same enhanced pattern engine while maintaining distinct user mental models.ension with additional tools and utilities that are available in the it-tools online platform, while maintaining the VS Code-native experience.

## 🔐 Crypto Tools Category ✅ **COMPLETED v2.25.0**

**Description**: Add cryptographic tools missing from the extension

### Functions Implemented:
  - [x] MD5 hashing
  - [x] SHA1 hashing  
  - [x] SHA256 hashing
  - [x] SHA224 hashing
  - [x] SHA512 hashing
  - [x] SHA384 hashing
  - [ ] SHA3 hashing (not implemented)
  - [x] ~~RIPEMD160 hashing~~ (removed for web compatibility)
  - [x] Generate bcrypt hash from text
  - [x] Compare text with bcrypt hash
  - [x] Generate HMAC with secret key
  - [x] Support multiple hash functions (SHA256, SHA1, SHA512, MD5)
  - [ ] Generate RSA private/public key pairs
  - [ ] PEM format output
  - [x] Analyze password strength with 100-point scoring system
  - [x] Estimate crack time
  - [x] Entropy calculation
  - [x] Pattern detection and penalties
  - [x] Detailed scoring breakdown
  - [ ] Generate BIP39 mnemonic
  - [ ] Convert mnemonic to passphrase
  - [ ] AES encryption/decryption
  - [ ] TripleDES encryption/decryption
  - [ ] Rabbit encryption/decryption
  - [ ] RC4 encryption/decryption
  - [x] Cryptographically secure random tokens
  - [x] Configurable length (1-128 characters)
  - [x] Hexadecimal and Base64 encoding support

## 🔄 Data Format Converters ✅ **COMPLETED v2.26.0**

**Description**: Add bidirectional converters between various data formats

### Functions Implemented:
  - [x] JSON to YAML conversion with formatting options
  - [x] YAML to JSON conversion with indentation control
  - [x] Comprehensive validation and error handling
  - [x] Custom options: indentation, line width, sort keys
  - [x] YAML to TOML conversion with proper data type handling
  - [x] TOML to YAML conversion with formatting preservation
  - [x] Cross-format data type preservation
  - [x] JSON to TOML conversion with structured formatting
  - [x] TOML to JSON conversion with type preservation
  - [x] Handle complex nested structures
  - [x] XML to JSON conversion with attribute handling
  - [x] JSON to XML conversion with customizable formatting
  - [x] Support for attributes, namespaces, and CDATA
  - [x] Configurable attribute prefixes and text nodes
  - [x] Convert CSV data to formatted Markdown tables
  - [x] Convert Markdown tables back to CSV format
  - [x] Support multiple delimiters and header options
  - [x] Markdown to HTML conversion with markdown-it parser
  - [x] HTML to Markdown conversion with Turndown
  - [x] Support for tables, code blocks, and formatting
  - [x] Configurable conversion options
  - [x] Convert JSON arrays/objects to CSV format
  - [x] Customizable delimiters and header handling
  - [x] Nested object flattening options

## 🔢 Advanced Base Conversion

**Description**: Extend beyond hex/decimal to support all common number bases

### Functions to Implement:
  - [ ] Base64 number conversion
  - [ ] Arabic numbers to Roman numerals
  - [ ] Roman numerals to Arabic numbers
  - [ ] Validation for valid Roman numeral format
## 📝 Text Encoding Enhancements

**Description**: Add advanced text encoding and conversion features

### Functions to Implement:
- [ ] **Text to ASCII Binary**
  - [ ] Convert text to ASCII binary representation
  - [ ] Convert ASCII binary back to text
- [ ] **Text to Unicode**
  - [ ] Parse and convert text to Unicode
  - [ ] Convert Unicode back to text
  - [ ] Display Unicode code points
- [ ] **NATO Phonetic Alphabet**
  - [ ] Convert text to NATO phonetic alphabet
  - [ ] Support for oral transmission formatting

## Advanced Sequence Generation

### Enhanced Pattern Engine Features ✅ **COMPLETED**:
- [x] **Enhanced Number Patterns** - `{n:start:step:format}` syntax
  - [x] Custom start values: `{n:5}` starts at 5
  - [x] Custom step increments: `{n:1:2}` for 1,3,5,7,9...
  - [x] Multiple number formats: `{n:10::hex}`, `{n:10::binary}`, `{n:10::octal}`
  - [x] Backward compatibility with basic `{n}` pattern
- [x] **Enhanced Letter Sequences** - Custom start positions
  - [x] Lowercase with start: `{i:c}` starts at 'c'
  - [x] Uppercase with start: `{I:Z}` starts at 'Z'
  - [x] Full alphabet cycling support beyond 26 letters
- [x] **Enhanced Roman Numerals** - Start value support
  - [x] Lowercase Roman: `{r:5}` starts at 'v' (5)
  - [x] Uppercase Roman: `{R:10}` starts at 'X' (10)
  - [x] Proper Roman numeral generation up to large numbers
- [x] **Complex Pattern Support** - Multiple patterns in single string
  - [x] Mixed patterns: `Item {n:1:2} - {i:a} ({R:1})`
  - [x] Backward compatibility with existing date/time patterns
- [x] **Robust Error Handling** - Graceful fallbacks for invalid syntax
  - [x] Invalid parameters default to safe values
  - [x] Non-numeric parameters handled gracefully
  - [x] Empty parameters use sensible defaults

### Command Implementation ✅ **COMPLETED**:
- [x] **Advanced Prefix/Suffix** - Enhanced existing commands with pattern choice
  - [x] User choice: Simple text or advanced patterns
  - [x] Full pattern engine integration
  - [x] Maintains existing user workflow
- [x] **Insert Sequence** - New dedicated sequence generation command
  - [x] Focused on sequence generation mental model
  - [x] Same pattern engine as Prefix/Suffix
  - [x] Direct cursor position insertion
- [x] **Shared Pattern Engine** - Single implementation for both commands
  - [x] Consistent behavior across commands
  - [x] Easier maintenance and testing
  - [x] Pattern processing in `advancedListConverter.ts`

### Technical Implementation ✅ **COMPLETED**:
- [x] **Enhanced Pattern Processing** - `processEnhancedPattern()` function
  - [x] Regex-based pattern parsing: `/\{([nrRiI]):([^:}]*):?([^:}]*):?([^}]*)\}/g`
  - [x] Flexible parameter handling with defaults
  - [x] Support for empty parameters with fallbacks
- [x] **Number Formatting** - `formatNumber()` function
  - [x] Hex formatting with proper padding
  - [x] Binary formatting with prefix support
  - [x] Octal formatting capabilities
- [x] **Comprehensive Testing** - 20+ test cases
  - [x] Basic pattern backward compatibility
  - [x] Enhanced syntax validation
  - [x] Edge case handling
  - [x] Integration testing
  - [x] All 387 tests passing

### Enhanced Features Beyond insertnums:
- [x] **Unified User Experience** - Two commands, one engine
- [x] **VS Code Integration** - Native command palette and context menu
- [x] **Pattern Flexibility** - More intuitive syntax than complex command-line options
- [x] **Type Safety** - Full TypeScript implementation with proper error handling
- [x] **Extensible Architecture** - Easy to add new pattern types in future

### Future Enhancements (Not Required for Core Functionality):
- [ ] **Date Sequences** - Date increments by days/weeks/months/years
- [ ] **Month Name Sequences** - Month names in different languages
- [ ] **JavaScript Expressions** - Custom expressions for complex patterns
- [ ] **Repeat Patterns** - Cycle through sequences (#3 syntax)
- [ ] **Random Ranges** - Random numbers in specified ranges
- [ ] **Command History** - Remember previous sequence patterns

## Advanced List Converter ✅ **COMPLETED Phase 1 - September 2025**

**Description**: Enhance existing list functionality with advanced operations that VS Code doesn't provide built-in

**Status**: ✅ **Phase 1 COMPLETE** - 5 core functions implemented with comprehensive testing

### Phase 1: Core Unique Features ✅ **COMPLETED**
- [x] **Transpose Data (Rows ↔ Columns)** ✅
  - [x] Convert CSV/TSV rows to columns and vice versa
  - [x] Support custom delimiters (tab, comma, space, custom)
  - [x] Handle irregular data gracefully
  - [x] Essential for data manipulation tasks
- [x] **Reverse List Order** ✅
  - [x] Simple line order reversal (not sorting)
  - [x] Preserve empty lines in position
  - [x] Different from sort reverse operation
- [x] **Truncate Lines to Length** ✅
  - [x] Limit each line to N characters
  - [x] Optional ellipsis (...) for truncated content
  - [x] Useful for formatting consistency
- [x] **Enhanced Remove Duplicates** ✅
  - [x] Keep first vs last occurrence option
  - [x] Case sensitive/insensitive toggle
  - [x] Trim whitespace before comparison option
  - [x] Extends existing duplicate removal with advanced options
- [x] **Advanced Prefix/Suffix Operations** ✅
  - [x] Pattern-based numbering: {n}, {i}, {I}, {a}, {A}
  - [x] Date/time patterns: {date}, {time}
  - [x] Line-based patterns: {line}
  - [x] Conditional formatting based on content
- [x] **CSV ↔ Markdown Table Converter** ✅ **NEW September 2025**
  - [x] Convert CSV data to formatted Markdown tables
  - [x] Convert Markdown tables back to CSV format
  - [x] Support multiple delimiters (comma, semicolon, tab, pipe, custom)
  - [x] Flexible header handling (first row, custom headers, default headers)
  - [x] Proper CSV field escaping for special characters
  - [x] Robust Markdown table parsing with validation
  - [x] Bidirectional conversion workflow

### Phase 2: Advanced Operations (Extended Value)
- [ ] **Multi-Criteria Sorting**
  - [ ] Numeric vs alphabetic sorting (1,2,10 vs 1,10,2)
  - [ ] Sort by length then alphabetically
  - [ ] Custom comparison functions
  - [ ] Enhances existing sort functionality
- [ ] **List Analytics & Statistics**
  - [ ] Count unique items and duplicates
  - [ ] Length distribution analysis
  - [ ] Pattern matching and validation
  - [ ] Complements existing text statistics

### Technical Implementation ✅ **COMPLETED**:
- **New Module**: `src/modules/advancedListConverter.ts` ✅ (516 lines)
- **VS Code Integration**: New submenu "Advanced List Converter" ✅
- **No Duplication**: Avoids VS Code built-in transforms ✅
- **Multi-Selection Support**: Works with multiple cursors and selections ✅
- **Performance**: Optimized for large text processing ✅
- **Comprehensive Testing**: 31 test cases with full coverage ✅

### Commands Implemented ✅:
```json
"vscode-texttoolbox.TransposeData"               ✅
"vscode-texttoolbox.ReverseListOrder"            ✅
"vscode-texttoolbox.TruncateLines"               ✅
"vscode-texttoolbox.EnhancedRemoveDuplicates"    ✅
"vscode-texttoolbox.AdvancedPrefixSuffix"        ✅
"vscode-texttoolbox.MultiCriteriaSort"           🚧 Phase 2
"vscode-texttoolbox.ListAnalytics"               🚧 Phase 2
```

### Test Coverage ✅:
- **Total Tests**: 31 test cases across 8 test suites
- **Edge Cases**: Empty documents, single lines, special characters
- **Error Handling**: Invalid inputs and boundary conditions
- **Integration**: VS Code editor integration and user workflows

## 🌐 Web Development Tools

**Description**: Add web development utilities and reference tools

### Functions to Implement:
- [ ] **URL Parser**
  - [ ] Parse URL components (protocol, host, path, params, etc.)
  - [ ] Display URL structure breakdown
- [ ] **Basic Auth Generator**
  - [ ] Generate base64 basic auth header
  - [ ] From username and password input
- [ ] **Open Graph Meta Generator**
  - [ ] Generate Open Graph HTML meta tags
  - [ ] Template for social media sharing
- [ ] **MIME Types Converter**
  - [ ] Convert MIME types to file extensions
  - [ ] Convert file extensions to MIME types
  - [ ] Comprehensive MIME type database
- [ ] **User-Agent Parser**
  - [ ] Parse user-agent strings
  - [ ] Detect browser, engine, OS, CPU, device

## 🔑 JWT and Security Tools

**Description**: Expand JWT functionality and add security utilities

### Functions to Implement:
- [ ] **Enhanced JWT Parser**
  - [ ] Full JWT parsing and validation
  - [ ] Display header, payload, signature
  - [ ] Verify JWT signatures (if key provided)
  - [ ] Token expiration checking
- [ ] **OTP Code Generator**
  - [ ] Generate time-based OTP codes
  - [ ] Multi-factor authentication support
  - [ ] QR code generation for setup
- [ ] **Keycode Information**
  - [ ] Display JavaScript keycode information
  - [ ] Show code, location, and modifiers
  - [ ] Interactive key press detection

## 🔗 String Utilities

**Status**: ✅ COMPLETED  
**Description**: Add advanced string manipulation and transformation tools

### Functions Implemented:
- [x] **String Slugification**
  - [x] Make strings URL/filename safe
  - [x] Remove special characters
  - [x] Convert to lowercase with hyphens
  - [x] Support custom separators
- [x] **String Obfuscation**
  - [x] Obfuscate sensitive strings
  - [x] Make shareable without revealing content
  - [x] Reversible obfuscation methods
  - [x] Support custom shift values
- [x] **Numeronym Generator**
  - [x] Generate numeronyms (e.g., i18n for internationalization)
  - [x] Calculate character counts between letters
  - [x] Handle edge cases (short words, whitespace)
- [x] **Enhanced Text Statistics**
  - [x] Character count (with/without spaces)
  - [x] Word count
  - [x] Sentence count
  - [x] Paragraph count
  - [x] Line count
  - [x] Reading time estimation
  - [x] File size in bytes (UTF-8)
  - [x] Display in dialog or new editor

### Implementation Details:
- ✅ Created `src/modules/stringUtilities.ts` with all functions
- ✅ Added VS Code commands and menu integration
- ✅ Created comprehensive test suite `src/test/suite/stringUtilities.test.ts`
- ✅ Added to extension.ts with proper command registration
- ✅ Updated package.json with new commands and context menus
- ✅ Added "String Utilities" submenu to editor context menu

## 📱 QR Code Generators

**Description**: Add QR code generation capabilities

### Functions to Implement:
- [ ] **QR Code Generator**
  - [ ] Generate QR codes for text/URLs
  - [ ] Customizable foreground/background colors
  - [ ] Different size options
  - [ ] Export functionality
- [ ] **WiFi QR Code Generator**
  - [ ] Generate QR codes for WiFi networks
  - [ ] Support WPA/WEP security types
  - [ ] Hidden network support

## 🛠️ Development Tools

**Description**: Add developer-focused utilities and references

### Functions to Implement:
- [ ] **Random Port Generator**
  - [ ] Generate random ports outside known range (0-1023)
  - [ ] Check port availability
- [ ] **Crontab Generator**
  - [ ] Generate crontab expressions
  - [ ] Human-readable cron descriptions
  - [ ] Validation and testing
- [ ] **Chmod Calculator**
  - [ ] Compute chmod permissions
  - [ ] Generate chmod commands
  - [ ] Visual permission representation
- [ ] **Docker Run to Docker Compose**
  - [ ] Convert docker run commands
  - [ ] Generate docker-compose.yml files
  - [ ] Support for common options
- [ ] **SQL Formatter**
  - [ ] Format and prettify SQL queries
  - [ ] Support multiple SQL dialects
  - [ ] Syntax highlighting

## 🌐 Network Tools

**Description**: Add network calculation and analysis tools

### Functions to Implement:
- [ ] **IPv4 Subnet Calculator**
  - [ ] Parse IPv4 CIDR blocks
  - [ ] Calculate network information
  - [ ] Show subnet details and ranges
- [ ] **IPv4 Address Converter**
  - [ ] Convert IP to decimal/binary/hex
  - [ ] IPv6 representation
  - [ ] Validation and formatting
- [ ] **IPv4 Range Expander**
  - [ ] Calculate valid subnets from IP ranges
  - [ ] CIDR notation generation
- [ ] **MAC Address Tools**
  - [ ] MAC address lookup (vendor/manufacturer)
  - [ ] MAC address generator
  - [ ] Support uppercase/lowercase
- [ ] **IPv6 ULA Generator**
  - [ ] Generate IPv6 Unique Local Addresses
  - [ ] RFC4193 compliance
  - [ ] Local network addressing

## ⏱️ Measurement Tools

**Description**: Add time and performance measurement utilities


## ✨ Enhanced Text Tools

**Description**: Add advanced text manipulation and generation tools

### Functions to Implement:
- [ ] **Emoji Picker**
  - [ ] Browse and insert emojis
  - [ ] Unicode and code point values
  - [ ] Category-based organization
  - [ ] Search functionality
- [ ] **ASCII Art Text Generator**
  - [ ] Create ASCII art from text
  - [ ] Multiple font styles
  - [ ] Size and formatting options
- [ ] **Advanced Text Diff**
  - [ ] Side-by-side text comparison
  - [ ] Highlight differences
  - [ ] Word-level and character-level diff
- [ ] **Phone Number Parser/Formatter**
  - [ ] Parse international phone numbers
  - [ ] Format validation
  - [ ] Country code detection

## ✅ Data Validation Tools

**Description**: Add data validation and normalization utilities

### Functions to Implement:
- [ ] **IBAN Validator/Parser**
  - [ ] Validate IBAN numbers
  - [ ] Parse IBAN components
  - [ ] Country and bank identification
  - [ ] QR-IBAN support
- [ ] **Email Normalizer**
  - [ ] Normalize email addresses
  - [ ] Standard format conversion
  - [ ] Deduplication support
- [ ] **Regex Testing Environment**
  - [ ] Test regular expressions
  - [ ] Pattern validation
  - [ ] Match highlighting
  - [ ] Regex cheatsheet reference

## 📄 PDF and File Tools

**Description**: Add file handling and verification utilities

### Functions to Implement:
- [ ] **PDF Signature Checker**
  - [ ] Verify PDF signatures
  - [ ] Check document integrity
  - [ ] Signature validation status
- [ ] **SVG Placeholder Generator**
  - [ ] Generate SVG placeholder images
  - [ ] Customizable dimensions and colors
  - [ ] Text overlay options

## 📊 Enhanced JSON Tools

**Description**: Extend current JSON functionality with advanced features

### Functions to Implement:
- [ ] **JSON Diff Comparison**
  - [ ] Compare two JSON objects
  - [ ] Highlight differences
  - [ ] Structural comparison
- [ ] **JSON to CSV Converter**
  - [ ] Convert JSON arrays to CSV
  - [ ] Automatic header detection
  - [ ] Nested object flattening
- [ ] **Enhanced JSON Validation**
  - [ ] Schema validation
  - [ ] Error reporting and suggestions
  - [ ] JSON Path queries

## 🎨 Advanced Formatting Tools

**Description**: Add formatting tools for various data formats

### Functions to Implement:
- [ ] **XML Formatter**
  - [ ] Prettify XML documents
  - [ ] Syntax validation
  - [ ] Namespace handling
- [ ] **YAML Prettifier**
  - [ ] Format YAML documents
  - [ ] Validation and error reporting
  - [ ] Consistent indentation
- [ ] **Enhanced SQL Formatter**
  - [ ] Advanced SQL formatting
  - [ ] Multiple database dialects
  - [ ] Keyword highlighting

## 🔐 Additional Encoding Tools

**Description**: Add specialized encoding and decoding utilities

### Functions to Implement:
- [ ] **Outlook SafeLink Decoder**
  - [ ] Decode Outlook SafeLink URLs
  - [ ] Extract original URLs
  - [ ] Batch processing support
- [x] **Enhanced Base64/URL Encoding Tools** ✅ **COMPLETED Phase 1 - September 2025**
  - [x] URL-safe Base64 encoding/decoding (replaces +/ with -_, removes padding)  
  - [x] Query string to JSON parser with duplicate key handling
  - [x] Enhanced error handling and validation
  - [x] Cross-platform line ending compatibility
  - [x] Comprehensive test coverage (399 passing tests)
  - [ ] **Phase 2 Planned**: Bulk operations, URL builder, data URL generation
- [ ] **Advanced URL Encoding/Decoding**
  - [ ] Comprehensive URL encoding
  - [ ] Component-specific encoding  
  - [ ] Multiple encoding standards

## 💻 Device and System Info

**Description**: Add system information utilities

### Functions to Implement:
- [ ] **Device Information Utility**
  - [ ] Display VS Code environment info
  - [ ] Screen resolution and DPI
  - [ ] Platform and architecture details
  - [ ] Extension environment data

## 🌐 HTML Tools

**Description**: Add HTML editing and processing tools

### Functions to Implement:
- [ ] **Enhanced HTML Entity Escape/Unescape**
  - [ ] Comprehensive entity support
  - [ ] Bidirectional conversion
  - [ ] Named and numeric entities

## 📷 Camera and Media Tools

**Priority**: Very Low  
**Description**: Add media capture tools (if technically feasible)

## Implementation Notes

### Technical Considerations:
- **VS Code API Limitations**: Some features may need to be adapted to work within VS Code's extension environment
- **External Dependencies**: Consider lightweight libraries for crypto, networking, and data format conversions
- **Performance**: Ensure large data processing doesn't block the UI
- **Security**: Be mindful of sensitive data handling, especially for crypto operations

### Development Approach:
1. **Phase 1**: High-priority items that extend existing functionality
2. **Phase 2**: Medium-priority items that add new categories
3. **Phase 3**: Low-priority items and experimental features

### Testing Strategy:
- Unit tests for all utility functions
- Integration tests for VS Code commands
- Performance tests for large data processing
- Security tests for crypto operations

## Progress Tracking

**Overall Progress**: 0/25 categories completed

**Last Updated**: September 9, 2025  
**Next Review**: TBD
