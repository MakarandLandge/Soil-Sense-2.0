export type Weather = {
  tempC: number | null;
  humidity: number | null;
  description: string;
  icon: string;
  windKph: number | null;
  city: string;
  country: string;
  dt: string;
};

export async function fetchWeather(params: { lat?: number; lon?: number; q?: string }): Promise<Weather | null> {
  const usp = new URLSearchParams();
  if (params.lat != null && params.lon != null) {
    usp.set("lat", String(params.lat));
    usp.set("lon", String(params.lon));
  } else if (params.q) {
    usp.set("q", params.q);
  } else {
    return null;
  }
  const r = await fetch(`/api/weather?${usp.toString()}`);
  if (!r.ok) return null;
  return (await r.json()) as Weather;
}

export function getStoredCoords(): { lat?: number; lon?: number } {
  const lat = localStorage.getItem("weather_lat");
  const lon = localStorage.getItem("weather_lon");
  return {
    lat: lat ? Number(lat) : undefined,
    lon: lon ? Number(lon) : undefined,
  };
}
