import { parseBundle, getPatientName } from "@/lib/fhir";
import type { ParsedObservation } from "@/types/observations";

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export type SortOrder = "asc" | "desc" | "random";

const FETCH_ALL_COUNT = 20;

async function fetchBundle(
  params: Record<string, string | number>,
): Promise<fhir4.Bundle> {
  const url = new URL(BASE_URL);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }

  const res = await fetch(url.toString());

  if (!res.ok) {
    throw new Error(`Observations API error: ${res.status}`);
  }

  return res.json() as Promise<fhir4.Bundle>;
}

export async function fetchAllObservations(
  sort: SortOrder,
): Promise<{ observations: ParsedObservation[]; patientName: string | null }> {
  const bundle = await fetchBundle({ count: FETCH_ALL_COUNT, sort });

  return {
    observations: parseBundle(bundle),
    patientName: getPatientName(bundle),
  };
}

export async function fetchObservationsPage(
  page: number,
  pageSize: number,
  sort: SortOrder,
): Promise<{ observations: ParsedObservation[]; total: number }> {
  const bundle = await fetchBundle({ page, pageSize, sort });

  return {
    observations: parseBundle(bundle),
    total: bundle.total ?? 0,
  };
}
