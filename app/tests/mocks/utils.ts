import { Locator, Page } from "@playwright/test";

import type { OpplysningerDto } from "~/types/api-models.ts";

import {
  ingenEksisterendeInntektsmeldingerResponse,
  mangeEksisterendeInntektsmeldingerResponse,
} from "./eksisterende-inntektsmeldinger";
import { grunnbeløpResponse } from "./grunnbeløp";
import { enkeltGrunnlagResponse } from "./grunnlag";

type MockGrunnlagParams = {
  page: Page;
  json?: OpplysningerDto;
  uuid?: string;
};

export const mockGrunnlag = ({
  page,
  json = enkeltGrunnlagResponse,
  uuid = "1",
}: MockGrunnlagParams) => {
  return page.route(
    `**/*/imdialog/opplysninger?foresporselUuid=${uuid}`,
    async (route) => {
      await route.fulfill({ json });
    },
  );
};

type MockGrunnbeløpParams = {
  page: Page;
  json?: typeof grunnbeløpResponse;
};
export const mockGrunnbeløp = ({
  page,
  json = grunnbeløpResponse,
}: MockGrunnbeløpParams) => {
  return page.route(
    "https://g.nav.no/api/v1/grunnbel%C3%B8p",
    async (route) => {
      await route.fulfill({ json });
    },
  );
};

type MockInntektsmeldingerParams = {
  page: Page;
  json?: typeof mangeEksisterendeInntektsmeldingerResponse;
  uuid?: string;
};

export const mockInntektsmeldinger = ({
  page,
  json = ingenEksisterendeInntektsmeldingerResponse,
  uuid = "1",
}: MockInntektsmeldingerParams) => {
  return page.route(
    `**/*/imdialog/inntektsmeldinger?foresporselUuid=${uuid}`,
    async (route) => {
      await route.fulfill({ json });
    },
  );
};

export const finnInputFraLabel = async ({
  page,
  nth = 0,
  labelText,
}: {
  page: Locator | Page;
  nth?: number;
  labelText: string;
}) => {
  const label = page.locator(`label:has-text("${labelText}")`).nth(nth);
  const inputId = await label.getAttribute("for");
  return page.locator(`#${inputId}`);
};
