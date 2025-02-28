import { expect, test } from "@playwright/test";
import { expectError, mockHentPersonOgArbeidsforhold } from "tests/mocks/utils";

import { enkeltOpplysningerResponse } from "../mocks/opplysninger.ts";

test("Ny ansatt", async ({ page }) => {
  await mockHentPersonOgArbeidsforhold({ page });

  await page.goto("/fp-im-dialog/opprett?ytelseType=FORELDREPENGER");

  await page.locator('input[name="årsak"][value="ny_ansatt"]').click();
  await page.getByLabel("Ansattes fødselsnummer").fill("0981019887");
  await page.getByRole("button", { name: "Hent opplysninger" }).click();

  await expectError({
    page,
    error: "Du må fylle ut et gyldig fødselsnummer",
    label: "Ansattes fødselsnummer",
  });
  await expectError({
    page,
    label: "Første fraværsdag",
    error: "Må oppgis",
  });

  await page.getByLabel("Ansattes fødselsnummer").fill("09810198874");
  await page.getByLabel("Første fraværsdag").fill("01.4.2024");
  await page.getByRole("button", { name: "Hent opplysninger" }).click();

  await page.route(`**/*/arbeidsgiverinitiert/opplysninger`, async (route) => {
    await route.fulfill({ json: enkeltOpplysningerResponse });
  });

  await page.getByLabel("Arbeidsgiver").selectOption("974652293");

  await page.getByRole("button", { name: "Opprett inntektsmelding" }).click();
  await expect(
    page.getByRole("heading", { name: "Dine opplysninger" }),
  ).toBeVisible();
});

test("Skal ikke kunne velge NEI på refusjon hvis AGI og nyansatt", async ({ page }) => {
  await mockHentPersonOgArbeidsforhold({ page });

  await page.goto("/fp-im-dialog/opprett?ytelseType=FORELDREPENGER");

  await page.locator('input[name="årsak"][value="ny_ansatt"]').click();
  await page.getByLabel("Ansattes fødselsnummer").fill("09810198874");
  await page.getByLabel("Første fraværsdag").fill("01.4.2024");
  await page.getByRole("button", { name: "Hent opplysninger" }).click();

  await page.route(`**/*/arbeidsgiverinitiert/opplysninger`, async (route) => {
    await route.fulfill({ json: enkeltOpplysningerResponse });
  });

  await page.getByLabel("Arbeidsgiver").selectOption("974652293");

  await page.getByRole("button", { name: "Opprett inntektsmelding" }).click();
  await page.getByLabel("Telefon").fill("13371337");
  await page.getByRole("button", { name: "Bekreft og gå videre" }).click();

  await page.locator('input[name="skalRefunderes"][value="NEI"]').click();
  await page.locator('input[name="misterNaturalytelser"][value="nei"]').click();
  await expect(page.getByText("Inntektsmelding kan ikke sendes inn")).toBeVisible();
  await expect(page.getByRole("button", { name: "Neste steg" })).toBeDisabled();
});

test("Kun kvinner kan søke SVP", async ({ page }) => {
  await mockHentPersonOgArbeidsforhold({ page });

  await page.goto("/fp-im-dialog/opprett?ytelseType=SVANGERSKAPSPENGER");

  await page.locator('input[name="årsak"][value="ny_ansatt"]').click();
  await page.getByLabel("Ansattes fødselsnummer").fill("09810198874");
  await page.getByLabel("Første fraværsdag").fill("01.8.2024");
  await page.getByRole("button", { name: "Hent opplysninger" }).click();

  await expect(
    page.getByRole("heading", {
      name: "Bare kvinner kan søke svangerskapspenger",
    }),
  ).toBeVisible();

  await page.getByRole("link", { name: "Klikk her" }).click();
  await page.getByRole("button", { name: "Hent opplysninger" }).click();
  await page.getByLabel("Arbeidsgiver").selectOption("974652293");
});
