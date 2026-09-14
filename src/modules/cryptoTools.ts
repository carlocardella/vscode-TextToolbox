import * as vscode from 'vscode';
import * as bcrypt from 'bcryptjs';
import * as CryptoJS from 'crypto-js';

/**
 * Hash Text Generator - Generate various hash types from text
 */
export async function generateHashFromText(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active text editor');
        return;
    }

    const selection = editor.selection;
    const text = editor.document.getText(selection);
    
    if (!text) {
        vscode.window.showErrorMessage('No text selected');
        return;
    }

    // Available hash algorithms
    const hashTypes = [
        { label: 'MD5', value: 'md5' },
        { label: 'SHA1', value: 'sha1' },
        { label: 'SHA256', value: 'sha256' },
        { label: 'SHA224', value: 'sha224' },
        { label: 'SHA512', value: 'sha512' },
        { label: 'SHA384', value: 'sha384' }
    ];

    const selectedHash = await vscode.window.showQuickPick(hashTypes, {
        placeHolder: 'Select hash algorithm'
    });

    if (!selectedHash) {
        return;
    }

    try {
        let hash: string;
        
        if (selectedHash.value === 'md5') {
            hash = CryptoJS.MD5(text).toString();
        } else if (selectedHash.value === 'sha1') {
            hash = CryptoJS.SHA1(text).toString();
        } else if (selectedHash.value === 'sha256') {
            hash = CryptoJS.SHA256(text).toString();
        } else if (selectedHash.value === 'sha224') {
            hash = CryptoJS.SHA224(text).toString();
        } else if (selectedHash.value === 'sha512') {
            hash = CryptoJS.SHA512(text).toString();
        } else if (selectedHash.value === 'sha384') {
            hash = CryptoJS.SHA384(text).toString();
        } else {
            throw new Error(`Unsupported hash algorithm: ${selectedHash.value}`);
        }

        // Show result in new editor
        const doc = await vscode.workspace.openTextDocument({
            content: `Original text:\n${text}\n\n${selectedHash.label} Hash:\n${hash}`,
            language: 'text'
        });
        await vscode.window.showTextDocument(doc);

    } catch (error) {
        vscode.window.showErrorMessage(`Error generating ${selectedHash.label} hash: ${error}`);
    }
}

/**
 * Generate Bcrypt Hash from text
 */
export async function generateBcryptHash(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active text editor');
        return;
    }

    const selection = editor.selection;
    const text = editor.document.getText(selection);
    
    if (!text) {
        vscode.window.showErrorMessage('No text selected');
        return;
    }

    const saltRoundsInput = await vscode.window.showInputBox({
        prompt: 'Enter salt rounds (1-15, default: 10)',
        value: '10',
        validateInput: (value: string) => {
            const rounds = parseInt(value);
            if (isNaN(rounds) || rounds < 1 || rounds > 15) {
                return 'Salt rounds must be a number between 1 and 15';
            }
            return null;
        }
    });

    if (!saltRoundsInput) {
        return;
    }

    const saltRounds = parseInt(saltRoundsInput);

    try {
        const hash = await bcrypt.hash(text, saltRounds);
        
        // Show result in new editor
        const doc = await vscode.workspace.openTextDocument({
            content: `Original text:\n${text}\n\nBcrypt Hash (rounds: ${saltRounds}):\n${hash}`,
            language: 'text'
        });
        await vscode.window.showTextDocument(doc);

    } catch (error) {
        vscode.window.showErrorMessage(`Error generating bcrypt hash: ${error}`);
    }
}

/**
 * Compare text with Bcrypt Hash
 */
export async function compareBcryptHash(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active text editor');
        return;
    }

    const selection = editor.selection;
    const text = editor.document.getText(selection);
    
    if (!text) {
        vscode.window.showErrorMessage('No text selected');
        return;
    }

    const hash = await vscode.window.showInputBox({
        prompt: 'Enter bcrypt hash to compare against',
        placeHolder: '$2b$10$...'
    });

    if (!hash) {
        return;
    }

    try {
        const isMatch = await bcrypt.compare(text, hash);
        
        const result = isMatch ? 'MATCH ✓' : 'NO MATCH ✗';
        const doc = await vscode.workspace.openTextDocument({
            content: `Text: ${text}\nHash: ${hash}\n\nResult: ${result}`,
            language: 'text'
        });
        await vscode.window.showTextDocument(doc);

    } catch (error) {
        vscode.window.showErrorMessage(`Error comparing bcrypt hash: ${error}`);
    }
}

/**
 * Generate HMAC with secret key
 */
export async function generateHMAC(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active text editor');
        return;
    }

    const selection = editor.selection;
    const text = editor.document.getText(selection);
    
    if (!text) {
        vscode.window.showErrorMessage('No text selected');
        return;
    }

    const secretKey = await vscode.window.showInputBox({
        prompt: 'Enter secret key for HMAC',
        password: true
    });

    if (!secretKey) {
        return;
    }

    // Available HMAC algorithms
    const hmacTypes = [
        { label: 'HMAC-SHA256', value: 'sha256' },
        { label: 'HMAC-SHA1', value: 'sha1' },
        { label: 'HMAC-SHA512', value: 'sha512' },
        { label: 'HMAC-MD5', value: 'md5' }
    ];

    const selectedHmac = await vscode.window.showQuickPick(hmacTypes, {
        placeHolder: 'Select HMAC algorithm'
    });

    if (!selectedHmac) {
        return;
    }

    try {
        let hmac: string;
        
        if (selectedHmac.value === 'sha256') {
            hmac = CryptoJS.HmacSHA256(text, secretKey).toString();
        } else if (selectedHmac.value === 'sha1') {
            hmac = CryptoJS.HmacSHA1(text, secretKey).toString();
        } else if (selectedHmac.value === 'sha512') {
            hmac = CryptoJS.HmacSHA512(text, secretKey).toString();
        } else if (selectedHmac.value === 'md5') {
            hmac = CryptoJS.HmacMD5(text, secretKey).toString();
        } else {
            throw new Error(`Unsupported HMAC algorithm: ${selectedHmac.value}`);
        }

        // Show result in new editor
        const doc = await vscode.workspace.openTextDocument({
            content: `Original text:\n${text}\n\nSecret key: ${secretKey}\n\n${selectedHmac.label}:\n${hmac}`,
            language: 'text'
        });
        await vscode.window.showTextDocument(doc);

    } catch (error) {
        vscode.window.showErrorMessage(`Error generating ${selectedHmac.label}: ${error}`);
    }
}

/**
 * Generate secure random token
 */
export async function generateToken(): Promise<void> {
    const lengthInput = await vscode.window.showInputBox({
        prompt: 'Enter token length (1-128, default: 32)',
        value: '32',
        validateInput: (value: string) => {
            const length = parseInt(value);
            if (isNaN(length) || length < 1 || length > 128) {
                return 'Token length must be a number between 1 and 128';
            }
            return null;
        }
    });

    if (!lengthInput) {
        return;
    }

    const length = parseInt(lengthInput);

    // Character set options
    const characterSets = await vscode.window.showQuickPick([
        { label: 'Alphanumeric (A-Z, a-z, 0-9)', picked: true },
        { label: 'Uppercase only (A-Z)', picked: false },
        { label: 'Lowercase only (a-z)', picked: false },
        { label: 'Numbers only (0-9)', picked: false },
        { label: 'Alphanumeric + Symbols', picked: false },
        { label: 'Hexadecimal (0-9, A-F)', picked: false }
    ], {
        placeHolder: 'Select character set for token generation'
    });

    if (!characterSets) {
        return;
    }

    try {
        let charset = '';
        switch (characterSets.label) {
            case 'Alphanumeric (A-Z, a-z, 0-9)':
                charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                break;
            case 'Uppercase only (A-Z)':
                charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                break;
            case 'Lowercase only (a-z)':
                charset = 'abcdefghijklmnopqrstuvwxyz';
                break;
            case 'Numbers only (0-9)':
                charset = '0123456789';
                break;
            case 'Alphanumeric + Symbols':
                charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
                break;
            case 'Hexadecimal (0-9, A-F)':
                charset = '0123456789ABCDEF';
                break;
        }

        // Generate cryptographically secure random token
        const token = CryptoJS.lib.WordArray.random(length).toString();
        
        // If specific charset is needed, convert the random bytes
        let finalToken: string;
        if (characterSets.label === 'Hexadecimal (0-9, A-F)') {
            finalToken = token.substring(0, length).toUpperCase();
        } else {
            // Convert random bytes to charset-specific token
            const randomBytes = CryptoJS.lib.WordArray.random(length * 2);
            finalToken = '';
            const bytes = randomBytes.toString();
            
            for (let i = 0; i < length; i++) {
                const randomIndex = parseInt(bytes.substring(i * 2, i * 2 + 2), 16) % charset.length;
                finalToken += charset[randomIndex];
            }
        }

        const editor = vscode.window.activeTextEditor;
        if (editor) {
            // Insert token at cursor position
            await editor.edit((editBuilder: vscode.TextEditorEdit) => {
                editBuilder.insert(editor.selection.active, finalToken);
            });
        } else {
            // Show in new editor if no active editor
            const doc = await vscode.workspace.openTextDocument({
                content: `Generated Token (${characterSets.label}):\n${finalToken}\n\nLength: ${finalToken.length}`,
                language: 'text'
            });
            await vscode.window.showTextDocument(doc);
        }

    } catch (error) {
        vscode.window.showErrorMessage(`Error generating token: ${error}`);
    }
}

/**
 * Password Strength Analyzer
 */
export async function analyzePasswordStrength(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active text editor');
        return;
    }

    const selection = editor.selection;
    const password = editor.document.getText(selection);
    
    if (!password) {
        vscode.window.showErrorMessage('No text selected');
        return;
    }

    try {
        const analysis = analyzePassword(password);
        
        const doc = await vscode.workspace.openTextDocument({
            content: `Password: ${password}\n\n${analysis}`,
            language: 'text'
        });
        await vscode.window.showTextDocument(doc);

    } catch (error) {
        vscode.window.showErrorMessage(`Error analyzing password: ${error}`);
    }
}

/**
 * Password strength analysis helper
 */
function analyzePassword(password: string): string {
    const length = password.length;
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSymbols = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    const hasSpaces = /\s/.test(password);

    // Calculate entropy
    let charset = 0;
    if (hasLowercase) { charset += 26; }
    if (hasUppercase) { charset += 26; }
    if (hasNumbers) { charset += 10; }
    if (hasSymbols) { charset += 32; }
    if (hasSpaces) { charset += 1; }

    // Calculate entropy in bits (log2 = ln(x) / ln(2))
    const entropy = Math.log(Math.pow(charset, length)) / Math.log(2);

    // Calculate comprehensive score out of 100
    let score = 0;
    
    // Length scoring (40 points max)
    if (length >= 16) { score += 40; }
    else if (length >= 12) { score += 30; }
    else if (length >= 8) { score += 20; }
    else if (length >= 6) { score += 10; }
    else if (length >= 4) { score += 5; }
    
    // Character variety scoring (40 points max)
    if (hasLowercase) { score += 8; }
    if (hasUppercase) { score += 8; }
    if (hasNumbers) { score += 8; }
    if (hasSymbols) { score += 16; } // Symbols are worth more
    
    // Complexity bonus (20 points max)
    const characterTypes = [hasLowercase, hasUppercase, hasNumbers, hasSymbols, hasSpaces].filter(Boolean).length;
    if (characterTypes >= 4) { score += 20; }
    else if (characterTypes >= 3) { score += 15; }
    else if (characterTypes >= 2) { score += 10; }
    else if (characterTypes >= 1) { score += 5; }
    
    // Length bonus for very long passwords
    if (length >= 20) { score += 5; }
    if (length >= 24) { score += 5; }
    
    // Penalties for common patterns
    if (/(.)\1{2,}/.test(password)) { score -= 10; } // Repeated characters
    if (/123|abc|qwe|asd|zxc/i.test(password)) { score -= 15; } // Sequential patterns
    if (/password|123456|qwerty|admin|login/i.test(password)) { score -= 25; } // Common passwords
    
    // Ensure score stays within 0-100 range
    score = Math.max(0, Math.min(100, score));

    // Determine strength based on score
    let strength = '';
    let strengthCategory = '';
    
    if (score >= 90) {
        strength = 'Excellent 🟢';
        strengthCategory = 'Excellent';
    } else if (score >= 75) {
        strength = 'Very Strong 🟢';
        strengthCategory = 'Very Strong';
    } else if (score >= 60) {
        strength = 'Strong 🟡';
        strengthCategory = 'Strong';
    } else if (score >= 40) {
        strength = 'Moderate 🟠';
        strengthCategory = 'Moderate';
    } else if (score >= 20) {
        strength = 'Weak 🟠';
        strengthCategory = 'Weak';
    } else {
        strength = 'Very Weak 🔴';
        strengthCategory = 'Very Weak';
    }

    // Estimate crack time (simplified)
    const possibleCombinations = Math.pow(charset, length);
    const crackTimeSeconds = possibleCombinations / (1000000000); // Assuming 1B guesses/sec
    
    let crackTime = '';
    if (crackTimeSeconds < 60) {
        crackTime = `${Math.round(crackTimeSeconds)} seconds`;
    } else if (crackTimeSeconds < 3600) {
        crackTime = `${Math.round(crackTimeSeconds / 60)} minutes`;
    } else if (crackTimeSeconds < 86400) {
        crackTime = `${Math.round(crackTimeSeconds / 3600)} hours`;
    } else if (crackTimeSeconds < 31536000) {
        crackTime = `${Math.round(crackTimeSeconds / 86400)} days`;
    } else {
        crackTime = `${Math.round(crackTimeSeconds / 31536000)} years`;
    }

    return `STRENGTH: ${strength}
SCORE: ${score}/100 points (${strengthCategory})
LENGTH: ${length} characters
ENTROPY: ${entropy.toFixed(2)} bits

CHARACTER TYPES:
- Lowercase letters: ${hasLowercase ? '✓' : '✗'}
- Uppercase letters: ${hasUppercase ? '✓' : '✗'}
- Numbers: ${hasNumbers ? '✓' : '✗'}
- Symbols: ${hasSymbols ? '✓' : '✗'}
- Spaces: ${hasSpaces ? '✓' : '✗'}

CHARSET SIZE: ${charset} characters
POSSIBLE COMBINATIONS: ${possibleCombinations.toExponential(2)}
ESTIMATED CRACK TIME: ${crackTime}

SCORING BREAKDOWN:
- Length (40 pts max): ${Math.min(40, length >= 16 ? 40 : length >= 12 ? 30 : length >= 8 ? 20 : length >= 6 ? 10 : length >= 4 ? 5 : 0)} points
- Character variety (40 pts max): ${(hasLowercase ? 8 : 0) + (hasUppercase ? 8 : 0) + (hasNumbers ? 8 : 0) + (hasSymbols ? 16 : 0)} points
- Complexity bonus (20 pts max): ${characterTypes >= 4 ? 20 : characterTypes >= 3 ? 15 : characterTypes >= 2 ? 10 : characterTypes >= 1 ? 5 : 0} points
- Length bonus: ${(length >= 24 ? 10 : length >= 20 ? 5 : 0)} points
- Pattern penalties: ${/(.)\1{2,}/.test(password) ? -10 : 0}${/123|abc|qwe|asd|zxc/i.test(password) ? -15 : 0}${/password|123456|qwerty|admin|login/i.test(password) ? -25 : 0} points

RECOMMENDATIONS:
${length < 8 ? '- Use at least 8 characters (minimum)\n' : ''}${length < 12 ? '- Consider using 12+ characters for better security\n' : ''}${length < 16 ? '- Use 16+ characters for maximum length score\n' : ''}${!hasUppercase ? '- Add uppercase letters\n' : ''}${!hasLowercase ? '- Add lowercase letters\n' : ''}${!hasNumbers ? '- Add numbers\n' : ''}${!hasSymbols ? '- Add symbols (!@#$%^&*) for maximum security\n' : ''}${/(.)\1{2,}/.test(password) ? '- Avoid repeated character patterns\n' : ''}${/123|abc|qwe|asd|zxc/i.test(password) ? '- Avoid sequential character patterns\n' : ''}${/password|123456|qwerty|admin|login/i.test(password) ? '- Avoid common passwords and dictionary words\n' : ''}`;
}