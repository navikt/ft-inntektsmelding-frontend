import { expect, test } from "@playwright/test";
import {
  mockGrunnbeløp,
  mockOpplysninger,
  mockInntektsmeldinger,
} from "tests/mocks/utils";

test('burde vise "dine opplysninger" riktig', async ({ page }) => {
  await mockOpplysninger({ page });
  await mockGrunnbeløp({ page });
  await mockInntektsmeldinger({ page });

  await page.goto("/fp-im-dialog/1/dine-opplysninger");

  await expect(
    page.getByText("Underfundig Dyreflokk", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Underfundig Dyreflokk (275278 27812)"),
  ).toBeVisible();

  await expect(page.getByLabel("Navn")).toBeVisible();
  await expect(page.getByLabel("Navn")).toHaveValue("Berømt Flyttelass");

  await expect(page.getByLabel("Telefon")).toBeVisible();
  await expect(page.getByLabel("Telefon")).toHaveValue("");
});
