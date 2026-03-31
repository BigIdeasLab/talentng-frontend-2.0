# API Contract Testing Tool

An automated API contract testing tool that validates backend API endpoints against expected frontend data contracts.

## Features

- **Automatic Authentication**: Supports both token-based and email/password authentication
- **Schema Validation**: Validates API response structures against expected schemas
- **Nested Structure Support**: Handles deeply nested objects and arrays
- **Contract Violation Detection**: Identifies missing fields, type mismatches, and HTTP errors
- **Comprehensive Reporting**: Color-coded console output and JSON export
- **Error Resilience**: Continues testing even when individual endpoints fail

## Installation

The tool is already set up in this project. Dependencies are installed via npm.

## Configuration

### 1. Environment Variables

Copy the example environment file and configure your API credentials:

```bash
cp scripts/api-contract-testing/.env.example .env
```

Edit `.env` with your API configuration:

```bash
# API Base URL (required)
API_URL=http://localhost:3000/api/v1

# Authentication Method 1: Token-based
ACCESS_TOKEN=your_access_token_here

# OR Authentication Method 2: Email/Password
# EMAIL=user@example.com
# PASSWORD=your_password_here
```

### 2. Endpoint Configuration

Edit `scripts/api-contract-testing/config/api-endpoints.ts` to define your API endpoints and expected schemas:

```typescript
export const API_ENDPOINTS: FeatureConfig[] = [
  {
    name: "Profile",
    endpoints: [
      {
        path: "/profile",
        method: "GET",
        schema: {
          id: { type: "string", required: true },
          email: { type: "string", required: true },
          name: { type: "string", required: true },
        },
      },
    ],
  },
];
```

## Usage

Run the contract tests:

```bash
npm run test:api-contracts
```

## Output

### Console Output

The tool provides color-coded console output:

- ✓ Green for passing tests
- ✗ Red for failing tests
- Detailed error information for failures

### JSON Report

Test results are exported to `API_TEST_RESULTS.json` with:

- Total test count and pass rate
- Individual test results
- Detailed violation information
- Timestamps

## Schema Definition

### Basic Types

```typescript
{
  fieldName: { type: 'string', required: true },
  optionalField: { type: 'number', required: false },
}
```

Supported types: `'string'`, `'number'`, `'boolean'`, `'object'`, `'array'`, `'null'`

### Nested Objects

```typescript
{
  user: {
    type: 'object',
    required: true,
    objectSchema: {
      name: { type: 'string', required: true },
      age: { type: 'number', required: false },
    },
  },
}
```

### Arrays

```typescript
{
  items: {
    type: 'array',
    required: true,
    arrayItemSchema: {
      id: { type: 'string', required: true },
      title: { type: 'string', required: true },
    },
  },
}
```

## CI/CD Integration

Add to your CI/CD pipeline:

```yaml
- name: Run API Contract Tests
  run: npm run test:api-contracts
```

The tool exits with code 1 if any tests fail, making it suitable for CI/CD pipelines.

## Troubleshooting

### Authentication Errors

- Verify `API_URL` is correct
- Check that `ACCESS_TOKEN` or `EMAIL`/`PASSWORD` are set
- Ensure the authentication endpoint is accessible

### Schema Validation Errors

- Review the JSON report for detailed error information
- Check that field names match exactly (case-sensitive)
- Verify data types match expected values

### Network Errors

- Confirm the API is running and accessible
- Check firewall and network settings
- Verify the API URL includes the correct protocol (http/https)

## Project Structure

```
scripts/api-contract-testing/
├── index.ts                    # CLI entry point
├── types.ts                    # TypeScript type definitions
├── authentication.ts           # Authentication module
├── http-client.ts             # HTTP request handler
├── schema-validator.ts        # Response validation
├── test-orchestrator.ts       # Test execution coordinator
├── console-reporter.ts        # Console output formatter
├── json-reporter.ts           # JSON report generator
├── violation-detector.ts      # Contract violation detection
├── configuration-loader.ts    # Configuration management
├── config/
│   └── api-endpoints.ts       # Endpoint configurations
├── .env.example               # Environment variable template
└── README.md                  # This file
```

## License

Part of the Fusion Starter project.
