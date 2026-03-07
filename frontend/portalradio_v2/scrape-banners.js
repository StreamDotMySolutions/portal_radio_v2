const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');

// Create screenshots directory if it doesn't exist
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const filepath = path.join(SCREENSHOTS_DIR, filename);

    const file = fs.createWriteStream(filepath);

    protocol
      .get(url, (response) => {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✓ Downloaded: ${filename}`);
          resolve(filepath);
        });
      })
      .on('error', (err) => {
        fs.unlink(filepath, () => {});
        reject(err);
      });
  });
}

(async () => {
  let browser;
  try {
    console.log('🚀 Launching browser...');
    browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    await page.setViewport({ width: 1280, height: 720 });

    console.log('📖 Navigating to radio.rtm.gov.my...');
    await page.goto('https://radio.rtm.gov.my', { waitUntil: 'networkidle0', timeout: 30000 });

    console.log('⏳ Waiting for dynamic content...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Scroll to trigger lazy loading
    console.log('📜 Scrolling page...');
    await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight);
    });

    await new Promise(resolve => setTimeout(resolve, 2000));

    // Get all images
    const allImages = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('img'))
        .map((img) => ({
          src: img.src || img.getAttribute('src') || '',
          alt: img.alt || img.getAttribute('alt') || '',
          dataSrc: img.getAttribute('data-src') || '',
        }))
        .filter((img) => {
          const src = img.src || img.dataSrc;
          return (
            src &&
            !src.includes('data:') &&
            (src.includes('.png') || src.includes('.jpg') || src.includes('.jpeg') || src.includes('.webp')) &&
            (src.includes('radio') || src.includes('station') || src.includes('banner') || src.length > 100)
          );
        });
    });

    console.log(`📊 Found ${allImages.length} images`);
    allImages.forEach((img, i) => {
      console.log(`${i + 1}. ${img.alt || 'unknown'}`);
      console.log(`   src: ${(img.src || img.dataSrc).substring(0, 80)}...`);
    });

    // Download all unique images
    const downloadedSet = new Set();
    let successCount = 0;

    for (const img of allImages) {
      try {
        const imageUrl = img.src || img.dataSrc;
        if (!imageUrl) continue;

        // Create unique filename
        const urlPath = new URL(imageUrl, 'https://radio.rtm.gov.my').pathname;
        let filename = path.basename(urlPath).split('?')[0];

        if (!filename || filename.length < 5) {
          filename = `banner_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.png`;
        }

        if (downloadedSet.has(filename)) continue;
        downloadedSet.add(filename);

        await downloadImage(imageUrl, filename);
        successCount++;
      } catch (err) {
        // Continue on individual errors
      }
    }

    console.log(`\n✅ Download complete: ${successCount} images saved to ./screenshots/`);

    // List downloaded files
    const files = fs.readdirSync(SCREENSHOTS_DIR);
    console.log('\n📁 Downloaded files:');
    files.forEach(f => {
      const stats = fs.statSync(path.join(SCREENSHOTS_DIR, f));
      console.log(`   ${f} (${(stats.size / 1024).toFixed(1)}KB)`);
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
})();
