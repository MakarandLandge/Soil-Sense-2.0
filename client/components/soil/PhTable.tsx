import { Reading } from "@/lib/soil";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function PhTable({ readings, onDelete }: { readings: Reading[]; onDelete: (id: string) => void }) {
  const { t } = useI18n();
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("th_date")}</TableHead>
            <TableHead>{t("th_location")}</TableHead>
            <TableHead>{t("th_ph")}</TableHead>
            <TableHead className="hidden lg:table-cell">{t("th_moisture")}</TableHead>
            <TableHead className="hidden xl:table-cell">{t("th_n")}</TableHead>
            <TableHead className="hidden xl:table-cell">{t("th_k")}</TableHead>
            <TableHead className="hidden md:table-cell">{t("th_crop")}</TableHead>
            <TableHead className="hidden md:table-cell">{t("th_notes")}</TableHead>
            <TableHead className="w-[60px] text-right">{t("th_actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {readings.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-muted-foreground">
                {t("empty_table")}
              </TableCell>
            </TableRow>
          ) : (
            readings
              .slice()
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.date}</TableCell>
                  <TableCell>{r.location}</TableCell>
                  <TableCell>{r.ph.toFixed(1)}</TableCell>
                  <TableCell className="hidden lg:table-cell">{r.moisture ?? "–"}</TableCell>
                  <TableCell className="hidden xl:table-cell">{r.n ?? "–"}</TableCell>
                  <TableCell className="hidden xl:table-cell">{r.k ?? "–"}</TableCell>
                  <TableCell className="hidden md:table-cell">{r.cropType ?? "–"}</TableCell>
                  <TableCell className="hidden md:table-cell max-w-[260px] truncate" title={r.notes}>{r.notes}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" aria-label="Delete" onClick={() => onDelete(r.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
