import { ArrowLeftIcon, ArrowRightIcon } from "@navikt/aksel-icons";
import {
  Alert,
  BodyLong,
  Button,
  GuidePanel,
  Heading,
  Loader,
  VStack,
} from "@navikt/ds-react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";

import { OpplysningerDto } from "~/types/api-models";

import { Inntekt } from "../skjema-moduler/Inntekt";
import { useDocumentTitle } from "../useDocumentTitle";
import { hentInntektsopplysningerOptions } from "./api/queries.ts";
import { OmsorgspengerFremgangsindikator } from "./OmsorgspengerFremgangsindikator.tsx";
import { useRefusjonOmsorgspengerArbeidsgiverFormContext } from "./RefusjonOmsorgspengerArbeidsgiverForm";

export const RefusjonOmsorgspengerArbeidsgiverSteg4 = () => {
  useDocumentTitle(
    "Refusjon – søknad om refusjon av omsorgspenger for arbeidsgiver",
  );

  const { handleSubmit, getValues } =
    useRefusjonOmsorgspengerArbeidsgiverFormContext();

  const navigate = useNavigate();
  const onSubmit = handleSubmit(() => {
    navigate({
      from: "/refusjon-omsorgspenger/$organisasjonsnummer/4-refusjon",
      to: "../5-oppsummering",
    });
  });

  const fraværHeleDager = getValues("fraværHeleDager");
  const fraværDelerAvDagen = getValues("fraværDelerAvDagen");

  const førsteFraværsdato = [
    ...(fraværHeleDager?.map((dag) => dag.fom) ?? []),
    ...(fraværDelerAvDagen?.map((dag) => dag.dato) ?? []),
  ].sort()[0];

  const {
    data: inntektsopplysninger,
    isLoading,
    isError,
  } = useQuery(
    hentInntektsopplysningerOptions({
      skjæringstidspunkt: førsteFraværsdato!,
      fødselsnummer: getValues("ansattesFødselsnummer")!,
      organisasjonsnummer: getValues("valgtArbeidsforhold")!,
    }),
  );

  if (!førsteFraværsdato) {
    throw new Error("Ingen fraværsdato funnet");
  }

  return (
    <div>
      <Heading level="1" size="large">
        Beregnet månedslønn for refusjon
      </Heading>
      <OmsorgspengerFremgangsindikator aktivtSteg={4} />
      <GuidePanel className="mb-4">
        <BodyLong>
          Oppgi kun dager dere søker refusjon for. Har det vært en varig
          lønnsendring mellom perioder som dere ønsker vi skal ta hensyn til, må
          dere sende inn to søknader med periodene før og etter lønnsendring.
        </BodyLong>
      </GuidePanel>
      <form onSubmit={onSubmit}>
        <VStack gap="4">
          {inntektsopplysninger ? (
            <Inntekt
              harEksisterendeInntektsmeldinger={false}
              opplysninger={{
                person: {
                  aktørId: getValues("ansattesAktørId")!,
                  fødselsnummer: getValues("ansattesFødselsnummer")!,
                  fornavn: getValues("ansattesFornavn")!,
                  etternavn: getValues("ansattesEtternavn")!,
                },
                inntektsopplysninger,
                skjæringstidspunkt: førsteFraværsdato,
              }}
            />
          ) : isLoading ? (
            <Loader />
          ) : isError ? (
            <Alert variant="error">
              Inntektsopplysninger kunne ikke hentes.
            </Alert>
          ) : null}
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
              disabled={!inntektsopplysninger}
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
    </div>
  );
};

const dummyOpplysninger: OpplysningerDto = {
  skjæringstidspunkt: new Date().toString(),
  førsteUttaksdato: new Date().toString(),
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
  inntektsopplysninger: {
    gjennomsnittLønn: 53_000,
    månedsinntekter: [
      {
        fom: "2024-02-01",
        tom: "2024-02-29",
        beløp: 52_000,
        status: "BRUKT_I_GJENNOMSNITT",
      },
      {
        fom: "2024-03-01",
        tom: "2024-03-31",
        beløp: 50_000,
        status: "BRUKT_I_GJENNOMSNITT",
      },
      {
        fom: "2024-04-01",
        tom: "2024-04-30",
        beløp: 57_000,
        status: "BRUKT_I_GJENNOMSNITT",
      },
    ],
  },
};
