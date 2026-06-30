export const LOINC = {
  BODY_LENGTH: "8302-2",
  BODY_WEIGHT: "29463-7",
  BLOOD_OXYGEN_SATURATION: "2708-6",
  BLOOD_PRESSURE: "55284-4",
  HEART_RATE: "8867-4",
  BLOOD_GLUCOSE: "2345-7",
} as const;

export type ObservationCode = (typeof LOINC)[keyof typeof LOINC];

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
