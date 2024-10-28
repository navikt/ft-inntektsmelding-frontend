import { expect, test } from "@playwright/test";
import {
  mockGrunnbeløp,
  mockGrunnlag,
  mockInntektsmeldinger,
} from "tests/mocks/utils";

test("Gå igjennom skjema og test alle valideringer", async ({ page }) => {
  await mockGrunnlag({ page });
  await mockGrunnbeløp({ page });
  await mockInntektsmeldinger({ page });

  // Skal forsøke hente eksisterende inntektsmelding og navigere til første steg når IM ikke finnes.
  await page.goto("/fp-im-dialog/1");

  await expect(
    page.getByText("Underfundig Dyreflokk", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Underfundig Dyreflokk (275278 27812)"),
  ).toBeVisible();

  await expect(page.getByLabel("Navn")).toBeVisible();
  await expect(page.getByLabel("Navn")).toHaveValue("Berømt Flyttelass");
  await page.getByLabel("Navn").click();
  await page.keyboard.type("123123123".repeat(10));

  await page.getByText("Bekreft og gå videre").click();

  // Sjekk errors.
  // TODO: sjekk selve error element og om det er gruppert sammen med input?
  await expect(
    page.getByText("Navn kan ikke være lenger enn 100 tegn"),
  ).toBeVisible();
  await expect(page.getByText("Telefonnummer er påkrevd")).toBeVisible();

  await page.getByLabel("Navn").clear();
  await page.keyboard.type("Berømt Flyttelass");

  await page.getByLabel("Telefon").fill("12312312");

  await page.getByText("Bekreft og gå videre").click();
});
