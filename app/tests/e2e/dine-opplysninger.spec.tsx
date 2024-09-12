import { expect, test } from "@playwright/test";
import {
  mockGrunnbeløp,
  mockGrunnlag,
  mockInntektsmeldinger,
} from "tests/mocks/utils";

test('burde vise "dine opplysninger" riktig', async ({ page }) => {
  await mockGrunnlag({ page });
  await mockGrunnbeløp({ page });
  await mockInntektsmeldinger({ page });

  await page.goto("/fp-im-dialog/1/dine-opplysninger");

  await expect(
    page.getByText("Ola Normann Hansen", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Ola Normann Hansen (123456 78901)"),
  ).toBeVisible();

  await expect(page.getByLabel("Navn")).toBeVisible();
  await expect(page.getByLabel("Navn")).toHaveValue("Kari Normann Hansen");

  await expect(page.getByLabel("Telefon")).toBeVisible();
  await expect(page.getByLabel("Telefon")).toHaveValue("12345678");
});
