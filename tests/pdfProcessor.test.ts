/**
 * @jest-environment node
 */

import { PDFProcessor } from '@/lib/agents/pdfProcessor';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { createHash } from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

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

describe('PDF Processor Integration Tests', () => {
  const wpBaseUrl = process.env.WORDPRESS_URL!;
  const wpUsername = process.env.WORDPRESS_USERNAME!;
  const wpPassword = process.env.WORDPRESS_PASSWORD!;
  
  let processor: PDFProcessor;

  beforeAll(() => {
    // Verify environment variables
    expect(wpBaseUrl).toBeDefined();
    expect(wpUsername).toBeDefined();
    expect(wpPassword).toBeDefined();

    processor = new PDFProcessor(wpBaseUrl, wpUsername, wpPassword);
  });

  it('should process PDFs from a test URL', async () => {
    // Using a known URL that contains PDFs
    const testUrl = 'https://www.alzdiscovery.org/cognitive-vitality/researchers';
    
    const results = await processor.processURL(testUrl);
    
    // Basic validation of results
    expect(results).toHaveProperty('processed');
    expect(results).toHaveProperty('skipped');
    expect(results).toHaveProperty('errors');
    
    // Log results for manual verification
    console.log('Processing results:', results);
    
    // Ensure some PDFs were found and processed
    expect(results.processed + results.skipped).toBeGreaterThan(0);
  }, 300000); // 5-minute timeout

  it('should handle invalid URLs gracefully', async () => {
    const invalidUrl = 'https://invalid-url-that-does-not-exist.com';
    
    const results = await processor.processURL(invalidUrl);
    
    expect(results.errors.length).toBeGreaterThan(0);
    expect(results.processed).toBe(0);
  });

  it('should extract PDF URLs from a webpage', async () => {
    // Using a known URL that contains PDFs
    const testUrl = 'https://www.alzdiscovery.org/cognitive-vitality/researchers';
    
    const pdfUrls = await processor.getPDFLinks(testUrl);
    
    // Basic validation
    expect(Array.isArray(pdfUrls)).toBe(true);
    expect(pdfUrls.length).toBeGreaterThan(0);
    
    // Verify each URL is a PDF
    pdfUrls.forEach(url => {
      expect(url.toLowerCase()).toMatch(/\.pdf$/);
      expect(url).toMatch(/^https?:\/\//);
    });
    
    // Log URLs for manual verification
    console.log('Found PDF URLs:', pdfUrls);
  }, 30000); // 30-second timeout

  it('should download PDFs from extracted URLs', async () => {
    // Using a known URL that contains PDFs
    const testUrl = 'https://www.alzdiscovery.org/cognitive-vitality/researchers';
    
    // First get the PDF URLs
    const pdfUrls = await processor.getPDFLinks(testUrl);
    expect(pdfUrls.length).toBeGreaterThan(0);

    // Create downloads directory if it doesn't exist
    const downloadDir = path.join(process.cwd(), 'downloads');
    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir, { recursive: true });
    }

    // Try to download each PDF
    for (const pdfUrl of pdfUrls) {
      const downloadResult = await downloadPDF(pdfUrl);
      
      // Verify the download was successful
      expect(downloadResult).toHaveProperty('success');
      expect(downloadResult).toHaveProperty('filePath');
      
      if (downloadResult.success) {
        // Verify the file exists
        expect(downloadResult.filePath).toBeTruthy();
        expect(fs.existsSync(downloadResult.filePath!)).toBe(true);
        const stats = fs.statSync(downloadResult.filePath!);
        expect(stats.size).toBeGreaterThan(0);
        
        // Log successful download
        console.log(`Successfully downloaded: ${pdfUrl} to ${downloadResult.filePath}`);
      } else {
        // Log failed download
        console.log(`Failed to download: ${pdfUrl}`, downloadResult.error);
      }
    }
  }, 600000); // 10-minute timeout for multiple downloads

  afterAll(() => {
    // Clean up downloads directory after tests
    const downloadDir = path.join(process.cwd(), 'downloads');
    if (fs.existsSync(downloadDir)) {
      //fs.rmSync(downloadDir, { recursive: true, force: true });
    }
  });
}); 