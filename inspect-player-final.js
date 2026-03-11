const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Capture all network requests including XHR/Fetch
  const allRequests = [];
  page.on('response', async (response) => {
    const url = response.url();
    const status = response.status();

    // Log all requests for analysis
    allRequests.push({
      url: url,
      status: status,
      method: response.request().method()
    });

    // Log specific interesting requests
    if ((url.includes('stream') ||
         url.includes('stw.media') ||
         url.includes('audio') ||
         url.includes('mount') ||
         url.includes('secure') ||
         url.includes('api')) &&
        !url.includes('idsync') &&
        !url.includes('translation.json')) {
      console.log(`\n📡 ${response.request().method()} ${url}`);
      console.log(`   Status: ${status}`);

      if (status === 200 && response.request().method() === 'GET') {
        try {
          const text = await response.text();
          console.log(`   Size: ${text.length} bytes`);
          console.log(`   Preview: ${text.substring(0, 300)}`);
        } catch (e) {
          console.log('   [Could not read response body]');
        }
      }
    }
  });

  console.log('🎵 Inspecting RTM MINNAL FM Player\n');
  console.log('📍 URL: https://rtmklik-radio-player.s3.ap-southeast-1.amazonaws.com/index.html?radio=MINNAL_FM\n');

  try {
    await page.goto('https://rtmklik-radio-player.s3.ap-southeast-1.amazonaws.com/index.html?radio=MINNAL_FM', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    console.log('⏳ Waiting for player to initialize...\n');
    await page.waitForTimeout(5000);

    // Try to find audio or stream element
    console.log('\n📊 Checking for audio/media elements...');
    const playerInfo = await page.evaluate(async () => {
      // Check for any hidden audio elements
      const audios = document.querySelectorAll('audio, video, [data-stream], [data-src], [data-url]');
      const info = {
        audioElements: [],
        dataAttributes: []
      };

      audios.forEach((el, idx) => {
        if (el.tagName === 'AUDIO' || el.tagName === 'VIDEO') {
          const sources = el.querySelectorAll('source');
          sources.forEach(src => {
            info.audioElements.push({
              src: src.src,
              type: src.type
            });
          });
        }

        // Check data attributes
        if (el.dataset.stream || el.dataset.src || el.dataset.url) {
          info.dataAttributes.push({
            element: el.tagName,
            data: el.dataset
          });
        }
      });

      // Also check all script text for stream URLs
      const scripts = document.querySelectorAll('script');
      const streamUrls = [];
      const patterns = [
        /https?:\/\/[^\s"'<>]+\.m3u8/gi,
        /https?:\/\/[^\s"'<>]+\.(mp3|aac|ogg|flac)/gi,
        /"url"\s*:\s*"([^"]+)"/gi,
      ];

      scripts.forEach(script => {
        patterns.forEach(pattern => {
          let match;
          while ((match = pattern.exec(script.textContent)) !== null) {
            streamUrls.push(match[0]);
          }
        });
      });

      return {
        ...info,
        foundStreamUrls: [...new Set(streamUrls)]
      };
    });

    console.log(JSON.stringify(playerInfo, null, 2));

    // Get all unique network requests
    console.log('\n\n📋 Summary of All Network Requests:');
    console.log(`Total requests: ${allRequests.length}`);

    // Group by domain
    const domains = {};
    allRequests.forEach(req => {
      const url = new URL(req.url);
      const domain = url.hostname;
      if (!domains[domain]) domains[domain] = [];
      domains[domain].push(req);
    });

    console.log('\nBy Domain:');
    Object.entries(domains).forEach(([domain, reqs]) => {
      console.log(`\n  ${domain}: ${reqs.length} requests`);
      reqs.slice(0, 3).forEach(req => {
        console.log(`    - ${req.method} ${req.url.split('?')[0]}`);
      });
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  await browser.close();
})();
