namespace GenerateTree {
  const fs = require('fs');
  const path = require('path');

  function generateTree(dir: string, prefix: string = ''): string {
    let tree = '';
    const items = fs.readdirSync(dir);

    items.forEach((item: string, index: number) => {
      const fullPath = path.join(dir, item);
      const isLast = index === items.length - 1;
      const isDirectory = fs.statSync(fullPath).isDirectory();
      
      // Skip node_modules, .next, and other common excludes
      if (item === 'node_modules' || item === '.next' || item.startsWith('.')) {
        return;
      }

      // Add the current item to the tree
      tree += `${prefix}${isLast ? '└── ' : '├── '}${item}\n`;

      // If it's a directory, recursively process its contents
      if (isDirectory) {
        const newPrefix = prefix + (isLast ? '    ' : '│   ');
        tree += generateTree(fullPath, newPrefix);
      }
    });

    return tree;
  }

  // Generate the tree starting from the app directory
  const appDir = path.join(process.cwd(), 'app');
  const tree = `# App Directory Structure\n\n\`\`\`\n${generateTree(appDir)}\`\`\`\n`;

  // Save to docs/app-tree.md
  const docsDir = path.join(process.cwd(), 'docs');
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir);
  }

  fs.writeFileSync(path.join(docsDir, 'app-tree.md'), tree);
  console.log('Directory tree has been generated in docs/app-tree.md');
} 