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
import { loadReadings, saveReadings, suggestForReading, type Reading } from "@/lib/soil";
import { useI18n } from "@/lib/i18n";

export default function Index() {
  const { t } = useI18n();
  const [readings, setReadings] = useState<Reading[]>(() => loadReadings());
  const [lastSuggestions, setLastSuggestions] = useState<ReturnType<typeof suggestForReading> | null>(null);
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
    setLastSuggestions(suggestForReading(r));
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
    if (!lastSuggestions || lastSuggestions.length === 0) return base;
    const s = lastSuggestions[0];
    if (s.status === "acidic") return "raise soil pH garden lime application rate";
    if (s.status === "alkaline") return "lower alkaline soil pH elemental sulfur";
    if (s.status === "dry") return "increase soil moisture irrigation scheduling";
    if (s.status === "wet") return "improve soil drainage reduce overwatering";
    return base;
  }, [lastSuggestions]);

  return (
    <div className="bg-gradient-to-b from-secondary/60 to-background">
      <section className="container py-10 md:py-14">
        <div className="grid gap-8 lg:grid-cols-5 items-start">
          <div className="lg:col-span-3 space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{t("app_title")}</h1>
              <p className="mt-2 text-muted-foreground max-w-2xl">{t("app_sub")}</p>
            </div>

            <div className="rounded-xl border bg-card p-4 md:p-6">
              <h2 className="font-semibold mb-4">{t("add_reading")}</h2>
              <PhForm onAdd={addReading} defaultLocation={locations[0]} />
              {lastSuggestions && lastSuggestions.map((s, i) => (
                <div key={i} className="mt-6"><SuggestionPanel suggestion={s} /></div>
              ))}
            </div>

            <div className="rounded-xl border bg-card p-4 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="font-semibold">{t("export_reports")}</h2>
                <ExportXlsx readings={readings} />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border bg-card p-4 md:p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-semibold">{t("chart")}</h2>
                <div className="w-44">
                  <Select value={filterLocation} onValueChange={(v) => setFilterLocation(v as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("all_locations")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">{t("all_locations")}</SelectItem>
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
                <p className="mt-2 text-xs text-muted-foreground">{t("ideal_band")}</p>
              </div>
            </div>

            <div className="rounded-xl border bg-card p-4 md:p-6">
              <h2 className="font-semibold">{t("google_info")}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{t("google_info_sub")}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button asChild>
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(googleQuery)}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <BookOpen className="h-4 w-4 mr-2" /> {t("open_google")}
                  </a>
                </Button>
                <Button asChild variant="secondary">
                  <a
                    href="https://www.google.com/search?q=how+to+test+soil+pH+properly"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t("ph_testing_tips")}
                  </a>
                </Button>
                <Button asChild variant="secondary">
                  <a
                    href="https://www.google.com/search?q=fertilizer+recommendations+by+soil+pH"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t("fert_vs_ph")}
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
              <h2 className="font-semibold">{t("readings")}</h2>
              <p className="text-sm text-muted-foreground">{t("filter_manage")}</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <div className="hidden md:block w-44">
                <Label className="sr-only" htmlFor="table-location">{t("location")}</Label>
                <Select value={filterLocation} onValueChange={(v) => setFilterLocation(v as any)}>
                  <SelectTrigger id="table-location">
                    <SelectValue placeholder={t("all_locations")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">{t("all_locations")}</SelectItem>
                    {locations.map((l) => (
                      <SelectItem key={l} value={l}>
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 md:w-64">
                <Label className="sr-only" htmlFor="search">{t("search")}</Label>
                <Input id="search" placeholder={t("search")} value={search} onChange={(e) => setSearch(e.target.value)} />
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
