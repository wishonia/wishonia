export function getFaviconUrl(url: string | null | undefined): string | null {
  if (!url) return null
  try {
    const domain = new URL(url).hostname
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
  } catch {
    return null
  }
} 