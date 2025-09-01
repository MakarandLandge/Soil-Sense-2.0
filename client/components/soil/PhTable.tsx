import { Reading } from "@/lib/soil";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function PhTable({ readings, onDelete }: { readings: Reading[]; onDelete: (id: string) => void }) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>pH</TableHead>
            <TableHead className="hidden md:table-cell">Notes</TableHead>
            <TableHead className="w-[60px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {readings.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No readings yet. Add your first measurement above.
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
                  <TableCell className="hidden md:table-cell max-w-[300px] truncate" title={r.notes}>{r.notes}</TableCell>
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
