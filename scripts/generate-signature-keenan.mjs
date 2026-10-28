import puppeteer from 'puppeteer-core';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.join(__dirname, '..', 'public', 'images', 'signature-keenan.png');
const logoPath = path.join(__dirname, '..', 'public', 'images', 'logo.png');

const logoB64 = fs.readFileSync(logoPath).toString('base64');
const logoSrc = `data:image/png;base64,${logoB64}`;

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Segoe UI', Arial, sans-serif;
    background: transparent;
    width: fit-content;
  }
  .sig {
    display: inline-flex;
    align-items: center;
    background: #111b1b;
    border: 1px solid rgba(48,176,176,0.3);
    border-radius: 12px;
    padding: 18px 24px;
    gap: 0;
  }
  .logo-cell {
    padding-right: 22px;
    border-right: 1.5px solid #30B0B0;
    display: flex;
    align-items: center;
  }
  .logo-cell img {
    width: 90px;
    height: auto;
    display: block;
  }
  .info {
    padding-left: 22px;
    display: flex;
    flex-direction: column;
    gap: 0;
  }
  .name {
    font-size: 16px;
    font-weight: 700;
    color: #e0e0e0;
    letter-spacing: 0.3px;
    margin-bottom: 3px;
  }
  .title {
    font-size: 10px;
    font-weight: 700;
    color: #30B0B0;
    text-transform: uppercase;
    letter-spacing: 1.2px;
    margin-bottom: 10px;
  }
  .contact-row {
    display: flex;
    align-items: center;
    gap: 7px;
    margin-bottom: 4px;
  }
  .contact-row svg { flex-shrink: 0; }
  .contact-row a, .contact-row span {
    font-size: 11.5px;
    color: #30B0B0;
    text-decoration: none;
  }
  .contact-row span { color: #888; }
  .tagline {
    font-size: 10px;
    color: #666;
    font-style: italic;
    margin-top: 7px;
  }
</style>
</head>
<body>
<div class="sig">
  <div class="logo-cell">
    <img src="${logoSrc}" alt="Swift Designz" />
  </div>
  <div class="info">
    <div class="name">Keenan Husselmann</div>
    <div class="title">Founder &amp; Developer &middot; Swift Designz</div>

    <div class="contact-row">
      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#30B0B0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
      </svg>
      <a href="mailto:keenan@swiftdesignz.co.za">keenan@swiftdesignz.co.za</a>
    </div>

    <div class="contact-row">
      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#30B0B0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
        <path d="M2 12h20"/>
      </svg>
      <a href="https://swiftdesignz.co.za">swiftdesignz.co.za</a>
    </div>

    <div class="contact-row">
      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#30B0B0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6 6l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.03z"/>
      </svg>
      <span>+264 81 853 6789</span>
    </div>

    <div class="tagline">Crafting Digital Excellence</div>
  </div>
</div>
</body>
</html>`;

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 400, deviceScaleFactor: 2 });
await page.setContent(html, { waitUntil: 'domcontentloaded' });

const element = await page.$('.sig');
await element.screenshot({
  path: outputPath,
  omitBackground: false,
});

await browser.close();
console.log(`Saved: ${outputPath}`);
