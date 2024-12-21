import fs from 'fs'
import path from 'path'

interface RouteNode {
  name: string
  path: string
  isDynamic: boolean
  children: { [key: string]: RouteNode }
}

function generateRouteTree(dir: string = 'app', parentPath: string = ''): RouteNode {
  const root: RouteNode = {
    name: 'root',
    path: '/',
    isDynamic: false,
    children: {}
  }

  const items = fs.readdirSync(path.join(process.cwd(), dir))

  for (const item of items) {
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory() && !item.startsWith('_') && !item.startsWith('.')) {
      const segmentName = item
      const isDynamic = segmentName.startsWith('[') && segmentName.endsWith(']')
      const cleanName = isDynamic ? segmentName.slice(1, -1) : segmentName
      const routePath = `${parentPath}/${segmentName}`

      // Check if directory contains page.tsx
      const hasPage = fs.existsSync(path.join(fullPath, 'page.tsx'))

      if (hasPage) {
        console.log(`Found page: ${routePath}`)
        const node: RouteNode = {
          name: cleanName,
          path: routePath,
          isDynamic,
          children: {}
        }

        // Recursively process subdirectories
        const subTree = generateRouteTree(fullPath, routePath)
        node.children = subTree.children

        root.children[cleanName] = node
      }
    }
  }

  return root
}

// Generate and save the route tree
const routeTree = generateRouteTree()
console.log('Generated route tree:', JSON.stringify(routeTree, null, 2))

const output = `// Generated route tree - do not edit manually
export const routeTree = ${JSON.stringify(routeTree, null, 2)} as const;

export type RouteNode = {
  name: string;
  path: string;
  isDynamic: boolean;
  children: { [key: string]: RouteNode };
};
`

fs.writeFileSync(
  path.join(process.cwd(), 'config/routeTree.ts'),
  output
)

console.log('Route tree generated successfully!') 