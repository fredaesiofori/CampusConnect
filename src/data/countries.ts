/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Country {
  name: string;
  code: string;
  flag: string;
  nationality: string;
}

// Complete, comprehensive, deduplicated global countries directory (ISO 3166-1)
export const ALL_COUNTRIES: Country[] = [
  { name: 'Afghanistan', code: 'AF', flag: '🇦🇫', nationality: 'Afghan' },
  { name: 'Albania', code: 'AL', flag: '🇦🇱', nationality: 'Albanian' },
  { name: 'Algeria', code: 'DZ', flag: '🇩🇿', nationality: 'Algerian' },
  { name: 'Andorra', code: 'AD', flag: '🇦🇩', nationality: 'Andorran' },
  { name: 'Angola', code: 'AO', flag: '🇦🇴', nationality: 'Angolan' },
  { name: 'Antigua and Barbuda', code: 'AG', flag: '🇦🇬', nationality: 'Antiguan and Barbudan' },
  { name: 'Argentina', code: 'AR', flag: '🇦🇷', nationality: 'Argentine' },
  { name: 'Armenia', code: 'AM', flag: '🇦🇲', nationality: 'Armenian' },
  { name: 'Australia', code: 'AU', flag: '🇦🇺', nationality: 'Australian' },
  { name: 'Austria', code: 'AT', flag: '🇦🇹', nationality: 'Austrian' },
  { name: 'Azerbaijan', code: 'AZ', flag: '🇦🇿', nationality: 'Azerbaijani' },
  { name: 'Bahamas', code: 'BS', flag: '🇧🇸', nationality: 'Bahamian' },
  { name: 'Bahrain', code: 'BH', flag: '🇧🇭', nationality: 'Bahraini' },
  { name: 'Bangladesh', code: 'BD', flag: '🇧🇩', nationality: 'Bangladeshi' },
  { name: 'Barbados', code: 'BB', flag: '🇧🇧', nationality: 'Barbadian' },
  { name: 'Belarus', code: 'BY', flag: '🇧🇾', nationality: 'Belarusian' },
  { name: 'Belgium', code: 'BE', flag: '🇧🇪', nationality: 'Belgian' },
  { name: 'Belize', code: 'BZ', flag: '🇧🇿', nationality: 'Belizean' },
  { name: 'Benin', code: 'BJ', flag: '🇧🇯', nationality: 'Beninese' },
  { name: 'Bermuda', code: 'BM', flag: '🇧🇲', nationality: 'Bermudian' },
  { name: 'Bhutan', code: 'BT', flag: '🇧🇹', nationality: 'Bhutanese' },
  { name: 'Bolivia', code: 'BO', flag: '🇧🇴', nationality: 'Bolivian' },
  { name: 'Bosnia and Herzegovina', code: 'BA', flag: '🇧🇦', nationality: 'Bosnian and Herzegovinian' },
  { name: 'Botswana', code: 'BW', flag: '🇧🇼', nationality: 'Motswana' },
  { name: 'Brazil', code: 'BR', flag: '🇧🇷', nationality: 'Brazilian' },
  { name: 'Brunei', code: 'BN', flag: '🇧🇳', nationality: 'Bruneian' },
  { name: 'Bulgaria', code: 'BG', flag: '🇧🇬', nationality: 'Bulgarian' },
  { name: 'Burkina Faso', code: 'BF', flag: '🇧🇫', nationality: 'Burkinabe' },
  { name: 'Burundi', code: 'BI', flag: '🇧🇮', nationality: 'Burundian' },
  { name: 'Cabo Verde', code: 'CV', flag: '🇨🇻', nationality: 'Cabo Verdean' },
  { name: 'Cambodia', code: 'KH', flag: '🇰🇭', nationality: 'Cambodian' },
  { name: 'Cameroon', code: 'CM', flag: '🇨🇲', nationality: 'Cameroonian' },
  { name: 'Canada', code: 'CA', flag: '🇨🇦', nationality: 'Canadian' },
  { name: 'Cayman Islands', code: 'KY', flag: '🇰🇾', nationality: 'Caymanian' },
  { name: 'Central African Republic', code: 'CF', flag: '🇨🇫', nationality: 'Central African' },
  { name: 'Chad', code: 'TD', flag: '🇹🇩', nationality: 'Chadian' },
  { name: 'Chile', code: 'CL', flag: '🇨🇱', nationality: 'Chilean' },
  { name: 'China', code: 'CN', flag: '🇨🇳', nationality: 'Chinese' },
  { name: 'Colombia', code: 'CO', flag: '🇨🇴', nationality: 'Colombian' },
  { name: 'Comoros', code: 'KM', flag: '🇰🇲', nationality: 'Comorian' },
  { name: 'Congo (Brazzaville)', code: 'CG', flag: '🇨🇬', nationality: 'Congolese (Brazzaville)' },
  { name: 'Congo (DRC)', code: 'CD', flag: '🇨🇩', nationality: 'Congolese (DRC)' },
  { name: 'Costa Rica', code: 'CR', flag: '🇨🇷', nationality: 'Costa Rican' },
  { name: 'Croatia', code: 'HR', flag: '🇭🇷', nationality: 'Croatian' },
  { name: 'Cuba', code: 'CU', flag: '🇨🇺', nationality: 'Cuban' },
  { name: 'Cyprus', code: 'CY', flag: '🇨🇾', nationality: 'Cypriot' },
  { name: 'Czech Republic', code: 'CZ', flag: '🇨🇿', nationality: 'Czech' },
  { name: 'Denmark', code: 'DK', flag: '🇩🇰', nationality: 'Danish' },
  { name: 'Djibouti', code: 'DJ', flag: '🇩🇯', nationality: 'Djiboutian' },
  { name: 'Dominica', code: 'DM', flag: '🇩🇲', nationality: 'Dominican' },
  { name: 'Dominican Republic', code: 'DO', flag: '🇩🇴', nationality: 'Dominican' },
  { name: 'Ecuador', code: 'EC', flag: '🇪🇨', nationality: 'Ecuadorian' },
  { name: 'Egypt', code: 'EG', flag: '🇪🇬', nationality: 'Egyptian' },
  { name: 'El Salvador', code: 'SV', flag: '🇸🇻', nationality: 'Salvadoran' },
  { name: 'Equatorial Guinea', code: 'GQ', flag: '🇬🇶', nationality: 'Equatorial Guinean' },
  { name: 'Eritrea', code: 'ER', flag: '🇪🇷', nationality: 'Eritrean' },
  { name: 'Estonia', code: 'EE', flag: '🇪🇪', nationality: 'Estonian' },
  { name: 'Eswatini', code: 'SZ', flag: '🇸🇿', nationality: 'Eswatini' },
  { name: 'Ethiopia', code: 'ET', flag: '🇪🇹', nationality: 'Ethiopian' },
  { name: 'Fiji', code: 'FJ', flag: '🇫🇯', nationality: 'Fijian' },
  { name: 'Finland', code: 'FI', flag: '🇫🇮', nationality: 'Finnish' },
  { name: 'France', code: 'FR', flag: '🇫🇷', nationality: 'French' },
  { name: 'Gabon', code: 'GA', flag: '🇬🇦', nationality: 'Gabonese' },
  { name: 'Gambia', code: 'GM', flag: '🇬🇲', nationality: 'Gambian' },
  { name: 'Georgia', code: 'GE', flag: '🇬🇪', nationality: 'Georgian' },
  { name: 'Germany', code: 'DE', flag: '🇩🇪', nationality: 'German' },
  { name: 'Ghana', code: 'GH', flag: '🇬🇭', nationality: 'Ghanaian' },
  { name: 'Greece', code: 'GR', flag: '🇬🇷', nationality: 'Greek' },
  { name: 'Grenada', code: 'GD', flag: '🇬🇩', nationality: 'Grenadian' },
  { name: 'Guatemala', code: 'GT', flag: '🇬🇹', nationality: 'Guatemalan' },
  { name: 'Guinea', code: 'GN', flag: '🇬🇳', nationality: 'Guinean' },
  { name: 'Guinea-Bissau', code: 'GW', flag: '🇬🇼', nationality: 'Bissau-Guinean' },
  { name: 'Guyana', code: 'GY', flag: '🇬🇾', nationality: 'Guyanese' },
  { name: 'Haiti', code: 'HT', flag: '🇭🇹', nationality: 'Haitian' },
  { name: 'Honduras', code: 'HN', flag: '🇭🇳', nationality: 'Honduran' },
  { name: 'Hong Kong', code: 'HK', flag: '🇭🇰', nationality: 'Hong Konger' },
  { name: 'Hungary', code: 'HU', flag: '🇭🇺', nationality: 'Hungarian' },
  { name: 'Iceland', code: 'IS', flag: '🇮🇸', nationality: 'Icelandic' },
  { name: 'India', code: 'IN', flag: '🇮🇳', nationality: 'Indian' },
  { name: 'Indonesia', code: 'ID', flag: '🇮🇩', nationality: 'Indonesian' },
  { name: 'Iran', code: 'IR', flag: '🇮🇷', nationality: 'Iranian' },
  { name: 'Iraq', code: 'IQ', flag: '🇮🇶', nationality: 'Iraqi' },
  { name: 'Ireland', code: 'IE', flag: '🇮🇪', nationality: 'Irish' },
  { name: 'Israel', code: 'IL', flag: '🇮🇱', nationality: 'Israeli' },
  { name: 'Italy', code: 'IT', flag: '🇮🇹', nationality: 'Italian' },
  { name: 'Ivory Coast (Côte d\'Ivoire)', code: 'CI', flag: '🇨🇮', nationality: 'Ivorian' },
  { name: 'Jamaica', code: 'JM', flag: '🇯🇲', nationality: 'Jamaican' },
  { name: 'Japan', code: 'JP', flag: '🇯🇵', nationality: 'Japanese' },
  { name: 'Jordan', code: 'JO', flag: '🇯🇴', nationality: 'Jordanian' },
  { name: 'Kazakhstan', code: 'KZ', flag: '🇰🇿', nationality: 'Kazakhstani' },
  { name: 'Kenya', code: 'KE', flag: '🇰🇪', nationality: 'Kenyan' },
  { name: 'Kiribati', code: 'KI', flag: '🇰🇮', nationality: 'I-Kiribati' },
  { name: 'Kosovo', code: 'XK', flag: '🇽🇰', nationality: 'Kosovar' },
  { name: 'Kuwait', code: 'KW', flag: '🇰🇼', nationality: 'Kuwaiti' },
  { name: 'Kyrgyzstan', code: 'KG', flag: '🇰🇬', nationality: 'Kyrgyz' },
  { name: 'Laos', code: 'LA', flag: '🇱🇦', nationality: 'Laotian' },
  { name: 'Latvia', code: 'LV', flag: '🇱🇻', nationality: 'Latvian' },
  { name: 'Lebanon', code: 'LB', flag: '🇱🇧', nationality: 'Lebanese' },
  { name: 'Lesotho', code: 'LS', flag: '🇱🇸', nationality: 'Basotho' },
  { name: 'Liberia', code: 'LR', flag: '🇱🇷', nationality: 'Liberian' },
  { name: 'Libya', code: 'LY', flag: '🇱🇾', nationality: 'Libyan' },
  { name: 'Liechtenstein', code: 'LI', flag: '🇱🇮', nationality: 'Liechtensteiner' },
  { name: 'Lithuania', code: 'LT', flag: '🇱🇹', nationality: 'Lithuanian' },
  { name: 'Luxembourg', code: 'LU', flag: '🇱🇺', nationality: 'Luxembourgish' },
  { name: 'Macao', code: 'MO', flag: '🇲🇴', nationality: 'Macanese' },
  { name: 'Madagascar', code: 'MG', flag: '🇲🇬', nationality: 'Malagasy' },
  { name: 'Malawi', code: 'MW', flag: '🇲🇼', nationality: 'Malawian' },
  { name: 'Malaysia', code: 'MY', flag: '🇲🇾', nationality: 'Malaysian' },
  { name: 'Maldives', code: 'MV', flag: '🇲🇻', nationality: 'Maldivian' },
  { name: 'Mali', code: 'ML', flag: '🇲🇱', nationality: 'Malian' },
  { name: 'Malta', code: 'MT', flag: '🇲🇹', nationality: 'Maltese' },
  { name: 'Marshall Islands', code: 'MH', flag: '🇲🇭', nationality: 'Marshallese' },
  { name: 'Mauritania', code: 'MR', flag: '🇲🇷', nationality: 'Mauritanian' },
  { name: 'Mauritius', code: 'MU', flag: '🇲🇺', nationality: 'Mauritian' },
  { name: 'Mexico', code: 'MX', flag: '🇲🇽', nationality: 'Mexican' },
  { name: 'Micronesia', code: 'FM', flag: '🇫🇲', nationality: 'Micronesian' },
  { name: 'Moldova', code: 'MD', flag: '🇲🇩', nationality: 'Moldovan' },
  { name: 'Monaco', code: 'MC', flag: '🇲🇨', nationality: 'Monegasque' },
  { name: 'Mongolia', code: 'MN', flag: '🇲🇳', nationality: 'Mongolian' },
  { name: 'Montenegro', code: 'ME', flag: '🇲🇪', nationality: 'Montenegrin' },
  { name: 'Morocco', code: 'MA', flag: '🇲🇦', nationality: 'Moroccan' },
  { name: 'Mozambique', code: 'MZ', flag: '🇲🇿', nationality: 'Mozambican' },
  { name: 'Myanmar', code: 'MM', flag: '🇲🇲', nationality: 'Burmese' },
  { name: 'Namibia', code: 'NA', flag: '🇳🇦', nationality: 'Namibian' },
  { name: 'Nauru', code: 'NR', flag: '🇳🇷', nationality: 'Nauruan' },
  { name: 'Nepal', code: 'NP', flag: '🇳🇵', nationality: 'Nepali' },
  { name: 'Netherlands', code: 'NL', flag: '🇳🇱', nationality: 'Dutch' },
  { name: 'New Zealand', code: 'NZ', flag: '🇳🇿', nationality: 'New Zealander' },
  { name: 'Nicaragua', code: 'NI', flag: '🇳🇮', nationality: 'Nicaraguan' },
  { name: 'Niger', code: 'NE', flag: '🇳🇪', nationality: 'Nigerien' },
  { name: 'Nigeria', code: 'NG', flag: '🇳🇬', nationality: 'Nigerian' },
  { name: 'North Korea', code: 'KP', flag: '🇰🇵', nationality: 'North Korean' },
  { name: 'North Macedonia', code: 'MK', flag: '🇲🇰', nationality: 'Macedonian' },
  { name: 'Norway', code: 'NO', flag: '🇳🇴', nationality: 'Norwegian' },
  { name: 'Oman', code: 'OM', flag: '🇴🇲', nationality: 'Omani' },
  { name: 'Pakistan', code: 'PK', flag: '🇵🇰', nationality: 'Pakistani' },
  { name: 'Palau', code: 'PW', flag: '🇵🇼', nationality: 'Palauan' },
  { name: 'Palestine', code: 'PS', flag: '🇵🇸', nationality: 'Palestinian' },
  { name: 'Panama', code: 'PA', flag: '🇵🇦', nationality: 'Panamanian' },
  { name: 'Papua New Guinea', code: 'PG', flag: '🇵🇬', nationality: 'Papua New Guinean' },
  { name: 'Paraguay', code: 'PY', flag: '🇵🇾', nationality: 'Paraguayan' },
  { name: 'Peru', code: 'PE', flag: '🇵🇪', nationality: 'Peruvian' },
  { name: 'Philippines', code: 'PH', flag: '🇵🇭', nationality: 'Filipino' },
  { name: 'Poland', code: 'PL', flag: '🇵🇱', nationality: 'Polish' },
  { name: 'Portugal', code: 'PT', flag: '🇵🇹', nationality: 'Portuguese' },
  { name: 'Puerto Rico', code: 'PR', flag: '🇵🇷', nationality: 'Puerto Rican' },
  { name: 'Qatar', code: 'QA', flag: '🇶🇦', nationality: 'Qatari' },
  { name: 'Romania', code: 'RO', flag: '🇷🇴', nationality: 'Romanian' },
  { name: 'Russia', code: 'RU', flag: '🇷🇺', nationality: 'Russian' },
  { name: 'Rwanda', code: 'RW', flag: '🇷🇼', nationality: 'Rwandan' },
  { name: 'Saint Kitts and Nevis', code: 'KN', flag: '🇰🇳', nationality: 'Kittian and Nevisian' },
  { name: 'Saint Lucia', code: 'LC', flag: '🇱🇨', nationality: 'Saint Lucian' },
  { name: 'Saint Vincent and the Grenadines', code: 'VC', flag: '🇻🇨', nationality: 'Vincentian' },
  { name: 'Samoa', code: 'WS', flag: '🇼🇸', nationality: 'Samoan' },
  { name: 'San Marino', code: 'SM', flag: '🇸🇲', nationality: 'Sammarinese' },
  { name: 'Sao Tome and Principe', code: 'ST', flag: '🇸🇹', nationality: 'Sao Tomean' },
  { name: 'Saudi Arabia', code: 'SA', flag: '🇸🇦', nationality: 'Saudi Arabian' },
  { name: 'Senegal', code: 'SN', flag: '🇸🇳', nationality: 'Senegalese' },
  { name: 'Serbia', code: 'RS', flag: '🇷🇸', nationality: 'Serbian' },
  { name: 'Seychelles', code: 'SC', flag: '🇸🇨', nationality: 'Seychellois' },
  { name: 'Sierra Leone', code: 'SL', flag: '🇸🇱', nationality: 'Sierra Leonean' },
  { name: 'Singapore', code: 'SG', flag: '🇸🇬', nationality: 'Singaporean' },
  { name: 'Slovakia', code: 'SK', flag: '🇸🇰', nationality: 'Slovak' },
  { name: 'Slovenia', code: 'SI', flag: '🇸🇮', nationality: 'Slovenian' },
  { name: 'Solomon Islands', code: 'SB', flag: '🇸🇧', nationality: 'Solomon Islander' },
  { name: 'Somalia', code: 'SO', flag: '🇸🇴', nationality: 'Somali' },
  { name: 'South Africa', code: 'ZA', flag: '🇿🇦', nationality: 'South African' },
  { name: 'South Korea', code: 'KR', flag: '🇰🇷', nationality: 'South Korean' },
  { name: 'South Sudan', code: 'SS', flag: '🇸🇸', nationality: 'South Sudanese' },
  { name: 'Spain', code: 'ES', flag: '🇪🇸', nationality: 'Spanish' },
  { name: 'Sri Lanka', code: 'LK', flag: '🇱🇰', nationality: 'Sri Lankan' },
  { name: 'Sudan', code: 'SD', flag: '🇸🇩', nationality: 'Sudanese' },
  { name: 'Suriname', code: 'SR', flag: '🇸🇷', nationality: 'Surinamese' },
  { name: 'Sweden', code: 'SE', flag: '🇸🇪', nationality: 'Swedish' },
  { name: 'Switzerland', code: 'CH', flag: '🇨🇭', nationality: 'Swiss' },
  { name: 'Syria', code: 'SY', flag: '🇸🇾', nationality: 'Syrian' },
  { name: 'Taiwan', code: 'TW', flag: '🇹🇼', nationality: 'Taiwanese' },
  { name: 'Tajikistan', code: 'TJ', flag: '🇹🇯', nationality: 'Tajik' },
  { name: 'Tanzania', code: 'TZ', flag: '🇹🇿', nationality: 'Tanzanian' },
  { name: 'Thailand', code: 'TH', flag: '🇹🇭', nationality: 'Thai' },
  { name: 'Timor-Leste', code: 'TL', flag: '🇹🇱', nationality: 'Timorese' },
  { name: 'Togo', code: 'TG', flag: '🇹🇬', nationality: 'Togolese' },
  { name: 'Tonga', code: 'TO', flag: '🇹🇴', nationality: 'Tongan' },
  { name: 'Trinidad and Tobago', code: 'TT', flag: '🇹🇹', nationality: 'Trinidadian and Tobagonian' },
  { name: 'Tunisia', code: 'TN', flag: '🇹🇳', nationality: 'Tunisian' },
  { name: 'Turkey', code: 'TR', flag: '🇹🇷', nationality: 'Turkish' },
  { name: 'Turkmenistan', code: 'TM', flag: '🇹🇲', nationality: 'Turkmen' },
  { name: 'Tuvalu', code: 'TV', flag: '🇹🇻', nationality: 'Tuvaluan' },
  { name: 'Uganda', code: 'UG', flag: '🇺🇬', nationality: 'Ugandan' },
  { name: 'Ukraine', code: 'UA', flag: '🇺🇦', nationality: 'Ukrainian' },
  { name: 'United Arab Emirates', code: 'AE', flag: '🇦🇪', nationality: 'Emirati' },
  { name: 'United Kingdom', code: 'GB', flag: '🇬🇧', nationality: 'British' },
  { name: 'United States', code: 'US', flag: '🇺🇸', nationality: 'American' },
  { name: 'Uruguay', code: 'UY', flag: '🇺🇾', nationality: 'Uruguayan' },
  { name: 'Uzbekistan', code: 'UZ', flag: '🇺🇿', nationality: 'Uzbek' },
  { name: 'Vanuatu', code: 'VU', flag: '🇻🇺', nationality: 'Ni-Vanuatu' },
  { name: 'Vatican City', code: 'VA', flag: '🇻🇦', nationality: 'Vatican' },
  { name: 'Venezuela', code: 'VE', flag: '🇻🇪', nationality: 'Venezuelan' },
  { name: 'Vietnam', code: 'VN', flag: '🇻🇳', nationality: 'Vietnamese' },
  { name: 'Yemen', code: 'YE', flag: '🇾🇪', nationality: 'Yemeni' },
  { name: 'Zambia', code: 'ZM', flag: '🇿🇲', nationality: 'Zambian' },
  { name: 'Zimbabwe', code: 'ZW', flag: '🇿🇼', nationality: 'Zimbabwean' },
];

// Helper to look up country by name (case-insensitive)
export function getCountryByName(name: string): Country | undefined {
  if (!name) return undefined;
  const lower = name.trim().toLowerCase();
  return ALL_COUNTRIES.find(
    (c) => c.name.toLowerCase() === lower || c.nationality.toLowerCase() === lower
  );
}

// Helper to look up country by ISO code
export function getCountryByCode(code: string): Country | undefined {
  if (!code) return undefined;
  const upper = code.trim().toUpperCase();
  return ALL_COUNTRIES.find((c) => c.code.toUpperCase() === upper);
}

// Search helper matching country name, code, or nationality
export function searchCountries(query: string): Country[] {
  if (!query || !query.trim()) return ALL_COUNTRIES;
  const lower = query.trim().toLowerCase();
  return ALL_COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(lower) ||
      c.nationality.toLowerCase().includes(lower) ||
      c.code.toLowerCase().includes(lower)
  );
}

// Nationality options mapped directly from the single maintained country directory
export interface NationalityOption {
  value: string;
  label: string;
  countryName: string;
  flag: string;
}

export const ALL_NATIONALITIES: NationalityOption[] = ALL_COUNTRIES.map((c) => ({
  value: c.nationality,
  label: `${c.nationality} ${c.flag}`,
  countryName: c.name,
  flag: c.flag,
})).sort((a, b) => a.value.localeCompare(b.value));
