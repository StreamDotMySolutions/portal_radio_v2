const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const networkRequests = [];
  const allResponses = [];

  page.on('response', async (response) => {
    const url = response.url();
    const status = response.status();

    networkRequests.push({
      url: url,
      status: status,
      method: response.request().method(),
      contentType: response.headers()['content-type']
    });

    // Capture responses that might contain stream info
    if ((url.includes('api') || url.includes('stream') || url.includes('mount') ||
         url.includes('secure') || url.includes('stw') || url.includes('triton')) &&
        status === 200 &&
        response.headers()['content-type']?.includes('application/json')) {
      try {
        const text = await response.text();
        allResponses.push({
          url: url,
          body: text
        });
      } catch (e) {
        // Ignore
      }
    }
  });

  console.log('🎵 Inspecting: https://rtmklik.rtm.gov.my/radio/nasional/nasional-fm\n');

  try {
    await page.goto('https://rtmklik.rtm.gov.my/radio/nasional/nasional-fm', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    console.log('⏳ Waiting for page to fully load...\n');
    await page.waitForTimeout(3000);

    // Check for audio elements and stream URLs
    const pageData = await page.evaluate(() => {
      const data = {
        title: document.title,
        url: window.location.href,
        audioElements: [],
        iframes: [],
        scripts: [],
        dataInDOM: {}
      };

      // Find audio elements
      document.querySelectorAll('audio').forEach((audio, idx) => {
        const sources = [];
        audio.querySelectorAll('source').forEach(src => {
          sources.push({
            src: src.src,
            type: src.type
          });
        });
        data.audioElements.push({ id: audio.id, src: audio.src, sources });
      });

      // Find iframes
      document.querySelectorAll('iframe').forEach((iframe, idx) => {
        data.iframes.push({
          id: iframe.id,
          src: iframe.src,
          name: iframe.name,
          class: iframe.className
        });
      });

      // Look for stream URLs in all text and attributes
      const bodyText = document.body.innerText;
      const patterns = [
        /https?:\/\/[^\s"'<>]+\.m3u8/g,
        /https?:\/\/[^\s"'<>]+\.(mp3|aac|ogg)/g,
        /stream["\']?\s*[=:]\s*["\']?([^"'\s<>]+)/gi
      ];

      const foundUrls = new Set();
      patterns.forEach(pattern => {
        let match;
        const html = document.documentElement.outerHTML;
        while ((match = pattern.exec(html)) !== null) {
          foundUrls.add(match[0]);
        }
      });

      data.foundUrls = Array.from(foundUrls);

      // Check window variables
      const interestingVars = {};
      for (const key in window) {
        if (key.toLowerCase().includes('stream') ||
            key.toLowerCase().includes('radio') ||
            key.toLowerCase().includes('mount') ||
            key.toLowerCase().includes('api')) {
          try {
            const val = window[key];
            if (typeof val === 'object' || typeof val === 'string') {
              interestingVars[key] = typeof val === 'object' ? '{...}' : val;
            }
          } catch (e) {}
        }
      }

      data.windowVars = interestingVars;

      // Check meta tags
      const metas = {};
      document.querySelectorAll('meta').forEach(meta => {
        if (meta.name || meta.property) {
          metas[meta.name || meta.property] = meta.content;
        }
      });
      data.metaTags = metas;

      return data;
    });

    console.log('📄 Page Information:');
    console.log(`   Title: ${pageData.title}`);
    console.log(`   URL: ${pageData.url}\n`);

    console.log('🔊 Audio Elements Found:', pageData.audioElements.length);
    pageData.audioElements.forEach((audio, idx) => {
      console.log(`   [${idx}] ${audio.id || 'unnamed'}`);
      if (audio.src) console.log(`       src: ${audio.src}`);
      audio.sources.forEach(src => {
        console.log(`       source: ${src.src} (${src.type})`);
      });
    });

    console.log('\n🖼️ iframes Found:', pageData.iframes.length);
    pageData.iframes.forEach((iframe, idx) => {
      console.log(`   [${idx}] ${iframe.id || iframe.name || 'unnamed'}`);
      console.log(`       src: ${iframe.src}`);
    });

    console.log('\n🔗 Stream URLs Found in DOM:', pageData.foundUrls.length);
    pageData.foundUrls.forEach(url => {
      console.log(`   ${url}`);
    });

    console.log('\n📊 Window Variables (Stream/Radio related):');
    Object.entries(pageData.windowVars).forEach(([key, val]) => {
      console.log(`   ${key}: ${val}`);
    });

    console.log('\n🌐 Network Requests Summary:');
    const domains = {};
    networkRequests.forEach(req => {
      try {
        const url = new URL(req.url);
        const domain = url.hostname;
        if (!domains[domain]) domains[domain] = [];
        domains[domain].push(req);
      } catch (e) {}
    });

    Object.entries(domains).sort().forEach(([domain, reqs]) => {
      if (reqs.some(r => r.url.includes('stream') || r.url.includes('secure') ||
                         r.url.includes('api') || r.url.includes('triton') ||
                         r.url.includes('mount'))) {
        console.log(`\n   ${domain}:`);
        reqs.forEach(req => {
          console.log(`     - ${req.method} ${req.url.split('?')[0]}`);
        });
      }
    });

    console.log('\n📋 API Responses (JSON):');
    allResponses.forEach((resp, idx) => {
      console.log(`\n   [${idx}] ${resp.url}`);
      try {
        const json = JSON.parse(resp.body);
        console.log(`       ${JSON.stringify(json).substring(0, 200)}`);
      } catch (e) {
        console.log(`       ${resp.body.substring(0, 200)}`);
      }
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  await browser.close();
})();
