export type Profile = {
  id: string;
  name: string;
  phone?: string;
  location?: string;
  experience?: string;
  tags?: string[];
  active?: boolean;
};

const KEY = "profiles_v1";

export function loadProfiles(): Profile[] {
  const raw = localStorage.getItem(KEY);
  if (raw) return JSON.parse(raw) as Profile[];
  const seed: Profile[] = [
    {
      id: crypto.randomUUID(),
      name: "Farmer Singh",
      phone: "+91 98765 43210",
      location: "Ludhiana, Punjab",
      experience: "Expert (10+ years)",
      tags: ["Organic Farming"],
      active: true,
    },
    {
      id: crypto.randomUUID(),
      name: "Rajesh Kumar",
      phone: "+91 87246 32190",
      location: "Nashik, Maharashtra",
      experience: "Intermediate (3-10 years)",
      tags: ["Crop Rotation"],
      active: false,
    },
  ];
  localStorage.setItem(KEY, JSON.stringify(seed));
  return seed;
}

export function saveProfiles(list: Profile[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function activeProfile(list: Profile[]): Profile | undefined {
  return list.find((p) => p.active) ?? list[0];
}
