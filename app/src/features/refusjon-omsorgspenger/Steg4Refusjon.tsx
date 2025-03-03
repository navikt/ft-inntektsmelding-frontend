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

import { Inntekt } from "../skjema-moduler/Inntekt";
import { useDocumentTitle } from "../useDocumentTitle";
import { hentInntektsopplysningerOptions } from "./api/queries.ts";
import { OmsorgspengerFremgangsindikator } from "./OmsorgspengerFremgangsindikator.tsx";
import {
  Step4FormData,
  useRefusjonOmsorgspengerArbeidsgiverFormContext,
} from "./RefusjonOmsorgspengerArbeidsgiverForm";

export const RefusjonOmsorgspengerArbeidsgiverSteg4 = () => {
  useDocumentTitle(
    "Refusjon – søknad om refusjon av omsorgspenger for arbeidsgiver",
  );

  const { handleSubmit, getValues, setValue } =
    useRefusjonOmsorgspengerArbeidsgiverFormContext<Step4FormData>();

  const navigate = useNavigate();
  const onSubmit = handleSubmit((skjemadata) => {
    const { korrigertInntekt } = skjemadata;

    setValue(
      "endringAvInntektÅrsaker",
      korrigertInntekt ? skjemadata.endringAvInntektÅrsaker : [],
    );
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
      organisasjonsnummer: getValues("organisasjonsnummer")!,
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
          Vi har forhåndsutfylt beregnet månedsbeløp ut fra opplysninger i
          A-ordningen. Vurder om beløpet er riktig, eller gjør endringer hvis
          noe ikke stemmer. Beregnet månedslønn tilsvarer beløpet dere kan få i
          refusjon.
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
            <div className="my-4 flex justify-center">
              <Loader />
            </div>
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
