import { expect, test } from "@playwright/test";

import {
  mockGrunnbeløp,
  mockInntektsmeldinger,
  mockOpplysninger,
} from "../mocks/utils.ts";

test("Skal toggle hjelpetekster med switch", async ({ page }) => {
  await mockOpplysninger({ page });
  await mockGrunnbeløp({ page });
  await mockInntektsmeldinger({ page });

  await page.goto("/fp-im-dialog/1/dine-opplysninger");
  await expect(
    page.getByRole("checkbox", { name: "Vis hjelpetekster" }),
  ).toBeChecked();

  await page.goto("/fp-im-dialog/1/inntekt-og-refusjon");
  await expect(page.getByText("Hva betyr dette?")).toBeVisible();
  await page.getByRole("checkbox", { name: "Vis hjelpetekster" }).click();
  await expect(page.getByText("Hva betyr dette?")).toBeVisible({
    visible: false,
  });
  await page.getByRole("checkbox", { name: "Vis hjelpetekster" }).click();
  await expect(page.getByText("Hva betyr dette?")).toBeVisible({
    visible: true,
  });
});
