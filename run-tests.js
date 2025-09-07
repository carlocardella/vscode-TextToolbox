#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🧪 VS Code Extension Test Runner');
console.log('================================');

try {
    console.log('📦 Compiling TypeScript...');
    execSync('npm run test-compile', { stdio: 'inherit', cwd: __dirname });
    
    console.log('\n🚀 Running Extension Tests...');
    console.log('Open VS Code and press F5, then select "Extension Tests"');
    console.log('Or use: Debug → Start Debugging → Extension Tests');
    
    console.log('\n📋 Available test files:');
    const fs = require('fs');
    const testDir = path.join(__dirname, 'out', 'test', 'suite');
    
    if (fs.existsSync(testDir)) {
        const testFiles = fs.readdirSync(testDir)
            .filter(file => file.endsWith('.test.js'))
            .sort();
        
        testFiles.forEach((file, index) => {
            console.log(`   ${index + 1}. ${file.replace('.test.js', '')}`);
        });
        
        console.log(`\n✅ Found ${testFiles.length} test suites ready to run!`);
    } else {
        console.log('❌ Test output directory not found. Run npm run test-compile first.');
    }
    
} catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
}
