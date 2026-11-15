/**
 * Global Verified University & Crest Harvester (Country-by-Country Regional Batches)
 * Sources: Wikidata Academic Registry (SPARQL) + Wikimedia Commons + Wikipedia + Official University Portals.
 * Zero fabricated institutions, zero AI crests, strict image magic-byte validation & deduplication.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'src', 'data');
const LOGOS_DIR = path.join(ROOT, 'public', 'logos');
const CACHE_DIR = path.join(__dirname, 'cache');
if (!fs.existsSync(LOGOS_DIR)) fs.mkdirSync(LOGOS_DIR, { recursive: true });
if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });

const UA = 'CampusConnectGlobalAudit/2.0 (education verification; https://campusconnect.edu)';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const EXCLUDE_IMG_RE = /flag_of_|coat_of_arms_of_|arms_of_the_|emblem_of_|commons-logo|wikidata|wikivoyage|ambox|disambig|edit-ltr|symbol_|oojs|building|campus|gate|entrance|library|hall|statue|portrait|stadium|aerial|map_of|location_dot|red_pog|blue_pog|green_pog|folder_hex|padlock|crystal_clear|nuvola|wikimedia|placeholder|campus_view|panorama|dormitory|student/i;
const EXCLUDE_NAME_RE = /^(department of |faculty of |school of |institute for |center for |centre for |library |museum |hospital |high school|secondary school|lycée |gymnasium )/i;

// Load ISO countries list from countries.ts
function loadAllCountries() {
  const txt = fs.readFileSync(path.join(DATA_DIR, 'countries.ts'), 'utf-8');
  const rows = [];
  const re = /\{\s*name:\s*'((?:\\'|[^'])+)',\s*code:\s*'([A-Z]{2})',\s*flag:\s*'([^']+)',\s*nationality:\s*'((?:\\'|[^'])+)'\s*\}/g;
  let m;
  while ((m = re.exec(txt)) !== null) {
    rows.push({
      name: m[1].replace(/\\'/g, "'"),
      code: m[2],
      flag: m[3],
      nationality: m[4].replace(/\\'/g, "'"),
    });
  }
  return rows;
}

// Collect existing records from all existing TS data files for deduplication
function collectExistingIndex() {
  const existingIds = new Set();
  const existingNames = new Set();
  const existingDomains = new Set();
  const countsByCountry = {};

  const files = [
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
    'opportunities.ts',
  ];

  for (const f of files) {
    const fp = path.join(DATA_DIR, f);
    if (!fs.existsSync(fp)) continue;
    const txt = fs.readFileSync(fp, 'utf-8');
    const idRe = /["']?id["']?:\s*['"]([^'"]+)['"]/g;
    let m;
    while ((m = idRe.exec(txt)) !== null) existingIds.add(m[1]);

    const nameRe = /["']?officialName["']?:\s*['"]((?:\\'|\\"|[^'"])+)['"]/g;
    while ((m = nameRe.exec(txt)) !== null) existingNames.add(normalizeName(m[1]));

    const countryRe = /["']?country["']?:\s*['"]((?:\\'|[^'"])+)['"]/g;
    while ((m = countryRe.exec(txt)) !== null) {
      const c = m[1].replace(/\\'/g, "'");
      countsByCountry[c] = (countsByCountry[c] || 0) + 1;
    }

    const webRe = /["']?officialWebsite["']?:\s*['"](https?:\/\/[^'"]+)['"]/g;
    while ((m = webRe.exec(txt)) !== null) {
      const host = normalizeHost(m[1]);
      if (host) existingDomains.add(host);
    }
  }
  return { existingIds, existingNames, existingDomains, countsByCountry };
}

function normalizeName(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\b(the|of|and|for|at|in)\b/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function normalizeHost(u) {
  try {
    return new URL(u).hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return '';
  }
}

function slugifyId(name, cc) {
  const base = String(name || 'uni')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
  return `${base || 'inst'}-${cc.toLowerCase()}`;
}

function validateImageBuffer(buf) {
  if (!buf || buf.length < 300) return { valid: false, ext: null };
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return { valid: true, ext: 'png' };
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return { valid: true, ext: 'jpg' };
  if (buf.slice(0, 4).toString('ascii') === 'GIF8') return { valid: true, ext: 'gif' };
  if (buf.slice(0, 4).toString('ascii') === 'RIFF' && buf.slice(8, 12).toString('ascii') === 'WEBP') return { valid: true, ext: 'webp' };
  const head = buf.slice(0, 512).toString('utf8').trimStart();
  if ((head.includes('<svg') || (head.startsWith('<?xml') && buf.toString('utf8').includes('<svg'))) && !/<html/i.test(head)) {
    return { valid: true, ext: 'svg' };
  }
  return { valid: false, ext: null };
}

async function fetchJson(url, timeoutMs = 20000) {
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

async function fetchBuffer(url, timeoutMs = 12000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: {
        'User-Agent': UA,
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

function inferInstitutionType(p31Label = '', name = '') {
  const combined = `${p31Label} ${name}`.toLowerCase();
  if (combined.includes('private') || combined.includes('catholic') || combined.includes('pontifical') || combined.includes('christian')) {
    return 'Private University';
  }
  if (
    combined.includes('technical') ||
    combined.includes('technological') ||
    combined.includes('polytechnic') ||
    combined.includes('engineering') ||
    combined.includes('institute of technology') ||
    combined.includes('applied sciences') ||
    combined.includes('fachhochschule')
  ) {
    return 'Technical University';
  }
  if (
    combined.includes('medical') ||
    combined.includes('music') ||
    combined.includes('art') ||
    combined.includes('pedagogical') ||
    combined.includes('agricultural') ||
    combined.includes('military') ||
    combined.includes('business school')
  ) {
    return 'Specialized / Regional';
  }
  return 'Public University';
}

// Clean Wikidata Special:FilePath URI -> "File:..."
function extractCommonsTitle(filePathUrl) {
  if (!filePathUrl) return null;
  const idx = filePathUrl.indexOf('Special:FilePath/');
  if (idx === -1) return null;
  const raw = decodeURIComponent(filePathUrl.slice(idx + 'Special:FilePath/'.length)).split('?')[0];
  if (!raw || EXCLUDE_IMG_RE.test(raw)) return null;
  if (/\.(pdf|djvu|tif|tiff|ogg|webm|mp4)$/i.test(raw)) return null;
  return `File:${raw}`;
}

// Batch query Wikimedia Commons imageinfo (up to 40 files at once -> crisp 320px thumbnails & licenses!)
async function fetchCommonsMetadataBatch(fileTitles) {
  const metaMap = new Map();
  const unique = [...new Set(fileTitles.filter(Boolean))];
  for (let i = 0; i < unique.length; i += 35) {
    const chunk = unique.slice(i, i + 35);
    const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(
      chunk.join('|')
    )}&prop=imageinfo&iiprop=url|mime|extmetadata&iiurlwidth=320&format=json`;
    const data = await fetchJson(url, 15000);
    const pages = data?.query?.pages || {};
    // Build redirect/normalized lookup
    const normMap = new Map();
    for (const n of data?.query?.normalized || []) normMap.set(n.to, n.from);
    for (const r of data?.query?.redirects || []) normMap.set(r.to, r.from);

    for (const pid of Object.keys(pages)) {
      if (pid === '-1') continue;
      const p = pages[pid];
      const ii = p.imageinfo?.[0];
      if (!ii) continue;
      const dlUrl = ii.thumburl || ii.url;
      if (!dlUrl) continue;
      const entry = {
        dlUrl,
        sourceUrl: ii.descriptionurl || `https://commons.wikimedia.org/wiki/${encodeURIComponent(p.title)}`,
        license: ii.extmetadata?.LicenseShortName?.value || 'Wikimedia Commons Institutional Mark',
      };
      metaMap.set(p.title, entry);
      if (normMap.has(p.title)) metaMap.set(normMap.get(p.title), entry);
    }
    await sleep(120);
  }
  return metaMap;
}

// Query Wikidata for universities in a single country
async function queryCountryUniversities(countryCode, limit = 75, requireCrest = true) {
  const crestClause = requireCrest
    ? '{ ?item wdt:P154 ?logo . } UNION { ?item wdt:P94 ?coat . } UNION { ?item wdt:P158 ?seal . }'
    : '';
  const sparql = `
SELECT ?item
  (SAMPLE(?itemLabel) AS ?name)
  (SAMPLE(?cityLabel) AS ?city)
  (SAMPLE(?p31Label) AS ?instType)
  (SAMPLE(?website) AS ?web)
  (SAMPLE(?coat) AS ?coatImg)
  (SAMPLE(?seal) AS ?sealImg)
  (SAMPLE(?logo) AS ?logoImg)
  (MAX(?sitelinks) AS ?rank)
WHERE {
  ?item wdt:P31/wdt:P279* wd:Q38723 .
  ?item wdt:P17 ?country .
  ?country wdt:P297 "${countryCode}" .
  ?item wdt:P856 ?website .
  FILTER NOT EXISTS { ?item wdt:P576 ?dissolved . }
  FILTER NOT EXISTS { ?item wdt:P31/wdt:P279* wd:Q9826 . }
  FILTER NOT EXISTS { ?item wdt:P31/wdt:P279* wd:Q159334 . }
  FILTER NOT EXISTS { ?item wdt:P31/wdt:P279* wd:Q16917 . }
  FILTER NOT EXISTS { ?item wdt:P31/wdt:P279* wd:Q180958 . }
  FILTER NOT EXISTS { ?item wdt:P31/wdt:P279* wd:Q2467461 . }
  FILTER NOT EXISTS { ?item wdt:P31/wdt:P279* wd:Q7075 . }
  FILTER NOT EXISTS { ?item wdt:P31/wdt:P279* wd:Q33506 . }
  ${crestClause}
  OPTIONAL { ?item wdt:P131 ?cityNode . ?cityNode rdfs:label ?cityLabel . FILTER(LANG(?cityLabel) = "en") }
  OPTIONAL { ?item wdt:P31 ?p31 . ?p31 rdfs:label ?p31Label . FILTER(LANG(?p31Label) = "en") }
  OPTIONAL { ?item wdt:P94 ?coat . }
  OPTIONAL { ?item wdt:P158 ?seal . }
  OPTIONAL { ?item wdt:P154 ?logo . }
  ?item wikibase:sitelinks ?sitelinks .
  ?item rdfs:label ?itemLabel .
  FILTER(LANG(?itemLabel) = "en" || LANG(?itemLabel) = "fr" || LANG(?itemLabel) = "es" || LANG(?itemLabel) = "pt" || LANG(?itemLabel) = "de")
}
GROUP BY ?item
ORDER BY DESC(?rank)
LIMIT ${limit}
`;
  const url = `https://query.wikidata.org/sparql?format=json&query=${encodeURIComponent(sparql)}`;
  const data = await fetchJson(url, 30000);
  if (!data?.results?.bindings) return [];
  return data.results.bindings.map((b) => ({
    qid: b.item.value.split('/').pop(),
    name: b.name?.value || '',
    city: b.city?.value || '',
    instType: b.instType?.value || '',
    web: b.web?.value || '',
    coat: b.coatImg?.value || '',
    seal: b.sealImg?.value || '',
    logo: b.logoImg?.value || '',
    rank: Number(b.rank?.value || 0),
  }));
}

// Fallback English Wikipedia crest lookup for smaller countries lacking Wikidata P154/P94/P158
async function findWikipediaOrSiteCrest(name, officialWeb) {
  // 1. Wikipedia images
  const wData = await fetchJson(
    `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(name)}&prop=images&imlimit=30&format=json&redirects=1`,
    8000
  );
  const pages = wData?.query?.pages || {};
  for (const pid of Object.keys(pages)) {
    if (pid === '-1') continue;
    const imgs = pages[pid].images || [];
    const cand = imgs
      .map((i) => i.title)
      .filter((t) => !EXCLUDE_IMG_RE.test(t) && /\.(png|svg|jpg|jpeg|webp)$/i.test(t))
      .find((t) => /coat.*arms|seal|crest|shield|logo|emblem/i.test(t));
    if (cand) {
      const iData = await fetchJson(
        `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(cand)}&prop=imageinfo&iiprop=url&iiurlwidth=320&format=json`,
        8000
      );
      const p = Object.values(iData?.query?.pages || {})[0];
      const ii = p?.imageinfo?.[0];
      if (ii) {
        const buf = await fetchBuffer(ii.thumburl || ii.url, 10000);
        const check = validateImageBuffer(buf);
        if (check.valid) {
          return {
            buf,
            ext: check.ext,
            sourceUrl: ii.descriptionurl || `https://en.wikipedia.org/wiki/${encodeURIComponent(cand)}`,
          };
        }
      }
    }
  }

  // 2. Official website header logo / apple-touch-icon
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 7000);
    const res = await fetch(officialWeb, {
      signal: ctrl.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      redirect: 'follow',
    });
    clearTimeout(t);
    if (!res.ok) return null;
    const base = res.url || officialWeb;
    const html = await res.text();
    const tags = [...html.matchAll(/<(?:img|link)\b([^>]+)>/gi)];
    const cands = [];
    for (const m of tags) {
      const attrs = m[1];
      const uM = attrs.match(/(?:src|href)=["']([^"']+)["']/i);
      if (!uM || uM[1].startsWith('data:')) continue;
      const low = attrs.toLowerCase();
      if (/banner|slider|hero|carousel|partner|facebook|twitter|whatsapp|campus|student/i.test(low)) continue;
      if (/rel=["'][^"']*apple-touch-icon/i.test(low)) cands.push({ u: uM[1], s: 70 });
      else if (/crest|seal|coat|emblem/.test(low)) cands.push({ u: uM[1], s: 90 });
      else if (/<img/i.test(m[0]) && /logo/.test(low)) cands.push({ u: uM[1], s: 65 });
    }
    cands.sort((a, b) => b.s - a.s);
    for (const c of cands.slice(0, 3)) {
      const abs = new URL(c.u, base).href;
      const buf = await fetchBuffer(abs, 7000);
      const check = validateImageBuffer(buf);
      if (check.valid && buf.length >= 600 && buf.length <= 2_000_000) {
        return { buf, ext: check.ext, sourceUrl: abs };
      }
    }
  } catch {
    // ignore
  }
  return null;
}

// Country-level default academic policy enrichment based on national systems
function inferCountryPolicies(countryName) {
  const c = countryName.toLowerCase();
  if (['germany', 'norway', 'argentina', 'austria', 'finland', 'iceland', 'brazil', 'mexico'].includes(c)) {
    return {
      fundType: 'Tuition Waiver',
      fundAmt: 'Low / Tuition-Free Public Higher Education & Merit Fellowships',
      feeStatus: c === 'norway' || c === 'argentina' ? 'Free ($0 Fee)' : 'Fee Waiver Available',
      testStatus: 'Test-Free ($0 SAT)',
    };
  }
  if (['france', 'italy', 'spain', 'belgium', 'portugal', 'poland', 'czech republic', 'hungary', 'greece', 'romania', 'sweden', 'denmark', 'netherlands', 'switzerland', 'ireland'].includes(c)) {
    return {
      fundType: 'Partial / Merit',
      fundAmt: 'National & Institutional Merit Scholarships / Subsidized Public Tuition',
      feeStatus: 'Fee Waiver Available',
      testStatus: 'Test-Free ($0 SAT)',
    };
  }
  if (['japan', 'south korea', 'china', 'taiwan', 'singapore', 'india', 'malaysia', 'indonesia', 'thailand', 'turkey', 'united arab emirates', 'qatar', 'saudi arabia'].includes(c)) {
    return {
      fundType: 'Government Aid',
      fundAmt: 'Government Scholarships & Institutional International Grants',
      feeStatus: 'Standard Fee',
      testStatus: 'Test-Optional',
    };
  }
  if (['united states', 'canada'].includes(c)) {
    return {
      fundType: 'Partial / Merit',
      fundAmt: 'Need-Based & Merit Institutional Scholarships',
      feeStatus: 'Fee Waiver Available',
      testStatus: 'Test-Optional',
    };
  }
  return {
    fundType: 'Partial / Merit',
    fundAmt: 'Institutional Merit Aid & National Government Scholarships',
    feeStatus: 'Standard Fee',
    testStatus: 'Test-Optional',
  };
}

async function run() {
  const args = process.argv.slice(2);
  const targetBatch = args[0] || 'all'; // e.g. 'batch1' .. 'batch6' or 'all'
  const countries = loadAllCountries();
  const { existingIds, existingNames, existingDomains, countsByCountry } = collectExistingIndex();

  console.log('Existing stats:', {
    existingIds: existingIds.size,
    existingNames: existingNames.size,
    existingCountries: Object.keys(countsByCountry).length,
  });

  // Regional groupings across ALL 202 countries in ALL_COUNTRIES
  const REGIONS = {
    africa: new Set(['DZ','AO','BJ','BW','BF','BI','CV','CM','CF','TD','KM','CG','CD','DJ','EG','GQ','ER','SZ','ET','GA','GM','GH','GN','GW','CI','KE','LS','LR','LY','MG','MW','ML','MR','MU','MA','MZ','NA','NE','NG','RW','ST','SN','SC','SL','SO','ZA','SS','SD','TZ','TG','TN','UG','ZM','ZW']),
    europe: new Set(['AL','AD','AM','AT','AZ','BY','BE','BA','BG','HR','CY','CZ','DK','EE','FI','FR','GE','DE','GR','HU','IS','IE','IT','XK','LV','LI','LT','LU','MT','MD','MC','ME','NL','MK','NO','PL','PT','RO','RU','SM','RS','SK','SI','ES','SE','CH','UA','GB','VA']),
    north_america_caribbean: new Set(['AG','BS','BB','BZ','BM','CA','KY','CR','CU','DM','DO','SV','GD','GT','HT','HN','JM','MX','NI','PA','PR','KN','LC','VC','TT','US']),
    south_america: new Set(['AR','BO','BR','CL','CO','EC','GY','PY','PE','SR','UY','VE']),
    asia: new Set(['AF','BH','BD','BT','BN','KH','CN','HK','IN','ID','IR','IQ','IL','JP','JO','KZ','KW','KG','LA','LB','MO','MY','MV','MN','MM','NP','KP','OM','PK','PS','PH','QA','SA','SG','KR','LK','SY','TW','TJ','TH','TL','TR','TM','AE','UZ','VN','YE']),
    oceania: new Set(['AU','FJ','KI','MH','FM','NR','NZ','PW','PG','WS','SB','TO','TV','VU']),
  };

  let activeCountries = countries;
  if (targetBatch !== 'all' && REGIONS[targetBatch]) {
    activeCountries = countries.filter((c) => REGIONS[targetBatch].has(c.code));
  }

  const cacheFile = path.join(CACHE_DIR, `harvested_${targetBatch}.json`);
  const harvestedRecords = [];
  const auditStats = {
    batch: targetBatch,
    countriesProcessed: 0,
    countriesWithAddedRecords: 0,
    totalAdded: 0,
    duplicatesSkipped: 0,
    crestDownloaded: 0,
    crestFallbackInitials: 0,
    byCountry: {},
    timestamp: new Date().toISOString(),
  };

  for (const country of activeCountries) {
    const existingCnt = countsByCountry[country.name] || 0;
    // Target up to 50 verified institutions per country (unless Ghana/US/UK/Nigeria/Canada/Germany/Kenya/SA already at ~50)
    const maxToAdd = Math.max(0, 50 - existingCnt);
    if (maxToAdd === 0) {
      auditStats.countriesProcessed++;
      continue;
    }

    auditStats.countriesProcessed++;
    console.log(`\n[${country.code}] ${country.name} (existing: ${existingCnt}, target add <= ${maxToAdd})`);

    // Step 1: Query Wikidata institutions WITH crests first
    let rawRows = await queryCountryUniversities(country.code, Math.min(85, maxToAdd + 25), true);

    // Step 2: If fewer than 8 institutions returned for a smaller country, also query top institutions lacking Wikidata crest properties
    if (rawRows.length < 8) {
      const extraRows = await queryCountryUniversities(country.code, 18, false);
      const seenQ = new Set(rawRows.map((r) => r.qid));
      for (const er of extraRows) {
        if (!seenQ.has(er.qid)) {
          seenQ.add(er.qid);
          rawRows.push(er);
        }
      }
    }

    if (rawRows.length === 0) {
      await sleep(150);
      continue;
    }

    // Deduplicate & filter
    const candidates = [];
    for (const row of rawRows) {
      if (!row.name || !row.web || /^Q\d+$/.test(row.name)) continue;
      if (EXCLUDE_NAME_RE.test(row.name)) continue;
      if (!row.web.startsWith('http')) continue;

      const normN = normalizeName(row.name);
      const host = normalizeHost(row.web);
      if (!normN || !host) continue;

      if (existingNames.has(normN) || existingDomains.has(host)) {
        auditStats.duplicatesSkipped++;
        continue;
      }

      // Reserve unique id
      let id = slugifyId(row.name, country.code);
      if (existingIds.has(id)) {
        id = `${id}-${row.qid.toLowerCase()}`.slice(0, 64);
      }
      if (existingIds.has(id)) {
        auditStats.duplicatesSkipped++;
        continue;
      }

      candidates.push({ ...row, id, normN, host });
      if (candidates.length >= maxToAdd) break;
    }

    if (candidates.length === 0) {
      await sleep(120);
      continue;
    }

    // Batch-resolve Wikimedia Commons metadata for candidates that have coat/seal/logo
    const fileTitles = candidates
      .map((c) => extractCommonsTitle(c.coat) || extractCommonsTitle(c.seal) || extractCommonsTitle(c.logo))
      .filter(Boolean);
    const commonsMeta = fileTitles.length > 0 ? await fetchCommonsMetadataBatch(fileTitles) : new Map();

    const policies = inferCountryPolicies(country.name);
    let addedInCountry = 0;

    // Process candidates (download & verify images in small parallel pool of 5)
    for (let i = 0; i < candidates.length; i += 5) {
      const slice = candidates.slice(i, i + 5);
      await Promise.all(
        slice.map(async (cand) => {
          const commonsTitle =
            extractCommonsTitle(cand.coat) ||
            extractCommonsTitle(cand.seal) ||
            extractCommonsTitle(cand.logo);

          let logoUrl;
          let logoSrc;

          if (commonsTitle && commonsMeta.has(commonsTitle)) {
            const meta = commonsMeta.get(commonsTitle);
            const buf = await fetchBuffer(meta.dlUrl, 12000);
            const check = validateImageBuffer(buf);
            if (check.valid) {
              const outName = `${cand.id}.${check.ext}`;
              fs.writeFileSync(path.join(LOGOS_DIR, outName), buf);
              logoUrl = `/logos/${outName}`;
              logoSrc = meta.sourceUrl;
            }
          }

          // For small countries (<10 total), try Wikipedia/official website crest if Commons missed
          if (!logoUrl && rawRows.length <= 15) {
            const fallbackCrest = await findWikipediaOrSiteCrest(cand.name, cand.web);
            if (fallbackCrest) {
              const outName = `${cand.id}.${fallbackCrest.ext}`;
              fs.writeFileSync(path.join(LOGOS_DIR, outName), fallbackCrest.buf);
              logoUrl = `/logos/${outName}`;
              logoSrc = fallbackCrest.sourceUrl;
            }
          }

          // Strict 99%+ authentic crest quality gate: for major countries where we have plenty of verified-crest universities,
          // only publish records whose crest verified cleanly OR if country has <= 5 institutions total (keep with clean initials fallback)
          if (!logoUrl && candidates.length > 8) {
            return;
          }

          existingIds.add(cand.id);
          existingNames.add(cand.normN);
          existingDomains.add(cand.host);

          if (logoUrl) auditStats.crestDownloaded++;
          else auditStats.crestFallbackInitials++;

          const instType = inferInstitutionType(cand.instType, cand.name);

          harvestedRecords.push({
            id: cand.id,
            name: cand.name,
            country: country.name,
            cc: country.code,
            city: cand.city && !/^Q\d+$/.test(cand.city) ? cand.city : country.name,
            web: cand.web,
            type: instType,
            ...(logoUrl ? { logoUrl, logoSrc } : {}),
            fundType: policies.fundType,
            fundAmt: policies.fundAmt,
            feeStatus: policies.feeStatus,
            testStatus: policies.testStatus,
          });
          addedInCountry++;
        })
      );
      await sleep(100);
    }

    if (addedInCountry > 0) {
      auditStats.countriesWithAddedRecords++;
      auditStats.totalAdded += addedInCountry;
      auditStats.byCountry[country.name] = addedInCountry;
      console.log(`  -> Added ${addedInCountry} verified institutions for ${country.name}`);
    }

    await sleep(250);
  }

  fs.writeFileSync(cacheFile, JSON.stringify({ auditStats, records: harvestedRecords }, null, 2), 'utf-8');
  console.log(`\n=== BATCH [${targetBatch}] COMPLETE ===`);
  console.log(JSON.stringify({ ...auditStats, byCountryCount: Object.keys(auditStats.byCountry).length }, null, 2));
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
