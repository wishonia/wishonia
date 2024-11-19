/**
 * @jest-environment node
 */

import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { createHash } from 'crypto';

interface DownloadResult {
  success: boolean;
  filePath?: string;
  error?: string;
}

async function downloadPDF(url: string): Promise<DownloadResult> {
  try {
    // Create downloads directory if it doesn't exist
    const downloadDir = path.join(process.cwd(), 'downloads');
    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir, { recursive: true });
    }

    // Generate a filename based on URL hash
    const urlHash = createHash('md5').update(url).digest('hex');
    const fileName = `${urlHash}.pdf`;
    const filePath = path.join(downloadDir, fileName);

    // Download the file
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream',
      timeout: 30000 // 30 second timeout
    });

    // Create write stream
    const writer = fs.createWriteStream(filePath);

    // Pipe the response to the file
    response.data.pipe(writer);

    // Return promise that resolves when download is complete
    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        resolve({ success: true, filePath });
      });
      writer.on('error', (error) => {
        fs.unlink(filePath, () => {}); // Clean up failed download
        resolve({ success: false, error: error.message });
      });
    });
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

describe('PDF Downloader Tests', () => {
  const testUrls = [
    'https://www.alzdiscovery.org/uploads/cognitive_vitality_media/Metformin-Cognitive-Vitality-For-Researchers.pdf',
    'https://www.alzdiscovery.org/uploads/cognitive_vitality_media/Ashwagandha-Cognitive-Vitality-For-Researchers.pdf'
  ];

  beforeAll(() => {
    // Clean up downloads directory before tests
    const downloadDir = path.join(process.cwd(), 'downloads');
    if (fs.existsSync(downloadDir)) {
      fs.rmSync(downloadDir, { recursive: true, force: true });
    }
  });

  it('should download PDFs from URLs', async () => {
    for (const url of testUrls) {
      const result = await downloadPDF(url);
      
      expect(result).toHaveProperty('success');
      
      if (result.success) {
        expect(result.filePath).toBeTruthy();
        
        // Verify file exists and has content
        expect(fs.existsSync(result.filePath!)).toBe(true);
        const stats = fs.statSync(result.filePath!);
        expect(stats.size).toBeGreaterThan(0);
        
        console.log(`Successfully downloaded: ${url} to ${result.filePath}`);
      } else {
        console.log(`Failed to download: ${url}`, result.error);
      }
    }
  }, 60000); // 1-minute timeout

  it('should handle invalid URLs gracefully', async () => {
    const invalidUrl = 'https://invalid-url-that-does-not-exist.com/test.pdf';
    const result = await downloadPDF(invalidUrl);
    
    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });

  afterAll(() => {
    // Clean up downloads directory after tests
    const downloadDir = path.join(process.cwd(), 'downloads');
    if (fs.existsSync(downloadDir)) {
      fs.rmSync(downloadDir, { recursive: true, force: true });
    }
  });
}); 