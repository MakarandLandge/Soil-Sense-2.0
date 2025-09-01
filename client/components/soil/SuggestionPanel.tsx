import { Suggestion } from "@/lib/soil";
import { CheckCircle2, AlertTriangle, Info } from "lucide-react";

export default function SuggestionPanel({ suggestion }: { suggestion: Suggestion }) {
  const tone =
    suggestion.status === "optimal"
      ? "bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-100 dark:border-emerald-800"
      : suggestion.status === "acidic"
        ? "bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-900/20 dark:text-amber-100 dark:border-amber-800"
        : "bg-sky-50 text-sky-900 border-sky-200 dark:bg-sky-900/20 dark:text-sky-100 dark:border-sky-800";
  const Icon = suggestion.status === "optimal" ? CheckCircle2 : suggestion.status === "acidic" ? AlertTriangle : Info;
  return (
    <div className={`rounded-lg border p-4 ${tone}`}>
      <div className="flex items-start gap-3">
        <span className="mt-0.5"><Icon className="h-5 w-5" /></span>
        <div>
          <h3 className="font-semibold leading-tight">{suggestion.headline}</h3>
          <ul className="mt-2 list-disc pl-5 space-y-1 text-sm opacity-90">
            {suggestion.details.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
