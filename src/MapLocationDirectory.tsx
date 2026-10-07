import { stateGuides } from "./stateGuides";
import { statePath } from "./statePaths";
import { regionPath } from "./regionGuides";
import { cityPagesWithGuides } from "./cityDirectory";
import { kellerLocation } from "./kellerLocation";

export function MapLocationDirectory() {
  return (
    <section
      className="map-location-directory"
      aria-label="Browse shower rental locations"
    >
      <h3>Browse shower rental locations</h3>
      <p>
        Open a state shower guide directly, or expand its regions and published city
        guides. Confirm shower equipment availability for your exact site and dates.
      </p>
      <div className="map-location-grid">
        {Object.entries(stateGuides)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([name, guide]) => (
            <div key={name}>
              <a className="map-location-state" href={statePath(name)}>
                {name}
              </a>
              <details>
                <summary>Regions and cities in {name}</summary>
                <ul>
                  {guide.regions.map((region) => {
                    const isKellerParent =
                      name === "Texas" && region === "North Texas";
                    return (
                      <li key={region}>
                        <a href={regionPath(name, region)}>{region}</a>
                        {isKellerParent && (
                          <ul className="map-location-sublist">
                            <li>
                              <a
                                data-directory-city
                                href={kellerLocation.path}
                              >
                                Keller, Texas
                              </a>
                            </li>
                          </ul>
                        )}
                      </li>
                    );
                  })}
                  {cityPagesWithGuides
                    .filter(
                      (city) =>
                        city.state === name &&
                        city.path !== kellerLocation.path,
                    )
                    .map((city) => (
                      <li key={city.path}>
                        <a data-directory-city href={city.path}>
                          {city.name}, {name}
                        </a>
                      </li>
                    ))}
                </ul>
              </details>
            </div>
          ))}
      </div>
    </section>
  );
}
