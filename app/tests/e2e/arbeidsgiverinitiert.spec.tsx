import { expect, test } from "@playwright/test";
import { mockHentPersonOgArbeidsforhold } from "tests/mocks/utils";

import { enkeltOpplysningerResponse } from "../mocks/opplysninger.ts";

test.describe("Arbeidsgiverinitielt path", () => {
  test("Happy path", async ({ page }) => {
    await mockHentPersonOgArbeidsforhold({ page });

    await page.goto("/fp-im-dialog/opprett?ytelseType=FORELDREPENGER");

    await page.locator('input[name="årsak"][value="ny_ansatt"]').click();
    await page.getByLabel("Ansattes fødselsnummer").fill("06519405464");

    await page.getByLabel("Første fraværsdag").fill("01.4.2024");
    await page.getByRole("button", { name: "Hent opplysninger" }).click();

    await page.route(
      `**/*/arbeidsgiverinitiert/opplysninger`,
      async (route) => {
        await route.fulfill({ json: enkeltOpplysningerResponse });
      },
    );

    await page.getByLabel("Arbeidsgiver").selectOption("123_123_123");

    await page.getByRole("button", { name: "Opprett inntektsmelding" }).click();
    await expect(
      page.getByRole("heading", { name: "Dine opplysninger" }),
    ).toBeVisible();
  });

  test("Kun kvinner kan søke SVP", async ({ page }) => {
    await mockHentPersonOgArbeidsforhold({ page });

    await page.goto("/fp-im-dialog/opprett?ytelseType=SVANGERSKAPSPENGER");

    await page.locator('input[name="årsak"][value="ny_ansatt"]').click();
    await page.getByLabel("Ansattes fødselsnummer").fill("06519405364");
    await page.getByLabel("Første fraværsdag").fill("01.8.2024");
    await page.getByRole("button", { name: "Hent opplysninger" }).click();

    await expect(
      page.getByRole("heading", {
        name: "Bare kvinner kan søke svangerskapspenger",
      }),
    ).toBeVisible();
  });
});
