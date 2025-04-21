/**
 * PgnGenerator module for chessmsgs2pgn
 * Generates standard PGN format output from chess moves
 */

const { Chess } = require('chess.js');

/**
 * Formats movetext with proper line wrapping for PGN standard
 * @param {string[]} moves - Array of moves in SAN format
 * @returns {string} - Formatted movetext with proper line wrapping
 */
function formatMovetext(moves) {
    const lines = [];
    let currentLine = '';

    for (const move of moves) {
        if (currentLine.length + move.length + 1 > 80) {
            lines.push(currentLine.trim());
            currentLine = move;
        } else {
            currentLine += (currentLine ? ' ' : '') + move;
        }
    }

    if (currentLine) {
        lines.push(currentLine.trim());
    }

    return lines.join('\n');
}

/**
 * Generates standard PGN format output from parsed chess moves
 * @param {Object} parsedData - Object containing moves array and gameId from ChessMsgs.com
 * @returns {string} - Complete PGN string with headers and movetext
 * @throws {Error} - If move validation fails
 */
function generatePgn(parsedData) {
    const { moves, gameId } = parsedData;
    const chess = new Chess();

    // Generate standard PGN headers
    const headers = [
        `[Event "${gameId}"]`,
        '[Site "ChessMsgs.com"]',
        `[Date "${new Date().toISOString().split('T')[0].replace(/-/g, '.')}"]`,
        '[Round "1"]',
        '[White "?"]',
        '[Black "?"]',
        '[Result "*"]',
        ''
    ].join('\n');

    // Process moves and generate SAN notation
    const sanMoves = [];
    let moveNumber = 1;

    for (const move of moves) {
        const moveObj = {
            from: move.from,
            to: move.to,
            promotion: move.promotion
        };

        const result = chess.move(moveObj);
        if (!result) {
            throw new Error(`Illegal move: ${move.from}${move.to}${move.promotion || ''} at position ${chess.fen()}`);
        }

        // Add move number for white moves or first black move after line break
        if (chess.turn() === 'b') {
            sanMoves.push(`${moveNumber}. ${result.san}`);
        } else {
            sanMoves.push(result.san);
            moveNumber++;
        }
    }

    // Format movetext with proper line wrapping
    const movetext = formatMovetext(sanMoves);

    // Combine headers, moves, and result
    return `${headers}${movetext} *\n`;
}

module.exports = { generatePgn }; 