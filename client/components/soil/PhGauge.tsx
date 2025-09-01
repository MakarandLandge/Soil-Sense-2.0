export default function PhGauge({ value }: { value: number | null }) {
  const pct = Math.max(0, Math.min(100, ((value ?? 0) / 14) * 100));
  const status = !value ? "" : value < 6 ? "Acidic" : value > 7.5 ? "Alkaline" : "Optimal";
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="text-sm text-muted-foreground">Current Soil pH</div>
      <div className="mt-3 h-2 w-full rounded-full bg-muted">
        <div
          className="h-2 rounded-full bg-primary transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-3 flex items-end justify-between text-xs text-muted-foreground">
        <span>0</span>
        <span>7</span>
        <span>14</span>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div>
          <div className="text-xl font-semibold">pH {value?.toFixed(1) ?? "–"}</div>
          <div className="text-xs text-muted-foreground flex gap-8">
            <span>Acidic</span>
            <span>Neutral</span>
            <span>Alkaline</span>
          </div>
        </div>
        {status && (
          <span className="px-3 py-1 rounded-full text-xs bg-secondary text-secondary-foreground border">
            {status}
          </span>
        )}
      </div>
    </div>
  );
}
