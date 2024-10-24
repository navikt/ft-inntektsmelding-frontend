import { ArrowLeftIcon, ArrowRightIcon } from "@navikt/aksel-icons";
import {
  BodyLong,
  Button,
  GuidePanel,
  Heading,
  VStack,
} from "@navikt/ds-react";
import { Link, useNavigate } from "@tanstack/react-router";

import { RotLayout } from "~/features/rot-layout/RotLayout";
import { OpplysningerDto } from "~/types/api-models";

import { Inntekt } from "../skjema-moduler/Inntekt";
import { useDocumentTitle } from "../useDocumentTitle";
import { OmsorgspengerFremgangsindikator } from "./OmsorgspengerFremgangsindikator.tsx";
import { useRefusjonOmsorgspengerArbeidsgiverFormContext } from "./RefusjonOmsorgspengerArbeidsgiverForm";

export const RefusjonOmsorgspengerArbeidsgiverSteg4 = () => {
  useDocumentTitle(
    "Refusjon – søknad om refusjon av omsorgspenger for arbeidsgiver",
  );

  const { handleSubmit } = useRefusjonOmsorgspengerArbeidsgiverFormContext();
  const navigate = useNavigate();
  const onSubmit = handleSubmit(() => {
    navigate({
      from: "/refusjon-omsorgspenger-arbeidsgiver/4-refusjon",
      to: "../5-oppsummering",
    });
  });

  return (
    <RotLayout medHvitBoks={true} tittel="Søknad om refusjon for omsorgspenger">
      <Heading level="1" size="large">
        Beregnet månedslønn for refusjon
      </Heading>
      <OmsorgspengerFremgangsindikator aktivtSteg={4} />
      <GuidePanel>
        <BodyLong>
          Oppgi kun dager dere søker refusjon for. Har det vært en varig
          lønnsendring mellom perioder som dere ønsker vi skal ta hensyn til, må
          dere sende inn to søknader med periodene før og etter lønnsendring.
        </BodyLong>
      </GuidePanel>
      <form onSubmit={onSubmit}>
        <VStack gap="4">
          <Inntekt
            harEksisterendeInntektsmeldinger={false}
            opplysninger={dummyOpplysninger}
          />
          <div className="flex gap-4">
            <Button
              as={Link}
              icon={<ArrowLeftIcon />}
              to="../3-omsorgsdager"
              variant="secondary"
            >
              Forrige steg
            </Button>
            <Button
              icon={<ArrowRightIcon />}
              iconPosition="right"
              type="submit"
              variant="primary"
            >
              Neste steg
            </Button>
          </div>
        </VStack>
      </form>
    </RotLayout>
  );
};

const dummyOpplysninger: OpplysningerDto = {
  startdatoPermisjon: new Date().toString(),
  person: {
    aktørId: "1234567890",
    fødselsnummer: "1234567890",
    fornavn: "Ola",
    etternavn: "Nordmann",
  },
  innsender: {
    fornavn: "Ola",
    etternavn: "Nordmann",
  },
  arbeidsgiver: {
    organisasjonNavn: "Bedrift AS",
    organisasjonNummer: "123456789",
  },
  ytelse: "OMSORGSPENGER",
  forespørselStatus: "UNDER_BEHANDLING",
  inntekter: [
    {
      fom: new Date(2023, 0, 1).toISOString(),
      tom: new Date(2023, 0, 31).toISOString(),
      arbeidsgiverIdent: "123456789",
      beløp: 30_000,
    },
    {
      fom: new Date(2023, 1, 1).toISOString(),
      tom: new Date(2023, 1, 28).toISOString(),
      arbeidsgiverIdent: "123456789",
      beløp: 31_000,
    },
    {
      fom: new Date(2023, 2, 1).toISOString(),
      tom: new Date(2023, 2, 31).toISOString(),
      arbeidsgiverIdent: "123456789",
      beløp: 32_000,
    },
  ],
};
