import { expect, test } from "@playwright/test";

import {
  mockGrunnbeløp,
  mockInntektsmeldinger,
  mockOpplysninger,
} from "../mocks/utils.ts";

test("Skal vise hjelpetekst", async ({ page }) => {
  await mockOpplysninger({ page });
  await mockGrunnbeløp({ page });
  await mockInntektsmeldinger({ page });

  await page.goto("/fp-im-dialog/1/dine-opplysninger");

  await expect(
    page.getByRole("checkbox", { name: "Vis hjelpetekster" }),
  ).toBeVisible();

  await page.goto("/fp-im-dialog/1/inntekts-og-refusjon");

});
