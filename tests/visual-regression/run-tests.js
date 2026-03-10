#!/usr/bin/env node

/**
 * Visual Regression Test Runner
 * 
 * This script provides a convenient way to run visual regression tests
 * with different configurations and options.
 */

const { spawn } = require('child_process');
const path = require('path');

const args = process.argv.slice(2);
const command = args[0] || 'help';

const commands = {
  help: () => {
    console.log(`
Visual Regression Test Runner

Usage: node run-tests.js <command> [options]

Commands:
  help              Show this help message
  all               Run all visual regression tests
  auth              Run authentication page tests
  dashboard         Run dashboard page tests
  opportunities     Run opportunities page tests
  applicants        Run applicants page tests
  profiles          Run profile page tests
  modals            Run modal component tests
  navigation        Run navigation component tests
  components        Run responsive component tests
  mobile            Run all tests for mobile viewport only
  tablet            Run all tests for tablet viewport only
  desktop           Run all tests for desktop viewport only
  update            Update all baseline screenshots
  ui                Run tests in UI mode (interactive)
  debug             Run tests in debug mode
  headed            Run tests in headed mode (visible browser)

Examples:
  node run-tests.js all
  node run-tests.js auth --headed
  node run-tests.js mobile --update-snapshots
  node run-tests.js dashboard --grep "employer"
`);
  },

  all: () => runPlaywright([]),
  auth: () => runPlaywright(['auth.spec.ts']),
  dashboard: () => runPlaywright(['dashboard.spec.ts']),
  opportunities: () => runPlaywright(['opportunities.spec.ts']),
  applicants: () => runPlaywright(['applicants.spec.ts']),
  profiles: () => runPlaywright(['profiles.spec.ts']),
  modals: () => runPlaywright(['modals.spec.ts']),
  navigation: () => runPlaywright(['navigation.spec.ts']),
  components: () => runPlaywright(['responsive-components.spec.ts']),
  
  mobile: () => runPlaywright(['--grep', 'mobile']),
  tablet: () => runPlaywright(['--grep', 'tablet']),
  desktop: () => runPlaywright(['--grep', 'desktop']),
  
  update: () => runPlaywright(['--update-snapshots']),
  ui: () => runPlaywright(['--ui']),
  debug: () => runPlaywright(['--debug']),
  headed: () => runPlaywright(['--headed']),
};

function runPlaywright(playwrightArgs) {
  const additionalArgs = args.slice(1);
  const allArgs = [...playwrightArgs, ...additionalArgs];
  
  console.log(`Running: npx playwright test ${allArgs.join(' ')}`);
  
  const child = spawn('npx', ['playwright', 'test', ...allArgs], {
    stdio: 'inherit',
    shell: true,
    cwd: path.resolve(__dirname, '../..')
  });
  
  child.on('close', (code) => {
    process.exit(code);
  });
  
  child.on('error', (error) => {
    console.error('Error running Playwright:', error);
    process.exit(1);
  });
}

// Execute command
if (commands[command]) {
  commands[command]();
} else {
  console.error(`Unknown command: ${command}`);
  console.log('Run "node run-tests.js help" for available commands.');
  process.exit(1);
}