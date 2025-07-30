import fs from 'fs';
import path from 'path';
import WDIOReporter from '@wdio/reporter';

/**
 * Custom reporter that generates a JSON report with timestamps for WebdriverIO tests.
 */
export default class JSONReporter extends WDIOReporter {
	constructor(options) {
		super(options);
		// Ensure option params exist
		options = Object.assign(options, { stdout: true });
		this.testResults = [];

		// Create report output directory
		this.ensureDirectoryExistence(this.options.outputFile);
	}

	onRunnerEnd() {
		this.writeJSONReport();
	}

	onTestPass(test) {
		this.addTestResult(test, 'PASSED');
	}

	onTestFail(test) {
		this.addTestResult(test, 'FAILED');
	}

	addTestResult(test, status) {
		const timestamp = new Date().toISOString();
		const suiteName = test.parent || 'Default Suite';
		const error = test.error ? this.sanitizeErrorMessage(test.error.message) : '';
		this.testResults.push({ timestamp, suiteName, testName: test.title, status, error });
	}

	writeJSONReport() {
		const timestamp = new Date().toISOString().replace(/:/g, '-'); // Replace colons with dashes for filename
		const fileName = `test-report-${timestamp}.json`;
		const outputFile = path.join(path.dirname(this.options.outputFile), fileName);
		fs.writeFileSync(outputFile, JSON.stringify(this.testResults, null, 2));
		console.log(`JSON report successfully written to ${outputFile}`);
	}

	sanitizeErrorMessage(errorMessage) {
		return errorMessage
			.replace(/[\u001b\u009b]\[\d{1,2}(;\d{1,2})?(m|K)/g, '')
			.split('\n')[0]
			.trim();
	}

	ensureDirectoryExistence(filePath) {
		const dirname = path.dirname(filePath);
		if (fs.existsSync(dirname)) {
			return true;
		}
		fs.mkdirSync(dirname, { recursive: true });
	}
}
