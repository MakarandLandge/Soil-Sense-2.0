import { useEffect, useMemo, useState } from "react";
import PhForm from "@/components/soil/PhForm";
import PhChart from "@/components/soil/PhChart";
import PhTable from "@/components/soil/PhTable";
import SuggestionPanel from "@/components/soil/SuggestionPanel";
import ExportXlsx from "@/components/soil/ExportXlsx";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { loadReadings, saveReadings, suggestForPh, type Reading } from "@/lib/soil";

export default function Index() {
  const [readings, setReadings] = useState<Reading[]>(() => loadReadings());
  const [lastSuggestion, setLastSuggestion] = useState<ReturnType<typeof suggestForPh> | null>(null);
  const [filterLocation, setFilterLocation] = useState<string | "All">("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    saveReadings(readings);
  }, [readings]);

  const locations = useMemo(() => Array.from(new Set(readings.map((r) => r.location))), [readings]);

  function addReading(r: Reading) {
    setReadings((prev) => {
      const next = [...prev, r];
      return next;
    });
    setLastSuggestion(suggestForPh(r.ph));
    if (filterLocation === "All") setFilterLocation(r.location);
  }

  function removeReading(id: string) {
    setReadings((prev) => prev.filter((r) => r.id !== id));
  }

  const filteredTable = useMemo(() => {
    return readings.filter((r) => {
      const matchesLoc = filterLocation === "All" || r.location === filterLocation;
      const matchesSearch = search
        ? `${r.date} ${r.location} ${r.ph} ${r.notes ?? ""}`.toLowerCase().includes(search.toLowerCase())
        : true;
      return matchesLoc && matchesSearch;
    });
  }, [readings, filterLocation, search]);

  const googleQuery = useMemo(() => {
    const base = "soil pH management";
    if (!lastSuggestion) return base;
    if (lastSuggestion.status === "acidic") return "raise soil pH garden lime application rate";
    if (lastSuggestion.status === "alkaline") return "lower alkaline soil pH elemental sulfur";
    return base;
  }, [lastSuggestion]);

  return (
    <div className="bg-gradient-to-b from-secondary/60 to-background">
      <section className="container py-10 md:py-14">
        <div className="grid gap-8 lg:grid-cols-5 items-start">
          <div className="lg:col-span-3 space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Soil pH Tracker & Fertilizer Advisor</h1>
              <p className="mt-2 text-muted-foreground max-w-2xl">
                Record soil pH by field, visualize trends, export weekly or monthly Excel reports, and
                get guidance on fertilizer and amendments.
              </p>
            </div>

            <div className="rounded-xl border bg-card p-4 md:p-6">
              <h2 className="font-semibold mb-4">Add a Reading</h2>
              <PhForm onAdd={addReading} defaultLocation={locations[0]} />
              {lastSuggestion && <div className="mt-6"><SuggestionPanel suggestion={lastSuggestion} /></div>}
            </div>

            <div className="rounded-xl border bg-card p-4 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="font-semibold">Export Reports</h2>
                <ExportXlsx readings={readings} />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border bg-card p-4 md:p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-semibold">Chart</h2>
                <div className="w-44">
                  <Select value={filterLocation} onValueChange={(v) => setFilterLocation(v as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All locations</SelectItem>
                      {locations.map((l) => (
                        <SelectItem key={l} value={l}>
                          {l}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-4">
                <PhChart readings={readings} location={filterLocation} />
                <p className="mt-2 text-xs text-muted-foreground">Shaded band indicates typical ideal range (6.0–7.5).</p>
              </div>
            </div>

            <div className="rounded-xl border bg-card p-4 md:p-6">
              <h2 className="font-semibold">Google information</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Open a relevant Google search to learn best practices and local guidance.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button asChild>
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(googleQuery)}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <BookOpen className="h-4 w-4 mr-2" /> Open Google
                  </a>
                </Button>
                <Button asChild variant="secondary">
                  <a
                    href="https://www.google.com/search?q=how+to+test+soil+pH+properly"
                    target="_blank"
                    rel="noreferrer"
                  >
                    pH Testing tips
                  </a>
                </Button>
                <Button asChild variant="secondary">
                  <a
                    href="https://www.google.com/search?q=fertilizer+recommendations+by+soil+pH"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Fertilizer vs pH
                  </a>
                </Button>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                For syncing with Google Sheets later, we can integrate via Zapier. Ask when ready.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container pb-12">
        <div className="rounded-xl border bg-card p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex-1">
              <h2 className="font-semibold">Readings</h2>
              <p className="text-sm text-muted-foreground">Filter and manage your measurements.</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <div className="hidden md:block w-44">
                <Label className="sr-only" htmlFor="table-location">Location</Label>
                <Select value={filterLocation} onValueChange={(v) => setFilterLocation(v as any)}>
                  <SelectTrigger id="table-location">
                    <SelectValue placeholder="Filter location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All locations</SelectItem>
                    {locations.map((l) => (
                      <SelectItem key={l} value={l}>
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 md:w-64">
                <Label className="sr-only" htmlFor="search">Search</Label>
                <Input id="search" placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>
          </div>
          <div className="mt-4">
            <PhTable readings={filteredTable} onDelete={removeReading} />
          </div>
        </div>
      </section>
    </div>
  );
}
