const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Listen for network requests to capture stream URLs
  const networkRequests = [];
  page.on('request', request => {
    networkRequests.push({
      url: request.url(),
      method: request.method(),
      resourceType: request.resourceType()
    });
  });

  console.log('📡 Navigating to: https://rtmklik-radio-player.s3.ap-southeast-1.amazonaws.com/index.html?radio=MINNAL_FM\n');

  try {
    await page.goto('https://rtmklik-radio-player.s3.ap-southeast-1.amazonaws.com/index.html?radio=MINNAL_FM', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Get page title and URL
    const title = await page.title();
    const url = page.url();
    console.log(`✅ Page Title: ${title}`);
    console.log(`✅ Current URL: ${url}\n`);

    // Get page content
    const html = await page.content();
    console.log('📄 Page HTML (first 2000 chars):');
    console.log(html.substring(0, 2000));
    console.log('\n...\n');

    // Look for audio elements
    console.log('🔊 Searching for audio/video elements...');
    const audioElements = await page.locator('audio').count();
    const videoElements = await page.locator('video').count();
    console.log(`   Found ${audioElements} audio element(s)`);
    console.log(`   Found ${videoElements} video element(s)\n`);

    // Get all audio sources
    if (audioElements > 0) {
      console.log('📻 Audio Sources:');
      const sources = await page.locator('audio source').all();
      for (let i = 0; i < sources.length; i++) {
        const src = await sources[i].getAttribute('src');
        const type = await sources[i].getAttribute('type');
        console.log(`   [${i+1}] src: ${src}`);
        console.log(`       type: ${type}\n`);
      }
    }

    // Look for stream URLs in scripts
    console.log('🔍 Searching for stream URLs in page scripts...');
    const scriptContent = await page.evaluate(() => {
      const scripts = document.querySelectorAll('script');
      const contents = [];
      scripts.forEach(script => {
        if (script.textContent) {
          contents.push(script.textContent);
        }
      });
      return contents;
    });

    // Search for stream URLs in scripts
    let foundStreams = false;
    scriptContent.forEach((script, idx) => {
      const patterns = [
        /https?:\/\/[^\s"'<>]+\.m3u8/gi,
        /https?:\/\/[^\s"'<>]+\.mp3/gi,
        /https?:\/\/[^\s"'<>]+\.aac/gi,
        /"streamUrl"\s*:\s*"([^"]+)"/gi,
        /"url"\s*:\s*"([^"]+)"/gi,
        /stream["\']?\s*:\s*["\']([^"']+)/gi
      ];

      patterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(script)) !== null) {
          console.log(`   Found: ${match[0]}`);
          foundStreams = true;
        }
      });
    });

    if (!foundStreams) {
      console.log('   No obvious stream URLs found in scripts');
    }

    // Check meta tags and window variables
    console.log('\n🔬 Checking window variables and config...');
    const windowVars = await page.evaluate(() => {
      const obj = {};
      for (const key in window) {
        if (key.toLowerCase().includes('stream') ||
            key.toLowerCase().includes('audio') ||
            key.toLowerCase().includes('radio') ||
            key.toLowerCase().includes('url')) {
          try {
            obj[key] = window[key];
          } catch (e) {}
        }
      }
      return obj;
    });

    if (Object.keys(windowVars).length > 0) {
      console.log(JSON.stringify(windowVars, null, 2));
    } else {
      console.log('   No relevant window variables found');
    }

    // Log network requests related to media
    console.log('\n🌐 Network Requests (media/stream related):');
    const mediaRequests = networkRequests.filter(r =>
      r.resourceType.includes('media') ||
      r.resourceType.includes('xhr') ||
      r.resourceType.includes('fetch') ||
      r.url.includes('.m3u8') ||
      r.url.includes('.mp3') ||
      r.url.includes('.aac') ||
      r.url.includes('stream') ||
      r.url.includes('audio')
    );

    if (mediaRequests.length > 0) {
      mediaRequests.forEach(req => {
        console.log(`   ${req.method} ${req.resourceType}`);
        console.log(`   ${req.url}\n`);
      });
    } else {
      console.log('   No media-related requests captured\n');
    }

    console.log('✅ Inspection complete!');

  } catch (error) {
    console.error('❌ Error navigating to page:', error.message);
  }

  await browser.close();
})();
