import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  fetchAllObservations,
  fetchObservationsPage,
} from "@/api/observations";
import { getLatestPerType, calculateBmi } from "@/lib/fhir";
import type { SortOrder } from "@/api/observations";
import { LOINC } from "@/types/observations";
import type { SummaryMetrics } from "@/types/observations";

const DEFAULT_SORT: SortOrder = "desc";

export function useAllObservations() {
  return useQuery({
    queryKey: ["observations", "all"],
    queryFn: () => fetchAllObservations(DEFAULT_SORT),
    staleTime: Infinity,
  });
}

export function useSummaryMetrics(): SummaryMetrics & {
  isLoading: boolean;
  isError: boolean;
} {
  const { data, isLoading, isError } = useAllObservations();

  const metrics = useMemo<SummaryMetrics>(() => {
    if (!data) {
      return {
        bodyLength: null,
        bodyWeight: null,
        bloodSaturation: null,
        bloodPressure: null,
        heartRate: null,
        bmi: null,
      };
    }

    const latest = getLatestPerType(data.observations);

    const bodyLength = latest[LOINC.BODY_LENGTH] ?? null;
    const bodyWeight = latest[LOINC.BODY_WEIGHT] ?? null;

    const bmi =
      bodyWeight && bodyLength
        ? calculateBmi(bodyWeight.value, bodyLength.value)
        : null;

    return {
      bodyLength,
      bodyWeight,
      bloodSaturation: latest[LOINC.BLOOD_OXYGEN_SATURATION] ?? null,
      bloodPressure: latest[LOINC.BLOOD_PRESSURE] ?? null,
      heartRate: latest[LOINC.HEART_RATE] ?? null,
      bmi,
    };
  }, [data]);

  return { ...metrics, isLoading, isError };
}

export function usePatientName(): string | null {
  const { data } = useAllObservations();
  return data?.patientName ?? null;
}

export function useObservationsPage(page: number, pageSize: number) {
  return useQuery({
    queryKey: ["observations", "page", page, pageSize],
    queryFn: () => fetchObservationsPage(page, pageSize, DEFAULT_SORT),
  });
}
