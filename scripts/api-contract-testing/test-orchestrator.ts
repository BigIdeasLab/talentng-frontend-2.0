import type {
  FeatureConfig,
  EndpointConfig,
  DetailEndpointConfig,
  TestResult,
  TestReport,
} from './types.js';
import type { IHttpClient } from './http-client.js';
import type { ISchemaValidator } from './schema-validator.js';
import { ViolationDetector } from './violation-detector.js';

export interface ITestOrchestrator {
  runTests(features: FeatureConfig[]): Promise<TestReport>;
}

export class TestOrchestrator implements ITestOrchestrator {
  private violationDetector: ViolationDetector;

  constructor(
    private httpClient: IHttpClient,
    private validator: ISchemaValidator,
    private authToken: string
  ) {
    this.violationDetector = new ViolationDetector();
  }

  async runTests(features: FeatureConfig[]): Promise<TestReport> {
    const results: TestResult[] = [];
    const startTime = Date.now();

    // Test all endpoints sequentially
    for (const feature of features) {
      console.log(`\nTesting feature: ${feature.name}`);
      
      for (const endpoint of feature.endpoints) {
        try {
          // Test the main endpoint
          const result = await this.testEndpoint(endpoint);
          results.push(result);

          // Test detail endpoints if main endpoint passed and returned data
          if (result.passed && endpoint.detailEndpoints) {
            const detailResults = await this.testDetailEndpoints(
              result,
              endpoint.detailEndpoints
            );
            results.push(...detailResults);
          }
        } catch (error) {
          // Continue testing even if one endpoint fails
          console.error(`Error testing ${endpoint.path}:`, error);
          const errorResult: TestResult = {
            endpoint: endpoint.path,
            method: endpoint.method,
            passed: false,
            errors: [
              this.violationDetector.createNetworkErrorViolation(
                endpoint.path,
                endpoint.method,
                error instanceof Error ? error.message : 'Unknown error'
              ),
            ],
            timestamp: new Date().toISOString(),
          };
          results.push(errorResult);
        }
      }
    }

    // Calculate statistics
    const passedTests = results.filter((r) => r.passed).length;
    const failedTests = results.filter((r) => !r.passed).length;
    const passRate = results.length > 0 ? (passedTests / results.length) * 100 : 0;

    return {
      totalTests: results.length,
      passedTests,
      failedTests,
      passRate: Math.round(passRate * 100) / 100,
      results,
      timestamp: new Date().toISOString(),
    };
  }

  private async testEndpoint(endpoint: EndpointConfig): Promise<TestResult> {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();

    try {
      // Execute HTTP request
      const response = await this.httpClient.request(
        endpoint.method,
        endpoint.path,
        this.authToken
      );

      const responseTime = Date.now() - startTime;

      // Validate response against schema
      const validationErrors = this.validator.validate(response, endpoint.schema);

      // Add endpoint context to errors
      const errors = this.violationDetector.detectViolations(
        validationErrors,
        endpoint.path,
        endpoint.method
      );

      return {
        endpoint: endpoint.path,
        method: endpoint.method,
        passed: errors.length === 0,
        errors,
        timestamp,
        responseTime,
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;

      // Handle HTTP errors
      if (error instanceof Error) {
        const httpErrorMatch = error.message.match(/HTTP (\d+): (.+)/);
        if (httpErrorMatch) {
          const statusCode = parseInt(httpErrorMatch[1], 10);
          const statusText = httpErrorMatch[2];
          return {
            endpoint: endpoint.path,
            method: endpoint.method,
            passed: false,
            errors: [
              this.violationDetector.createHttpErrorViolation(
                endpoint.path,
                endpoint.method,
                statusCode,
                statusText
              ),
            ],
            timestamp,
            responseTime,
          };
        }

        // Handle network errors
        return {
          endpoint: endpoint.path,
          method: endpoint.method,
          passed: false,
          errors: [
            this.violationDetector.createNetworkErrorViolation(
              endpoint.path,
              endpoint.method,
              error.message
            ),
          ],
          timestamp,
          responseTime,
        };
      }

      throw error;
    }
  }

  private async testDetailEndpoints(
    listResult: TestResult,
    detailConfigs: DetailEndpointConfig[]
  ): Promise<TestResult[]> {
    const results: TestResult[] = [];

    // Skip if list endpoint failed
    if (!listResult.passed) {
      return results;
    }

    // Parse list response to get IDs
    // Assuming the response is an array or has a data array
    let items: any[] = [];
    
    // This is a simplified approach - in reality, you'd need to handle different response structures
    // For now, we'll skip detail endpoint testing if we can't determine the structure
    
    return results;
  }
}
