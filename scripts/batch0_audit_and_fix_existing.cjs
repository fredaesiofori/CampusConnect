/**
 * Batch 0: Audit existing 455 records, validate existing crest files (magic bytes),
 * and resolve missing crests for Ghana, Nigeria, and Kenya institutions from
 * verified Wikipedia / Wikidata / Official Institutional Websites.
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'src', 'data');
const LOGOS_DIR = path.join(__dirname, '..', 'public', 'logos');
const UA = 'CampusConnectGlobalAudit/2.0 (education verification; https://campusconnect.edu)';

const TARGET_FILES = [
  'ghanaUniversities.ts',
  'usUniversities.ts',
  'ukUniversities.ts',
  'nigeriaUniversities.ts',
  'canadaUniversities.ts',
  'australiaUniversities.ts',
  'germanyUniversities.ts',
  'kenyaUniversities.ts',
  'southAfricaUniversities.ts',
  'moreGlobalUniversities.ts',
];

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function validateImageBuffer(buf, filenameHint = '') {
  if (!buf || buf.length < 250) return { valid: false, ext: null, reason: 'too-small' };
  // Check PNG: 89 50 4E 47
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
    return { valid: true, ext: 'png' };
  }
  // Check JPEG: FF D8 FF
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    return { valid: true, ext: 'jpg' };
  }
  // Check GIF: GIF8
  if (buf.slice(0, 4).toString('ascii') === 'GIF8') {
    return { valid: true, ext: 'gif' };
  }
  // Check WebP: RIFF....WEBP
  if (buf.slice(0, 4).toString('ascii') === 'RIFF' && buf.slice(8, 12).toString('ascii') === 'WEBP') {
    return { valid: true, ext: 'webp' };
  }
  // Check ICO: 00 00 01 00
  if (buf[0] === 0x00 && buf[1] === 0x00 && buf[2] === 0x01 && buf[3] === 0x00) {
    return { valid: true, ext: 'ico' };
  }
  // Check SVG
  const head = buf.slice(0, 512).toString('utf8').trimStart();
  if (head.includes('<svg') || (head.startsWith('<?xml') && buf.toString('utf8').includes('<svg'))) {
    if (head.toLowerCase().includes('<html') || head.toLowerCase().includes('<!doctype html')) {
      return { valid: false, ext: null, reason: 'html-not-svg' };
    }
    return { valid: true, ext: 'svg' };
  }
  return { valid: false, ext: null, reason: `unknown-magic:${filenameHint}` };
}

const EXCLUDE_WIKI_IMG = /flag_of_|coat_of_arms_of_(ghana|nigeria|kenya|the_united|canada|germany|australia|south_africa)|commons-logo|wikidata|ambox|disambig|edit-ltr|symbol_question|building|campus|gate|library|hall|statue|portrait|stadium|aerial|map_of|location_dot|red_pog|blue_pog|green_pog|folder_hex|padlock|semi-protection|crystal_clear|nuvola|wikimedia|placeholder/i;

async function fetchJson(url, timeoutMs = 8000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { 'User-Agent': UA, Accept: 'application/json' },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

async function fetchBuffer(url, timeoutMs = 10000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 CampusConnect/2.0',
        Accept: 'image/avif,image/webp,image/png,image/svg+xml,image/*,*/*;q=0.8',
      },
      redirect: 'follow',
    });
    if (!res.ok) return null;
    const ct = (res.headers.get('content-type') || '').toLowerCase();
    if (ct.includes('text/html')) return null;
    return Buffer.from(await res.arrayBuffer());
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

async function findWikipediaCrest(officialName, shortName, country) {
  // Search Wikipedia to resolve disambiguations like "University of Benin (Nigeria)"
  const searchQuery = `${officialName} ${country}`.trim();
  const sData = await fetchJson(
    `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchQuery)}&srlimit=3&format=json`
  );
  const titles = [officialName];
  if (sData?.query?.search) {
    for (const hit of sData.query.search) {
      if (!titles.includes(hit.title)) titles.push(hit.title);
    }
  }

  for (const title of titles) {
    const data = await fetchJson(
      `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=images|pageprops&imlimit=60&format=json&redirects=1`
    );
    const pages = data?.query?.pages || {};
    for (const pid of Object.keys(pages)) {
      if (pid === '-1') continue;
      const page = pages[pid];
      // Check Wikidata QID via pageprops first
      const qid = page.pageprops?.wikibase_item;
      if (qid) {
        const wd = await fetchJson(
          `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${qid}&props=claims&format=json`
        );
        const claims = wd?.entities?.[qid]?.claims || {};
        for (const prop of ['P94', 'P158', 'P154']) {
          const val = claims[prop]?.[0]?.mainsnak?.datavalue?.value;
          if (val && !EXCLUDE_WIKI_IMG.test(val)) {
            const infoUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent('File:' + val)}&prop=imageinfo&iiprop=url|mime|extmetadata&iiurlwidth=360&format=json`;
            const infoData = await fetchJson(infoUrl);
            const p = Object.values(infoData?.query?.pages || {})[0];
            const ii = p?.imageinfo?.[0];
            if (ii) {
              return {
                dlUrl: ii.thumburl || ii.url,
                sourceUrl: ii.descriptionurl || `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(val)}`,
                sourceType: 'wikidata-' + prop,
              };
            }
          }
        }
      }

      // Fallback: inspect Wikipedia page images (including fair-use infobox logos on enwiki)
      const images = page.images || [];
      const scored = [];
      for (const img of images) {
        const fname = img.title.replace(/^File:/i, '');
        if (EXCLUDE_WIKI_IMG.test(fname)) continue;
        if (!/\.(png|svg|jpg|jpeg|webp)$/i.test(fname)) continue;
        let score = 0;
        if (/coat.*arms/i.test(fname)) score += 100;
        else if (/seal/i.test(fname)) score += 90;
        else if (/crest/i.test(fname)) score += 85;
        else if (/shield/i.test(fname)) score += 80;
        else if (/logo/i.test(fname)) score += 60;
        else if (/emblem/i.test(fname)) score += 55;
        if (score > 0) {
          const tokens = officialName.toLowerCase().split(/\s+/).filter((w) => w.length > 3 && w !== 'university');
          for (const t of tokens) {
            if (fname.toLowerCase().includes(t)) score += 15;
          }
          if (shortName && fname.toLowerCase().includes(shortName.toLowerCase())) score += 25;
          scored.push({ title: img.title, score });
        }
      }
      scored.sort((a, b) => b.score - a.score);
      if (scored.length > 0) {
        const best = scored[0];
        const infoUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(best.title)}&prop=imageinfo&iiprop=url|mime&iiurlwidth=360&format=json`;
        const infoData = await fetchJson(infoUrl);
        const p = Object.values(infoData?.query?.pages || {})[0];
        const ii = p?.imageinfo?.[0];
        if (ii) {
          return {
            dlUrl: ii.thumburl || ii.url,
            sourceUrl: ii.descriptionurl || `https://en.wikipedia.org/wiki/${encodeURIComponent(best.title)}`,
            sourceType: 'wikipedia-image',
          };
        }
      }
    }
  }
  return null;
}

async function findOfficialWebsiteLogo(officialWebsite, officialName) {
  if (!officialWebsite || !officialWebsite.startsWith('http')) return null;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 8000);
  let html = '';
  let finalBase = officialWebsite;
  try {
    const res = await fetch(officialWebsite, {
      signal: ctrl.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      redirect: 'follow',
    });
    if (!res.ok) return null;
    finalBase = res.url || officialWebsite;
    html = await res.text();
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }

  const candidates = [];
  // 1. <img> tags whose src/alt/class mentions logo, crest, seal, emblem, brand (excluding banners/sliders/hero/partners)
  const imgTags = [...html.matchAll(/<img\b([^>]+)>/gi)];
  for (const m of imgTags) {
    const attrs = m[1];
    const srcM = attrs.match(/(?:src|data-src)=["']([^"']+)["']/i);
    if (!srcM) continue;
    const src = srcM[1];
    if (src.startsWith('data:')) continue;
    const altM = attrs.match(/alt=["']([^"']*)["']/i);
    const clsM = attrs.match(/class=["']([^"']*)["']/i);
    const combined = `${src} ${altM?.[1] || ''} ${clsM?.[1] || ''}`.toLowerCase();
    if (/banner|slider|hero|carousel|partner|sponsor|flag|whatsapp|facebook|twitter|youtube|instagram|qr|avatar|student|campus/i.test(combined)) {
      continue;
    }
    let score = 0;
    if (/crest|seal|coat|emblem/.test(combined)) score += 90;
    if (/logo/.test(combined)) score += 70;
    if (altM && officialName.split(/\s+/).some((w) => w.length > 3 && altM[1].toLowerCase().includes(w.toLowerCase()))) {
      score += 20;
    }
    if (score >= 70) {
      candidates.push({ rawUrl: src, score, sourceType: 'official-site-img' });
    }
  }

  // 2. <link rel="apple-touch-icon" ...> or large <link rel="icon" ...>
  const linkTags = [...html.matchAll(/<link\b([^>]+)>/gi)];
  for (const m of linkTags) {
    const attrs = m[1];
    const relM = attrs.match(/rel=["']([^"']+)["']/i);
    const hrefM = attrs.match(/href=["']([^"']+)["']/i);
    if (!relM || !hrefM) continue;
    const rel = relM[1].toLowerCase();
    const href = hrefM[1];
    if (href.startsWith('data:')) continue;
    if (rel.includes('apple-touch-icon')) {
      candidates.push({ rawUrl: href, score: 65, sourceType: 'official-apple-touch-icon' });
    } else if (rel.includes('icon')) {
      const sizeM = attrs.match(/sizes=["'](\d+)x\d+["']/i);
      const size = sizeM ? Number(sizeM[1]) : 32;
      if (size >= 48 || /\.svg$/i.test(href) || /\.png$/i.test(href)) {
        candidates.push({ rawUrl: href, score: size >= 96 ? 60 : 40, sourceType: 'official-icon' });
      }
    }
  }

  candidates.sort((a, b) => b.score - a.score);
  for (const cand of candidates.slice(0, 4)) {
    try {
      const absUrl = new URL(cand.rawUrl, finalBase).href;
      const buf = await fetchBuffer(absUrl, 8000);
      const check = validateImageBuffer(buf, absUrl);
      if (check.valid && buf.length >= 600 && buf.length <= 2_500_000) {
        return {
          dlUrl: absUrl,
          buf,
          ext: check.ext,
          sourceUrl: absUrl,
          sourceType: cand.sourceType,
        };
      }
    } catch {
      // try next
    }
  }
  return null;
}

async function run() {
  let totalChecked = 0;
  let validPreExisting = 0;
  let corruptedPreExisting = 0;
  let resolvedCount = 0;
  let stillMissing = [];

  for (const filename of TARGET_FILES) {
    const filePath = path.join(DATA_DIR, filename);
    if (!fs.existsSync(filePath)) continue;
    let content = fs.readFileSync(filePath, 'utf-8');

    const uniRegex = /\{\s*["']?id["']?:\s*"([^"]+)",[\s\S]*?["']?officialName["']?:\s*"([^"]+)",[\s\S]*?["']?country["']?:\s*"([^"]+)",[\s\S]*?["']?officialWebsite["']?:\s*"([^"]+)",[\s\S]*?["']?logo["']?:\s*\{([\s\S]*?)\}/g;
    let m;
    const updates = [];

    while ((m = uniRegex.exec(content)) !== null) {
      totalChecked++;
      const fullBlock = m[0];
      const id = m[1];
      const officialName = m[2];
      const country = m[3];
      const officialWebsite = m[4];
      const logoBlock = m[5];

      const shortM = fullBlock.match(/["']?shortName["']?:\s*"([^"]+)"/);
      const shortName = shortM ? shortM[1] : '';

      const logoUrlM = logoBlock.match(/["']?logoUrl["']?:\s*"([^"]+)"/);
      if (logoUrlM) {
        const localPath = path.join(__dirname, '..', 'public', logoUrlM[1]);
        if (fs.existsSync(localPath)) {
          const buf = fs.readFileSync(localPath);
          const check = validateImageBuffer(buf, localPath);
          if (check.valid) {
            validPreExisting++;
            continue;
          } else {
            corruptedPreExisting++;
            console.log(`[CORRUPTED EXISTING] ${id}: ${logoUrlM[1]} (${check.reason})`);
          }
        }
      }

      // Resolve missing or corrupted crest
      console.log(`[Resolving] ${officialName} (${country}) — ${officialWebsite}`);
      let found = await findWikipediaCrest(officialName, shortName, country);
      let imgBuf = null;
      let imgExt = null;
      let sourceUrl = null;
      let sourceType = null;

      if (found) {
        imgBuf = await fetchBuffer(found.dlUrl);
        const check = validateImageBuffer(imgBuf, found.dlUrl);
        if (check.valid) {
          imgExt = check.ext;
          sourceUrl = found.sourceUrl;
          sourceType = found.sourceType;
        } else {
          imgBuf = null;
        }
      }

      if (!imgBuf) {
        const siteRes = await findOfficialWebsiteLogo(officialWebsite, officialName);
        if (siteRes) {
          imgBuf = siteRes.buf;
          imgExt = siteRes.ext;
          sourceUrl = siteRes.sourceUrl;
          sourceType = siteRes.sourceType;
        }
      }

      if (imgBuf && imgExt) {
        const outName = `${id}.${imgExt}`;
        const outPath = path.join(LOGOS_DIR, outName);
        fs.writeFileSync(outPath, imgBuf);
        resolvedCount++;
        console.log(`  -> SAVED ${outName} (${imgBuf.length}B) via ${sourceType} (${sourceUrl})`);
        updates.push({
          id,
          logoUrl: `/logos/${outName}`,
          logoSourceUrl: sourceUrl,
        });
      } else {
        stillMissing.push({ id, officialName, country, officialWebsite });
        console.log(`  -> UNRESOLVED (keeping clean initials fallback)`);
      }

      await sleep(150);
    }

    // Apply updates safely to TS file
    for (const upd of updates) {
      const escapedId = upd.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const blockRe = new RegExp(
        `(["']?id["']?:\\s*"${escapedId}"[\\s\\S]*?["']?logo["']?:\\s*\\{)([\\s\\S]*?)(\\n\\s*\\})`
      );
      content = content.replace(blockRe, (full, p1, p2, p3) => {
        let updatedLogo = p2.trimEnd();
        if (/["']?logoUrl["']?:/.test(updatedLogo)) {
          updatedLogo = updatedLogo.replace(/["']?logoUrl["']?:\s*"[^"]+"/, `"logoUrl": "${upd.logoUrl}"`);
        } else {
          updatedLogo += `,\n      "logoUrl": "${upd.logoUrl}"`;
        }
        if (/["']?logoSourceUrl["']?:/.test(updatedLogo)) {
          updatedLogo = updatedLogo.replace(
            /["']?logoSourceUrl["']?:\s*"[^"]+"/,
            `"logoSourceUrl": "${upd.logoSourceUrl.replace(/"/g, '\\"')}"`
          );
        } else {
          updatedLogo += `,\n      "logoSourceUrl": "${upd.logoSourceUrl.replace(/"/g, '\\"')}"`;
        }
        return `${p1}${updatedLogo}${p3}`;
      });
    }

    if (updates.length > 0) {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`Updated ${filename} (+${updates.length} verified crests).`);
    }
  }

  console.log('\n=== BATCH 0 AUDIT SUMMARY ===');
  console.log({ totalChecked, validPreExisting, corruptedPreExisting, resolvedCount, stillMissingCount: stillMissing.length });
  if (stillMissing.length > 0) {
    console.log('Still missing:', stillMissing);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
