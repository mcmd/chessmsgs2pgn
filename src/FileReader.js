/**
 * FileReader module for chessmsgs2pgn
 * Handles file reading operations with proper error handling
 */

const fs = require('fs').promises;

/**
 * Reads a file asynchronously and returns its contents
 * @param {string} filePath - Path to the file to read
 * @returns {Promise<string>} - File contents as a string
 * @throws {Error} - If file cannot be read
 */
async function readFile(filePath) {
    try {
        const content = await fs.readFile(filePath, 'utf8');
        return content;
    } catch (error) {
        throw new Error(`Error reading file ${filePath}: ${error.message}`);
    }
}

module.exports = { readFile }; 