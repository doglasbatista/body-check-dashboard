import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface MetricCardProps {
  label: string;
  value: number | null;
  unit: string;
  date: string | null;
  isLoading: boolean;
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function MetricCard({
  label,
  value,
  unit,
  date,
  isLoading,
}: MetricCardProps) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-1 pt-4">
        {isLoading ? (
          <>
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-8 w-32 mt-1" />
            <Skeleton className="h-3 w-28 mt-1" />
          </>
        ) : (
          <>
            <span className="text-xs font-medium text-primary">{label}</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">{value ?? "—"}</span>
              {unit && (
                <span className="text-sm text-muted-foreground">{unit}</span>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {date ? formatDate(date) : "—"}
            </span>
          </>
        )}
      </CardContent>
    </Card>
  );
}
