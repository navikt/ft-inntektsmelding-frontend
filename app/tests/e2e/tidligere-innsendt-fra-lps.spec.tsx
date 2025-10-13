import { expect, test } from "@playwright/test";
import {
  mockGrunnbeløp,
  mockInntektsmeldinger,
  mockOpplysninger,
} from "tests/mocks/utils";

import { mangeEksisterendeInntektsmeldingerResponse } from "../mocks/eksisterende-inntektsmeldinger.ts";
import {
  enkeltOpplysningerResponse,
  fullførtOppgaveResponse,
} from "../mocks/opplysninger.ts";

test("burde vise alert dersom vi kan anta at IM er sendt inn tidligere fra LPS/Altinn", async ({
  page,
}) => {
  await mockOpplysninger({ page, json: fullførtOppgaveResponse });
  await mockGrunnbeløp({ page });
  await mockInntektsmeldinger({ page });

  await page.goto("/k9-im-dialog/1/dine-opplysninger");

  await expect(
    page.getByText(
      "Inntektsmelding er sendt inn via Altinn eller lønns- og personalsystem",
    ),
  ).toBeVisible();

  await page.getByLabel("Telefon").fill("12312312");
  await page.getByRole("button", { name: "Bekreft og gå videre" }).click();

  await expect(
    page.getByText(
      "Inntektsmelding er sendt inn via Altinn eller lønns- og personalsystem",
    ),
  ).toBeVisible({ visible: false });
});

test("burde ikke vise alert dersom IM finnes", async ({ page }) => {
  await mockOpplysninger({ page, json: enkeltOpplysningerResponse });
  await mockGrunnbeløp({ page });
  await mockInntektsmeldinger({
    page,
    json: mangeEksisterendeInntektsmeldingerResponse,
  });

  await page.goto("/k9-im-dialog/1/dine-opplysninger");

  await expect(
    page.getByRole("heading", { name: "Dine opplysninger" }),
  ).toBeVisible();

  await expect(
    page.getByText(
      "Inntektsmelding er sendt inn via Altinn eller lønns- og personalsystem",
    ),
  ).toBeVisible({ visible: false });
});
