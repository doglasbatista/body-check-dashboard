import { useSummaryMetrics } from "@/hooks/useObservations";
import { MetricCard } from "@/components/MetricCard";

export function OverviewCards() {
  const {
    bodyLength,
    bodyWeight,
    bloodSaturation,
    bloodPressure,
    heartRate,
    bmi,
    isLoading,
  } = useSummaryMetrics();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <MetricCard
        label="Body Length"
        value={bodyLength?.value ?? null}
        unit="cm"
        date={bodyLength?.effectiveDateTime ?? null}
        isLoading={isLoading}
      />
      <MetricCard
        label="Body Weight"
        value={bodyWeight?.value ?? null}
        unit="kg"
        date={bodyWeight?.effectiveDateTime ?? null}
        isLoading={isLoading}
      />
      <MetricCard
        label="Body Mass Index"
        value={bmi !== null ? Math.round(bmi * 10) / 10 : null}
        unit=""
        date={bodyWeight?.effectiveDateTime ?? null}
        isLoading={isLoading}
      />
      <MetricCard
        label="Blood Saturation"
        value={bloodSaturation?.value ?? null}
        unit="%"
        date={bloodSaturation?.effectiveDateTime ?? null}
        isLoading={isLoading}
      />
      <MetricCard
        label="Blood Pressure"
        value={bloodPressure?.value ?? null}
        unit="mmHg"
        date={bloodPressure?.effectiveDateTime ?? null}
        isLoading={isLoading}
      />
      <MetricCard
        label="Heart Rate"
        value={heartRate?.value ?? null}
        unit="/min"
        date={heartRate?.effectiveDateTime ?? null}
        isLoading={isLoading}
      />
    </div>
  );
}
