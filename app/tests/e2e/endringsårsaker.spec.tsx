import { expect, Page, test } from "@playwright/test";

import {
  expectError,
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

  await expect(page.getByText("Legg inn dato for :")).toBeVisible({
    visible: false,
  });

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
  await page.getByText("Ansatt har fremdeles sykefravær").click();
  await expect(page.getByText("Til og med")).toBeDisabled();

  await page
    .getByLabel("Hva er årsaken til endringen?")
    .selectOption("Permisjon");
  await expect(page.getByText(`Legg inn periode for permisjon:`)).toBeVisible({
    visible: true,
  });
  await expect(page.getByText("Fra og med")).toBeVisible({ visible: true });
  await expect(page.getByText("Til og med")).toBeVisible({ visible: true });
  await page.getByText("Ansatt er fremdeles i permisjon").click();

  await expect(page.getByText("Til og med")).toBeEnabled();

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
  await page.getByText("Ansatt er fremdeles permittert").click();
  await expect(page.getByText("Til og med")).toBeDisabled();
});

test("oppsummering vises riktig når tomdato er gjort valgfri", async ({
  page,
}) => {
  await mockOpplysninger({ page });
  await mockGrunnbeløp({ page });
  await mockInntektsmeldinger({ page });

  await page.goto("/fp-im-dialog/1/dine-opplysninger");
  await page.getByLabel("Telefon").fill("12312312");
  await page.getByText("Bekreft og gå videre").click();

  await page.getByRole("button", { name: "Endre månedslønn" }).click();
  await page.getByText("Endret månedsinntekt").fill("50000");

  await page
    .getByLabel("Hva er årsaken til endringen?")
    .selectOption("Sykefravær");
  await page.getByLabel("Fra og med").fill("01.6.2020");
  await page.getByRole("button", { name: "Neste steg" }).click();
  await expectError({
    page,
    label: "Fra og med",
    error: "Lønnsendring må være før første dag med fravær",
  });
  await page.getByLabel("Fra og med").fill("01.6.2024");
  await page.getByLabel("Til og med").fill("01.7.2024");

  await page.getByText("Ansatt har fremdeles sykefravær").click();

  await page.locator('input[name="skalRefunderes"][value="NEI"]').click();
  await page.locator('input[name="misterNaturalytelser"][value="nei"]').click();
  await page.getByRole("button", { name: "Neste steg" }).click();

  await expect(
    page.getByText("Årsaker").locator("..").getByText("Sykefravær"),
  ).toBeVisible();
  await expect(
    page
      .getByText("Årsaker")
      .locator("..")
      .getByText("Fra og med 01.06.2024", { exact: true }),
  ).toBeVisible();

  await page.route(
    `**/*/imdialog/send-inntektsmelding`,
    async (route, request) => {
      const requestBody = request.postData();
      expect(JSON.parse(requestBody ?? "{}").endringAvInntektÅrsaker).toEqual([
        {
          årsak: "SYKEFRAVÆR",
          fom: "2024-06-01", // Viktig at tom er undefined.
        },
      ]);
      await route.continue();
    },
  );

  await page.getByRole("button", { name: "Send inn" }).click();
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
