import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateShort } from "@/lib/format";

interface MetricCardProps {
  label: string;
  value: number | null;
  unit: string;
  date: string | null;
  isLoading: boolean;
}

export function MetricCard({
  label,
  value,
  unit,
  date,
  isLoading,
}: MetricCardProps) {
  return (
    <Card className="h-[140px]">
      <CardContent className="flex flex-col gap-3 pt-4">
        {isLoading ? (
          <>
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-12 w-36" />
            <Skeleton className="h-3 w-28" />
          </>
        ) : (
          <>
            <span className="text-base font-semibold leading-none text-[#f97759]">
              {label}
            </span>
            <div className="flex h-[48px] items-end gap-1">
              <span className="text-5xl font-extrabold leading-none text-card-foreground">
                {value ?? "—"}
              </span>
              {unit && (
                <span className="pb-1 text-base font-medium text-muted-foreground">
                  {unit}
                </span>
              )}
            </div>
            <span className="text-sm text-muted-foreground">
              {date ? formatDateShort(date) : "—"}
            </span>
          </>
        )}
      </CardContent>
    </Card>
  );
}
