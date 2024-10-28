import { expect, test } from "@playwright/test";
import {
  mockGrunnbeløp,
  mockGrunnlag,
  mockInntektsmeldinger,
} from "tests/mocks/utils";

test("Gå igjennom skjema og test alle valideringer", async ({ page }) => {
  await mockGrunnlag({ page });
  await mockGrunnbeløp({ page });
  await mockInntektsmeldinger({ page });

  // Skal forsøke hente eksisterende inntektsmelding og navigere til første steg når IM ikke finnes.
  await page.goto("/fp-im-dialog/1");

  await expect(
    page.getByText("Underfundig Dyreflokk", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Underfundig Dyreflokk (275278 27812)"),
  ).toBeVisible();

  await expect(page.getByLabel("Navn")).toBeVisible();
  await expect(page.getByLabel("Navn")).toHaveValue("Berømt Flyttelass");
  await page.getByLabel("Navn").click();
  await page.keyboard.type("123123123".repeat(10));

  await page.getByText("Bekreft og gå videre").click();

  // Sjekk errors.
  // TODO: sjekk selve error element og om det er gruppert sammen med input?
  await expect(
    page.getByText("Navn kan ikke være lenger enn 100 tegn"),
  ).toBeVisible();
  await expect(page.getByText("Telefonnummer er påkrevd")).toBeVisible();

  await page.getByLabel("Navn").clear();
  await page.keyboard.type("Berømt Flyttelass");

  await page.getByLabel("Telefon").fill("12312312");

  await page.getByText("Bekreft og gå videre").click();

  // Inntekt og refusjon siden
  await expect(
    page.getByRole("heading", { name: "Inntekt og refusjon" }),
  ).toBeVisible();

  // Periode med ytelse
  await expect(
    page.getByRole("heading", { name: "Periode med foreldrepenger" }),
  ).toBeVisible();

  await expect(
    page.getByText("Underfundigs første dag med foreldrepenger"),
  ).toBeVisible();
  await expect(page.getByText("Fra søknaden til Underfundig")).toBeVisible();
  await expect(page.getByText("Torsdag 30. mai 2024")).toBeVisible();

  // Beregnet månedslønn
  await expect(
    page.getByRole("heading", { name: "Beregnet Månedslønn" }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Underfundigs lønn fra de siste tre månedene før 30.05.2024",
    ),
  ).toBeVisible();
  await expect(page.getByText("Fra A-Ordningen")).toBeVisible();
  const gjennomsnittInntektBlokk = page.getByTestId(
    "gjennomsnittinntekt-block",
  );
  await expect(
    gjennomsnittInntektBlokk.getByText("Beregnet månedslønn"),
  ).toBeVisible();
  await expect(gjennomsnittInntektBlokk.getByText("53 000")).toBeVisible();
  await expect(
    gjennomsnittInntektBlokk.getByText(
      "Gjennomsnittet av de siste tre månedene før 30.05.2024",
    ),
  ).toBeVisible();

  await page.getByRole("button", { name: "Endre månedslønn" }).click();
  // Prøv å submit for å trigge errors
  await page.getByRole("button", { name: "Neste steg" }).click();

  await expect(
    page
      .getByLabel("Endret månedsinntekt")
      .locator("..")
      .getByText("Må oppgis"),
  ).toBeVisible();

  await expect(
    page
      .getByText("Hva er årsaken til endringen?") // TODO: skjønner ikke hvorfor getByLabel ikke funker her
      .locator("..")
      .getByText("Må oppgis"),
  ).toBeVisible();

  await page.getByLabel("Endret månedsinntekt").fill("-50000");
  await expect(
    page
      .getByText("Endret månedsinntekt")
      .locator("..")
      .getByText("Beløpet må være 0 eller høyere"),
  ).toBeVisible();
  await page.getByText("Endret månedsinntekt").fill("50000");
  // await expect(page.getByLabel("Endret månedsinntekt")).toHaveValue("50 000");

  await page.getByLabel("Hva er årsaken til endringen?").selectOption("Ferie");
  // Hvorfor feiler denne???
  // await expect(page.getByLabel("Endret månedsinntekt")).toBeVisible();

  await page.getByRole("button", { name: "Neste steg" }).click();
  await expect(
    page.getByText("Fra og med").locator("..").getByText("Må oppgis"),
  ).toBeVisible();
  await expect(
    page.getByText("Til og med").locator("..").getByText("Må oppgis"),
  ).toBeVisible();

  await page.getByLabel("Fra og med").fill("01.4.2024");
  await page.getByLabel("Til og med").fill("01.5.2024"); // TODO: mangler validering på at den ikke kan være tidligere

  await page.getByRole("button", { name: "Legg til ny endringsårsak" }).click();
  await expect(page.getByText("Hva er årsaken til endringen?")).toHaveCount(2);

  await page
    .getByLabel("Hva er årsaken til endringen?")
    .nth(1)
    .selectOption("Ferie");
  await page.getByRole("button", { name: "Neste steg" }).click();
  await expect(
    page.getByText("Fra og med").nth(1).locator("..").getByText("Må oppgis"),
  ).toBeVisible();

  await page.getByRole("button", { name: "Slett endringsårsak" }).click(); // TODO: Kan finnes flere. Vurder testId
  await expect(page.getByText("Hva er årsaken til endringen?")).toHaveCount(1);
});
