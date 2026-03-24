import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Get project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '../../');
const OUTPUT_DIR = path.join(PROJECT_ROOT, 'project-context');

// Configuration
const IGNORE_PATTERNS = [
  'node_modules',
  '.git',
  '.next',
  'dist',
  'build',
  'dist-react',
  'coverage',
  '.cache',
  '.vscode',
  'context-engine',
  '\.env',
  'tools/context',
];

const FILE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.json'];

// Utility functions
function shouldIgnore(filePath) {
  const normalized = filePath.replace(/\\/g, '/');
  return IGNORE_PATTERNS.some(pattern => {
    const regexPattern = pattern.replace(/\./g, '\\.');
    return new RegExp(`(^|/)${regexPattern}(/|$)`).test(normalized);
  });
}

function getFileExtension(filePath) {
  return path.extname(filePath);
}

async function getAllFiles(dir) {
  let files = [];

  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (shouldIgnore(fullPath)) {
        continue;
      }

      if (entry.isDirectory()) {
        const subFiles = await getAllFiles(fullPath);
        files = files.concat(subFiles);
      } else if (entry.isFile()) {
        const ext = getFileExtension(entry.name);
        if (FILE_EXTENSIONS.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  } catch (error) {
    console.warn(`Failed to read directory ${dir}`);
  }

  return files;
}

function extractImports(content) {
  const imports = new Set();

  // ES6 imports: import x from 'module'
  const es6Regex = /import\s+(?:{[^}]*}|(?:\*\s+as\s+\w+)|[\w$_]+)\s+from\s+['"]([^'"]+)['"]/g;
  let match;
  while ((match = es6Regex.exec(content)) !== null) {
    imports.add(match[1]);
  }

  // CommonJS require: require('module')
  const cjsRegex = /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
  while ((match = cjsRegex.exec(content)) !== null) {
    imports.add(match[1]);
  }

  return Array.from(imports);
}

function extractExports(content) {
  const exports = new Set();

  // Named exports: export function/const/class/interface X
  const namedRegex = /export\s+(?:async\s+)?(?:function|class|const|interface|type|enum)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/gm;
  let match;
  while ((match = namedRegex.exec(content)) !== null) {
    exports.add(match[1]);
  }

  // Default export: export default X
  const defaultRegex = /export\s+default\s+(?:function|class)?\s*([a-zA-Z_$][a-zA-Z0-9_$]*)?/gm;
  while ((match = defaultRegex.exec(content)) !== null) {
    if (match[1]) {
      exports.add(match[1]);
    }
  }

  // Export { X, Y } from 'module'
  const destructureRegex = /export\s+{\s*([^}]+)\s*}\s+from/gm;
  while ((match = destructureRegex.exec(content)) !== null) {
    const names = match[1].split(',').map(n => n.trim().split(' as ')[1]?.trim() || n.trim());
    names.forEach(n => {
      if (n && !n.includes('*')) {
        exports.add(n);
      }
    });
  }

  return Array.from(exports);
}

function generateSummary(filePath, content) {
  const basename = path.basename(filePath);
  const dirname = path.basename(path.dirname(filePath));

  // Basic heuristics for summary
  if (filePath.includes('component') || filePath.endsWith('.tsx')) {
    return `React component: ${basename}`;
  }
  if (filePath.includes('service') || filePath.includes('api')) {
    return `API/Service module: ${basename}`;
  }
  if (filePath.includes('context')) {
    return `React Context provider`;
  }
  if (filePath.includes('hook') || (filePath.endsWith('.ts') && content.includes('use'))) {
    return `Custom hook or utility`;
  }
  if (filePath.includes('interface') || filePath.includes('type')) {
    return `TypeScript type definitions`;
  }
  if (filePath.includes('constant') || filePath.includes('config')) {
    return `Constants and configuration`;
  }
  if (basename === 'package.json') {
    return `Package dependencies and metadata`;
  }
  if (filePath.endsWith('.tsx') || filePath.endsWith('.jsx')) {
    return `UI Component`;
  }
  if (filePath.endsWith('.ts') || filePath.endsWith('.js')) {
    return `TypeScript/JavaScript module`;
  }

  return `${dirname}/${basename}`;
}

async function analyzeFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const relativePath = path.relative(PROJECT_ROOT, filePath).replace(/\\/g, '/');

    return {
      path: relativePath,
      summary: generateSummary(filePath, content),
      imports: extractImports(content),
      exports: extractExports(content),
    };
  } catch (error) {
    console.warn(`Failed to analyze ${filePath}`);
    return {
      path: path.relative(PROJECT_ROOT, filePath).replace(/\\/g, '/'),
      summary: 'Unable to analyze',
      imports: [],
      exports: [],
    };
  }
}

function detectTechStack(files) {
  const stack = new Set();

  // Check for tech based on files and imports
  const allImports = files.flatMap(f => f.imports).join('|');

  if (allImports.includes('react')) stack.add('React');
  if (allImports.includes('firebase')) stack.add('Firebase');
  if (allImports.includes('react-router')) stack.add('React Router');
  if (allImports.includes('@mui')) stack.add('Material-UI');
  if (allImports.includes('i18next')) stack.add('i18n');
  if (allImports.includes('xlsx')) stack.add('XLSX');
  if (files.some(f => f.path.endsWith('.tsx'))) stack.add('TypeScript');
  if (files.some(f => f.path.includes('electron'))) stack.add('Electron');
  if (allImports.includes('html2canvas')) stack.add('HTML2Canvas');
  if (allImports.includes('jspdf')) stack.add('jsPDF');

  return Array.from(stack).sort();
}

function groupFilesByModule(files) {
  const modules = new Map();

  files.forEach(file => {
    const pathParts = file.path.split('/');
    let moduleName = 'root';

    if (pathParts.length > 1 && pathParts[0] === 'src') {
      moduleName = pathParts[1] || 'root';
    } else if (pathParts.length > 1) {
      moduleName = pathParts[0];
    }

    if (!modules.has(moduleName)) {
      modules.set(moduleName, []);
    }
    modules.get(moduleName).push(file);
  });

  return modules;
}

async function buildContext() {
  console.log('🔍 Scanning project files...');

  try {
    // Scan all files
    const allFiles = await getAllFiles(PROJECT_ROOT);
    console.log(`📦 Found ${allFiles.length} files to analyze`);

    // Analyze each file
    let fileMetadata = [];
    for (const filePath of allFiles) {
      const metadata = await analyzeFile(filePath);
      fileMetadata.push(metadata);
    }

    // Detect tech stack
    const techStack = detectTechStack(fileMetadata);

    // Group by modules
    const modules = groupFilesByModule(fileMetadata);

    // Calculate statistics
    const filesByType = {};
    fileMetadata.forEach(file => {
      const ext = path.extname(file.path);
      filesByType[ext] = (filesByType[ext] || 0) + 1;
    });

    const componentCount = fileMetadata.filter(f => f.path.includes('component') || f.path.endsWith('.tsx')).length;

    // Build context object
    const context = {
      project: {
        name: 'Billety',
        description: 'Invoice management application with Firebase backend and React UI',
        techStack,
        structure: 'Modular React app with components, services, and utilities. Firebase cloud functions for backend logic.',
        lastUpdated: new Date().toISOString(),
      },
      files: fileMetadata.sort((a, b) => a.path.localeCompare(b.path)),
      modules: Array.from(modules.entries())
        .map(([name, files]) => ({
          name,
          description: `${name} module (${files.length} files)`,
          fileCount: files.length,
        }))
        .sort((a, b) => b.fileCount - a.fileCount),
      statistics: {
        totalFiles: fileMetadata.length,
        totalLines: Math.floor(fileMetadata.length * 50),
        filesByType,
        componentCount,
      },
    };

    // Ensure output directory exists
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    // Write context.json
    const jsonPath = path.join(OUTPUT_DIR, 'context.json');
    await fs.writeFile(jsonPath, JSON.stringify(context, null, 2));
    console.log(`✅ Generated ${jsonPath}`);

    // Write context.md
    const mdPath = path.join(OUTPUT_DIR, 'context.md');
    const mdContent = generateMarkdownContext(context);
    await fs.writeFile(mdPath, mdContent);
    console.log(`✅ Generated ${mdPath}`);

    // Write context-for-ai.txt
    const aiPath = path.join(OUTPUT_DIR, 'context-for-ai.txt');
    const aiContent = generateAIContext(context);
    await fs.writeFile(aiPath, aiContent);
    console.log(`✅ Generated ${aiPath}`);

    console.log('\n✨ Context generation complete!');
    console.log(`\n📊 Summary:`);
    console.log(`   📁 Files: ${fileMetadata.length}`);
    console.log(`   🔧 Tech: ${techStack.join(', ')}`);
    console.log(`   📄 Modules: ${modules.size}`);
  } catch (error) {
    console.error('❌ Error building context:', error);
    process.exit(1);
  }
}

function generateMarkdownContext(context) {
  let md = `# ${context.project.name}\n\n`;
  md += `${context.project.description}\n\n`;

  md += `## 📋 Overview\n`;
  md += `- **Last Updated:** ${new Date(context.project.lastUpdated).toLocaleString()}\n`;
  md += `- **Total Files:** ${context.statistics.totalFiles}\n`;
  md += `- **Tech Stack:** ${context.project.techStack.join(', ')}\n\n`;

  md += `## 🏗️ Architecture\n`;
  md += `${context.project.structure}\n\n`;

  md += `## 📦 Modules\n`;
  context.modules.forEach(mod => {
    md += `### ${mod.name}\n${mod.description}\n\n`;
  });

  md += `## 🎨 Key Components\n`;
  const components = context.files.filter(f => f.path.includes('component') || f.path.includes('pages')).slice(0, 15);
  if (components.length > 0) {
    components.forEach(comp => {
      md += `- **${comp.path}** - ${comp.summary}\n`;
    });
  } else {
    md += `- No components found in filtered view\n`;
  }

  md += `\n## 🔗 Key Imports\n`;
  const topImports = new Map();
  context.files.forEach(f => {
    f.imports.forEach(imp => {
      topImports.set(imp, (topImports.get(imp) || 0) + 1);
    });
  });
  Array.from(topImports.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([imp, count]) => {
      md += `- ${imp} (used in ${count} files)\n`;
    });

  return md;
}

function generateAIContext(context) {
  let text = `PROJECT: ${context.project.name}\n`;
  text += `DESCRIPTION: ${context.project.description}\n`;
  text += `TECH STACK: ${context.project.techStack.join(', ')}\n`;
  text += `ARCHITECTURE: ${context.project.structure}\n`;
  text += `LAST UPDATED: ${new Date(context.project.lastUpdated).toLocaleString()}\n\n`;

  text += `=== MODULES (${context.modules.length} total) ===\n`;
  context.modules.slice(0, 15).forEach(mod => {
    text += `[${mod.name}] ${mod.fileCount} files\n`;
  });

  text += `\n=== KEY EXPORTS (by frequency) ===\n`;
  const exportCount = new Map();
  context.files.forEach(f => {
    f.exports.forEach(exp => {
      exportCount.set(exp, (exportCount.get(exp) || 0) + 1);
    });
  });
  Array.from(exportCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .forEach(([exp, count]) => {
      text += `${exp}\n`;
    });

  text += `\n=== STATISTICS ===\n`;
  text += `Total Files: ${context.statistics.totalFiles}\n`;
  text += `Components: ${context.statistics.componentCount}\n`;
  text += `File Types: ${Object.entries(context.statistics.filesByType)
    .map(([type, count]) => `${type}(${count})`)
    .join(', ')}\n`;

  text += `\n=== TOP MODULES ===\n`;
  context.modules.slice(0, 10).forEach(mod => {
    text += `${mod.name} (${mod.fileCount})\n`;
  });

  return text;
}

// Run
buildContext();
