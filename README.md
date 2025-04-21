# chessmsgs2pgn

A command-line tool to convert [ChessMsgs.com](https://chessmsgs.com) game logs into standard PGN (Portable Game Notation) format. This tool is designed to work with games played on [ChessMsgs.com](https://github.com/gregsramblings/chessmsgs), a service that allows playing chess over various messaging platforms.

## Features

- Extracts chess moves from ChessMsgs.com URLs in log files
- Validates moves using chess.js
- Generates standard-compliant PGN output
- Supports move validation and proper SAN (Standard Algebraic Notation) formatting
- Handles game identification via URL's `gid` parameter
- Proper PGN formatting with standard headers and line wrapping
- Automated testing with validation against known good PGN output

## Installation

### Global Installation (Recommended)
```bash
npm install -g chessmsgs2pgn
```

### Local Installation
1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Preparing Your Game Log

1. Export your chat history from your messaging app:
   - WhatsApp: Open chat → Menu → More → Export chat
   - Telegram: Open chat → Menu → Export chat history
   - SMS: Use your phone's SMS backup feature or copy/paste to a text file
   - Other apps: Copy/paste the conversation to a text file

2. (Optional) Filter the log to get only the game you want:
   ```bash
   # Find all games in your chat log
   grep -o 'chessmsgs.com/?[^[:space:]]*' chat_export.txt

   # Filter for a specific game ID
   grep -o 'chessmsgs.com/?[^[:space:]]*gid=U3s1rMn-9H' chat_export.txt > game_moves.txt
   ```

## Usage

```bash
# If installed globally
chessmsgs2pgn -i <input_file>
chessmsgs2pgn -i <input_file> -o <output_file>

# If installed locally
./index.js -i <input_file>
./index.js -i <input_file> -o <output_file>

# Run tests
npm test
```

### Example

```bash
# Convert a game log to PGN and save to file
chessmsgs2pgn -i game_moves.txt -o game.pgn

# Convert a game log and print to console
chessmsgs2pgn -i game_moves.txt
```

### Example Chat Export

Your chat export might look something like this:
```
[2024-04-21 14:30:15] Alice: Let's play chess!
[2024-04-21 14:30:20] Bob: Sure!
[2024-04-21 14:30:25] Alice: https://chessmsgs.com/?fen=rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR&to=e4&from=e2&gid=U3s1rMn-9H
[2024-04-21 14:31:10] Bob: https://chessmsgs.com/?fen=rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR&to=e5&from=e7&gid=U3s1rMn-9H
...
```

The tool will extract the chess moves from the URLs and generate a proper PGN file.

## Input Format

The tool expects a text file containing ChessMsgs.com URLs in the following format:

```
https://chessmsgs.com/?fen=...&to=e4&from=e2&gid=GAME_ID
```

Each URL should contain:
- `fen`: The FEN string representing the board position
- `to`: The destination square
- `from`: The origin square
- `gid`: The game identifier

## Output Format

The tool generates standard PGN format output with:
- Standard PGN headers (Event, Site, Date, Round, etc.)
- Properly formatted movetext with:
  - Move numbers
  - Standard Algebraic Notation (SAN)
  - Line wrapping at 80 characters
  - Proper spacing and formatting

## Project Structure

```
.
├── src/                    # Source files
│   ├── FileReader.js      # File reading operations
│   ├── LogParser.js       # URL parsing and move extraction
│   └── PgnGenerator.js    # PGN generation and formatting
├── test/                   # Test files
│   ├── fixtures/          # Test input/output files
│   │   ├── test.txt      # Sample game log
│   │   └── test.pgn      # Expected PGN output
│   └── chessmsgs2pgn.test.js # Test suite
├── index.js               # CLI entry point
├── package.json           # Project configuration
└── README.md             # Documentation
```

## Testing

The project includes automated tests that validate the PGN generation against known good output. To run the tests:

```bash
npm test
```

The test suite:
1. Reads the test input file (`test.txt`)
2. Generates PGN output
3. Compares it with the expected output (`test.pgn`)
4. Reports any differences

## Dependencies

- [chess.js](https://github.com/jhlywa/chess.js): Chess move validation and SAN generation
- [commander](https://github.com/tj/commander.js): Command-line argument parsing
- [jest](https://jestjs.io/): Testing framework (development only)

## License

ISC 