import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

interface GeneratePDFOptions {
  html: string;
  format?: "A4" | "Letter";
  printBackground?: boolean;
}

/**
 * Generate a PDF from HTML using Puppeteer
 * Works both locally and on Vercel serverless
 */
export async function generatePDFFromHTML({
  html,
  format = "A4",
  printBackground = true,
}: GeneratePDFOptions): Promise<Buffer> {
  let browser = null;

  try {
    // Different configurations for local vs production
    const isLocal = process.env.NODE_ENV === "development" || !process.env.VERCEL;

    if (isLocal) {
      // Local development - try to find Chrome
      const executablePath = await getLocalChromePath();
      browser = await puppeteer.launch({
        headless: true,
        executablePath,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
    } else {
      // Vercel/Lambda - use @sparticuz/chromium
      browser = await puppeteer.launch({
        headless: true,
        executablePath: await chromium.executablePath(),
        args: chromium.args,
      });
    }

    const page = await browser.newPage();

    // Set content and wait for fonts/images to load
    await page.setContent(html, {
      waitUntil: ["domcontentloaded", "networkidle0"],
    });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format,
      printBackground,
      margin: {
        top: "0mm",
        right: "0mm",
        bottom: "0mm",
        left: "0mm",
      },
      preferCSSPageSize: true,
    });

    return Buffer.from(pdfBuffer);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

/**
 * Try to find Chrome executable path on local machine
 */
async function getLocalChromePath(): Promise<string> {
  const platform = process.platform;

  // Common Chrome paths by platform
  const paths: Record<string, string[]> = {
    win32: [
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
      process.env.LOCALAPPDATA + "\\Google\\Chrome\\Application\\chrome.exe",
    ],
    darwin: [
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      "/Applications/Chromium.app/Contents/MacOS/Chromium",
    ],
    linux: [
      "/usr/bin/google-chrome",
      "/usr/bin/chromium-browser",
      "/usr/bin/chromium",
    ],
  };

  const possiblePaths = paths[platform] || [];

  // Check which path exists
  const fs = await import("fs");
  for (const chromePath of possiblePaths) {
    try {
      if (fs.existsSync(chromePath)) {
        return chromePath;
      }
    } catch {
      // Continue to next path
    }
  }

  // Fallback: try to use CHROME_PATH env variable
  if (process.env.CHROME_PATH) {
    return process.env.CHROME_PATH;
  }

  throw new Error(
    "Chrome not found. Please install Chrome or set CHROME_PATH environment variable."
  );
}

export default generatePDFFromHTML;
