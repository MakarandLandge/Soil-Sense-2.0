import { Reading } from "@/lib/soil";
import { useMemo } from "react";
import { ResponsiveContainer, LineChart, XAxis, YAxis, Tooltip, Line, ReferenceArea } from "recharts";

export default function PhChart({ readings, location }: { readings: Reading[]; location: string | "All" }) {
  const data = useMemo(() => {
    const filtered = location === "All" ? readings : readings.filter((r) => r.location === location);
    return filtered
      .slice()
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((r) => ({ date: r.date, ph: r.ph }));
  }, [readings, location]);

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
          <XAxis dataKey="date" tick={{ fontSize: 12 }} tickMargin={8} minTickGap={24} />
          <YAxis domain={[0, 14]} tick={{ fontSize: 12 }} tickMargin={8} />
          <Tooltip formatter={(v) => [v as number, "pH"]} labelFormatter={(l) => `Date: ${l}`} />
          <ReferenceArea y1={6} y2={7.5} fill="hsl(var(--secondary))" fillOpacity={0.4} strokeOpacity={0} />
          <Line type="monotone" dataKey="ph" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
