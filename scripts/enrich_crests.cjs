/**
 * Comprehensive University Crest Audit & Enrichment Engine
 * Fetches authentic institutional crests, coats of arms, seals, and shields.
 */

const fs = require('fs');
const path = require('path');

const LOGOS_DIR = path.join(__dirname, '..', 'public', 'logos');
if (!fs.existsSync(LOGOS_DIR)) {
  fs.mkdirSync(LOGOS_DIR, { recursive: true });
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// National / non-university patterns to filter out
const EXCLUDE_REGEX = /royal.*coat.*arms|coat.*arms.*united.*kingdom|coat.*arms.*united.*states|coat.*arms.*nigeria|coat.*arms.*ghana|coat.*arms.*canada|coat.*arms.*australia|coat.*arms.*kenya|coat.*arms.*south.*africa|flag_of_|commons-logo|wikidata|wikivoyage|decrease|increase|symbol|oojs|edit-ltr|building|hall|library|campus|gate|entrance|student|statue|view|aerial|park|tower|hospital|clinic|sports|stadium|football|rugby|cricket|crowd|protest|portrait|group|faculty_of|department_of/i;

async function getUniversityCrestFromWiki(officialName, shortName) {
  const queryNames = [officialName];
  if (shortName && shortName !== officialName && shortName.length > 2) {
    queryNames.push(shortName);
  }
  
  // Clean names for Wikipedia
  const cleanNames = queryNames.map(n => n.replace(/,.*$/, '').trim());

  for (const qName of cleanNames) {
    try {
      const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(qName)}&prop=images&imlimit=100&format=json&redirects=1`;
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'CampusConnectCrestAudit/2.0 (education verification; contact: info@campusconnect.edu)',
        },
      });
      if (!res.ok) continue;
      const data = await res.json();
      const pages = data.query?.pages || {};

      for (const pid in pages) {
        if (pid === '-1') continue;
        const images = pages[pid].images || [];
        const candidates = [];

        for (const img of images) {
          const title = img.title.replace(/^File:/i, '');
          const low = title.toLowerCase();

          if (EXCLUDE_REGEX.test(low)) continue;

          let score = 0;
          if (/coat.*arms/i.test(low)) score = 100;
          else if (/shield/i.test(low)) score = 90;
          else if (/crest/i.test(low)) score = 85;
          else if (/seal/i.test(low)) score = 75;
          else if (/emblem/i.test(low)) score = 65;
          else if (/logo/i.test(low)) score = 50;

          if (score > 0) {
            // Check relevance to university name or acronym
            const nameTokens = qName.toLowerCase().split(/\s+/).filter(w => w.length > 3);
            const acronym = (shortName || qName.split(/\s+/).map(w => w[0]).join('')).toLowerCase();
            
            let matched = 0;
            for (const tok of nameTokens) {
              if (low.includes(tok)) matched++;
            }
            if (low.includes(acronym)) matched += 2;

            if (matched > 0 || /coat.*arms|shield|crest|seal/i.test(low)) {
              score += matched * 15;
              candidates.push({ title: img.title, file: title, score });
            }
          }
        }

        candidates.sort((a, b) => b.score - a.score);
        if (candidates.length > 0) {
          return candidates[0];
        }
      }
    } catch (e) {
      // continue
    }
  }

  return null;
}

async function downloadCrestImage(fileTitle, outputSlug) {
  try {
    const fileInfoUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(fileTitle)}&prop=imageinfo&iiprop=url&iiurlwidth=500&format=json`;
    const res = await fetch(fileInfoUrl, {
      headers: {
        'User-Agent': 'CampusConnectCrestAudit/2.0 (education verification; contact: info@campusconnect.edu)',
      },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const pages = data.query?.pages || {};
    let downloadUrl = null;
    let isSvg = false;

    for (const pid in pages) {
      const info = pages[pid].imageinfo?.[0];
      if (info) {
        if (info.url?.endsWith('.svg')) {
          // If SVG, thumburl gives 500px transparent PNG, or we can use thumburl for crisp rendering
          downloadUrl = info.thumburl || info.url;
          isSvg = !info.thumburl;
        } else {
          downloadUrl = info.thumburl || info.url;
        }
      }
    }

    if (!downloadUrl) return null;

    const imgRes = await fetch(downloadUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });
    if (!imgRes.ok) return null;

    const buffer = Buffer.from(await imgRes.arrayBuffer());
    if (buffer.length < 500) return null; // Corrupted or placeholder

    const ext = isSvg ? 'svg' : 'png';
    const filename = `${outputSlug}.${ext}`;
    const targetPath = path.join(LOGOS_DIR, filename);
    fs.writeFileSync(targetPath, buffer);

    return {
      filename,
      logoUrl: `/logos/${filename}`,
      sizeBytes: buffer.length,
      sourceUrl: downloadUrl,
    };
  } catch (err) {
    return null;
  }
}

module.exports = {
  getUniversityCrestFromWiki,
  downloadCrestImage,
  LOGOS_DIR,
  sleep,
};
