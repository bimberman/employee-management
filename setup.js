#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Employee Management System with PostgreSQL...\n');

// Check if .env exists
if (!fs.existsSync('.env')) {
  console.log('📝 Creating .env file from template...');
  if (fs.existsSync('env.example')) {
    fs.copyFileSync('env.example', '.env');
    console.log(
      '✓ .env file created. Please edit it with your database credentials.'
    );
  } else {
    console.log('❌ env.example file not found. Please create .env manually.');
  }
} else {
  console.log('✓ .env file already exists');
}

// Check if node_modules exists
if (!fs.existsSync('node_modules')) {
  console.log('📦 Installing dependencies...');
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✓ Dependencies installed');
  } catch (error) {
    console.error('❌ Failed to install dependencies:', error.message);
    process.exit(1);
  }
} else {
  console.log('✓ Dependencies already installed');
}

// Check PostgreSQL connection
console.log('\n🔍 Checking PostgreSQL connection...');
try {
  const { testMigration } = require('./test-migration');
  testMigration().then(() => {
    console.log('\n🎉 Setup completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Edit .env file with your database credentials if needed');
    console.log('2. Run: npm run migrate (if not already done)');
    console.log('3. Run: npm start');
    console.log('4. Open http://localhost:3000 in your browser');
  });
} catch (error) {
  console.log('❌ PostgreSQL connection failed. Please ensure:');
  console.log('   - PostgreSQL is installed and running');
  console.log('   - Database credentials in .env are correct');
  console.log('   - Database user has proper permissions');
  console.log(
    '\nYou can still run the migration manually with: npm run migrate'
  );
}
