// Core types for API contract testing

// Schema validation types
export type SchemaType = 'string' | 'number' | 'boolean' | 'object' | 'array' | 'null';

export interface SchemaField {
  type: SchemaType;
  required: boolean;
  arrayItemSchema?: Schema;
  objectSchema?: Schema;
}

export interface Schema {
  [fieldName: string]: SchemaField;
}

// Endpoint configuration types
export interface EndpointConfig {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  schema: Schema;
  detailEndpoints?: DetailEndpointConfig[];
}

export interface DetailEndpointConfig {
  pathTemplate: string; // e.g., "/opportunities/:id"
  idField: string; // e.g., "id" - field from list response to use
  schema: Schema;
}

export interface FeatureConfig {
  name: string;
  endpoints: EndpointConfig[];
}

// Test result types
export interface ValidationError {
  type: 'missing_field' | 'type_mismatch' | 'http_error' | 'network_error';
  path: string;
  expected?: string;
  actual?: string;
  message: string;
}

export interface TestResult {
  endpoint: string;
  method: string;
  passed: boolean;
  errors: ValidationError[];
  timestamp: string;
  responseTime?: number;
}

export interface TestReport {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  passRate: number;
  results: TestResult[];
  timestamp: string;
}

// Authentication types
export interface AuthConfig {
  type: 'token' | 'email_password';
  token?: string;
  email?: string;
  password?: string;
}

export interface AuthResponse {
  token: string;
  [key: string]: any;
}
