import { expect, test } from "@playwright/test";

import { svpOpplysninger } from "../mocks/opplysninger.ts";
import {
  mockGrunnbeløp,
  mockInntektsmeldinger,
  mockOpplysninger,
} from "../mocks/utils.ts";

test("Skal toggle hjelpetekster med switch", async ({ page }) => {
  await mockOpplysninger({ page });
  await mockGrunnbeløp({ page });
  await mockInntektsmeldinger({ page });

  await page.goto("/k9-im-dialog/1/dine-opplysninger");
  await expect(
    page.getByRole("checkbox", { name: "Vis hjelpetekster" }),
  ).toBeChecked();

  await page.goto("/k9-im-dialog/1/inntekt-og-refusjon");
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

test("'Hva betyr dette' skal ha riktig tekst for pleiepenger", async ({
  page,
}) => {
  await mockOpplysninger({ page });
  await mockGrunnbeløp({ page });
  await mockInntektsmeldinger({ page });

  await page.goto("/k9-im-dialog/1/inntekt-og-refusjon");
  await page.getByText("Hva betyr dette?").click();

  await expect(
    page.getByText(
      "Dette er den første dagen den ansatte har søkt om pleiepenger sykt barn.",
    ),
  ).toBeVisible();
});
