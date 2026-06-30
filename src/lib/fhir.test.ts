import { describe, it, expect } from "vitest";
import {
  parseBundle,
  getLatestPerType,
  calculateBmi,
  getPatientName,
} from "./fhir";
import { LOINC } from "@/types/observations";

function makeObservationEntry(
  overrides: Partial<{
    id: string;
    code: string;
    display: string;
    value: number;
    unit: string;
    effectiveDateTime: string;
    subjectDisplay: string;
  }> = {},
): fhir4.BundleEntry {
  const {
    id = "obs-1",
    code = LOINC.BODY_LENGTH,
    display = "Body Height",
    value = 175,
    unit = "cm",
    effectiveDateTime = "2022-01-01T10:00:00Z",
    subjectDisplay = "John Doe",
  } = overrides;

  return {
    resource: {
      resourceType: "Observation",
      id,
      code: { coding: [{ code, display }] },
      valueQuantity: { value, unit },
      effectiveDateTime,
      subject: { display: subjectDisplay },
      status: "final",
    } as fhir4.Observation,
  };
}

function makeBundle(entries: fhir4.BundleEntry[]): fhir4.Bundle {
  return { resourceType: "Bundle", type: "searchset", entry: entries };
}

describe("parseBundle", () => {
  it("returns [] for a bundle with no entries", () => {
    expect(parseBundle({ resourceType: "Bundle", type: "searchset" })).toEqual(
      [],
    );
  });

  it("skips non-Observation entries", () => {
    const bundle = makeBundle([
      { resource: { resourceType: "Patient", id: "p1" } as fhir4.Patient },
    ]);
    expect(parseBundle(bundle)).toEqual([]);
  });

  it("skips observations with unrecognized LOINC codes", () => {
    const bundle = makeBundle([makeObservationEntry({ code: "9999-9" })]);
    expect(parseBundle(bundle)).toEqual([]);
  });

  it("skips observations missing required fields", () => {
    const entry: fhir4.BundleEntry = {
      resource: {
        resourceType: "Observation",
        id: "obs-bad",
        code: { coding: [{ code: LOINC.BODY_WEIGHT, display: "Body Weight" }] },
        status: "final",
      } as fhir4.Observation,
    };
    expect(parseBundle(makeBundle([entry]))).toEqual([]);
  });

  it("parses a valid observation entry", () => {
    const bundle = makeBundle([makeObservationEntry()]);
    const result = parseBundle(bundle);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: "obs-1",
      code: LOINC.BODY_LENGTH,
      display: "Body Height",
      value: 175,
      unit: "cm",
      effectiveDateTime: "2022-01-01T10:00:00Z",
    });
  });

  it("generates a non-empty id when obs.id is absent", () => {
    const bundle = makeBundle([
      makeObservationEntry({ id: undefined as unknown as string }),
    ]);
    const result = parseBundle(bundle);
    expect(result[0].id).toBeTruthy();
  });
});

describe("getLatestPerType", () => {
  it("returns {} for an empty array", () => {
    expect(getLatestPerType([])).toEqual({});
  });

  it("returns the single observation for one entry", () => {
    const obs = {
      id: "1",
      code: LOINC.BODY_LENGTH,
      display: "Body Height",
      value: 175,
      unit: "cm",
      effectiveDateTime: "2022-01-01T10:00:00Z",
    } as const;
    expect(getLatestPerType([obs])).toEqual({ [LOINC.BODY_LENGTH]: obs });
  });

  it("keeps the later effectiveDateTime when two entries share a code", () => {
    const older = {
      id: "1",
      code: LOINC.BODY_LENGTH,
      display: "Body Height",
      value: 170,
      unit: "cm",
      effectiveDateTime: "2021-01-01T00:00:00Z",
    } as const;
    const newer = {
      id: "2",
      code: LOINC.BODY_LENGTH,
      display: "Body Height",
      value: 175,
      unit: "cm",
      effectiveDateTime: "2022-01-01T00:00:00Z",
    } as const;
    expect(getLatestPerType([older, newer])[LOINC.BODY_LENGTH]).toBe(newer);
    expect(getLatestPerType([newer, older])[LOINC.BODY_LENGTH]).toBe(newer);
  });

  it("handles multiple codes independently", () => {
    const height = {
      id: "1",
      code: LOINC.BODY_LENGTH,
      display: "Body Height",
      value: 175,
      unit: "cm",
      effectiveDateTime: "2022-01-01T00:00:00Z",
    } as const;
    const weight = {
      id: "2",
      code: LOINC.BODY_WEIGHT,
      display: "Body Weight",
      value: 70,
      unit: "kg",
      effectiveDateTime: "2022-01-01T00:00:00Z",
    } as const;
    const result = getLatestPerType([height, weight]);
    expect(result[LOINC.BODY_LENGTH]).toBe(height);
    expect(result[LOINC.BODY_WEIGHT]).toBe(weight);
  });
});

describe("calculateBmi", () => {
  it("calculates BMI correctly for 70kg / 175cm", () => {
    expect(calculateBmi(70, 175)).toBeCloseTo(22.86, 1);
  });

  it("calculates BMI correctly for 90kg / 180cm", () => {
    expect(calculateBmi(90, 180)).toBeCloseTo(27.78, 1);
  });
});

describe("getPatientName", () => {
  it("returns null for a bundle with no entries", () => {
    expect(
      getPatientName({ resourceType: "Bundle", type: "searchset" }),
    ).toBeNull();
  });

  it("returns null when no entry has subject.display", () => {
    const entry: fhir4.BundleEntry = {
      resource: {
        resourceType: "Observation",
        id: "obs-1",
        code: { coding: [] },
        status: "final",
      } as fhir4.Observation,
    };
    expect(getPatientName(makeBundle([entry]))).toBeNull();
  });

  it("returns subject.display from the first matching entry", () => {
    const bundle = makeBundle([
      makeObservationEntry({ subjectDisplay: "Jane Doe" }),
    ]);
    expect(getPatientName(bundle)).toBe("Jane Doe");
  });

  it("skips entries without subject.display and returns the next one", () => {
    const noDisplay: fhir4.BundleEntry = {
      resource: {
        resourceType: "Observation",
        id: "obs-1",
        code: { coding: [] },
        status: "final",
      } as fhir4.Observation,
    };
    const withDisplay = makeObservationEntry({
      id: "obs-2",
      subjectDisplay: "Jane Doe",
    });
    expect(getPatientName(makeBundle([noDisplay, withDisplay]))).toBe(
      "Jane Doe",
    );
  });
});
