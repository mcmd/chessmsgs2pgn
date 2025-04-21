#!/usr/bin/env node

/**
 * chessmsgs2pgn - Convert ChessMsgs.com game logs to PGN format
 * 
 * This tool converts game logs containing ChessMsgs.com URLs into standard
 * Portable Game Notation (PGN) format. It extracts moves from the URLs,
 * validates them using chess.js, and generates properly formatted PGN output.
 */

const { program } = require('commander');
const { readFile } = require('./src/FileReader');
const { parseLog } = require('./src/LogParser');
const { generatePgn } = require('./src/PgnGenerator');
const fs = require('fs').promises;

program
    .name('chessmsgs2pgn')
    .description('Convert ChessMsgs.com game logs to PGN format')
    .version('1.0.0')
    .requiredOption('-i, --input <file>', 'Input log file containing ChessMsgs.com URLs')
    .option('-o, --output <file>', 'Output PGN file (prints to console if not specified)')
    .parse(process.argv);

async function main() {
    try {
        const { input, output } = program.opts();
        console.log('Reading input file:', input);

        // Read and parse the input file
        const logContent = await readFile(input);
        console.log('Parsing log content...');
        const parsedData = parseLog(logContent);
        console.log('Game ID:', parsedData.gameId);
        console.log('Number of moves:', parsedData.moves.length);

        // Generate PGN
        console.log('Generating PGN...');
        const pgn = generatePgn(parsedData);

        // Output the result
        if (output) {
            console.log('Writing to output file:', output);
            await fs.writeFile(output, pgn, 'utf8');
            console.log('PGN file generated successfully:', output);
        } else {
            console.log('No output file specified. Printing to console:');
            console.log(pgn);
        }
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

main(); 