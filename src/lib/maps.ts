import type { Entry } from "./types";

export function mapsLinkFor(entry: Entry): string | null {
  const query = [entry.name, entry.location].filter(Boolean).join(", ");
  if (!query.trim()) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function mapsQuery(entry: Entry): string {
  return [entry.name, entry.location].filter(Boolean).join(", ");
}

export function directionsLinkFor(entries: Entry[]): string | null {
  const stops = entries.filter((e) => mapsQuery(e).trim());
  if (stops.length < 2) return null;
  const origin = mapsQuery(stops[0]);
  const destination = mapsQuery(stops[stops.length - 1]);
  const waypoints = stops.slice(1, -1).map(mapsQuery);
  const params = new URLSearchParams({
    api: "1",
    origin,
    destination,
  });
  if (waypoints.length) params.set("waypoints", waypoints.join("|"));
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}
