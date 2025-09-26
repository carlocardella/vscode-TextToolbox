---
applyTo: "**/*"
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

### Grammar
* Use present tense verbs (is, open) instead of past tense (was, opened).
* Write factual statements and direct commands. Avoid hypotheticals like "could" or "would".
* Use active voice where the subject performs the action.
* Write in second person (you) to speak directly to readers.

### Markdown Guidelines
- Use headings to organize content.
- Use bullet points for lists.
- Include links to related resources.
- Use code blocks for code snippets.

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
