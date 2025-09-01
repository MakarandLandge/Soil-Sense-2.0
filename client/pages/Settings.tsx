import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loadProfiles, saveProfiles, activeProfile, type Profile } from "@/lib/profiles";
import { useI18n } from "@/lib/i18n";

export default function Settings() {
  const { lang, setLang } = useI18n();
  const [weatherAlerts, setWeatherAlerts] = useState<boolean>(() => localStorage.getItem("weather_alerts") === "1");
  const [driveSync, setDriveSync] = useState<boolean>(() => localStorage.getItem("drive_sync") === "1");
  const [soilTemp, setSoilTemp] = useState<string>(() => localStorage.getItem("soil_temp_c") || "24");
  const [profiles, setProfiles] = useState<Profile[]>(() => loadProfiles());

  useEffect(() => {
    localStorage.setItem("weather_alerts", weatherAlerts ? "1" : "0");
  }, [weatherAlerts]);
  useEffect(() => {
    localStorage.setItem("drive_sync", driveSync ? "1" : "0");
  }, [driveSync]);
  useEffect(() => {
    localStorage.setItem("soil_temp_c", soilTemp);
  }, [soilTemp]);

  const current = useMemo(() => activeProfile(profiles), [profiles]);

  function setActive(id: string) {
    const next = profiles.map((p) => ({ ...p, active: p.id === id }));
    setProfiles(next);
    saveProfiles(next);
  }

  function remove(id: string) {
    const next = profiles.filter((p) => p.id !== id);
    if (!next.some((p) => p.active) && next[0]) next[0].active = true;
    setProfiles(next);
    saveProfiles(next);
  }

  function addProfile() {
    const p: Profile = { id: crypto.randomUUID(), name: "New Farmer", active: false };
    const next = [...profiles, p];
    setProfiles(next);
    saveProfiles(next);
  }

  return (
    <div className="container py-8 max-w-3xl">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      <p className="text-sm text-muted-foreground">Customize your SoilSense experience</p>

      <section className="mt-6 space-y-4">
        <div className="rounded-xl border bg-card">
          <div className="p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">Weather Alerts</div>
              <div className="text-sm text-muted-foreground">Receive notifications about weather changes</div>
            </div>
            <Switch checked={weatherAlerts} onCheckedChange={setWeatherAlerts} />
          </div>
          <div className="border-t p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">Google Drive Sync</div>
              <div className="text-sm text-muted-foreground">Backup reports to Google Drive</div>
            </div>
            <Switch checked={driveSync} onCheckedChange={setDriveSync} />
          </div>
          <div className="border-t p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">Language</div>
              <div className="text-sm text-muted-foreground">{lang === "en" ? "English" : lang === "hi" ? "Hindi" : "Marathi"}</div>
            </div>
            <select
              className="h-9 px-2 rounded-md border bg-background text-sm"
              value={lang}
              onChange={(e) => setLang(e.target.value as any)}
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="mr">Marathi</option>
            </select>
          </div>
          <div className="border-t p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">Sensor Connection</div>
              <div className="text-sm text-muted-foreground">Bluetooth pH sensors</div>
            </div>
            <Button variant="secondary">Connect</Button>
          </div>
          <div className="border-t p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">Soil Temperature</div>
              <div className="text-sm text-muted-foreground">Shown on Dashboard</div>
            </div>
            <div className="flex items-center gap-2">
              <Input className="w-24" type="number" value={soilTemp} onChange={(e) => setSoilTemp(e.target.value)} />
              <span className="text-sm">°C</span>
            </div>
          </div>
          <div className="border-t p-4 grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
            <div>
              <div className="font-medium">Weather Location</div>
              <div className="text-sm text-muted-foreground">Use device GPS or set coordinates</div>
            </div>
            <div className="flex items-center gap-2">
              <Input placeholder="Lat" className="w-32" defaultValue={localStorage.getItem("weather_lat") ?? ""} onBlur={(e) => localStorage.setItem("weather_lat", e.target.value)} />
              <Input placeholder="Lon" className="w-32" defaultValue={localStorage.getItem("weather_lon") ?? ""} onBlur={(e) => localStorage.setItem("weather_lon", e.target.value)} />
              <Button
                variant="secondary"
                onClick={() => {
                  if (!navigator.geolocation) return;
                  navigator.geolocation.getCurrentPosition((pos) => {
                    localStorage.setItem("weather_lat", String(pos.coords.latitude));
                    localStorage.setItem("weather_lon", String(pos.coords.longitude));
                    alert("Location saved");
                  });
                }}
              >Use Current</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Manage Profiles</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Manage Profiles</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              {profiles.map((p) => (
                <div key={p.id} className={`rounded-lg border p-4 ${p.active ? "bg-emerald-50 border-emerald-200" : ""}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-medium flex items-center gap-2">{p.name} {p.active && <span className="text-xs text-emerald-700">Current Profile</span>}</div>
                      <div className="text-sm text-muted-foreground">{p.location}</div>
                      <div className="mt-1 flex flex-wrap gap-2 text-xs">
                        {p.experience && <span className="px-2 py-0.5 rounded-full bg-secondary">{p.experience}</span>}
                        {p.tags?.map((t) => (
                          <span key={t} className="px-2 py-0.5 rounded-full bg-secondary">{t}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!p.active && (
                        <Button size="sm" onClick={() => setActive(p.id)}>Set Active</Button>
                      )}
                      <Button size="icon" variant="ghost" onClick={() => remove(p.id)}>🗑️</Button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="pt-2">
                <Button variant="secondary" onClick={addProfile}>+ Add Profile</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </section>
    </div>
  );
}
