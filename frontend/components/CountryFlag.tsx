import React from "react";
import { FlagIcon } from "react-flag-kit";

// Comprehensive mapping of country names and league names to their ISO 2-letter country codes
const countryCodeMap = {
  // Countries from the provided leagues list
  England: "GB", // Using GB for United Kingdom
  Italy: "IT",
  Spain: "ES",
  France: "FR",
  Germany: "DE",

  // Additional countries from previous version
  "United States": "US",
  "United Kingdom": "GB",
  Canada: "CA",
  Australia: "AU",
  Japan: "JP",
  China: "CN",
  Brazil: "BR",
  India: "IN",
  Russia: "RU",
  Mexico: "MX",
  "South Korea": "KR",
  Argentina: "AR",

  // Additional league names (for international competitions)
  "Europa League": "EU", // Using EU flag or generic European flag
  "Champions League": "EU", // Same as Europa League
};

const CountryFlag = ({ countryName, size = 24, className = "" }) => {
  // Try to get the country code, with fallback to uppercase first two letters
  const countryCode =
    countryCodeMap[countryName] || (countryName.length >= 2 ? countryName.slice(0, 2).toUpperCase() : null);

  if (!countryCode) {
    return <div className={`text-xs text-gray-500 ${className}`}>No flag</div>;
  }

  return <FlagIcon code={countryCode} size={size} className={className} />;
};

// Example usage component
// const CountryFlagDemo = () => {
//   const leagues = [
//     { id: "all", name: "All" },
//     { id: "Europa League", name: "Europa League" },
//     { id: "Champions League", name: "Champions League" },
//     { id: "England", name: "England" },
//     { id: "Italy", name: "Italy" },
//     { id: "Spain", name: "Spain" },
//     { id: "France", name: "France" },
//     { id: "Germany", name: "Germany" },
//   ];

//   return (
//     <div className="flex flex-wrap items-center space-x-2 space-y-2">
//       {leagues
//         .filter((league) => league.id !== "all")
//         .map((league) => (
//           <div key={league.id} className="flex items-center space-x-2">
//             <CountryFlag countryName={league.name} size={32} />
//             <span>{league.name}</span>
//           </div>
//         ))}
//     </div>
//   );
// };

export { CountryFlag };
