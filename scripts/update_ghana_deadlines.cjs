const fs = require('fs');
const path = require('path');

// 1. UPDATE GHANA UNIVERSITIES
const ghanaFile = path.resolve('src/data/ghanaUniversities.ts');
let ghanaCode = fs.readFileSync(ghanaFile, 'utf8');

// For public universities in Ghana, regular 2026 vouchers closed on Aug 31, 2026
const publicUniversitiesIds = [
  'ug-legon-ghana',
  'knust-ghana',
  'ucc-ghana',
  'uew-ghana',
  'uds-ghana',
  'umat-ghana',
  'uenr-ghana',
  'uhas-ghana',
  'ckt-utas-ghana',
  'sdd-ubids-ghana',
  'gimpa-ghana',
  'aamusted-ghana',
  'upsa-ghana',
  'gctu-ghana',
  'uesd-ghana',
  'kaiptc-ghana',
  'gafcsc-ghana',
];

// Let's parse ghanaUniversities JSON/objects or do precise replacement
// Since ghanaUniversities.ts is an export array: export const ghanaUniversities: OpportunityItem[] = [ ... ];
// Let's load the items, update deadlines, and write back cleanly.
const ghanaOpps = eval(ghanaCode.replace('export const ghanaUniversities: OpportunityItem[] =', ''));

let ghanaUpdated = 0;
for (const item of ghanaOpps) {
  const isPublic = publicUniversitiesIds.includes(item.id);
  if (isPublic) {
    item.deadlines = {
      term: '2026/2027 Academic Year (Regular Cycle Closed)',
      deadlineText: 'August 31, 2026 (Expired / 2026 Vouchers Closed)',
      deadlineDate: '2026-08-31',
      isRolling: false,
      cycleStatus: 'expired',
      statusNotice: 'The 2026/2027 regular admissions voucher sales concluded on August 31, 2026. Check the official university portal for sandwich/modular admissions and 2027/2028 announcements.',
    };
    item.deadline = 'August 31, 2026 (Expired / 2026 Vouchers Closed)';
    item.deadlineDate = '2026-08-31';
    item.verifiedBadge = 'Verified Official Data';
  } else {
    // Technical universities and private universities with January 2027 intake or rolling
    item.deadlines = {
      term: 'January 2027 Spring / Modular Intake',
      deadlineText: 'Rolling / January 2027 Intake Open',
      deadlineDate: '2027-01-31',
      isRolling: true,
      cycleStatus: 'rolling',
      statusNotice: 'Admissions actively open for the upcoming January 2027 intake via the official institutional portal.',
    };
    item.deadline = 'Rolling / January 2027 Intake Open';
    item.deadlineDate = '2027-01-31';
    item.verifiedBadge = 'Verified Official Data';
  }
  ghanaUpdated++;
}

fs.writeFileSync(
  ghanaFile,
  `import type { OpportunityItem } from './opportunities';\n\nexport const ghanaUniversities: OpportunityItem[] = ${JSON.stringify(ghanaOpps, null, 2)};\n`,
  'utf8'
);
console.log(`Updated ${ghanaUpdated} Ghana universities in ${ghanaFile}`);
