/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { OpportunityItem } from '../data/opportunities';

/**
 * Registry of verified institutional campus photographs stored locally under /public/campuses.
 * Every entry maps an existing verified OpportunityItem.id to an authentic architectural
 * photograph of that exact institution's campus. No generic or unrelated stock images are used.
 */
export const VERIFIED_CAMPUS_PHOTO_BY_ID: Record<string, string> = {
  // Ghana
  'ug-legon-ghana': '/campuses/ug-legon-ghana.jpg',
  'knust-ghana': '/campuses/knust-ghana.jpg',
  'ashesi-ghana': '/campuses/ashesi-ghana.jpg',
  'uew-ghana': '/campuses/uew-ghana.jpg',

  // United States
  'harvard-university-usa': '/campuses/harvard-university-usa.jpg',
  'stanford-university-usa': '/campuses/stanford-university-usa.jpg',
  'mit-usa': '/campuses/mit-usa.jpg',
  'yale-university-usa': '/campuses/yale-university-usa.jpg',
  'columbia-university-usa': '/campuses/columbia-university-usa.jpg',
  'uc-berkeley-usa': '/campuses/uc-berkeley-usa.jpg',

  // United Kingdom
  'oxford-rhodes-uk': '/campuses/oxford-rhodes-uk.jpg',
  'cambridge-gates-uk': '/campuses/cambridge-gates-uk.jpg',
  'imperial-college-london-uk': '/campuses/imperial-college-london-uk.jpg',
  'ucl-uk': '/campuses/ucl-uk.jpg',
  'lse-uk': '/campuses/lse-uk.jpg',

  // Canada
  'mcgill-university-canada': '/campuses/mcgill-university-canada.jpg',
  'utoronto-pearson-canada': '/campuses/utoronto-pearson-canada.jpg',
  'ubc-canada': '/campuses/ubc-canada.jpg',
  'ualberta-canada': '/campuses/ualberta-canada.jpg',
  'waterloo-canada': '/campuses/waterloo-canada.jpg',
  'mcmaster-university-canada': '/campuses/mcmaster-university-canada.jpg',

  // Germany
  'tum-germany-daad': '/campuses/tum-germany-daad.jpg',
  'lmu-munich-germany': '/campuses/lmu-munich-germany.jpg',
  'heidelberg-university-germany': '/campuses/heidelberg-university-germany.jpg',
  'humboldt-berlin-germany': '/campuses/humboldt-berlin-germany.jpg',
  'rwth-aachen-germany': '/campuses/rwth-aachen-germany.jpg',

  // Australia
  'unimelb-australia': '/campuses/unimelb-australia.jpg',
  'anu-australia': '/campuses/anu-australia.jpg',
  'usyd-australia': '/campuses/usyd-australia.jpg',
  'unsw-australia': '/campuses/unsw-australia.jpg',
  'uq-australia': '/campuses/uq-australia.jpg',

  // South Africa
  'uct-south-africa': '/campuses/uct-south-africa.jpg',
  'wits-south-africa': '/campuses/wits-south-africa.jpg',
  'stellenbosch-south-africa': '/campuses/stellenbosch-south-africa.jpg',
  'up-south-africa': '/campuses/up-south-africa.jpg',

  // Nigeria
  'unilag-nigeria': '/campuses/unilag-nigeria.jpg',
  'oau-nigeria': '/campuses/oau-nigeria.jpg',
  'unibadan-nigeria': '/campuses/unibadan-nigeria.jpg',
  'abu-zaria-nigeria': '/campuses/abu-zaria-nigeria.jpg',
  'unn-nigeria': '/campuses/unn-nigeria.jpg',

  // Kenya
  'uon-kenya': '/campuses/uon-kenya.jpg',
  'strathmore-kenya': '/campuses/strathmore-kenya.jpg',
  'jkuat-kenya': '/campuses/jkuat-kenya.jpg',

  // India & Rwanda
  'iisc-bangalore-india': '/campuses/iisc-bangalore-india.jpg',
  'iit-bombay-india': '/campuses/iit-bombay-india.jpg',
  'univ-rwanda': '/campuses/univ-rwanda.jpg',

  // Global Flagship Countries
  'eth-zurich-switzerland': '/campuses/eth-zurich-switzerland.jpg',
  'u-tokyo-japan': '/campuses/u-tokyo-japan.jpg',
  'tu-delft-netherlands': '/campuses/tu-delft-netherlands.jpg',
  'sciences-po-france': '/campuses/sciences-po-france.jpg',
  'nus-singapore': '/campuses/nus-singapore.jpg',
  'tsinghua-university-china': '/campuses/tsinghua-university-china.jpg',
  'kaist-south-korea': '/campuses/kaist-south-korea.jpg',
  'nyu-abu-dhabi-uae': '/campuses/nyu-abu-dhabi-uae.jpg',
  'georgetown-university-qatar': '/campuses/georgetown-university-qatar.jpg',
  'karolinska-institutet-sweden': '/campuses/karolinska-institutet-sweden.jpg',
  'trinity-college-dublin-ireland': '/campuses/trinity-college-dublin-ireland.jpg',
  'politecnico-di-milano-italy': '/campuses/politecnico-di-milano-italy.jpg',
  'university-of-auckland-new-zealand': '/campuses/university-of-auckland-new-zealand.jpg',
  'american-university-in-cairo-egypt': '/campuses/american-university-in-cairo-egypt.jpg',
  'ku-leuven-belgium': '/campuses/ku-leuven-belgium.jpg',
  'university-of-hong-kong-hku': '/campuses/university-of-hong-kong-hku.jpg',
  'tecnologico-de-monterrey-mexico': '/campuses/tecnologico-de-monterrey-mexico.jpg',
  'koc-university-turkey': '/campuses/koc-university-turkey.jpg',
  'universidad-de-buenos-aires-argentina': '/campuses/universidad-de-buenos-aires-argentina.jpg',
};

/**
 * Returns the authentic local campus photograph URL for a verified university if one exists,
 * or null when no verified campus photograph is registered for that institution.
 */
export function getVerifiedCampusPhotoUrl(
  item: OpportunityItem | null | undefined
): string | null {
  if (!item || !item.isVerified) return null;
  return VERIFIED_CAMPUS_PHOTO_BY_ID[item.id] || null;
}
