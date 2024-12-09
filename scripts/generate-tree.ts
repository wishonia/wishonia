interface TreeNode {
  name: string;
  children?: TreeNode[];
}

export function generateTree(paths: string[]): TreeNode[] {
  const root: TreeNode[] = [];

  for (const path of paths) {
    const parts = path.split('/');
    let current = root;

    for (const part of parts) {
      let node = current.find(n => n.name === part);
      if (!node) {
        node = { name: part };
        current.push(node);
      }
      if (!node.children) {
        node.children = [];
      }
      current = node.children;
    }
  }

  return root;
}

export function printTree(node: TreeNode, prefix = ''): void {
  console.log(prefix + '├── ' + node.name);
  if (node.children) {
    for (let i = 0; i < node.children.length; i++) {
      const isLast = i === node.children.length - 1;
      printTree(node.children[i], prefix + (isLast ? '    ' : '│   '));
    }
  }
}

export function generateTreeFromPaths(paths: string[]): void {
  const tree = generateTree(paths);
  for (const node of tree) {
    printTree(node);
  }
} 