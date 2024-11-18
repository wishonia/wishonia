import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';

export class PDFDownloader {
  private downloadDir: string;

  constructor(downloadDir: string) {
    this.downloadDir = downloadDir;
  }

  private async ensureDirectoryExists(): Promise<void> {
    try {
      await fs.access(this.downloadDir);
    } catch {
      await fs.mkdir(this.downloadDir, { recursive: true });
    }
  }

  private async downloadPDF(pdfUrl: string): Promise<void> {
    const response = await fetch(pdfUrl);
    if (!response.ok) {
      throw new Error(`Failed to download PDF: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract filename from URL or use a fallback
    const urlParts = new URL(pdfUrl);
    const fileName = path.basename(urlParts.pathname) || 'document.pdf';
    const filePath = path.join(this.downloadDir, fileName);

    await fs.writeFile(filePath, buffer);
    console.log(`Downloaded: ${fileName}`);
  }

  public async downloadPDFs(pdfUrls: string[]): Promise<{
    downloaded: number;
    errors: string[];
  }> {
    const results = {
      downloaded: 0,
      errors: [] as string[]
    };

    try {
      await this.ensureDirectoryExists();
      
      console.log(`Starting download of ${pdfUrls.length} PDFs...`);
      
      for (const pdfUrl of pdfUrls) {
        try {
          await this.downloadPDF(pdfUrl);
          results.downloaded++;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          results.errors.push(`Error downloading ${pdfUrl}: ${errorMessage}`);
          console.error(`Failed to download ${pdfUrl}: ${errorMessage}`);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      results.errors.push(`Error in download process: ${errorMessage}`);
      console.error(`Error in download process: ${errorMessage}`);
    }

    return results;
  }
}
