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

  await expect(
    beregnetMånedslønn.getByTestId("alert-ikke-rapportert-brukt-i-snitt"),
  ).toBeVisible({ visible: false });
  await expect(
    beregnetMånedslønn.getByTestId("alert-ikke-rapportert-frist-ikke-passert"),
  ).toBeVisible({ visible: false });
});

test("[01.05] Siste måned er ikke rapportert - frist ikke passert", async ({
  page,
}) => {
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

  await expect(
    beregnetMånedslønn.getByTestId("alert-ikke-rapportert-brukt-i-snitt"),
  ).toBeVisible({ visible: false });
  await expect(
    beregnetMånedslønn.getByTestId("alert-ikke-rapportert-frist-ikke-passert"),
  ).toBeVisible({ visible: true });
});

test("[08.05] mangler siste måned men brukt i gjennomsnitt - frist passert", async ({
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
  await expect(
    beregnetMånedslønn.getByText("April:Ikke rapportert"),
  ).toBeVisible();
  await expect(
    page.getByTestId("gjennomsnittinntekt-block").getByText("34 000"),
  ).toBeVisible();
  await expect(
    page
      .getByTestId("gjennomsnittinntekt-block")
      .getByText("Gjennomsnittet av lønn fra februar, mars og april"),
  ).toBeVisible();

  await expect(
    beregnetMånedslønn.getByTestId("alert-ikke-rapportert-brukt-i-snitt"),
  ).toBeVisible({ visible: true });
  await expect(
    beregnetMånedslønn.getByTestId("alert-ikke-rapportert-frist-ikke-passert"),
  ).toBeVisible({ visible: false });
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

  await expect(beregnetMånedslønn.getByText("Desember:52 000")).toBeVisible();
  await expect(beregnetMånedslønn.getByText("Januar:52 000")).toBeVisible();
  await expect(beregnetMånedslønn.getByText("Februar:52 000")).toBeVisible();
  await expect(
    beregnetMånedslønn.getByText("Mars:Ikke rapportert"),
  ).toBeVisible();
  await expect(
    beregnetMånedslønn.getByText("April:Ikke rapportert"),
  ).toBeVisible();

  await expect(
    page.getByTestId("gjennomsnittinntekt-block").getByText("52 000"),
  ).toBeVisible();
  await expect(
    page
      .getByTestId("gjennomsnittinntekt-block")
      .getByText("Gjennomsnittet av lønn fra desember, januar og februar"),
  ).toBeVisible();

  await expect(
    beregnetMånedslønn.getByTestId("alert-ikke-rapportert-brukt-i-snitt"),
  ).toBeVisible({ visible: false });
  await expect(
    beregnetMånedslønn.getByTestId("alert-ikke-rapportert-frist-ikke-passert"),
  ).toBeVisible({ visible: true });
});
