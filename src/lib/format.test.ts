import { describe, it, expect } from "vitest";
import { roundBmi, formatDateShort, formatDateFull } from "./format";

describe("roundBmi", () => {
  it("leaves an already-rounded value unchanged", () => {
    expect(roundBmi(24.0)).toBe(24);
  });

  it("rounds up at .55", () => {
    expect(roundBmi(24.55)).toBe(24.6);
  });

  it("rounds down at .94 → .9", () => {
    expect(roundBmi(24.94)).toBe(24.9);
  });

  it("handles zero", () => {
    expect(roundBmi(0)).toBe(0);
  });
});

describe("formatDateShort", () => {
  const iso = "2018-04-12T10:00:00Z";

  it("includes the year", () => {
    expect(formatDateShort(iso)).toContain("2018");
  });

  it("includes the abbreviated month", () => {
    expect(formatDateShort(iso)).toContain("Apr");
  });

  it("includes the day", () => {
    expect(formatDateShort(iso)).toContain("12");
  });

  it("does not contain a comma", () => {
    expect(formatDateShort(iso)).not.toContain(",");
  });
});

describe("formatDateFull", () => {
  const iso = "2022-07-06T20:31:41Z";

  it("includes the year", () => {
    expect(formatDateFull(iso)).toContain("2022");
  });

  it("includes zero-padded day and month", () => {
    const result = formatDateFull(iso);
    expect(result).toContain("06");
    expect(result).toContain("07");
  });

  it("includes hours, minutes, and seconds", () => {
    const result = formatDateFull(iso);
    expect(result).toContain("20");
    expect(result).toContain("31");
    expect(result).toContain("41");
  });

  it("does not contain a comma", () => {
    expect(formatDateFull(iso)).not.toContain(",");
  });
});
