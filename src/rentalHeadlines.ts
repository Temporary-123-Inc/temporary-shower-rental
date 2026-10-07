const locationSeed = (value: string) =>
  [...value].reduce(
    (seed, character) => (seed * 31 + character.charCodeAt(0)) >>> 0,
    7,
  );

const select = <T>(items: readonly T[], key: string) =>
  items[locationSeed(key) % items.length];

export const commercialUseCases = [
  "Remote Emergency Base Camp",
  "Remote Industrial Base Camp",
  "Institutional Facility",
  "Accessible Commercial Site",
  "Remote Workforce Camp",
  "Construction Project",
  "Commercial Food Service",
  "Workforce Housing",
  "Remote Operations",
] as const;

export const locationEquipmentFamilies = [
  "Shower Trailer",
  "Shower and Restroom Combination Trailer",
  "ADA Shower and Restroom Combination Trailer",
  "Laundry Temporary Facilities",
  "Kitchen Emergency Trailer",
  "Commercial Kitchen Trailer",
  "Commercial Kitchen Modular Building",
  "Sleeper Bunk-Bed Facility",
  "Remote Man Camp Temporary Facilities",
] as const;

export const locationRentalIntents = [
  "Rental",
  "For Rent",
  "Leasing",
  "Short-Term Rental",
  "Long-Term Rental",
] as const;

export type LocationHeadlineOption = {
  commercialUseCase: (typeof commercialUseCases)[number];
  equipmentFamily: (typeof locationEquipmentFamilies)[number];
  rentalIntent: (typeof locationRentalIntents)[number];
};

const locationHeadlineRotation: readonly LocationHeadlineOption[] = [
  {
    commercialUseCase: "Remote Emergency Base Camp",
    equipmentFamily: "Shower Trailer",
    rentalIntent: "Rental",
  },
  {
    commercialUseCase: "Institutional Facility",
    equipmentFamily: "Shower and Restroom Combination Trailer",
    rentalIntent: "For Rent",
  },
  {
    commercialUseCase: "Accessible Commercial Site",
    equipmentFamily: "ADA Shower and Restroom Combination Trailer",
    rentalIntent: "Leasing",
  },
  {
    commercialUseCase: "Remote Workforce Camp",
    equipmentFamily: "Laundry Temporary Facilities",
    rentalIntent: "Long-Term Rental",
  },
  {
    commercialUseCase: "Construction Project",
    equipmentFamily: "Kitchen Emergency Trailer",
    rentalIntent: "Rental",
  },
  {
    commercialUseCase: "Commercial Food Service",
    equipmentFamily: "Commercial Kitchen Modular Building",
    rentalIntent: "For Rent",
  },
  {
    commercialUseCase: "Workforce Housing",
    equipmentFamily: "Sleeper Bunk-Bed Facility",
    rentalIntent: "Leasing",
  },
  {
    commercialUseCase: "Remote Operations",
    equipmentFamily: "Remote Man Camp Temporary Facilities",
    rentalIntent: "Rental",
  },
] as const;

const acceptedLocationHeadlineOptions: readonly LocationHeadlineOption[] = [
  ...locationHeadlineRotation,
  {
    commercialUseCase: "Remote Industrial Base Camp",
    equipmentFamily: "Commercial Kitchen Trailer",
    rentalIntent: "Rental",
  },
  {
    commercialUseCase: "Remote Industrial Base Camp",
    equipmentFamily: "Commercial Kitchen Modular Building",
    rentalIntent: "Rental",
  },
  {
    commercialUseCase: "Remote Industrial Base Camp",
    equipmentFamily: "Shower Trailer",
    rentalIntent: "Rental",
  },
  {
    commercialUseCase: "Remote Workforce Camp",
    equipmentFamily: "Shower Trailer",
    rentalIntent: "Short-Term Rental",
  },
] as const;

export const buildLocationRentalHeadline = (
  location: string,
  option: LocationHeadlineOption,
) =>
  `${location} ${option.commercialUseCase} ${option.equipmentFamily} ${option.rentalIntent}`;

export const matchesLocationRentalHeadline = (
  headline: string,
  location: string,
) => {
  if (!headline.startsWith(`${location} `)) return false;
  const phrase = headline.slice(location.length + 1);
  return acceptedLocationHeadlineOptions.some(
    ({ commercialUseCase, equipmentFamily, rentalIntent }) =>
      phrase === `${commercialUseCase} ${equipmentFamily} ${rentalIntent}`,
  );
};

export const regionLocationLabel = (region: string, state: string) =>
  region.toLowerCase() === state.toLowerCase() ||
  region.toLowerCase().endsWith(`, ${state.toLowerCase()}`) ||
  region.toLowerCase().endsWith(` ${state.toLowerCase()}`)
    ? region
    : `${region}, ${state}`;

export const stateRentalOption = (_state: string): LocationHeadlineOption =>
  locationHeadlineRotation[0];

export const stateRentalHeadline = (state: string) =>
  buildLocationRentalHeadline(state, stateRentalOption(state));

export const regionRentalHeadline = (
  region: string,
  state: string,
  _regionIndex: number,
) => {
  const location = regionLocationLabel(region, state);
  const option = locationHeadlineRotation[0];
  return buildLocationRentalHeadline(location, option);
};

const cityServiceHeadlines = {
  kitchen: [
    (location: string) =>
      buildLocationRentalHeadline(location, {
        commercialUseCase: "Commercial Food Service",
        equipmentFamily: "Commercial Kitchen Modular Building",
        rentalIntent: "For Rent",
      }),
    (location: string) =>
      buildLocationRentalHeadline(location, {
        commercialUseCase: "Construction Project",
        equipmentFamily: "Kitchen Emergency Trailer",
        rentalIntent: "Rental",
      }),
  ],
  shower: [
    (location: string) =>
      buildLocationRentalHeadline(location, locationHeadlineRotation[0]),
    (location: string) =>
      buildLocationRentalHeadline(location, {
        commercialUseCase: "Remote Workforce Camp",
        equipmentFamily: "Shower Trailer",
        rentalIntent: "Short-Term Rental",
      }),
  ],
  combination: [
    (location: string) =>
      buildLocationRentalHeadline(location, locationHeadlineRotation[1]),
    (location: string) =>
      buildLocationRentalHeadline(location, locationHeadlineRotation[2]),
  ],
  restroom: [
    (location: string) =>
      buildLocationRentalHeadline(location, locationHeadlineRotation[1]),
    (location: string) =>
      buildLocationRentalHeadline(location, locationHeadlineRotation[2]),
  ],
  sleeper: [
    (location: string) =>
      buildLocationRentalHeadline(location, locationHeadlineRotation[6]),
    (location: string) =>
      buildLocationRentalHeadline(location, locationHeadlineRotation[7]),
  ],
  facility: [
    (location: string) =>
      buildLocationRentalHeadline(location, locationHeadlineRotation[3]),
    (location: string) =>
      buildLocationRentalHeadline(location, locationHeadlineRotation[7]),
  ],
} as const;

export const cityRentalHeadline = (location: string, service: string) => {
  const lowerService = service.toLowerCase();
  const kind = /kitchen/.test(lowerService)
    ? "kitchen"
    : /combination|shower.*restroom|restroom.*shower/.test(lowerService)
      ? "combination"
      : /restroom/.test(lowerService)
        ? "restroom"
        : /shower/.test(lowerService)
          ? "shower"
          : /sleep|bunk/.test(lowerService)
            ? "sleeper"
            : "facility";
  return select(cityServiceHeadlines[kind], `${location}-${service}`)(location);
};

export const rentalProductHeadline = (name: string) => {
  if (/Combination Trailer/i.test(name)) {
    if (/ADA/i.test(name)) {
      const stalls = name.match(/(\d+) Stalls?/i)?.[1];
      if (stalls)
        return `${stalls}-Stall + 1 ADA Shower and Restroom Combination Trailer Rental`;
      return "ADA Shower and Restroom Combination Trailer Rental";
    }
    const size = name.match(/^(\d+)\s*ft/i)?.[1];
    const stalls = name.match(/(\d+) Stalls?/i)?.[1];
    if (size && stalls)
      return `${size} ft ${stalls}-Stall Shower and Restroom Combination Trailer Rental`;
    return "Shower and Restroom Combination Trailer Rental";
  }
  if (/^22 ft Shower Trailer, 10 Stalls$/i.test(name))
    return "22 ft 10-Stall Shower Trailer Rental";
  if (/^20 ft Shower Trailer, 5 Stalls$/i.test(name))
    return "20 ft 5-Stall Shower Trailer Rental";
  if (/^20 ft Shower Container, 5 Stalls$/i.test(name))
    return "20 ft 5-Stall Shower Container Rental";
  return /rental|lease/i.test(name) ? name : `${name} Rental`;
};

const categoryHeadlines: Record<string, string> = {
  "Mobile Kitchens": "Kitchen Trailer Rental",
  Dishwashing: "Dishwashing Trailer Rental",
  Refrigeration: "Refrigerated Trailer Rental",
  Shower: "Emergency Shower Trailer Rental",
  Restroom: "Restroom Trailer Rental",
  "Shower and Restroom Combination Trailers":
    "Shower and Restroom Combination Trailer Rental",
  Sleeper: "Sleeper Bunk-Bed Facility Rental",
  Laundry: "Laundry Trailer Rental",
  "Handwashing Trailers": "Portable Handwashing Trailer Rental",
};

export const rentalCategoryHeadline = (name: string) =>
  categoryHeadlines[name] || `${name} Facility Rental`;

const hubHeadlines: Record<string, string> = {
  "/inventory/": "Temporary Kitchen Rental Inventory",
  "/equipment-rental/": "Nationwide Temporary Facility and Equipment Rental",
  "/industries/": "Commercial and Institutional Temporary Facility Rental",
  "/services/": "Nationwide Temporary Facility Rental Services",
};

export const rentalHubHeadline = (path: string) => hubHeadlines[path];
