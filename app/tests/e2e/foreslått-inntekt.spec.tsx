import { expect, test } from "@playwright/test";
import {
  mockGrunnbeløp,
  mockInntektsmeldinger,
  mockOpplysninger,
} from "tests/mocks/utils";

import {
  enkeltOpplysningerResponse,
  opplysningerMedFlereEnn3Måneder,
  opplysningerMedSisteMånedIkkeRapportertFørRapporteringsfrist,
  opplysningerMedSisteMånedRapportert0,
} from "../mocks/opplysninger.ts";

test("[08.05] Alle 3 måneder har rapportert inntekt", async ({ page }) => {
  await mockOpplysninger({ page, json: enkeltOpplysningerResponse });
  await mockGrunnbeløp({ page });
  await mockInntektsmeldinger({
    page,
  });

  await page.goto("/fp-im-dialog/1/inntekt-og-refusjon");

  const beregnetMånedslønn = page
    .getByRole("heading", { name: "Beregnet månedslønn" })
    .locator("..");

  await expect(beregnetMånedslønn.getByText("Februar:52 000")).toBeVisible();
  await expect(beregnetMånedslønn.getByText("Mars:50 000")).toBeVisible();
  await expect(beregnetMånedslønn.getByText("April:57 000")).toBeVisible();
  await expect(
    page.getByTestId("gjennomsnittinntekt-block").getByText("53 000"),
  ).toBeVisible();
});

test("[01.05] Siste måned er ikke rapportert", async ({ page }) => {
  await mockOpplysninger({
    page,
    json: opplysningerMedSisteMånedIkkeRapportertFørRapporteringsfrist,
  });
  await mockGrunnbeløp({ page });
  await mockInntektsmeldinger({
    page,
  });

  await page.goto("/fp-im-dialog/1/inntekt-og-refusjon");

  const beregnetMånedslønn = page
    .getByRole("heading", { name: "Beregnet månedslønn" })
    .locator("..");

  await expect(beregnetMånedslønn.getByText("Januar:53 000")).toBeVisible();
  await expect(beregnetMånedslønn.getByText("Februar:52 000")).toBeVisible();
  await expect(beregnetMånedslønn.getByText("Mars:50 000")).toBeVisible();
  await expect(
    beregnetMånedslønn.getByText("April:Ikke rapportert"),
  ).toBeVisible();
  await expect(
    page.getByTestId("gjennomsnittinntekt-block").getByText("51 666,67"),
  ).toBeVisible();
  await expect(
    page
      .getByTestId("gjennomsnittinntekt-block")
      .getByText("Gjennomsnittet av lønn fra januar, februar og mars"),
  ).toBeVisible();
});

test("[08.05] mangler siste måned men brukt i gjennomsnitt", async ({
  page,
}) => {
  await mockOpplysninger({
    page,
    json: opplysningerMedSisteMånedRapportert0,
  });
  await mockGrunnbeløp({ page });
  await mockInntektsmeldinger({
    page,
  });

  await page.goto("/fp-im-dialog/1/inntekt-og-refusjon");

  const beregnetMånedslønn = page
    .getByRole("heading", { name: "Beregnet månedslønn" })
    .locator("..");

  await expect(beregnetMånedslønn.getByText("Februar:52 000")).toBeVisible();
  await expect(beregnetMånedslønn.getByText("Mars:50 000")).toBeVisible();
  await expect(beregnetMånedslønn.getByText("April:0")).toBeVisible();
  await expect(
    page.getByTestId("gjennomsnittinntekt-block").getByText("34 000"),
  ).toBeVisible();
});

test("[04.04] 2 siste måneder mangler før rapporteringsfrist", async ({
  page,
}) => {
  await mockOpplysninger({
    page,
    json: opplysningerMedFlereEnn3Måneder,
  });
  await mockGrunnbeløp({ page });
  await mockInntektsmeldinger({
    page,
  });

  await page.goto("/fp-im-dialog/1/inntekt-og-refusjon");

  const beregnetMånedslønn = page
    .getByRole("heading", { name: "Beregnet månedslønn" })
    .locator("..");

  await expect(beregnetMånedslønn.getByText("Februar:52 000")).toBeVisible();
  await expect(beregnetMånedslønn.getByText("Mars:50 000")).toBeVisible();
  await expect(beregnetMånedslønn.getByText("April:0")).toBeVisible();
  await expect(
    page.getByTestId("gjennomsnittinntekt-block").getByText("34 000"),
  ).toBeVisible();
});
