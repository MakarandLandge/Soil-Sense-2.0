import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Reading } from "@/lib/soil";
import { useI18n } from "@/lib/i18n";

export default function PhForm({
  onAdd,
  defaultLocation,
}: {
  onAdd: (r: Reading) => void;
  defaultLocation?: string;
}) {
  const { t } = useI18n();
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [location, setLocation] = useState<string>(defaultLocation ?? "Field A");
  const [ph, setPh] = useState<string>("");
  const [n, setN] = useState<string>("");
  const [k, setK] = useState<string>("");
  const [moisture, setMoisture] = useState<string>("");
  const [hydrogen, setHydrogen] = useState<string>("");
  const [cropType, setCropType] = useState<string>("");
  const [soilColor, setSoilColor] = useState<string>("");
  const [seedType, setSeedType] = useState<string>("");
  const [fertilizerUsed, setFertilizerUsed] = useState<string>("");
  const [pesticideUsed, setPesticideUsed] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const phVal = Number(ph);
    if (!location.trim() || !date || isNaN(phVal) || phVal < 0 || phVal > 14) return;
    const reading: Reading = {
      id: crypto.randomUUID(),
      date,
      location: location.trim(),
      ph: phVal,
      n: n ? Number(n) : undefined,
      k: k ? Number(k) : undefined,
      moisture: moisture ? Number(moisture) : undefined,
      hydrogen: hydrogen ? Number(hydrogen) : undefined,
      cropType: cropType || undefined,
      soilColor: soilColor || undefined,
      seedType: seedType || undefined,
      fertilizerUsed: fertilizerUsed || undefined,
      pesticideUsed: pesticideUsed || undefined,
      notes: notes.trim() || undefined,
    };
    onAdd(reading);
    setPh("");
    setN("");
    setK("");
    setMoisture("");
    setHydrogen("");
    setCropType("");
    setSoilColor("");
    setSeedType("");
    setFertilizerUsed("");
    setPesticideUsed("");
    setNotes("");
  }

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="space-y-2">
        <Label htmlFor="date">{t("date")}</Label>
        <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">{t("location")}</Label>
        <Input id="location" placeholder="e.g., North Field" value={location} onChange={(e) => setLocation(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="ph">{t("ph")}</Label>
        <Input id="ph" type="number" inputMode="decimal" step="0.1" min={0} max={14} placeholder="6.5" value={ph} onChange={(e) => setPh(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="moisture">{t("moisture")}</Label>
        <Input id="moisture" type="number" inputMode="decimal" step="1" min={0} max={100} placeholder="45" value={moisture} onChange={(e) => setMoisture(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="n">{t("n")}</Label>
        <Input id="n" type="number" inputMode="decimal" step="1" min={0} placeholder="25" value={n} onChange={(e) => setN(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="k">{t("k")}</Label>
        <Input id="k" type="number" inputMode="decimal" step="1" min={0} placeholder="80" value={k} onChange={(e) => setK(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="hydrogen">{t("hydrogen")}</Label>
        <Input id="hydrogen" type="number" inputMode="decimal" step="1" min={0} placeholder="" value={hydrogen} onChange={(e) => setHydrogen(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cropType">{t("crop_type")}</Label>
        <Input id="cropType" value={cropType} onChange={(e) => setCropType(e.target.value)} placeholder="e.g., Wheat" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="soilColor">{t("soil_color")}</Label>
        <Input id="soilColor" value={soilColor} onChange={(e) => setSoilColor(e.target.value)} placeholder="e.g., Dark brown" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="seedType">{t("seed_type")}</Label>
        <Input id="seedType" value={seedType} onChange={(e) => setSeedType(e.target.value)} placeholder="e.g., Hybrid" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="fertilizerUsed">{t("fertilizer")}</Label>
        <Input id="fertilizerUsed" value={fertilizerUsed} onChange={(e) => setFertilizerUsed(e.target.value)} placeholder="e.g., Urea 46% N" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="pesticideUsed">{t("pesticide")}</Label>
        <Input id="pesticideUsed" value={pesticideUsed} onChange={(e) => setPesticideUsed(e.target.value)} placeholder="e.g., Neem oil" />
      </div>
      <div className="space-y-2 sm:col-span-2 lg:col-span-2">
        <Label htmlFor="notes">{t("notes_opt")}</Label>
        <Textarea id="notes" placeholder="Fertilizer applied, rainfall, crop stage..." value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>
      <div className="sm:col-span-2 lg:col-span-4">
        <Button type="submit" className="w-full">{t("add")}</Button>
      </div>
    </form>
  );
}
