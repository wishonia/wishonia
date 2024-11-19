import { WordPressPost, WordPressError, WordPressCategory, WordPressTag } from './wordpressTypes';

interface WordPressClientConfig {
  baseUrl: string;
  username: string;
  password: string;
}

export class WordPressClient {
  private baseUrl: string;
  private auth: { username: string; password: string };

  constructor(config: WordPressClientConfig) {
    this.baseUrl = `${config.baseUrl}/wp-json/wp/v2`;
    this.auth = {
      username: config.username,
      password: config.password,
    };
  }

  private getAuthHeader(): string {
    return `Basic ${Buffer.from(`${this.auth.username}:${this.auth.password}`).toString('base64')}`;
  }

  private async fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': this.getAuthHeader(),
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      this.handleError({
        response: {
          data,
          status: response.status,
          statusText: response.statusText,
        },
        config: {
          url: endpoint,
          method: options.method || 'GET',
        }
      });
    }

    return response.json();
  }

  private handleError(error: any): never {
    const errorData = error.response?.data || {};
    const wpError: WordPressError = {
      code: errorData.code || 'unknown_error',
      message: `${errorData.message || 'Unknown error'} (Username: ${this.auth.username})`,
      data: {
        ...errorData,
        attemptedUser: this.auth.username,
        baseUrl: this.baseUrl
      }
    };

    console.error('WordPress API Error:', {
      code: wpError.code,
      message: wpError.message,
      user: this.auth.username,
      endpoint: error.config?.url,
      method: error.config?.method,
      status: error.response?.status
    });
    throw wpError;
  }

  async getPosts(params: any = {}) {
    const searchParams = new URLSearchParams(params);
    return this.fetchWithAuth(`/posts?${searchParams}`);
  }

  async getPost(id: number) {
    return this.fetchWithAuth(`/posts/${id}`);
  }

  async createPost(post: WordPressPost) {
    const categoryIds = await Promise.all(
      post.categories.map(name => this.findOrCreateCategory(name).then(cat => cat.id))
    );

    const tagIds = await Promise.all(
      post.tags.map(name => this.findOrCreateTag(name).then(tag => tag.id))
    );

    return this.fetchWithAuth('/posts', {
      method: 'POST',
      body: JSON.stringify({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        status: post.status || 'draft',
        categories: categoryIds,
        tags: tagIds,
        featured_media: post.featured_media,
        format: 'standard',
        meta: {
          _jetpack_markdown: 1
        }
      })
    });
  }

  async updatePost(id: number, post: Partial<WordPressPost>) {
    return this.fetchWithAuth(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(post)
    });
  }

  async deletePost(id: number) {
    return this.fetchWithAuth(`/posts/${id}`, {
      method: 'DELETE'
    });
  }

  private async findOrCreateCategory(categoryName: string): Promise<WordPressCategory> {
    const searchParams = new URLSearchParams({ search: categoryName });
    const categories = await this.fetchWithAuth(`/categories?${searchParams}`);
    
    const existingCategory = categories.find(
      (cat: WordPressCategory) => cat.name.toLowerCase() === categoryName.toLowerCase()
    );

    if (existingCategory) return existingCategory;

    return this.fetchWithAuth('/categories', {
      method: 'POST',
      body: JSON.stringify({
        name: categoryName,
        slug: categoryName.toLowerCase().replace(/\s+/g, '-'),
      })
    });
  }

  private async findOrCreateTag(tagName: string): Promise<WordPressTag> {
    const searchParams = new URLSearchParams({ search: tagName });
    const tags = await this.fetchWithAuth(`/tags?${searchParams}`);
    
    const existingTag = tags.find(
      (tag: WordPressTag) => tag.name.toLowerCase() === tagName.toLowerCase()
    );

    if (existingTag) return existingTag;

    return this.fetchWithAuth('/tags', {
      method: 'POST',
      body: JSON.stringify({
        name: tagName,
        slug: tagName.toLowerCase().replace(/\s+/g, '-'),
      })
    });
  }

  async uploadMedia(file: Blob, fileName: string, title: string) {
    const formData = new FormData();
    formData.append('file', file, fileName);
    formData.append('title', title);

    const response = await fetch(`${this.baseUrl}/media`, {
      method: 'POST',
      headers: {
        'Authorization': this.getAuthHeader(),
        // Let the browser set the correct Content-Type with boundary for FormData
      },
      body: formData
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      this.handleError({
        response: {
          data,
          status: response.status,
          statusText: response.statusText
        },
        config: {
          url: '/media',
          method: 'POST'
        }
      });
    }

    return response.json();
  }

  async deleteMedia(id: number) {
    return this.fetchWithAuth(`/media/${id}?force=true`, {
      method: 'DELETE'
    });
  }

  async getMedia(params: any = {}) {
    const searchParams = new URLSearchParams(params);
    return this.fetchWithAuth(`/media?${searchParams}`);
  }

  async uploadMediaFromUrl(imageUrl: string): Promise<number> {
    try {
      // Fetch the image
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image from ${imageUrl}`);
      }

      // Get the image blob and file name
      const imageBlob = await response.blob();
      const fileName = imageUrl.split('/').pop() || 'image.jpg';
      
      // Get the file extension from the content type or URL
      const fileExt = response.headers.get('content-type')?.split('/').pop() || 
                     fileName.split('.').pop() || 
                     'jpg';
      
      // Ensure we have a valid filename with extension
      const finalFileName = fileName.includes('.') ? fileName : `${fileName}.${fileExt}`;

      // Upload the media
      const uploadResponse = await this.uploadMedia(
        imageBlob,
        finalFileName,
        finalFileName // Using filename as title, you might want to customize this
      );

      return uploadResponse.id;
    } catch (error) {
      console.error('Error uploading media from URL:', error);
      throw error;
    }
  }
} 