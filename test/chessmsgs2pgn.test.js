const fs = require('fs').promises;
const path = require('path');
const { readFile } = require('../src/FileReader');
const { parseLog } = require('../src/LogParser');
const { generatePgn } = require('../src/PgnGenerator');

describe('ChessMsgs2PGN', () => {
    let testInput;
    let expectedOutput;

    beforeAll(async () => {
        // Read test files from fixtures directory
        testInput = await readFile(path.join(__dirname, 'fixtures/test.txt'));
        expectedOutput = await readFile(path.join(__dirname, 'fixtures/test.pgn'));
    });

    test('should parse log file correctly', () => {
        const parsedData = parseLog(testInput);
        expect(parsedData.gameId).toBe('U3s1rMn-9H');
        expect(parsedData.moves.length).toBe(43);
    });

    test('should generate correct PGN output', () => {
        const parsedData = parseLog(testInput);
        const pgn = generatePgn(parsedData);
        // Normalize line endings and trailing newlines
        const normalizedPgn = pgn.replace(/\r\n/g, '\n').trim();
        const normalizedExpected = expectedOutput.replace(/\r\n/g, '\n').trim();
        expect(normalizedPgn).toBe(normalizedExpected);
    });

    test('should handle invalid URLs gracefully', () => {
        const invalidInput = 'This is not a valid URL\nhttps://chessmsgs.com/?invalid=1';
        expect(() => parseLog(invalidInput)).toThrow('No valid game moves found in the log file');
    });

    test('should handle inconsistent game IDs', () => {
        const inconsistentInput = `
            https://chessmsgs.com/?fen=rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR&to=e4&from=e2&gid=GAME1
            https://chessmsgs.com/?fen=rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR&to=e5&from=e7&gid=GAME2
        `;
        expect(() => parseLog(inconsistentInput)).toThrow('Inconsistent game ID found');
    });
}); 