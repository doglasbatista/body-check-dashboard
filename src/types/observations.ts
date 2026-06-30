export type ObservationCode =
  | "8302-2" // Body Length
  | "29463-7" // Body Weight
  | "2708-6" // Blood Oxygen Saturation
  | "55284-4" // Blood Pressure
  | "8867-4" // Heart Rate (rest)
  | "2345-7"; // Blood Glucose Level

export interface ParsedObservation {
  id: string;
  code: ObservationCode;
  display: string;
  value: number;
  unit: string;
  effectiveDateTime: string;
}

export interface SummaryMetrics {
  bodyLength: ParsedObservation | null;
  bodyWeight: ParsedObservation | null;
  bloodSaturation: ParsedObservation | null;
  bloodPressure: ParsedObservation | null;
  heartRate: ParsedObservation | null;
  bmi: number | null;
}
