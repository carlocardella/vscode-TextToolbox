# Text Toolbox Enhancement TODO

## Overview

The goal is to extend the current Text Toolbox extension with additional tools and utilities that are available in the it-tools online platform, while maintaining the VS Code-native experience.

## 🔐 Crypto Tools Category ✅ **COMPLETED v2.25.0**

**Description**: Add cryptographic tools missing from the extension

### Functions Implemented:
- [x] **Hash Text Generator** ✅
  - [x] MD5 hashing
  - [x] SHA1 hashing  
  - [x] SHA256 hashing
  - [x] SHA224 hashing
  - [x] SHA512 hashing
  - [x] SHA384 hashing
  - [ ] SHA3 hashing (not implemented)
  - [x] ~~RIPEMD160 hashing~~ (removed for web compatibility)
- [x] **Bcrypt Hash/Compare** ✅
  - [x] Generate bcrypt hash from text
  - [x] Compare text with bcrypt hash
- [x] **HMAC Generator** ✅
  - [x] Generate HMAC with secret key
  - [x] Support multiple hash functions (SHA256, SHA1, SHA512, MD5)
- [ ] **RSA Key Pair Generator**
  - [ ] Generate RSA private/public key pairs
  - [ ] PEM format output
- [x] **Password Strength Analyzer** ✅
  - [x] Analyze password strength with 100-point scoring system
  - [x] Estimate crack time
  - [x] Entropy calculation
  - [x] Pattern detection and penalties
  - [x] Detailed scoring breakdown
- [ ] **BIP39 Passphrase Generator**
  - [ ] Generate BIP39 mnemonic
  - [ ] Convert mnemonic to passphrase
- [ ] **Advanced Encryption/Decryption**
  - [ ] AES encryption/decryption
  - [ ] TripleDES encryption/decryption
  - [ ] Rabbit encryption/decryption
  - [ ] RC4 encryption/decryption
- [x] **Token Generator** ✅
  - [x] Cryptographically secure random tokens
  - [x] Configurable length (1-128 characters)
  - [x] Hexadecimal and Base64 encoding support

## 🔄 Data Format Converters

**Description**: Add bidirectional converters between various data formats

### Functions to Implement:
- [ ] **YAML ↔ JSON Converter**
  - [ ] YAML to JSON conversion
  - [ ] JSON to YAML conversion
  - [ ] Validation and error handling
- [ ] **YAML ↔ TOML Converter**
  - [ ] YAML to TOML conversion
  - [ ] TOML to YAML conversion
- [ ] **JSON ↔ TOML Converter**
  - [ ] JSON to TOML conversion
  - [ ] TOML to JSON conversion
- [ ] **XML ↔ JSON Converter**
  - [ ] XML to JSON conversion
  - [ ] JSON to XML conversion
  - [ ] Handle attributes and namespaces
- [ ] **Markdown ↔ HTML Converter**
  - [ ] Markdown to HTML conversion
  - [ ] HTML to Markdown conversion (basic)
  - [ ] Support for common markdown extensions

## 🔢 Advanced Base Conversion

**Description**: Extend beyond hex/decimal to support all common number bases

### Functions to Implement:
- [ ] **Integer Base Converter**
  - [ ] Binary (base 2) conversion
  - [ ] Octal (base 8) conversion
  - [ ] Decimal (base 10) conversion
  - [ ] Hexadecimal (base 16) conversion
  - [ ] Arbitrary base conversion (base 2-36)
  - [ ] Base64 number conversion
- [ ] **Roman Numeral Converter**
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

## 📋 List Processing Tools

**Description**: Enhance existing list functionality with advanced operations

### Functions to Implement:
- [ ] **Advanced List Converter**
  - [ ] Transpose data (rows ↔ columns)
  - [ ] Add prefix to each line
  - [ ] Add suffix to each line
  - [ ] Reverse list order
  - [ ] Sort list (multiple criteria)
  - [ ] Convert to lowercase
  - [ ] Truncate values to specific length
  - [ ] Remove duplicates with options

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
- [ ] **HTTP Status Codes Reference**
  - [ ] Searchable HTTP status codes list
  - [ ] Include descriptions and meanings
  - [ ] Support for WebDAV codes

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

## 🧮 Math and Calculation Tools

**Description**: Add mathematical computation and calculation utilities

### Functions to Implement:
- [ ] **Math Expression Evaluator**
  - [ ] Calculate mathematical expressions
  - [ ] Support functions (sqrt, cos, sin, abs, etc.)
  - [ ] Variable support
- [ ] **ETA Calculator**
  - [ ] Estimate time of arrival
  - [ ] Duration calculations
  - [ ] Progress tracking
- [ ] **Percentage Calculator**
  - [ ] Calculate percentages between values
  - [ ] Percentage increase/decrease
  - [ ] Multiple calculation modes
- [ ] **Temperature Converter**
  - [ ] Celsius ↔ Fahrenheit ↔ Kelvin
  - [ ] Rankine, Delisle, Newton conversions
  - [ ] Réaumur and Rømer support

## ⏱️ Measurement Tools

**Description**: Add time and performance measurement utilities

### Functions to Implement:
- [ ] **Chronometer/Stopwatch**
  - [ ] Start/stop/reset functionality
  - [ ] Lap time recording
  - [ ] Multiple timer support
- [ ] **Benchmark Builder**
  - [ ] Compare execution times
  - [ ] Performance testing utilities
  - [ ] Statistical analysis of results

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
