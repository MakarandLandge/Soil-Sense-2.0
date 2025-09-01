import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Reading } from "@/lib/soil";

export default function PhForm({
  onAdd,
  defaultLocation,
}: {
  onAdd: (r: Reading) => void;
  defaultLocation?: string;
}) {
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [location, setLocation] = useState<string>(defaultLocation ?? "Field A");
  const [ph, setPh] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const phVal = Number(ph);
    if (!location.trim() || !date || isNaN(phVal) || phVal < 0 || phVal > 14) return;
    onAdd({ id: crypto.randomUUID(), date, location: location.trim(), ph: phVal, notes: notes.trim() || undefined });
    setPh("");
    setNotes("");
  }

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">Location / Plot</Label>
        <Input id="location" placeholder="e.g., North Field" value={location} onChange={(e) => setLocation(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="ph">pH</Label>
        <Input
          id="ph"
          type="number"
          inputMode="decimal"
          step="0.1"
          min={0}
          max={14}
          placeholder="6.5"
          value={ph}
          onChange={(e) => setPh(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2 sm:col-span-2 lg:col-span-1">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea id="notes" placeholder="Fertilizer applied, rainfall, crop stage..." value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>
      <div className="sm:col-span-2 lg:col-span-4">
        <Button type="submit" className="w-full">Add Reading</Button>
      </div>
    </form>
  );
}
