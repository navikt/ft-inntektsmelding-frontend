import { expect, Page, test } from "@playwright/test";

import {
  mockGrunnbeløp,
  mockInntektsmeldinger,
  mockOpplysninger,
} from "../mocks/utils.ts";

test("endringsårsaker uten ekstra felter", async ({ page }) => {
  await mockOpplysninger({ page });
  await mockGrunnbeløp({ page });
  await mockInntektsmeldinger({ page });

  await page.goto("/fp-im-dialog/1/inntekt-og-refusjon");
  await page.getByRole("button", { name: "Endre månedslønn" }).click();
  await expect(
    page.getByText("Dette hjelper oss å forstå avviket fra rapportert lønn."),
  ).toBeVisible();

  await page.getByLabel("Hva er årsaken til endringen?").selectOption("Bonus");
  await expect(page.getByText("Fra og med")).toBeVisible({ visible: false });
  await expect(page.getByText("Til og med")).toBeVisible({ visible: false });

  await page
    .getByLabel("Hva er årsaken til endringen?")
    .selectOption("Nyansatt");
  await expect(page.getByText("Fra og med")).toBeVisible({ visible: false });
  await expect(page.getByText("Til og med")).toBeVisible({ visible: false });
  await page
    .getByLabel("Hva er årsaken til endringen?")
    .selectOption("Ferietrekk / utbetaling av feriepenger");
  await expect(page.getByText("Fra og med")).toBeVisible({ visible: false });
  await expect(page.getByText("Til og med")).toBeVisible({ visible: false });
  await page
    .getByLabel("Hva er årsaken til endringen?")
    .selectOption("Mangelfull eller uriktig rapportering til A-ordningen");
  await expect(page.getByText("Fra og med")).toBeVisible({ visible: false });
  await expect(page.getByText("Til og med")).toBeVisible({ visible: false });
});

test("endringsårsaker med fom dato", async ({ page }) => {
  await mockOpplysninger({ page });
  await mockGrunnbeløp({ page });
  await mockInntektsmeldinger({ page });

  await page.goto("/fp-im-dialog/1/inntekt-og-refusjon");
  await page.getByRole("button", { name: "Endre månedslønn" }).click();
  await expect(
    page.getByText("Dette hjelper oss å forstå avviket fra rapportert lønn."),
  ).toBeVisible();

  await forventFomDatoForEndringsÅrsak({
    page,
    endringsÅrsak: "Varig lønnsendring",
  });
  await forventFomDatoForEndringsÅrsak({ page, endringsÅrsak: "Ny stilling" });
  await forventFomDatoForEndringsÅrsak({
    page,
    endringsÅrsak: "Ny stillingsprosent",
  });
});

test("endringsårsaker med fom og tom dato (kun ferie)", async ({ page }) => {
  await mockOpplysninger({ page });
  await mockGrunnbeløp({ page });
  await mockInntektsmeldinger({ page });

  await page.goto("/fp-im-dialog/1/inntekt-og-refusjon");
  await page.getByRole("button", { name: "Endre månedslønn" }).click();
  await expect(
    page.getByText("Dette hjelper oss å forstå avviket fra rapportert lønn."),
  ).toBeVisible();

  await page.getByLabel("Hva er årsaken til endringen?").selectOption("Ferie");
  await expect(page.getByText(`Legg inn periode for ferie:`)).toBeVisible({
    visible: true,
  });
  await expect(page.getByText("Fra og med")).toBeVisible({ visible: true });
  await expect(page.getByText("Til og med")).toBeVisible({ visible: true });
});

test("endringsårsaker med fom og valgfri tom dato", async ({ page }) => {
  await mockOpplysninger({ page });
  await mockGrunnbeløp({ page });
  await mockInntektsmeldinger({ page });

  await page.goto("/fp-im-dialog/1/inntekt-og-refusjon");
  await page.getByRole("button", { name: "Endre månedslønn" }).click();
  await expect(
    page.getByText("Dette hjelper oss å forstå avviket fra rapportert lønn."),
  ).toBeVisible();

  await page
    .getByLabel("Hva er årsaken til endringen?")
    .selectOption("Sykefravær");
  await expect(page.getByText(`Legg inn periode for sykefravær:`)).toBeVisible({
    visible: true,
  });
  await expect(page.getByText("Fra og med")).toBeVisible({ visible: true });
  await expect(page.getByText("Til og med")).toBeVisible({ visible: true });
  await expect(page.getByText("Ansatt har fremdeles sykefravær")).toBeVisible({
    visible: true,
  });

  await page
    .getByLabel("Hva er årsaken til endringen?")
    .selectOption("Permisjon");
  await expect(page.getByText(`Legg inn periode for permisjon:`)).toBeVisible({
    visible: true,
  });
  await expect(page.getByText("Fra og med")).toBeVisible({ visible: true });
  await expect(page.getByText("Til og med")).toBeVisible({ visible: true });
  await expect(page.getByText("Ansatt er fremdeles permittert")).toBeVisible({
    visible: true,
  });

  await page
    .getByLabel("Hva er årsaken til endringen?")
    .selectOption("Permittering");
  await expect(
    page.getByText(`Legg inn periode for permittering:`),
  ).toBeVisible({
    visible: true,
  });
  await expect(page.getByText("Fra og med")).toBeVisible({ visible: true });
  await expect(page.getByText("Til og med")).toBeVisible({ visible: true });
  await expect(page.getByText("Ansatt er fremdeles i permisjon")).toBeVisible({
    visible: true,
  });
});

const forventFomDatoForEndringsÅrsak = async ({
  page,
  endringsÅrsak,
}: {
  page: Page;
  endringsÅrsak: string;
}) => {
  await page
    .getByLabel("Hva er årsaken til endringen?")
    .selectOption(endringsÅrsak);
  await expect(
    page.getByText(`Legg inn dato for ${endringsÅrsak}:`),
  ).toBeVisible({
    visible: true,
  });
  await expect(page.getByText("Fra og med")).toBeVisible({ visible: true });
  await expect(page.getByText("Til og med")).toBeVisible({ visible: false });
};
