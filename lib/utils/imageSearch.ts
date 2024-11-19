// Set up a Google Custom Search Engine at https://programmablesearchengine.google.com/
// and then set the GOOGLE_API_KEY and GOOGLE_CUSTOM_SEARCH_CX environment variables
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_CX = process.env.GOOGLE_CUSTOM_SEARCH_CX;

interface GoogleSearchParams {
  num?: number;          // Number of search results to return (1-10)
  imgType?: 'clipart' | 'face' | 'lineart' | 'photo' | 'animated' | 'news' | 'stock';
  imgSize?: 'huge' | 'icon' | 'large' | 'medium' | 'small' | 'xlarge' | 'xxlarge';
  rights?: string;       // License type
  start?: number;        // Starting index for pagination
}

interface GoogleImageResult {
  link: string;          // Full-size image URL
  title: string;         // Image title
  image: {
    thumbnailLink: string;
    contextLink: string; // URL of the page containing the image
    height: number;
    width: number;
    byteSize: number;
  };
}

export async function searchImages(
  query: string, 
  params: GoogleSearchParams = {}
): Promise<GoogleImageResult[]> {
  if (!GOOGLE_API_KEY || !GOOGLE_CX) {
    throw new Error('Google API key or Custom Search Engine ID not configured');
  }

  try {
    // Build query parameters
    const searchParams = new URLSearchParams({
      key: GOOGLE_API_KEY,
      cx: GOOGLE_CX,
      q: query,
      searchType: 'image',
      num: (params.num || 10).toString(),
      safe: 'off',
    });

    // Add optional parameters if they exist
    if (params.imgType) searchParams.append('imgType', params.imgType);
    if (params.imgSize) searchParams.append('imgSize', params.imgSize);
    if (params.rights) searchParams.append('rights', params.rights);
    if (params.start) searchParams.append('start', params.start.toString());

    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?${searchParams.toString()}`
    );

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.error?.message || 
                          data.error?.errors?.[0]?.message ||
                          getGoogleApiErrorMessage(response.status);
      throw new Error(errorMessage);
    }
    
    if (!data.items?.length) {
      throw new Error(`No images found for query: ${query}`);
    }

    return data.items;
  } catch (error) {
    console.error('Image search failed:', error);
    throw error instanceof Error 
      ? error 
      : new Error('An unexpected error occurred during image search');
  }
}

// Fallback error messages if API doesn't return detailed error info
function getGoogleApiErrorMessage(status: number): string {
  switch (status) {
    case 400:
      return 'Invalid request parameters. Please check your API key, Custom Search Engine ID, and query format.';
    case 401:
      return 'Unauthorized: Invalid or missing API key. Please check your Google API credentials.';
    case 403:
      return 'Forbidden: You have exceeded your API quota or the API key doesn\'t have sufficient permissions.';
    case 429:
      return 'Too many requests: You have exceeded the rate limit. Please try again later.';
    case 500:
      return 'Google API internal server error. Please try again later.';
    case 503:
      return 'Google API service is temporarily unavailable. Please try again later.';
    default:
      return `Google API request failed with status: ${status}. Please check your request parameters and try again.`;
  }
} 