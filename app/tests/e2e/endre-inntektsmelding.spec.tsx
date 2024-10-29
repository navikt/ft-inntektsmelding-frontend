import { expect, test } from "@playwright/test";
import {
  mockGrunnbeløp,
  mockGrunnlag,
  mockInntektsmeldinger,
} from "tests/mocks/utils";

import { mangeEksisterendeInntektsmeldingerResponse } from "../mocks/eksisterende-inntektsmeldinger";

test('burde vise "vis IM"-siden for siste innsendte IM', async ({ page }) => {
  await mockGrunnlag({ page, uuid: "f29dcea7-febe-4a76-911c-ad8f6d3e8858" });
  await mockGrunnbeløp({ page });
  await mockInntektsmeldinger({
    page,
    json: mangeEksisterendeInntektsmeldingerResponse,
    uuid: "f29dcea7-febe-4a76-911c-ad8f6d3e8858",
  });

  await page.goto("/fp-im-dialog/f29dcea7-febe-4a76-911c-ad8f6d3e8858");

  await expect(
    page.getByRole("heading", { name: "Innsendt inntektsmelding" }),
  ).toBeVisible();
  await expect(page.getByText("Sendt inn 08.04.24 KL 13:34")).toBeVisible();

  await expect(
    page.getByText("Underfundig Dyreflokk", { exact: true }),
  ).toBeVisible();
});
