import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useObservationsPage } from "@/hooks/useObservations";
import type { ParsedObservation } from "@/types/observations";

const PAGE_SIZE = 10;

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
    .format(new Date(iso))
    .replace(",", "");
}

function sortByDateDesc(
  observations: ParsedObservation[],
): ParsedObservation[] {
  return [...observations].sort((a, b) =>
    b.effectiveDateTime.localeCompare(a.effectiveDateTime),
  );
}

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: PAGE_SIZE }).map((_, i) => (
        <TableRow key={i}>
          <TableCell>
            <Skeleton className="h-4 w-20" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-36" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-36" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-4" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

export function MeasurementsTable() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useObservationsPage(page, PAGE_SIZE);

  const observations = data ? sortByDateDesc(data.observations) : [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold">Latest measurements</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Measurement</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <SkeletonRows />
          ) : (
            observations.map((obs) => (
              <TableRow key={obs.id}>
                <TableCell className="font-medium">
                  {obs.value} {obs.unit}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {obs.display}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(obs.effectiveDateTime)}
                </TableCell>
                <TableCell className="text-muted-foreground">...</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => p - 1)}
          disabled={page === 1 || isLoading}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => p + 1)}
          disabled={page >= totalPages || isLoading}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
