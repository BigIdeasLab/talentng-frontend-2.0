#!/usr/bin/env node

import { config } from 'dotenv';
import { ConfigurationLoader } from './configuration-loader.js';
import { AuthenticationModule } from './authentication.js';
import { HttpClient } from './http-client.js';
import { SchemaValidator } from './schema-validator.js';
import { TestOrchestrator } from './test-orchestrator.js';
import { ConsoleReporter } from './console-reporter.js';
import { JsonReporter } from './json-reporter.js';
import { API_ENDPOINTS } from './config/api-endpoints.js';

async function main() {
  try {
    // Load environment variables
    config({ path: '.env' });

    console.log('🚀 API Contract Testing Tool\n');

    // Initialize configuration loader
    const configLoader = new ConfigurationLoader();

    // Load API URL
    const apiUrl = configLoader.loadApiUrl();
    console.log(`API URL: ${apiUrl}`);

    // Load authentication configuration
    const authConfig = configLoader.loadAuthConfig();
    console.log(`Authentication: ${authConfig.type}\n`);

    // Load and validate endpoint configurations
    const features = configLoader.loadEndpointConfigurations(API_ENDPOINTS);
    console.log(`Loaded ${features.length} feature(s) for testing\n`);

    // Initialize authentication module
    const authModule = new AuthenticationModule(authConfig, apiUrl);

    // Authenticate
    console.log('Authenticating...');
    const token = await authModule.authenticate();
    console.log('✓ Authentication successful\n');

    // Initialize HTTP client
    const httpClient = new HttpClient(apiUrl);

    // Initialize schema validator
    const validator = new SchemaValidator();

    // Initialize test orchestrator
    const orchestrator = new TestOrchestrator(httpClient, validator, token);

    // Initialize reporters
    const consoleReporter = new ConsoleReporter();
    const jsonReporter = new JsonReporter();

    // Run tests
    console.log('Running API contract tests...\n');
    const report = await orchestrator.runTests(features);

    // Report results to console
    report.results.forEach((result) => {
      consoleReporter.reportTest(result);
    });

    // Display summary
    consoleReporter.reportSummary(report);

    // Export JSON report
    await jsonReporter.exportReport(report, 'API_TEST_RESULTS.json');

    // Exit with appropriate code
    process.exit(report.failedTests > 0 ? 1 : 0);
  } catch (error) {
    console.error('\n❌ Error:', error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}

main();
