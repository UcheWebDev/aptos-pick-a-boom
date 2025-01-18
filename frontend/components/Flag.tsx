// Flag.tsx
import React from "react";

const countryMapping: { [key: string]: string } = {
  // Common country names to ISO codes
  australia: "au",
  japan: "jp",
  england: "gb-eng",
  "united kingdom": "gb",
  "united states": "us",
  spain: "es",
  germany: "de",
  france: "fr",
  italy: "it",
  brazil: "br",
  argentina: "ar",
  netherlands: "nl",
  portugal: "pt",
  belgium: "be",
  switzerland: "ch",
  austria: "at",
  sweden: "se",
  norway: "no",
  denmark: "dk",
  finland: "fi",
  poland: "pl",
  croatia: "hr",
  serbia: "rs",
  greece: "gr",
  turkey: "tr",
  russia: "ru",
  ukraine: "ua",
  china: "cn",
  "south korea": "kr",
  mexico: "mx",
  canada: "ca",
  // Add more mappings as needed
};

const leagueCountryMapping: { [key: string]: string } = {
  "premier league": "england",
  bundesliga: "germany",
  "la liga": "spain",
  "serie a": "italy",
  "ligue 1": "france",
  eredivisie: "netherlands",
  "primeira liga": "portugal",
  "super lig": "turkey",
  mls: "united states",
  "j league": "japan",
  "k league": "south korea",
  "a-league": "australia",
  // Add more leagues as needed
};

const fifaToIso = {
  AFG: 'AF',  // Afghanistan
  ALB: 'AL',  // Albania
  ALG: 'DZ',  // Algeria
  AND: 'AD',  // Andorra
  ANG: 'AO',  // Angola
  ARG: 'AR',  // Argentina
  ARM: 'AM',  // Armenia
  AUS: 'AU',  // Australia
  AUT: 'AT',  // Austria
  AZE: 'AZ',  // Azerbaijan
  BAH: 'BS',  // Bahamas
  BHR: 'BH',  // Bahrain
  BAN: 'BD',  // Bangladesh
  BAR: 'BB',  // Barbados
  BLR: 'BY',  // Belarus
  BEL: 'BE',  // Belgium
  BEN: 'BJ',  // Benin
  BHU: 'BT',  // Bhutan
  BOL: 'BO',  // Bolivia
  BIH: 'BA',  // Bosnia and Herzegovina
  BOT: 'BW',  // Botswana
  BRA: 'BR',  // Brazil
  BUL: 'BG',  // Bulgaria
  BUR: 'BF',  // Burkina Faso
  BDI: 'BI',  // Burundi
  CAM: 'CM',  // Cameroon
  CAN: 'CA',  // Canada
  CHI: 'CL',  // Chile
  CHN: 'CN',  // China
  COL: 'CO',  // Colombia
  CRC: 'CR',  // Costa Rica
  CRO: 'HR',  // Croatia
  CUB: 'CU',  // Cuba
  CYP: 'CY',  // Cyprus
  CZE: 'CZ',  // Czech Republic
  DEN: 'DK',  // Denmark
  DJI: 'DJ',  // Djibouti
  DOM: 'DO',  // Dominican Republic
  ECU: 'EC',  // Ecuador
  EGY: 'EG',  // Egypt
  ENG: 'GB',  // England
  SLV: 'SV',  // El Salvador
  EST: 'EE',  // Estonia
  ETH: 'ET',  // Ethiopia
  FIJ: 'FJ',  // Fiji
  FIN: 'FI',  // Finland
  FRA: 'FR',  // France
  GEO: 'GE',  // Georgia
  GER: 'DE',  // Germany
  GHA: 'GH',  // Ghana
  GRE: 'GR',  // Greece
  GRN: 'GD',  // Grenada
  GUA: 'GT',  // Guatemala
  GUY: 'GY',  // Guyana
  HAI: 'HT',  // Haiti
  HND: 'HN',  // Honduras
  HUN: 'HU',  // Hungary
  IND: 'IN',  // India
  INA: 'ID',  // Indonesia
  IRN: 'IR',  // Iran
  IRQ: 'IQ',  // Iraq
  IRL: 'IE',  // Ireland
  ISL: 'IS',  // Iceland
  ISR: 'IL',  // Israel
  ITA: 'IT',  // Italy
  JAM: 'JM',  // Jamaica
  JPN: 'JP',  // Japan
  JOR: 'JO',  // Jordan
  KAZ: 'KZ',  // Kazakhstan
  KEN: 'KE',  // Kenya
  KOR: 'KR',  // Korea Republic
  KOS: 'XK',  // Kosovo
  KWT: 'KW',  // Kuwait
  LAT: 'LV',  // Latvia
  LIB: 'LB',  // Lebanon
  LES: 'LS',  // Lesotho
  LBR: 'LR',  // Liberia
  LIE: 'LI',  // Liechtenstein
  LTU: 'LT',  // Lithuania
  LUX: 'LU',  // Luxembourg
  MAD: 'MG',  // Madagascar
  MWI: 'MW',  // Malawi
  MEX: 'MX',  // Mexico
  MDA: 'MD',  // Moldova
  MON: 'MC',  // Monaco
  MNG: 'MN',  // Mongolia
  MNE: 'ME',  // Montenegro
  MAR: 'MA',  // Morocco
  MOZ: 'MZ',  // Mozambique
  MYA: 'MM',  // Myanmar
  NAM: 'NA',  // Namibia
  NED: 'NL',  // Netherlands
  NZL: 'NZ',  // New Zealand
  NGA: 'NG',  // Nigeria
  NOR: 'NO',  // Norway
  OMN: 'OM',  // Oman
  PAK: 'PK',  // Pakistan
  PAN: 'PA',  // Panama
  PAR: 'PY',  // Paraguay
  PER: 'PE',  // Peru
  PHI: 'PH',  // Philippines
  POL: 'PL',  // Poland
  POR: 'PT',  // Portugal
  QAT: 'QA',  // Qatar
  ROU: 'RO',  // Romania
  RUS: 'RU',  // Russia
  RWA: 'RW',  // Rwanda
  KSA: 'SA',  // Saudi Arabia
  SEN: 'SN',  // Senegal
  SRB: 'RS',  // Serbia
  SGP: 'SG',  // Singapore
  SVK: 'SK',  // Slovakia
  SVN: 'SI',  // Slovenia
  SOM: 'SO',  // Somalia
  RSA: 'ZA',  // South Africa
  ESP: 'ES',  // Spain
  SRI: 'LK',  // Sri Lanka
  SUD: 'SD',  // Sudan
  SWE: 'SE',  // Sweden
  SUI: 'CH',  // Switzerland
  SYR: 'SY',  // Syria
  TAN: 'TZ',  // Tanzania
  THA: 'TH',  // Thailand
  TOG: 'TG',  // Togo
  TUN: 'TN',  // Tunisia
  TUR: 'TR',  // Turkey
  UGA: 'UG',  // Uganda
  UKR: 'UA',  // Ukraine
  UAE: 'AE',  // United Arab Emirates
  USA: 'US',  // United States
  URU: 'UY',  // Uruguay
  VEN: 'VE',  // Venezuela
  VIE: 'VN',  // Vietnam
  WAL: 'GB',  // Wales
  ZAM: 'ZM',  // Zambia
  ZIM: 'ZW',  // Zimbabwe
};

interface FlagProps {
  country: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const getFlagSize = (size: "sm" | "md" | "lg" = "md") => {
  switch (size) {
    case "sm":
      return "w-4 h-4";
    case "lg":
      return "w-8 h-8";
    default:
      return "w-6 h-6";
  }
};

interface LeagueFlagProps {
  ccode: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Flag: React.FC<LeagueFlagProps> = ({ size = "md", className = "", ccode }) => {
  const normalizedCode : string= fifaToIso[ccode] || "";
  const countryCode = normalizedCode.toLowerCase();
  console.log(countryCode);

  return (
    <img
      src={`https://flagcdn.com/48x36/${countryCode}.png`}
      alt="flag"
      className={`inline-block object-cover rounded ${getFlagSize(size)} ${className}`}
    />
  );
};

export default Flag;
