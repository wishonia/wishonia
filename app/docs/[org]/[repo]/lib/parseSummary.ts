export interface MenuItem {
  title: string
  path: string
  emoji?: string
  children?: MenuItem[]
}

export function parseSummaryMd(content: string): MenuItem[] {
  const lines = content.split('\n').filter(line => line.trim())
  const items: MenuItem[] = []
  let currentParent: MenuItem | null = null
  let currentLevel = 0

  for (const line of lines) {
    // Skip the "Table of contents" header
    if (line.startsWith('# Table of contents')) continue

    const level = line.match(/^\s*/)?.[0].length ?? 0
    const match = line.match(/^\s*\* \[(.*?)\]\((.*?)\)/)
    
    if (!match) continue

    const [, fullTitle, path] = match
    // Extract emoji if present
    const emojiMatch = fullTitle.match(/^([\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}])\s(.+)$/u)
    const title = emojiMatch ? emojiMatch[2] : fullTitle
    const emoji = emojiMatch ? emojiMatch[1] : undefined

    const item: MenuItem = {
      title,
      path: path.replace(/\.md$/, ''),
      emoji,
      children: []
    }

    if (level === 0) {
      items.push(item)
      currentParent = item
      currentLevel = 0
    } else if (level > currentLevel && currentParent) {
      currentParent.children?.push(item)
    } else {
      // Find the appropriate parent based on level
      let parent = items[items.length - 1]
      for (let i = 0; i < level - 2; i++) {
        parent = parent.children?.[parent.children.length - 1] ?? parent
      }
      parent.children?.push(item)
      currentParent = parent
      currentLevel = level
    }
  }

  return items
} 