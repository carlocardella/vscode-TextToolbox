---
applyTo: "**/*.md"
---
# VS Code TextToolbox Extension Development Guidelines

## Project documentation writing guidelines

### Scope
These documentation guidelines apply specifically to markdown files in the project:
- README.md
- CHANGELOG.md  
- TODO.md
- Documentation in docs/ directory

### General Guidelines
- Write clear and concise documentation.
- Use consistent terminology and style.
- Include code examples where applicable.
- Focus on creating evergreen content that remains valuable over time.
- Write documentation for your future self - assume you may not remember the context.
- Use active voice and present tense when possible.
- Break down complex topics into digestible sections.

### Grammar and Style
* Use present tense verbs (is, open) instead of past tense (was, opened).
* Write factual statements and direct commands. Avoid hypotheticals like "could" or "would".
* Use active voice where the subject performs the action.
* Write in second person (you) to speak directly to readers.
* Use descriptive link text instead of generic phrases like "click here".

### Markdown Guidelines
- Use headings to organize content.
- Do not use bold for markdown headers.
- Use bullet points for lists.
- Include links to related resources.
- Use code blocks for code snippets.
- Ensure Markdown syntax is correct and free of linting errors.

**Markdown Linting Best Practices:**
- Use proper YAML list syntax for frontmatter tags to avoid link reference conflicts
- Specify language for all code blocks: ```bash, ```json, ```markdown, ```powershell
- Avoid mixing inline code with markdown links in ways that confuse linters
- Remove trailing whitespace from lines to prevent MD009 errors
- Always run "Text Toolbox: Remove Control Characters" when reviewing and cleaning markdown files
- Test frontmatter syntax in YAML-aware editors when troubleshooting linting issues

### Formatting Standards

**Header Formatting:**
- Section headers (###, ##, #) should NOT use bold formatting
- Headers are already emphasized by markdown syntax
- Keep headers clean and professional: `### Section Name` not `### **Section Name**`

**Bold Text Usage:**
- Use bold ONLY for main command names and important feature names within lists
- Example: `* **Generate Hash from Text**` for main commands
- Example: `* **Enhanced Base64/URL Encoding Tools**` for key features
- Do NOT use bold for section headers or regular descriptive text

**List Formatting Consistency:**
- All main command/feature names in lists should use bold formatting
- Sub-descriptions and details remain regular text
- Use consistent bullet point style (*) throughout
- Maintain proper 4-space indentation for nested lists
- Example structure:
  ```markdown
  * **Main Command Name**
    * Regular description text
    * Additional details without bold
  ```

**Code Block Standards:**
- Always specify language for code blocks: ```bash, ```json, ```markdown, ```powershell
- Use inline code (`command`) for single commands or short code snippets
- Use code blocks for multi-line examples

**Professional Consistency:**
- Maintain consistent formatting patterns across all sections
- Bold usage should be strategic and purposeful, not decorative
- Create clear visual hierarchy without over-formatting

**Link Formatting Standards:**
- Use descriptive link text instead of generic phrases like "click here"
- Ensure all links function correctly and point to valid resources
- Use consistent formatting for internal and external links

### Extension-Specific Documentation Standards

**README.md Structure:**
- Maintain clear sections for features, installation, usage, and configuration
- Use consistent command documentation format with examples
- Include marketplace badges and download statistics at the top
- Organize features by logical groupings (Text Conversions, Crypto Tools, etc.)
- Provide practical examples for each major feature

**CHANGELOG.md Standards:**
- Follow semantic versioning principles
- Group changes by type: Added, Changed, Fixed, Removed
- Include version numbers and release dates
- Provide clear descriptions of user-facing changes
- Link to GitHub issues/PRs where applicable

**Command Documentation Format:**
- Use bold formatting for command names: `* **Command Name**`
- Include brief descriptions and practical examples
- Specify keyboard shortcuts where applicable
- Document configuration options and settings
- Cross-reference related commands when helpful

**Version Documentation:**
- Document breaking changes clearly
- Include migration guides for major version updates
- Maintain backward compatibility information
- Track deprecated features and removal timelines

## Extension Publishing Guidelines

### Pre-Publishing Checklist

**1. Code Quality & Testing**
- ✅ All tests pass (`npm run test:vscode`)
- ✅ TypeScript compilation successful (`npm run test-compile`)
- ✅ No linting errors or warnings
- ✅ Code coverage meets project standards
- ✅ Manual testing of new features completed

**2. Documentation Updates**
- ✅ `CHANGELOG.md` updated with new version entry
- ✅ `README.md` updated with new features/commands
- ✅ `TODO.md` updated to reflect completed items
- ✅ All new commands documented with clear descriptions
- ✅ Code comments and JSDoc updated
- ✅ **Formatting consistency verified** - all main commands use bold formatting
- ✅ **Header structure validated** - no bold formatting in section headers
- ✅ **List formatting standardized** - consistent bullet points and indentation

**3. Version Management**
- ✅ Update version in `package.json` following semantic versioning
- ✅ Git tag created for the release version
- ✅ All commits pushed to main/master branch
- ✅ Feature branches merged and cleaned up

**4. Extension Metadata**
- ✅ `package.json` commands section updated
- ✅ Command titles and categories are user-friendly
- ✅ Extension icon and assets are current
- ✅ Keywords and description reflect new functionality

### Publishing Process

**Step 1: Final Preparation**
```bash
# Ensure clean working directory
git status

# Run full test suite
npm run test:vscode

# Build production version
npm run webpack-prod
```

**Step 2: Version Update**
- Update version in `package.json` (e.g., 2.27.0 → 2.28.0)
- Commit version bump: `git commit -am "chore: bump version to 2.28.0"`
- Create Git tag: `git tag v2.28.0`

**Step 3: Publishing**

**VS Code Marketplace:**
```bash
# Install vsce if not already installed
npm install -g @vscode/vsce

# Package the extension (optional - vsce publish will do this automatically)
vsce package

# Publish to VS Code Marketplace
vsce publish
```

**Open VSX Registry (for VS Codium):**
```bash
# Option 1: Publish the existing .vsix package
npx ovsx publish vscode-texttoolbox-X.X.X.vsix -p <your-access-token>

# Option 2: Publish directly from source (requires ovsx installed)
npm install -g ovsx
ovsx publish -p <your-access-token>
```

**Getting Open VSX Access Token:**
1. Go to https://open-vsx.org/
2. Sign in with GitHub account
3. Go to your user settings
4. Generate a new access token
5. Store the token securely (needed for publishing)

**Environment Variable Setup (Optional):**
```bash
# Set environment variable for ovsx token (recommended)
export OVSX_PAT=<your-access-token>
# Then publish without -p flag
npx ovsx publish vscode-texttoolbox-X.X.X.vsix
```

**Step 4: Post-Publishing**
- ✅ Verify extension appears on VS Code Marketplace
- ✅ Verify extension appears on Open VSX Registry (if published)
- ✅ Test installation from both marketplaces
- ✅ Update GitHub release with changelog
- ✅ Push commits and tags to remote: `git push && git push --tags`

### Release Types

**Major Release (x.0.0)**
- Breaking changes to existing functionality
- Significant architecture changes
- Removal of deprecated features

**Minor Release (x.y.0)**
- New features and enhancements
- New commands or capabilities
- Backward-compatible changes

**Patch Release (x.y.z)**
- Bug fixes
- Documentation updates
- Small improvements

### Development Workflow

**Feature Development**
1. Create feature branch from master: `git checkout -b feature/feature-name`
2. Implement feature with comprehensive tests
3. Update documentation (README, CHANGELOG, TODO)
4. Ensure all tests pass
5. Create pull request with detailed description
6. Merge to master after review

**Hotfix Process**
1. Create hotfix branch from master: `git checkout -b hotfix/fix-description`
2. Implement minimal fix with test
3. Update patch version
4. Fast-track publish process
5. Merge back to master

### Publishing Troubleshooting

**Common Issues:**

**VS Code Marketplace:**
- `vsce login` required if not authenticated
- Update vsce to latest version: `npm install -g @vscode/vsce`
- Check publisher permissions in VS Code Marketplace portal

**Open VSX Registry:**
- Requires separate access token from https://open-vsx.org/
- Token must be associated with your GitHub account
- Use `-p <token>` flag or set `OVSX_PAT` environment variable
- Verify namespace ownership matches your publisher name

**Authentication Setup:**
```bash
# VS Code Marketplace (first time only)
vsce login <your-publisher-name>

# Open VSX Registry (get token from open-vsx.org)
export OVSX_PAT=<your-access-token>
```

### Quality Standards

**Code Standards**
- Follow TypeScript best practices
- Maintain consistent code formatting
- Use descriptive variable and function names
- Add JSDoc comments for public APIs
- Handle errors gracefully with user-friendly messages

**Testing Standards**
- Unit tests for all new functions
- Integration tests for VS Code commands
- Error handling and edge case testing
- Cross-platform compatibility testing
- Performance testing for large inputs

**User Experience Standards**
- Commands have clear, descriptive names
- Error messages are helpful and actionable
- Features work consistently across different file types
- Keyboard shortcuts don't conflict with VS Code defaults
- Commands are properly categorized in menus

**Documentation Quality Standards**
- **Formatting Consistency** - Main command names use bold formatting throughout all sections
- **Clean Header Structure** - Section headers use clean markdown without bold formatting
- **Strategic Bold Usage** - Bold text reserved for command names and key features, not decorative purposes
- **Professional Presentation** - Consistent bullet points, proper indentation, and clear visual hierarchy
- **Code Block Standards** - All code blocks specify language, inline code for single commands
- **Cross-Reference Accuracy** - Commands in README match exactly with CHANGELOG entries
- **User-Focused Language** - Clear, concise descriptions that help users understand command benefits

### Content Organization Guidelines

**File Organization:**
- Keep documentation files in root directory for maximum visibility
- Use clear, descriptive filenames (README.md, CHANGELOG.md, TODO.md)
- Organize supporting documentation in docs/ subdirectory if needed
- Maintain consistent file structure across releases

**Cross-Reference Standards:**
- Ensure README command lists match CHANGELOG entries exactly
- Maintain consistency between package.json command definitions and documentation
- Validate that all documented features are actually implemented
- Keep TODO.md synchronized with development progress

**Documentation Maintenance:**
- Review and update documentation with each release
- Remove outdated information promptly
- Consolidate redundant content to avoid confusion
- Ensure examples remain current with latest extension features

**User Experience Documentation:**
- Focus on practical usage scenarios and benefits
- Include troubleshooting information for common issues
- Provide clear configuration guidance
- Document keyboard shortcuts and accessibility features
