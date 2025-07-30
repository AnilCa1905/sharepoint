/**
 * File Utilities for Download and Upload Testing
 */

import {
    existsSync,
    mkdirSync,
} from 'fs';
import {
    join,
    dirname
} from 'path';
import {
    scrollAndClick
} from './actions.js';
import {
    fileURLToPath
} from 'url';
import {
    promises as fsPromises
} from 'fs'; // modern promise-based fs

const {
    readdir,
    unlink,
    mkdir
} = fsPromises;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const downloadFolder = join(__dirname, '/../.artifacts/downloads');
const uploadFilesDirectory = join(__dirname, '/../test-data/file-uploads');
const dummyFilesDirectory = join(__dirname, '/../test-data/file-uploads/dummy-files');

/**
 * Deletes all files in the downloads folder.
 * Creates the folder if it doesn't exist.
 */
export async function cleanUpDownloadsFolder() {
    try {
        if (existsSync(downloadFolder)) {
            const files = await readdir(downloadFolder);
            await Promise.all(
                files.map(file => unlink(join(downloadFolder, file)))
            );
        } else {
            await mkdir(downloadFolder, { recursive: true });
        }
    } catch (err) {
        console.error('Error during cleanup:', err);
        throw err;
    }
}

/**
 * Downloads a file by clicking the specified element.
 * Waits until a file with the expected extension appears.
 *
 * @param {*} $input - WebdriverIO element to click for downloading
 * @param {string} expectedExtension - File extension to wait for
 * @param {number} timeout - Max wait time in ms
 * @param {string} path - Custom download path (relative to project root)
 * @returns {Promise<boolean>} True if file was downloaded successfully
 */
export async function downloadFile($input, expectedExtension, timeout = 60000, path = downloadFolder) {
    try {
        if (path !== downloadFolder) {
            path = join(__dirname, path);
        }

        // Ensure the folder exists
        if (!existsSync(path)) {
            mkdirSync(path, { recursive: true });
        }

        const initialFiles = (await readdir(path)).filter(file =>
            file.endsWith(`.${expectedExtension}`)
        );
        const initialCount = initialFiles.length;

        // Configure download behavior
        await browser.cdp('Page', 'setDownloadBehavior', {
            behavior: 'allow',
            downloadPath: path,
        });

        // Click to trigger download
        await scrollAndClick($input);

        // Wait for file to appear
        await browser.waitUntil(async () => {
            const currentFiles = (await readdir(path)).filter(file =>
                file.endsWith(`.${expectedExtension}`)
            );
            return currentFiles.length === initialCount + 1;
        }, {
            timeout,
            timeoutMsg: `No file with the extension .${expectedExtension} was downloaded.`,
        });

        return true;
    } catch (err) {
        console.error('Download failed:', err);
        throw err;
    }
}

/**
 * Uploads one or more files using a file input element.
 *
 * @param {*} $input - WebdriverIO file input element
 * @param {string|string[]} expectedFiles - File name(s) to upload
 * @param {number} timeout - Unused, for future use or retries
 * @param {string} path - Relative path to file directory
 */
export async function uploadFiles($input, expectedFiles, timeout = 40000, path = dummyFilesDirectory) {
    try {
        if (!Array.isArray(expectedFiles)) {
            expectedFiles = [expectedFiles];
        }

        if (path !== dummyFilesDirectory) {
            path = join(__dirname, path);
        }

        const filesList = expectedFiles.map(fileName => join(path, fileName));
        const filesPath = filesList.join('\n');

        await $input.addValue(filesPath);
    } catch (err) {
        console.error('Upload failed:', err);
        throw err;
    }
}

