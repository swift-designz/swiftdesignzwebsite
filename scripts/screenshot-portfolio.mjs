import puppeteer from "puppeteer-core";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(__dirname, "..", "public", "potfolio");

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const sites = [
  {
    name: "dunmoretraining",
    url: "https://dunmore.co.za",
    waitFor: 4000,
  },
  {
    name: "iaacademy",
    url: "https://ia-academy.org",
    waitFor: 4000,
  },
  {
    name: "it-guru",
    url: "https://it-guru.co.za",
    waitFor: 4000,
  },
  {
    name: "rhb-community-trust",
    url: "https://rehotrust.org",
    waitFor: 4000,
  },
];

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--window-size=1440,900"],
  defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
});

for (const site of sites) {
  console.log(`\nScreenshotting: ${site.name} → ${site.url}`);
  const page = await browser.newPage();

  try {
    await page.goto(site.url, { waitUntil: "networkidle2", timeout: 30000 });

    if (site.ageGate) {
      console.log("  Looking for age gate...");
      // Try several common selector patterns for "Yes I'm over 21"
      const clicked = await page.evaluate(() => {
        const allButtons = Array.from(document.querySelectorAll("button, a, [role='button']"));
        const ageBtn = allButtons.find(el => {
          const text = el.textContent?.toLowerCase() ?? "";
          return text.includes("yes") || text.includes("over 21") || text.includes("i am") || text.includes("enter") || text.includes("21");
        });
        if (ageBtn) { ageBtn.click(); return true; }
        return false;
      });
      if (clicked) {
        console.log("  Age gate clicked — waiting for home page...");
        await new Promise(r => setTimeout(r, site.waitFor));
      } else {
        console.log("  No age gate found, proceeding...");
        await new Promise(r => setTimeout(r, 2000));
      }
    } else {
      await new Promise(r => setTimeout(r, site.waitFor));
    }

    // Scroll to top to ensure hero is visible
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise(r => setTimeout(r, 500));

    const outFile = path.join(outputDir, `${site.name}-portfolio-thumbnail.png`);
    await page.screenshot({ path: outFile, clip: { x: 0, y: 0, width: 1440, height: 900 } });
    console.log(`  Saved: ${outFile}`);
  } catch (err) {
    console.error(`  ERROR on ${site.name}:`, err.message);
  } finally {
    await page.close();
  }
}

await browser.close();
console.log("\nAll done.");
