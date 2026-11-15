/**
 * Live URL Verification & Crest Resolver for Global Scholarships & Educational Pathways
 */

const fs = require('fs');
const path = require('path');

const LOGOS_DIR = path.join(__dirname, '..', 'public', 'logos');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 CampusConnectVerifier/2.0';

async function checkUrl(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 10000);
  try {
    const res = await fetch(url, {
      method: 'GET',
      signal: ctrl.signal,
      headers: { 'User-Agent': UA, Accept: 'text/html,application/xhtml+xml,*/*;q=0.8' },
      redirect: 'follow',
    });
    return { ok: res.status >= 200 && res.status < 400, status: res.status, finalUrl: res.url };
  } catch (e) {
    return { ok: false, status: 0, error: e.message };
  } finally {
    clearTimeout(t);
  }
}

module.exports = { checkUrl };

if (require.main === module) {
  const urls = [
    ['chevening-uk', 'https://www.chevening.org/scholarships/'],
    ['commonwealth-csc-uk', 'https://cscuk.fcdo.gov.uk/about-us/scholarships/'],
    ['gates-cambridge-uk', 'https://www.gatescambridge.org/'],
    ['clarendon-oxford-uk', 'https://www.ox.ac.uk/clarendon'],
    ['rhodes-oxford-uk', 'https://www.rhodeshouse.ox.ac.uk/'],
    ['daad-epos-germany', 'https://www.daad.de/en/'],
    ['erasmus-mundus-eu', 'https://www.eacea.ec.europa.eu/scholarships/erasmus-mundus-catalogue_en'],
    ['eiffel-excellence-france', 'https://www.campusfrance.org/en/eiffel-scholarship-program-of-excellence'],
    ['emile-boutmy-sciencespo', 'https://www.sciencespo.fr/students/en/fees-funding/bursaries-financial-aid/emile-boutmy-scholarship/'],
    ['swiss-excellence-eskas', 'https://www.sbfi.admin.ch/sbfi/en/home/education/scholarships-and-grants/swiss-government-excellence-scholarships.html'],
    ['eth-zurich-esop', 'https://ethz.ch/students/en/studies/financial/scholarships/excellencescholarship.html'],
    ['swedish-institute-si', 'https://si.se/en/apply/scholarships/swedish-institute-scholarships-for-global-professionals/'],
    ['tu-delft-vaneffen', 'https://www.tudelft.nl/en/education/practical-matters/scholarships/justus-louise-van-effen-excellence-scholarships'],
    ['nl-scholarship-netherlands', 'https://www.studyinnl.org/finances/nl-scholarship'],
    ['vlir-uos-belgium', 'https://www.vliruos.be/en/scholarships'],
    ['stipendium-hungaricum', 'https://stipendiumhungaricum.hu/'],
    ['ireland-goi-ies', 'https://hea.ie/policy/internationalisation/goi-ies/'],
    ['finland-scholarship', 'https://www.studyinfinland.fi/scholarships'],
    ['rotary-peace-fellowship', 'https://www.rotary.org/en/our-programs/peace-fellowships'],
    ['fulbright-foreign-student', 'https://foreign.fulbrightonline.org/'],
    ['knight-hennessy-stanford', 'https://knight-hennessy.stanford.edu/'],
    ['aauw-international', 'https://www.aauw.org/resources/programs/fellowships-grants/current-opportunities/international/'],
    ['berea-college-tuition', 'https://www.berea.edu/admissions/international-admissions/'],
    ['lester-b-pearson-toronto', 'https://future.utoronto.ca/pearson/'],
    ['vanier-cgs-canada', 'https://vanier.gc.ca/en/home-accueil.html'],
    ['amexcid-mexico', 'https://www.gob.mx/amexcid/acciones-y-programas/becas-para-extranjeros-29785'],
    ['mext-japan', 'https://www.studyinjapan.go.jp/en/planning/scholarship/'],
    ['adb-jsp-asia', 'https://www.adb.org/work-with-us/careers/japan-scholarship-program'],
    ['gks-korea', 'https://www.studyinkorea.go.kr/ko/plan/scholarship.do'],
    ['kaist-intl-korea', 'https://admission.kaist.ac.kr/intl-undergraduate/support/scholarships'],
    ['csc-china', 'https://www.campuschina.org/'],
    ['schwarzman-scholars', 'https://www.schwarzmanscholars.org/'],
    ['singa-singapore', 'https://www.a-star.edu.sg/Scholarships/for-graduate-studies/singapore-international-graduate-award-singa'],
    ['hkpfs-hongkong', 'https://cerg1.ugc.edu.hk/hkpfs/index.html'],
    ['turkiye-burslari', 'https://www.turkiyeburslari.gov.tr/'],
    ['mbzuai-uae', 'https://mbzuai.ac.ae/study/admissions/'],
    ['kaust-fellowship', 'https://admissions.kaust.edu.sa/fellowship'],
    ['australia-awards', 'https://www.dfat.gov.au/people-to-people/australia-awards/australia-awards-scholarships'],
    ['melbourne-grad-research', 'https://scholarships.unimelb.edu.au/awards/graduate-research-scholarships'],
    ['manaaki-nz', 'https://www.nzscholarships.govt.nz/'],
    ['mandela-rhodes-sa', 'https://www.mandelarhodes.org/scholarship/'],
    ['beit-trust-scholarship', 'https://beittrust.org.uk/beit-trust-scholarships/'],
    ['jj-wbgsp-worldbank', 'https://www.worldbank.org/en/programs/scholarships'],
    ['akdn-isl-scholarship', 'https://www.akdn.org/our-agencies/aga-khan-foundation/international-scholarship-programme'],
    ['ashinaga-africa', 'https://en.ashinaga.org/apply/'],
  ];

  (async () => {
    const results = [];
    for (let i = 0; i < urls.length; i += 8) {
      const chunk = urls.slice(i, i + 8);
      const batchRes = await Promise.all(
        chunk.map(async ([id, u]) => ({ id, url: u, ...(await checkUrl(u)) }))
      );
      results.push(...batchRes);
    }
    const okCount = results.filter((r) => r.ok).length;
    console.log(`Checked ${results.length} scholarship URLs: ${okCount} OK`);
    console.log('Non-2xx/3xx:', results.filter((r) => !r.ok));
  })();
}
