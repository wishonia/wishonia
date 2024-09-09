export function slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/^(\d)/, 'n$1'); // Prepend 'n' if slug starts with a number
  }