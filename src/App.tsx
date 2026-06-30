import { OverviewCards } from "@/components/OverviewCards";
import { MeasurementsTable } from "@/components/MeasurementsTable";
import { useSummaryMetrics } from "@/hooks/useObservations";

function App() {
  const { patientName } = useSummaryMetrics();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-foreground">
            Body Check Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">{patientName}</p>
        </header>
        <OverviewCards />
        <MeasurementsTable />
      </div>
    </div>
  );
}

export default App;
