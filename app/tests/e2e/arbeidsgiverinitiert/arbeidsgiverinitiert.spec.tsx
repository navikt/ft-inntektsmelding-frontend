import { expect, test } from "@playwright/test";
import {
  expectError,
  mockHentPersonOgArbeidsforhold,
} from "tests/mocks/shared/utils";

import { enkeltOpplysningerResponse } from "../../mocks/inntektsmelding/opplysninger.ts";

const FAKE_FNR = "09810198874";

test("Ny ansatt", async ({ page }) => {
  await mockHentPersonOgArbeidsforhold({ page });

  await page.goto("/k9-im-dialog/opprett?ytelseType=PLEIEPENGER_SYKT_BARN");

  await page
    .getByRole("radio", { name: "Ny ansatt som mottar ytelse fra Nav" })
    .click();
  await page.getByLabel("Ansattes fødselsnummer").fill(FAKE_FNR.slice(2));
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

  await page.getByLabel("Ansattes fødselsnummer").fill(FAKE_FNR);
  await page.getByLabel("Første fraværsdag").fill("01.4.2024");
  await page.getByRole("button", { name: "Hent opplysninger" }).click();

  await page.route(`**/*/arbeidsgiverinitiert/opplysninger`, async (route) => {
    await route.fulfill({ json: enkeltOpplysningerResponse });
  });

  await page
    .getByRole("combobox", { name: "Arbeidsgiver" })
    .selectOption("974652293");

  await page.getByRole("button", { name: "Opprett inntektsmelding" }).click();
  await expect(
    page.getByRole("heading", { name: "Dine opplysninger" }),
  ).toBeVisible();
});

test("Skal ikke kunne velge NEI på refusjon hvis AGI og nyansatt", async ({
  page,
}) => {
  await mockHentPersonOgArbeidsforhold({ page });

  await page.goto("/k9-im-dialog/opprett?ytelseType=PLEIEPENGER_SYKT_BARN");

  await page
    .getByRole("radio", { name: "Ny ansatt som mottar ytelse fra Nav" })
    .click();
  await page.getByLabel("Ansattes fødselsnummer").fill(FAKE_FNR);
  await page.getByLabel("Første fraværsdag").fill("01.4.2024");
  await page.getByRole("button", { name: "Hent opplysninger" }).click();

  await page.route(`**/*/arbeidsgiverinitiert/opplysninger`, async (route) => {
    await route.fulfill({ json: enkeltOpplysningerResponse });
  });

  await page
    .getByRole("combobox", { name: "Arbeidsgiver" })
    .selectOption("974652293");

  await page.getByRole("button", { name: "Opprett inntektsmelding" }).click();
  await page.getByLabel("Telefon").fill("13371337");
  await page.getByRole("button", { name: "Bekreft og gå videre" }).click();

  await page
    .getByRole("group", {
      name: "Betaler dere lønn under fraværet og krever refusjon?",
    })
    .getByRole("radio", { name: "Nei" })
    .click();
  await page
    .getByRole("group", {
      name: "Har den ansatte naturalytelser som faller bort ved fraværet?",
    })
    .getByRole("radio", { name: "Nei" })
    .click();
  await expect(
    page.getByText("Inntektsmelding kan ikke sendes inn"),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Neste steg" })).toBeDisabled();
});
