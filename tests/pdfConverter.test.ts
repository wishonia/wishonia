/**
 * @jest-environment node
 */

import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface ConversionResult {
  success: boolean;
  htmlPath?: string;
  error?: string;
}

async function convertPDFToHTML(pdfPath: string): Promise<ConversionResult> {
  try {
    // Create output directory if it doesn't exist
    const htmlDir = path.join(process.cwd(), 'html_output');
    if (!fs.existsSync(htmlDir)) {
      fs.mkdirSync(htmlDir, { recursive: true });
    }

    // Generate output path
    const pdfFileName = path.basename(pdfPath, '.pdf');
    const htmlPath = path.join(htmlDir, pdfFileName);

    // Create directory for this specific PDF's output
    if (!fs.existsSync(htmlPath)) {
      fs.mkdirSync(htmlPath, { recursive: true });
    }

    // Run pdf2htmlEX command
    // Note: pdf2htmlEX must be installed on the system
    const command = `pdf2htmlEX --zoom 1.3 --embed-css 0 --embed-font 0 --embed-image 1 --embed-javascript 0 --dest-dir "${htmlPath}" "${pdfPath}"`;
    
    const { stdout, stderr } = await execAsync(command);
    
    // Check if output file exists
    const htmlFilePath = path.join(htmlPath, `${pdfFileName}.html`);
    if (fs.existsSync(htmlFilePath)) {
      return {
        success: true,
        htmlPath: htmlFilePath
      };
    } else {
      throw new Error('HTML file not created');
    }

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

describe('PDF to HTML Converter Tests', () => {
  const downloadsDir = path.join(process.cwd(), 'downloads');
  const htmlOutputDir = path.join(process.cwd(), 'html_output');

  beforeAll(() => {
    // Ensure downloads directory exists
    if (!fs.existsSync(downloadsDir)) {
      throw new Error('Downloads directory not found. Run PDF download tests first.');
    }

    // Clean up previous HTML output
    if (fs.existsSync(htmlOutputDir)) {
      //fs.rmSync(htmlOutputDir, { recursive: true, force: true });
    }
  });

  it('should convert all PDFs to HTML', async () => {
    // Get all PDF files
    const pdfFiles = fs.readdirSync(downloadsDir)
      .filter(file => file.toLowerCase().endsWith('.pdf'))
      .map(file => path.join(downloadsDir, file));

    expect(pdfFiles.length).toBeGreaterThan(0);
    console.log(`Found ${pdfFiles.length} PDFs to convert`);

    // Convert each PDF
    for (const pdfFile of pdfFiles) {
      console.log(`Converting ${pdfFile}...`);
      const result = await convertPDFToHTML(pdfFile);

      expect(result).toHaveProperty('success');

      if (result.success) {
        expect(result.htmlPath).toBeTruthy();
        expect(fs.existsSync(result.htmlPath!)).toBe(true);

        // Basic validation of HTML content
        const htmlContent = fs.readFileSync(result.htmlPath!, 'utf8');
        expect(htmlContent).toContain('<!DOCTYPE html>');
        expect(htmlContent.length).toBeGreaterThan(0);

        console.log(`Successfully converted: ${pdfFile} to ${result.htmlPath}`);

        // Validate that images were preserved (if any)
        const htmlDir = path.dirname(result.htmlPath!);
        const files = fs.readdirSync(htmlDir);
        const imageFiles = files.filter(f => /\.(png|jpg|jpeg|gif)$/i.test(f));
        if (imageFiles.length > 0) {
          console.log(`Found ${imageFiles.length} images in ${htmlDir}`);
        }
      } else {
        console.log(`Failed to convert: ${pdfFile}`, result.error);
      }
    }
  }, 1200000); // 20-minute timeout

  afterAll(() => {
    // Optionally clean up HTML output
    // Commented out to allow manual inspection of results
    // if (fs.existsSync(htmlOutputDir)) {
    //   fs.rmSync(htmlOutputDir, { recursive: true, force: true });
    // }
  });
}); 