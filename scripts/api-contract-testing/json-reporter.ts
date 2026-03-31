import { writeFile } from 'fs/promises';
import type { TestReport } from './types.js';

export interface IJsonReporter {
  exportReport(report: TestReport, filePath: string): Promise<void>;
}

export class JsonReporter implements IJsonReporter {
  async exportReport(report: TestReport, filePath: string): Promise<void> {
    try {
      const jsonContent = JSON.stringify(report, null, 2);
      await writeFile(filePath, jsonContent, 'utf-8');
      console.log(`\nJSON report exported to: ${filePath}`);
    } catch (error) {
      console.error(`Failed to write JSON report to ${filePath}:`, error);
      
      // Try to write to a temporary location
      try {
        const tempPath = './API_TEST_RESULTS_TEMP.json';
        const jsonContent = JSON.stringify(report, null, 2);
        await writeFile(tempPath, jsonContent, 'utf-8');
        console.log(`JSON report exported to alternate location: ${tempPath}`);
      } catch (tempError) {
        console.error('Failed to write JSON report to alternate location:', tempError);
      }
    }
  }
}
