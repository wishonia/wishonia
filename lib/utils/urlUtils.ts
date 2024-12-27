export function normalizeUrl(url: string): string {
  try {
    const parsedUrl = new URL(url);
    
    // Remove 'www.' if present
    const hostname = parsedUrl.hostname.replace(/^www\./, '');
    
    // Remove trailing slash
    const pathname = parsedUrl.pathname.replace(/\/$/, '');
    
    // Reconstruct the URL without protocol
    return `https://${hostname}${pathname}${parsedUrl.search}`;
  } catch (error) {
    console.error("Invalid URL:", url);
    return url; // Return original URL if invalid
  }
}
