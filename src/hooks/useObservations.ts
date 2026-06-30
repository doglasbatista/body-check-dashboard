import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  fetchAllObservations,
  fetchObservationsPage,
} from "@/api/observations";
import { getLatestPerType, calculateBmi } from "@/lib/fhir";

import type { SortOrder } from "@/api/observations";
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
  patientName: string | null;
  isLoading: boolean;
  isError: boolean;
} {
  const { data, isLoading, isError } = useAllObservations();

  const metrics = useMemo<
    SummaryMetrics & { patientName: string | null }
  >(() => {
    if (!data) {
      return {
        bodyLength: null,
        bodyWeight: null,
        bloodSaturation: null,
        bloodPressure: null,
        heartRate: null,
        bmi: null,
        patientName: null,
      };
    }

    const latest = getLatestPerType(data.observations);

    const bodyLength = latest["8302-2"] ?? null;
    const bodyWeight = latest["29463-7"] ?? null;

    const bmi =
      bodyWeight && bodyLength
        ? calculateBmi(bodyWeight.value, bodyLength.value)
        : null;

    return {
      bodyLength,
      bodyWeight,
      bloodSaturation: latest["2708-6"] ?? null,
      bloodPressure: latest["55284-4"] ?? null,
      heartRate: latest["8867-4"] ?? null,
      bmi,
      patientName: data.patientName,
    };
  }, [data]);

  return { ...metrics, isLoading, isError };
}

export function useObservationsPage(page: number, pageSize: number) {
  return useQuery({
    queryKey: ["observations", "page", page, pageSize],
    queryFn: () => fetchObservationsPage(page, pageSize, DEFAULT_SORT),
  });
}
