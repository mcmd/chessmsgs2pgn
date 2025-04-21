/**
 * LogParser module for chessmsgs2pgn
 * Parses ChessMsgs.com URLs from log files and extracts chess moves
 */

const { URLSearchParams } = require('url');

/**
 * Parses a log file content and extracts chess moves and game ID from ChessMsgs.com URLs
 * @param {string} logContent - Content of the log file containing ChessMsgs.com URLs
 * @returns {Object} - Object containing moves array and gameId
 * @throws {Error} - If parsing fails, no valid moves found, or game ID is inconsistent
 */
function parseLog(logContent) {
    const lines = logContent.split('\n');
    const moves = [];
    let gameId = null;
    let currentFen = null;
    let validUrlsFound = false;

    for (const line of lines) {
        // Parse ChessMsgs.com URLs
        const urlMatch = line.match(/https?:\/\/chessmsgs\.com\/\?([^#\s]*)/);
        if (!urlMatch) continue;

        const queryString = urlMatch[1];
        const params = new URLSearchParams(queryString);

        const from = params.get('from');
        const to = params.get('to');
        const fen = params.get('fen');
        const gid = params.get('gid');

        // Skip invalid URLs but don't throw error
        if (!from || !to || !fen || !gid) continue;

        validUrlsFound = true;

        if (!gameId) {
            gameId = gid;
        } else if (gameId !== gid) {
            throw new Error(`Inconsistent game ID found. Expected ${gameId}, got ${gid}`);
        }

        moves.push({
            from,
            to,
            fen: currentFen || fen, // Use previous FEN for move validation
            promotion: to.length === 3 ? to[2].toLowerCase() : undefined // Handle promotions
        });

        currentFen = fen;
    }

    if (!validUrlsFound) {
        throw new Error('No valid game moves found in the log file');
    }

    return { moves, gameId };
}

module.exports = { parseLog }; 