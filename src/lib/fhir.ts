import type { ObservationCode, ParsedObservation } from '@/types/observations'

const KNOWN_CODES = new Set<ObservationCode>([
  '8302-2',
  '29463-7',
  '2708-6',
  '55284-4',
  '8867-4',
  '2345-7',
])

function isObservationCode(code: string): code is ObservationCode {
  return KNOWN_CODES.has(code as ObservationCode)
}

export function parseBundle(bundle: fhir4.Bundle): ParsedObservation[] {
  if (!bundle.entry) return []

  const results: ParsedObservation[] = []

  for (const entry of bundle.entry) {
    const resource = entry.resource
    if (!resource || resource.resourceType !== 'Observation') continue

    const obs = resource as fhir4.Observation
    const loincCode = obs.code?.coding?.[0]?.code
    const display = obs.code?.coding?.[0]?.display
    const value = obs.valueQuantity?.value
    const unit = obs.valueQuantity?.unit
    const effectiveDateTime = obs.effectiveDateTime

    if (
      !loincCode ||
      !isObservationCode(loincCode) ||
      value == null ||
      !unit ||
      !effectiveDateTime ||
      !display
    ) {
      continue
    }

    results.push({
      id: obs.id ?? crypto.randomUUID(),
      code: loincCode,
      display,
      value,
      unit,
      effectiveDateTime,
    })
  }

  return results
}

export function getLatestPerType(
  observations: ParsedObservation[],
): Partial<Record<ObservationCode, ParsedObservation>> {
  const latest: Partial<Record<ObservationCode, ParsedObservation>> = {}

  for (const obs of observations) {
    const current = latest[obs.code]
    if (!current || obs.effectiveDateTime > current.effectiveDateTime) {
      latest[obs.code] = obs
    }
  }

  return latest
}

export function calculateBmi(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100
  return weightKg / (heightM * heightM)
}
