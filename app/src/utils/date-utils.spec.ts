import { describe, expect, test } from "vitest";

import {
  dagerTilPerioder,
  perioderOverlapper,
  periodeTilDager,
} from "./date-utils";

describe("dagerTilPerioder", () => {
  test("should return an array of periods", () => {
    const dager = [
      "2024-03-01",
      "2024-03-02",
      "2024-03-03",
      "2024-03-04",
      "2024-03-05",
    ];
    const perioder = dagerTilPerioder(dager);
    expect(perioder).toEqual([{ fom: "2024-03-01", tom: "2024-03-05" }]);
  });

  test("should return an array of periods with multiple periods", () => {
    const dager = ["2024-03-01", "2024-03-02", "2024-03-04", "2024-03-05"];
    const perioder = dagerTilPerioder(dager);
    expect(perioder).toEqual([
      { fom: "2024-03-01", tom: "2024-03-02" },
      { fom: "2024-03-04", tom: "2024-03-05" },
    ]);
  });
});

describe("periodeTilDager", () => {
  test("should return an array of dates", () => {
    const perioder = { fom: "2024-03-01", tom: "2024-03-05" };
    const dager = periodeTilDager(perioder);
    expect(dager).toEqual([
      "2024-03-01",
      "2024-03-02",
      "2024-03-03",
      "2024-03-04",
      "2024-03-05",
    ]);
  });
});

describe("perioderOverlapper", () => {
  test("should return true when periods overlap on same day", () => {
    const perioder1 = [{ fom: "2024-03-01", tom: "2024-03-05" }];
    const perioder2 = [{ fom: "2024-03-05", tom: "2024-03-10" }];

    expect(perioderOverlapper(perioder1, perioder2)).toBe(true);
  });

  test("should return true when one period is completely within another", () => {
    const perioder1 = [{ fom: "2024-03-01", tom: "2024-03-10" }];
    const perioder2 = [{ fom: "2024-03-03", tom: "2024-03-07" }];

    expect(perioderOverlapper(perioder1, perioder2)).toBe(true);
  });

  test("should return false when periods do not overlap", () => {
    const perioder1 = [{ fom: "2024-03-01", tom: "2024-03-05" }];
    const perioder2 = [{ fom: "2024-03-06", tom: "2024-03-10" }];

    expect(perioderOverlapper(perioder1, perioder2)).toBe(false);
  });

  test("should handle multiple periods in each array", () => {
    const perioder1 = [
      { fom: "2024-03-01", tom: "2024-03-03" },
      { fom: "2024-03-10", tom: "2024-03-15" },
    ];
    const perioder2 = [
      { fom: "2024-03-04", tom: "2024-03-08" },
      { fom: "2024-03-14", tom: "2024-03-16" },
    ];

    expect(perioderOverlapper(perioder1, perioder2)).toBe(true);
  });

  test("should return false when both arrays are empty", () => {
    expect(perioderOverlapper([], [])).toBe(false);
  });

  test("should handle single-day periods", () => {
    const perioder1 = [{ fom: "2024-03-01", tom: "2024-03-01" }];
    const perioder2 = [{ fom: "2024-03-01", tom: "2024-03-01" }];

    expect(perioderOverlapper(perioder1, perioder2)).toBe(true);
  });

  test("should return false when one array is empty", () => {
    const perioder1 = [{ fom: "2024-03-01", tom: "2024-03-05" }];

    expect(perioderOverlapper(perioder1, [])).toBe(false);
    expect(perioderOverlapper([], perioder1)).toBe(false);
  });
});
