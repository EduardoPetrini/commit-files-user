# Commit Files User

A TypeScript Node.js utility that analyzes git commits and generates a report of modified files by specific authors in a git repository.

## Description

This tool helps track file changes in a git repository by specific authors. It:
- Filters commits by author email(s)
- Excludes merge commits
- Generates a report of modified files with their associated commit hashes
- Supports branch filtering
- Excludes specific commit hashes if needed

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Git installed on your system
- Access to the target git repository

## Installation

1. Clone this repository:
```bash
git clone <repository-url>
cd commit-files-user
```

2. Install dependencies:
```bash
npm install
```

## Configuration

Create a `.env` file in the root directory with the following variables:

```env
REPO_PATH=/path/to/your/repository
GIT_BRANCH=develop
AUTHOR_EMAIL=user1@example.com,user2@example.com
HASHES_IGNORE=abc123,def456
```

### Environment Variables

- `REPO_PATH`: Absolute path to the git repository you want to analyze
- `GIT_BRANCH`: Branch name pattern to filter commits (default: 'develop')
- `AUTHOR_EMAIL`: Comma-separated list of author emails to filter commits
- `HASHES_IGNORE`: Comma-separated list of commit hashes to ignore

## Usage

Run the script using ts-node:

```bash
npx ts-node index.ts
```

The script will:
1. Read the git log for the specified branch
2. Filter commits by the provided author emails
3. Analyze file changes in each commit
4. Generate a `files.txt` report with the following format:
```
path/to/file1 - commit1hash,commit2hash
path/to/file2 - commit3hash,commit4hash
```

## Project Structure

```
├── index.ts           # Main application file
├── utils.ts           # Utility functions
├── package.json       # Project dependencies and scripts
├── .env              # Environment configuration
└── files.txt         # Generated report (output)
```

## Dependencies

- `dotenv`: Environment variable management
- `simple-git`: Git operations in Node.js
- `typescript`: TypeScript support
- `ts-node`: TypeScript execution environment

## Development

To modify or extend the project:

1. Install development dependencies:
```bash
npm install --save-dev typescript ts-node
```

2. Make your changes to the TypeScript files
3. Run the script using `npx ts-node index.ts`

## Output

The script generates a `files.txt` file containing:
- File paths relative to the repository root
- Associated commit hashes for each file
- Sorted alphabetically by file path

## Logging

The script includes basic logging that shows:
- Author name
- Commit date
- Number of files changed
- Commit hash
- Commit message

## Limitations

- Does not track renamed files separately
- Excludes merge commits
- Specific commits containing 'v1.55.3' or 'conflict' are filtered out

## License

ISC
