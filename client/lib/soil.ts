export type Frequency = "weekly" | "monthly";

export interface Reading {
  id: string;
  date: string; // ISO date
  location: string;
  ph: number;
  n?: number; // ppm
  k?: number; // ppm
  moisture?: number; // percentage 0-100
  hydrogen?: number; // optional, as requested
  cropType?: string;
  soilColor?: string;
  seedType?: string;
  fertilizerUsed?: string;
  pesticideUsed?: string;
  notes?: string;
}

export interface Suggestion {
  status: "acidic" | "optimal" | "alkaline" | "dry" | "wet";
  headline: string;
  details: string[];
  severity: "low" | "medium" | "high";
}

const STORAGE_KEY = "soil_readings_v1";

export function loadReadings(): Reading[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Reading[];
    return parsed.map((r) => ({ ...r, ph: Number(r.ph) })).sort((a, b) => a.date.localeCompare(b.date));
  } catch {
    return [];
  }
}

export function saveReadings(list: Reading[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function suggestForPh(ph: number): Suggestion {
  if (ph < 6.0) {
    const delta = Math.min(6 - ph, 2);
    const intensity = delta > 1.2 ? "high" : delta > 0.5 ? "medium" : "low";
    const limeLbPer100SqFt = Math.round((5 + delta * 4) * 10) / 10; // ~5–13 lb/100 sq ft
    return {
      status: "acidic",
      severity: intensity,
      headline: "Soil is acidic — raise pH",
      details: [
        `Apply garden lime approximately ${limeLbPer100SqFt} lb per 100 sq ft, then re-test in 2–4 weeks.`,
        "Prefer dolomitic lime if magnesium is also low.",
        "Add organic matter (compost) to improve buffering.",
        "Avoid ammonium-based nitrogen sources until pH improves.",
      ],
    };
  }
  if (ph > 7.5) {
    const delta = Math.min(ph - 7, 2.5);
    const intensity = delta > 1.5 ? "high" : delta > 0.75 ? "medium" : "low";
    const sulfurLbPer100SqFt = Math.round((1 + delta * 1.2) * 10) / 10; // ~1–4 lb/100 sq ft
    return {
      status: "alkaline",
      severity: intensity,
      headline: "Soil is alkaline — lower pH",
      details: [
        `Apply elemental sulfur about ${sulfurLbPer100SqFt} lb per 100 sq ft; water in well.`,
        "Use acid-forming fertilizers (e.g., ammonium sulfate).",
        "Mulch with pine bark/needles; add composted manure sparingly.",
        "For calcareous soils, expect gradual change and periodic maintenance.",
      ],
    };
  }
  return {
    status: "optimal",
    severity: "low",
    headline: "pH is within the ideal range",
    details: [
      "Maintain with balanced NPK and organic matter.",
      "Spot-correct only if crop-specific needs differ.",
      "Continue weekly/monthly monitoring.",
    ],
  };
}

export function suggestForReading(r: Reading): Suggestion[] {
  const list: Suggestion[] = [suggestForPh(r.ph)];
  if (typeof r.moisture === "number") {
    if (r.moisture < 25) {
      list.push({
        status: "dry",
        severity: r.moisture < 15 ? "high" : "medium",
        headline: "Soil moisture is low — increase irrigation",
        details: [
          "Irrigate to field capacity; avoid waterlogging.",
          "Mulch to reduce evaporation.",
          "Schedule watering in early morning.",
        ],
      });
    } else if (r.moisture > 80) {
      list.push({
        status: "wet",
        severity: r.moisture > 90 ? "high" : "medium",
        headline: "Soil is too wet — reduce watering",
        details: [
          "Allow drainage before field operations.",
          "Check irrigation scheduling and soil compaction.",
        ],
      });
    }
  }
  return list;
}

export type Period = "weekly" | "monthly";

export function summarize(readings: Reading[], period: Period) {
  // Group by location then by week or month
  const groups = new Map<string, Reading[]>();
  readings.forEach((r) => {
    const key = `${r.location}`.trim() || "General";
    const arr = groups.get(key) ?? [];
    arr.push(r);
    groups.set(key, arr);
  });

  const byLocation: Record<string, { label: string; avg: number; count: number }[]> = {};

  groups.forEach((arr, loc) => {
    const buckets = new Map<string, number[]>();
    arr.forEach((r) => {
      const d = new Date(r.date);
      const label = period === "weekly" ? weekLabel(d) : monthLabel(d);
      const nums = buckets.get(label) ?? [];
      nums.push(r.ph);
      buckets.set(label, nums);
    });
    byLocation[loc] = Array.from(buckets.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([label, nums]) => ({ label, avg: avg(nums), count: nums.length }));
  });

  return byLocation;
}

function avg(nums: number[]) {
  return Math.round((nums.reduce((a, b) => a + b, 0) / Math.max(nums.length, 1)) * 100) / 100;
}

function weekLabel(d: Date) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = date.getUTCDay();
  const diff = (day === 0 ? -6 : 1) - day; // Monday start
  const monday = new Date(date);
  monday.setUTCDate(date.getUTCDate() + diff);
  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);
  return `${monday.toISOString().slice(0, 10)} → ${sunday.toISOString().slice(0, 10)}`;
}

function monthLabel(d: Date) {
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  return `${y}-${String(m).padStart(2, "0")}`;
}
