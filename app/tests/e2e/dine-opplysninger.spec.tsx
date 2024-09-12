import { expect, test } from "@playwright/test";
import { ingenEksisterendeInntektsmeldinger } from "tests/mocks/eksisterende-inntektsmeldinger";
import { grunnbeløpResponse } from "tests/mocks/grunnbeløp";
import { enkeltGrunnlagResponse } from "tests/mocks/grunnlag";

test('burde vise "dine opplysninger" riktig', async ({ page }) => {
  await page.route(
    "**/*/imdialog/grunnlag?foresporselUuid=1",
    async (route) => {
      await route.fulfill({ json: enkeltGrunnlagResponse });
    },
  );
  await page.route("https://g.nav.no/api/v1/grunnbel%C3%B8p", async (route) => {
    await route.fulfill({ json: grunnbeløpResponse });
  });
  await page.route(
    "**/*/imdialog/inntektsmeldinger?foresporselUuid=1",
    async (route) => {
      await route.fulfill({ json: ingenEksisterendeInntektsmeldinger });
    },
  );

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
