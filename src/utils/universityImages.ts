/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { OpportunityItem } from '../data/opportunities';

// Curated library of authentic university campus architecture images
export const campusPhotoPool = [
  '/images/photo-1541339907198-e08756dedf3f.jpg',
  '/images/photo-1562774053-701939374585.jpg',
  '/images/photo-1523580494863-6f3031224c94.jpg',
  '/images/photo-1607013407627-6ee814329547.jpg',
  '/images/photo-1576267423445-b2e0074d68a4.jpg',
  '/images/photo-1588072432836-e10032774350.jpg',
  '/images/photo-1617042375876-a13e36732a04.jpg',
  '/images/photo-1627556704302-624286467c65.jpg',
  '/images/photo-1544717305-2782549b5136.jpg',
  '/images/ug_students_studying.jpg',
  '/images/ashesi_african_scholars.jpg',
  '/images/african_university_students_studying.jpg',
];

// Specific known institution mappings matching visual showcase
const specificInstitutionImages: Record<string, string> = {
  'ug-legon-ghana': '/images/ug_students_studying.jpg',
  'knust-kumasi-ghana': '/images/photo-1562774053-701939374585.jpg',
  'ashesi-university-ghana': '/images/ashesi_african_scholars.jpg',
  'ucc-capecoast-ghana': '/images/photo-1541339907198-e08756dedf3f.jpg',
  'uew-winneba-ghana': '/images/photo-1576267423445-b2e0074d68a4.jpg',
  'oxford-uk': '/images/photo-1523580494863-6f3031224c94.jpg',
  'oxford-university': '/images/photo-1523580494863-6f3031224c94.jpg',
  'university-of-oxford': '/images/photo-1523580494863-6f3031224c94.jpg',
  'toronto-canada': '/images/photo-1607013407627-6ee814329547.jpg',
  'eth-zurich': '/images/photo-1588072432836-e10032774350.jpg',
  'uct-south-africa': '/images/photo-1627556704302-624286467c65.jpg',
  'mit-usa': '/images/photo-1617042375876-a13e36732a04.jpg',
  'mcgill-canada': '/images/photo-1544717305-2782549b5136.jpg',
};

/**
 * Returns a high-resolution campus architecture image for a given institution
 */
export function getUniversityCampusImage(item?: OpportunityItem | null): string {
  if (!item) return campusPhotoPool[0];

  // 1. Direct ID match
  if (specificInstitutionImages[item.id]) {
    return specificInstitutionImages[item.id];
  }

  // 2. Name match heuristics
  const nameLower = (item.officialName || item.institution || '').toLowerCase();
  if (nameLower.includes('ghana') || nameLower.includes('legon')) {
    return '/images/ug_students_studying.jpg';
  }
  if (nameLower.includes('knust') || nameLower.includes('science and technology')) {
    return '/images/photo-1562774053-701939374585.jpg';
  }
  if (nameLower.includes('ashesi')) {
    return '/images/ashesi_african_scholars.jpg';
  }
  if (nameLower.includes('oxford')) {
    return '/images/photo-1523580494863-6f3031224c94.jpg';
  }
  if (nameLower.includes('toronto')) {
    return '/images/photo-1607013407627-6ee814329547.jpg';
  }
  if (nameLower.includes('eth') || nameLower.includes('zurich')) {
    return '/images/photo-1588072432836-e10032774350.jpg';
  }
  if (nameLower.includes('cape town') || nameLower.includes('uct')) {
    return '/images/photo-1627556704302-624286467c65.jpg';
  }
  if (nameLower.includes('mcgill')) {
    return '/images/photo-1544717305-2782549b5136.jpg';
  }

  // 3. Deterministic hash-based selection from pool for consistent photo per institution
  let hash = 0;
  for (let i = 0; i < item.id.length; i++) {
    hash = (hash << 5) - hash + item.id.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % campusPhotoPool.length;
  return campusPhotoPool[index];
}
