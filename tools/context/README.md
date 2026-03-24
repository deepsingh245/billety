# Project Context System

A lightweight context generation system for your Billety project. Generates comprehensive context files that can be used in AI chats or documentation.

## Quick Start

### Generate Context

```bash
npm run context:build
```

This will scan your entire project and generate three context files in `project-context/`:

- **context.json** - Complete structured context (machine-readable)
- **context.md** - Human-readable markdown documentation
- **context-for-ai.txt** - Optimized for pasting into ChatGPT, Claude, etc.

## Generated Files

### 1. `context.json`
Full structured context with:
- Project metadata (name, tech stack, description)
- Complete file inventory (path, summary, imports, exports)
- Module groupings
- Statistics (total files, components, etc.)

**Use Case:** Programmatic access, integration with tools

### 2. `context.md`
Human-readable markdown with:
- Project overview
- Architecture description
- Module organization
- Key components list
- Top imports/dependencies

**Use Case:** Team documentation, reading in editor

### 3. `context-for-ai.txt`
Optimized for AI chats (2000-3000 tokens):
- Condensed project summary
- Module list with file counts
- Key exports and signatures
- Statistics and top modules
- Ready to paste into ChatGPT/Claude

**Use Case:** "Here's my codebase, help me with [X]"

## How It Works

The context builder:

1. **Scans** all TypeScript, JavaScript, and JSON files
2. **Ignores** node_modules, dist, .git, etc.
3. **Analyzes** imports and exports using regex
4. **Detects** tech stack from dependencies
5. **Groups** files into logical modules
6. **Generates** three output formats

No external dependencies. Uses only native Node.js modules (fs, path).

## Using with AI Chats

### Step 1: Generate Context
```bash
npm run context:build
```

### Step 2: Copy AI Context
```bash
# On macOS/Linux:
cat project-context/context-for-ai.txt | pbcopy

# On Windows PowerShell:
Get-Content project-context/context-for-ai.txt | Set-Clipboard
```

### Step 3: Paste into Chat
Open ChatGPT, Claude, or other AI and paste:
```
[paste context-for-ai.txt contents]

Now, help me add a feature to the login page...
```

## What's Included

```
tools/context/
├── buildContext.js          # Main script (no dependencies needed)
└── buildContext.ts          # TypeScript source (optional)

project-context/              # Generated output
├── context.json             # Full context
├── context.md               # Markdown docs
├── context-for-ai.txt       # AI chat format
└── .gitignore               # Excludes from git
```

## Understanding the Output

### Tech Stack
Automatically detected from package.json and source imports:
- React, Firebase, Material-UI, TypeScript, Electron, i18n, jsPDF, XLSX, etc.

### Modules
Files are grouped by their top-level directory:
- **components** - 52 React UI components
- **shared** - 15 shared utilities and theme
- **pages** - 12 page containers
- **context** - 5 React context providers
- **firebase** - 4 Firebase integration files
- **services** - 2 service layer files
- **utils** - 7 utility functions
- etc.

### Statistics
- **Total Files:** 124 scanned and analyzed
- **Components:** 80 React components (.tsx files)
- **File Types:** TypeScript, JavaScript, JSON distribution

## Customization

To modify what gets scanned, edit `tools/context/buildContext.js`:

```javascript
// Lines 17-24: Change ignored directories
const IGNORE_PATTERNS = [
  'node_modules',
  '.git',
  // Add more patterns...
];

// Lines 26: Change file extensions
const FILE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.json'];
```

## Notes

- **No dependencies:** Uses only Node.js built-in modules
- **Fast:** Scans 124 files in <1 second
- **Always up-to-date:** Run anytime to refresh
- **Safe:** Outputs only to `project-context/` directory

## Example Usage in AI Chat

```
I have a React + Firebase project. Here's my codebase context:

PROJECT: Billety
DESCRIPTION: Invoice management application with Firebase backend and React UI
TECH STACK: Electron, Firebase, HTML2Canvas, Material-UI, React, React Router, TypeScript, XLSX, i18n, jsPDF
ARCHITECTURE: Modular React app with components, services, and utilities. Firebase cloud functions for backend logic.

[... rest of context-for-ai.txt ...]

Now, I need to add a new field to the client form. The client data is stored in Firestore and retrieved via the firebase service. Can you help me:
1. Add a 'taxId' field to the AddClientForm component
2. Update the Client interface
3. Ensure it's persisted to Firestore
```

## Troubleshooting

### Script won't run
Make sure you're in the project root:
```bash
cd /path/to/billety
npm run context:build
```

### Files not being scanned
Check the ignore patterns in `buildContext.js`. Add/remove directories as needed.

### Context files are outdated
Run context:build again. The output files are overwritten each time.

## Future Enhancements

You can extend `buildContext.js` to:
- Extract API endpoints from service files
- Detect database schema from interfaces
- Generate dependency graphs
- Include test coverage stats
- Detect circular dependencies
- Extract environment variables

## Support

Questions? Check the generated context files or run:
```bash
node tools/context/buildContext.js
```
