const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();

  // Intercept all network requests to capture API responses
  const responses = [];

  context.on('response', async (response) => {
    try {
      if (response.status() === 200) {
        const url = response.url();

        // Capture API responses and large requests
        if (url.includes('streamtheworld') ||
            url.includes('stw.media') ||
            url.includes('api') ||
            url.includes('stream') ||
            response.headers()['content-type']?.includes('application/json')) {

          try {
            const text = await response.text();
            responses.push({
              url: url,
              status: response.status(),
              contentType: response.headers()['content-type'],
              body: text.substring(0, 2000) // First 2000 chars
            });
          } catch (e) {
            // Some responses can't be read twice
          }
        }
      }
    } catch (e) {
      // Ignore errors reading responses
    }
  });

  const page = await context.newPage();

  console.log('🔍 Performing deep inspection of RTM player...\n');

  try {
    await page.goto('https://rtmklik-radio-player.s3.ap-southeast-1.amazonaws.com/index.html?radio=MINNAL_FM', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Wait a bit for any delayed API calls
    await page.waitForTimeout(3000);

    console.log('📡 All Network Requests Captured:\n');

    // Group requests by type
    const streamTheWorldRequests = responses.filter(r => r.url.includes('streamtheworld'));
    const apiRequests = responses.filter(r => r.url.includes('api'));
    const mediaRequests = responses.filter(r => r.url.includes('stream') || r.contentType?.includes('audio'));
    const jsonRequests = responses.filter(r => r.contentType?.includes('json'));

    if (streamTheWorldRequests.length > 0) {
      console.log('🎙️ STREAMTHEWORLD Requests:');
      streamTheWorldRequests.forEach((req, idx) => {
        console.log(`\n[${idx + 1}] ${req.url}`);
        console.log(`    Status: ${req.status}`);
        console.log(`    Response: ${req.body.substring(0, 500)}`);
      });
    }

    if (jsonRequests.length > 0) {
      console.log('\n\n📋 JSON API Responses:');
      jsonRequests.forEach((req, idx) => {
        console.log(`\n[${idx + 1}] ${req.url}`);
        try {
          const json = JSON.parse(req.body);
          console.log(`    Response: ${JSON.stringify(json, null, 2).substring(0, 800)}`);
        } catch (e) {
          console.log(`    Response: ${req.body.substring(0, 500)}`);
        }
      });
    }

    // Try to find stream URLs in all responses
    console.log('\n\n🔗 Searching for Stream URLs in all responses...');
    let foundStreams = false;
    responses.forEach((req) => {
      const patterns = [
        /https?:\/\/[^\s"'<>]+\.m3u8/gi,
        /https?:\/\/[^\s"'<>]+\.pls/gi,
        /https?:\/\/[^\s"'<>]+\.mp3/gi,
        /https?:\/\/[^\s"'<>]+\.aac/gi,
        /"url"\s*:\s*"([^"]+)"/gi,
        /"stream[Uu]rl"\s*:\s*"([^"]+)"/gi,
      ];

      patterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(req.body)) !== null) {
          console.log(`   ✅ Found: ${match[0]}`);
          foundStreams = true;
        }
      });
    });

    if (!foundStreams) {
      console.log('   ⚠️ No direct stream URLs found in captured responses');
    }

    // Check page state
    console.log('\n\n📊 Page State Inspection:');
    const pageState = await page.evaluate(() => {
      // Look for player configuration
      const playerInfo = {
        window_stw: typeof window.stw !== 'undefined' ? 'Found' : 'Not found',
        window_player: typeof window.player !== 'undefined' ? 'Found' : 'Not found',
        window_triton: typeof window.triton !== 'undefined' ? 'Found' : 'Not found',
      };

      // Check for player iframe
      const iframes = document.querySelectorAll('iframe');
      const audioElements = document.querySelectorAll('audio');
      const videoElements = document.querySelectorAll('video');

      return {
        ...playerInfo,
        iframeCount: iframes.length,
        audioCount: audioElements.length,
        videoCount: videoElements.length,
        bodyHTML: document.body.innerHTML.substring(0, 1000)
      };
    });

    console.log(JSON.stringify(pageState, null, 2));

  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  await browser.close();
})();
