import type { RequestHandler } from "express";

export const handleWeather: RequestHandler = async (req, res) => {
  try {
    const key = process.env.WEATHER_API_KEY;
    if (!key) {
      return res.status(500).json({ error: "Missing WEATHER_API_KEY" });
    }
    const { lat, lon, q } = req.query as { lat?: string; lon?: string; q?: string };
    let url = "";
    if (lat && lon) {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&appid=${key}&units=metric`;
    } else if (q) {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(q)}&appid=${key}&units=metric`;
    } else {
      return res.status(400).json({ error: "Provide lat/lon or q" });
    }

    const r = await fetch(url);
    if (!r.ok) {
      const txt = await r.text();
      return res.status(502).json({ error: "Upstream error", detail: txt });
    }
    const data = await r.json();
    const payload = {
      tempC: data.main?.temp ?? null,
      humidity: data.main?.humidity ?? null,
      description: data.weather?.[0]?.description ?? "",
      icon: data.weather?.[0]?.icon ?? "",
      windKph: data.wind?.speed != null ? Math.round((data.wind.speed as number) * 3.6) : null,
      city: data.name ?? "",
      country: data.sys?.country ?? "",
      dt: data.dt ? new Date(data.dt * 1000).toISOString() : new Date().toISOString(),
    };
    res.json(payload);
  } catch (e: any) {
    res.status(500).json({ error: "weather_failed", detail: String(e?.message ?? e) });
  }
};
