import { OverviewCards } from "@/components/OverviewCards";
import { MeasurementsTable } from "@/components/MeasurementsTable";
import { usePatientName } from "@/hooks/useObservations";

function App() {
  const patientName = usePatientName();

  return (
    <div className="min-h-screen bg-[#eeeff0]">
      <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
        <header className="pt-4">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Body Check Dashboard
          </h1>
          <p className="text-2xl font-medium text-slate-500">{patientName}</p>
        </header>
        <OverviewCards />
        <MeasurementsTable />
      </div>
    </div>
  );
}

export default App;
