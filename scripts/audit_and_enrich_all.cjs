/**
 * Comprehensive Audit and Crest Enrichment Script
 * Audits all universities across Campus Connect database.
 */

const fs = require('fs');
const path = require('path');
const { getUniversityCrestFromWiki, downloadCrestImage, sleep } = require('./enrich_crests.cjs');

const DATA_DIR = path.join(__dirname, '..', 'src', 'data');
const targetFiles = [
  'canadaUniversities.ts',
  'australiaUniversities.ts',
  'germanyUniversities.ts',
  'southAfricaUniversities.ts',
  'nigeriaUniversities.ts',
  'kenyaUniversities.ts',
  'moreGlobalUniversities.ts',
];

const auditResults = {
  totalAudited: 0,
  preExistingCrests: 0,
  newlyEnrichedCrests: 0,
  unverifiedInitialsFallback: 0,
  byCountry: {},
  unverifiedList: [],
  enrichedList: [],
};

async function processFile(filename) {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) return;

  console.log(`\n==================================================`);
  console.log(`Auditing & Enriching: ${filename}`);
  console.log(`==================================================`);

  let fileContent = fs.readFileSync(filePath, 'utf-8');

  // Support both quoted and unquoted property keys (e.g. id: "..." or "id": "...")
  const uniRegex = /\{\s*["']?id["']?:\s*"([^"]+)",[\s\S]*?["']?officialName["']?:\s*"([^"]+)",[\s\S]*?["']?logo["']?:\s*\{([\s\S]*?)\}/g;

  let match;
  const updates = [];

  while ((match = uniRegex.exec(fileContent)) !== null) {
    const fullMatch = match[0];
    const id = match[1];
    const officialName = match[2];
    const logoBlock = match[3];

    auditResults.totalAudited++;

    // Check if already has a valid logoUrl
    const existingLogoMatch = logoBlock.match(/["']?logoUrl["']?:\s*"([^"]+)"/);
    if (existingLogoMatch) {
      const existingUrl = existingLogoMatch[1];
      const localFile = path.join(__dirname, '..', 'public', existingUrl);
      if (fs.existsSync(localFile)) {
        auditResults.preExistingCrests++;
        continue;
      }
    }

    // Needs crest discovery
    console.log(`[Searching] ${officialName} (${id})...`);
    
    // Short name if present
    const shortNameMatch = fullMatch.match(/["']?shortName["']?:\s*"([^"]+)"/);
    const shortName = shortNameMatch ? shortNameMatch[1] : '';

    const crestCandidate = await getUniversityCrestFromWiki(officialName, shortName);

    if (crestCandidate) {
      console.log(`  -> Candidate: ${crestCandidate.file} (score: ${crestCandidate.score})`);
      const downloadResult = await downloadCrestImage(crestCandidate.title, id);
      if (downloadResult) {
        console.log(`  -> Verified & Downloaded: ${downloadResult.filename} (${downloadResult.sizeBytes} bytes)`);
        auditResults.newlyEnrichedCrests++;
        auditResults.enrichedList.push({
          id,
          officialName,
          filename: downloadResult.filename,
          source: downloadResult.sourceUrl,
        });

        updates.push({
          id,
          newLogoUrl: downloadResult.logoUrl,
        });
      } else {
        console.log(`  -> Download failed or invalid image.`);
        auditResults.unverifiedInitialsFallback++;
        auditResults.unverifiedList.push({ id, officialName, reason: 'Image download failed' });
      }
    } else {
      console.log(`  -> No official emblem found on authoritative register.`);
      auditResults.unverifiedInitialsFallback++;
      auditResults.unverifiedList.push({ id, officialName, reason: 'No authentic crest verified' });
    }

    await sleep(200); // Respect Wikipedia rate limits
  }

  // Apply updates safely keyed by ID
  for (const upd of updates) {
    const regex = new RegExp(`(["']?id["']?:\\s*"${upd.id}"[\\s\\S]*?["']?logo["']?:\\s*\\{)([\\s\\S]*?)(\\n\\s*\\})`);
    fileContent = fileContent.replace(regex, (m, p1, p2, p3) => {
      let updatedLogo = p2.trimEnd();
      if (/["']?logoUrl["']?:/.test(updatedLogo)) {
        updatedLogo = updatedLogo.replace(/["']?logoUrl["']?:\s*"[^"]+"/, `"logoUrl": "${upd.newLogoUrl}"`);
      } else {
        updatedLogo = updatedLogo + `,\n      "logoUrl": "${upd.newLogoUrl}"`;
      }
      return `${p1}${updatedLogo}${p3}`;
    });
  }

  fs.writeFileSync(filePath, fileContent, 'utf-8');
  console.log(`Updated ${filename} with ${updates.length} new authentic crests.`);
}

async function run() {
  console.log('Starting Phase 2 Worldwide Campus Connect Crest Audit & Enrichment...');
  for (const f of targetFiles) {
    await processFile(f);
  }

  console.log('\n==================================================');
  console.log('PHASE 2 AUDIT & ENRICHMENT COMPLETE');
  console.log('==================================================');
  console.log(`Total Universities Audited (Phase 2): ${auditResults.totalAudited}`);
  console.log(`Pre-existing Valid Crests: ${auditResults.preExistingCrests}`);
  console.log(`Newly Enriched Authentic Crests: ${auditResults.newlyEnrichedCrests}`);
  console.log(`Preserved Monogram Fallbacks: ${auditResults.unverifiedInitialsFallback}`);

  fs.writeFileSync(
    path.join(__dirname, 'audit_report_phase2.json'),
    JSON.stringify(auditResults, null, 2),
    'utf-8'
  );
  console.log('Phase 2 audit report saved to scripts/audit_report_phase2.json');
}

run().catch((err) => {
  console.error('Fatal error during audit:', err);
  process.exit(1);
});
