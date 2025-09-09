# Text Toolbox Enhancement TODO

## Overview

The goal is to extend the current Text Toolbox extension with additional tools and utilities that are available in the it-tools online platform, while maintaining the VS Code-native experience.

## 🔐 Crypto Tools Category

**Description**: Add cryptographic tools missing from the extension

### Functions to Implement:
- [ ] **Hash Text Generator**
  - [ ] MD5 hashing
  - [ ] SHA1 hashing  
  - [ ] SHA256 hashing
  - [ ] SHA224 hashing
  - [ ] SHA512 hashing
  - [ ] SHA384 hashing
  - [ ] SHA3 hashing
  - [ ] RIPEMD160 hashing
- [ ] **Bcrypt Hash/Compare**
  - [ ] Generate bcrypt hash from text
  - [ ] Compare text with bcrypt hash
- [ ] **HMAC Generator**
  - [ ] Generate HMAC with secret key
  - [ ] Support multiple hash functions
- [ ] **RSA Key Pair Generator**
  - [ ] Generate RSA private/public key pairs
  - [ ] PEM format output
- [ ] **Password Strength Analyzer**
  - [ ] Analyze password strength
  - [ ] Estimate crack time
  - [ ] Entropy calculation
- [ ] **BIP39 Passphrase Generator**
  - [ ] Generate BIP39 mnemonic
  - [ ] Convert mnemonic to passphrase
- [ ] **Advanced Encryption/Decryption**
  - [ ] AES encryption/decryption
  - [ ] TripleDES encryption/decryption
  - [ ] Rabbit encryption/decryption
  - [ ] RC4 encryption/decryption

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

**Priority**: Medium  
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

**Priority**: Medium  
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

**Priority**: Medium  
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

**Priority**: Medium  
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

**Priority**: Medium  
**Description**: Add advanced string manipulation and transformation tools

### Functions to Implement:
- [ ] **String Slugification**
  - [ ] Make strings URL/filename safe
  - [ ] Remove special characters
  - [ ] Convert to lowercase with hyphens
- [ ] **String Obfuscation**
  - [ ] Obfuscate sensitive strings
  - [ ] Make shareable without revealing content
  - [ ] Reversible obfuscation methods
- [ ] **Numeronym Generator**
  - [ ] Generate numeronyms (e.g., i18n for internationalization)
  - [ ] Calculate character counts between letters
- [ ] **Enhanced Text Statistics**
  - [ ] Character count (with/without spaces)
  - [ ] Word count
  - [ ] Sentence count
  - [ ] Paragraph count
  - [ ] Reading time estimation
  - [ ] File size in bytes

## 📱 QR Code Generators

**Priority**: Low  
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
- [ ] **Git Cheatsheet**
  - [ ] Searchable Git commands reference
  - [ ] Common workflows and examples
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

**Priority**: Medium  
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

**Priority**: Medium  
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

**Priority**: Low  
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

**Priority**: Medium  
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

**Priority**: Medium  
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

**Priority**: Low  
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

**Priority**: Medium  
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

**Priority**: Medium  
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

**Priority**: Low  
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

**Priority**: Low  
**Description**: Add system information utilities

### Functions to Implement:
- [ ] **Device Information Utility**
  - [ ] Display VS Code environment info
  - [ ] Screen resolution and DPI
  - [ ] Platform and architecture details
  - [ ] Extension environment data

## 🌐 HTML Tools

**Priority**: Medium  
**Description**: Add HTML editing and processing tools

### Functions to Implement:
- [ ] **Enhanced HTML Entity Escape/Unescape**
  - [ ] Comprehensive entity support
  - [ ] Bidirectional conversion
  - [ ] Named and numeric entities
- [ ] **HTML WYSIWYG Editor** (if feasible)
  - [ ] Rich text editing interface
  - [ ] HTML source generation
  - [ ] Preview functionality

## 📷 Camera and Media Tools

**Priority**: Very Low  
**Description**: Add media capture tools (if technically feasible)

### Functions to Implement:
- [ ] **Camera Recorder** (Feasibility Study Required)
  - [ ] Investigate VS Code extension capabilities
  - [ ] Webcam access permissions
  - [ ] Photo capture functionality
  - [ ] Video recording (if possible)

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
