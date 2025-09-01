import { Button } from "@/components/ui/button";
import type { Reading, Period } from "@/lib/soil";
import { summarize } from "@/lib/soil";
import * as XLSX from "xlsx";
import { FileSpreadsheet } from "lucide-react";

export default function ExportXlsx({ readings }: { readings: Reading[] }) {
  function exportBook(period: Period) {
    if (readings.length === 0) return;

    const wb = XLSX.utils.book_new();

    // Raw data sheet
    const data = [
      ["Date", "Location", "pH", "Notes"],
      ...readings
        .slice()
        .sort((a, b) => a.date.localeCompare(b.date))
        .map((r) => [r.date, r.location, r.ph, r.notes ?? ""]),
    ];
    const wsData = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, wsData, "Readings");

    // Summary sheet by chosen period
    const summary = summarize(readings, period);
    const summaryRows: (string | number)[][] = [[`Summary (${period})`], ["Location", period === "weekly" ? "Week" : "Month", "Average pH", "Count"]];
    Object.entries(summary).forEach(([loc, rows]) => {
      rows.forEach((row) => {
        summaryRows.push([loc, row.label, row.avg, row.count]);
      });
    });
    const wsSummary = XLSX.utils.aoa_to_sheet(summaryRows);
    XLSX.utils.book_append_sheet(wb, wsSummary, period === "weekly" ? "Weekly" : "Monthly");

    const filename = `soil-ph-${period}-${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, filename);
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <Button onClick={() => exportBook("weekly")} variant="secondary">
        <FileSpreadsheet className="h-4 w-4 mr-2" /> Export Weekly XLSX
      </Button>
      <Button onClick={() => exportBook("monthly")}>
        <FileSpreadsheet className="h-4 w-4 mr-2" /> Export Monthly XLSX
      </Button>
    </div>
  );
}
