import chalk from "chalk";
import type { TestResult, TestReport } from "./types.js";

export interface IConsoleReporter {
  reportTest(result: TestResult): void;
  reportSummary(report: TestReport): void;
}

export class ConsoleReporter implements IConsoleReporter {
  reportTest(result: TestResult): void {
    const status = result.passed ? chalk.green("✓ PASS") : chalk.red("✗ FAIL");
    const endpoint = `${result.method} ${result.endpoint}`;
    const time = result.responseTime ? ` (${result.responseTime}ms)` : "";

    console.log(`${status} ${endpoint}${time}`);

    // Display errors for failed tests
    if (!result.passed && result.errors.length > 0) {
      result.errors.forEach((error) => {
        console.log(chalk.red(`  ├─ ${error.type}: ${error.message}`));

        if (error.type === "missing_field") {
          console.log(chalk.red(`  │  Field: ${error.path}`));
        }

        if (error.type === "type_mismatch") {
          console.log(chalk.red(`  │  Field: ${error.path}`));
          console.log(chalk.red(`  │  Expected: ${error.expected}`));
          console.log(chalk.red(`  │  Actual: ${error.actual}`));
        }

        if (error.type === "http_error") {
          console.log(chalk.red(`  │  Status: ${error.actual}`));
        }
      });
    }
  }

  reportSummary(report: TestReport): void {
    console.log("\n" + chalk.bold("═".repeat(60)));
    console.log(chalk.bold("Test Summary"));
    console.log(chalk.bold("═".repeat(60)));

    console.log(`Total Tests:  ${report.totalTests}`);
    console.log(chalk.green(`Passed:       ${report.passedTests}`));
    console.log(chalk.red(`Failed:       ${report.failedTests}`));

    const passRateColor =
      report.passRate >= 80
        ? chalk.green
        : report.passRate >= 50
          ? chalk.yellow
          : chalk.red;
    console.log(passRateColor(`Pass Rate:    ${report.passRate.toFixed(2)}%`));

    console.log(chalk.bold("═".repeat(60)));
    console.log(`Timestamp:    ${report.timestamp}`);
    console.log(chalk.bold("═".repeat(60)) + "\n");
  }
}
