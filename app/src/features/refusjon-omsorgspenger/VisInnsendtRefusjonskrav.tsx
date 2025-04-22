import { zodResolver } from "@hookform/resolvers/zod";
import { DownloadIcon } from "@navikt/aksel-icons";
import { Alert, Button, Detail, Heading, List, VStack } from "@navikt/ds-react";
import {
  FormSummary,
  FormSummaryAnswer,
  FormSummaryAnswers,
  FormSummaryEditLink,
  FormSummaryHeader,
  FormSummaryHeading,
  FormSummaryLabel,
  FormSummaryValue,
} from "@navikt/ds-react/FormSummary";
import { ListItem } from "@navikt/ds-react/List";
import { getRouteApi, Link } from "@tanstack/react-router";
import { FormProvider, useForm } from "react-hook-form";

import { hentInntektsmeldingPdfUrl } from "~/api/queries.ts";
import {
  finnSenesteInntektsmelding,
  formatDatoTidKort,
  formatFodselsnummer,
  formatKroner,
  lagFulltNavn,
} from "~/utils.ts";
import { navnPåMåned } from "~/utils/date-utils.ts";

import { endringsårsak } from "../skjema-moduler/Inntekt.tsx";
import { useDocumentTitle } from "../useDocumentTitle";
import { RefusjonOmsorgspengerResponseDto } from "./api/mutations.ts";
import {
  RefusjonOmsorgspengerFormData,
  RefusjonOmsorgspengerSchemaMedValidering,
  useRefusjonOmsorgspengerArbeidsgiverFormContext,
} from "./RefusjonOmsorgspengerArbeidsgiverForm";
import { useInnloggetBruker } from "./useInnloggetBruker.tsx";
import { mapSendInntektsmeldingTilSkjema } from "./utils.ts";

export const VisInnsendtRefusjonskrav = () => {
  useDocumentTitle(
    "Innsendt refusjonskrav – søknad om refusjon av omsorgspenger for arbeidsgiver",
  );

  const route = getRouteApi("/refusjon-omsorgspenger/$organisasjonsnummer");
  const { eksisterendeInntektsmeldinger, opplysninger } = route.useLoaderData();
  const sisteInntektsmelding = finnSenesteInntektsmelding(
    eksisterendeInntektsmeldinger as RefusjonOmsorgspengerResponseDto[],
  );
  const { getValues } = useRefusjonOmsorgspengerArbeidsgiverFormContext();

  const defaultValues = mapSendInntektsmeldingTilSkjema(
    opplysninger,
    sisteInntektsmelding,
  );

  const form = useForm<RefusjonOmsorgspengerFormData>({
    resolver: zodResolver(RefusjonOmsorgspengerSchemaMedValidering),
    defaultValues,
    mode: "onSubmit",
    reValidateMode: "onBlur",
  });

  const måneder = [
    ...(sisteInntektsmelding?.omsorgspenger.fraværHeleDager?.flatMap((dag) => [
      navnPåMåned(dag.fom).toLowerCase(),
      navnPåMåned(dag.tom).toLowerCase(),
    ]) ?? []),
    ...(sisteInntektsmelding?.omsorgspenger.fraværDelerAvDagen?.map((dag) =>
      navnPåMåned(dag.dato).toLowerCase(),
    ) ?? []),
  ];

  const unikeMåneder = [...new Set(måneder)];

  const sisteMåned = unikeMåneder?.[unikeMåneder.length - 1];

  return (
    <FormProvider {...form}>
      <div className="bg-bg-default rounded-md flex flex-col gap-6">
        <div>
          <Heading level="2" size="medium">
            {`Innsendt refusjonskrav (for dager i ${måneder?.slice(0, -1).join(", ")}
         og ${sisteMåned})`}
          </Heading>
          <Detail uppercase>
            sendt inn{" "}
            {formatDatoTidKort(
              new Date(sisteInntektsmelding?.opprettetTidspunkt || ""),
            )}
          </Detail>
        </div>
        <Alert variant="info">
          For å korrigere eller melde fra om endringer må du opprette et nytt
          refusjonskrav.
          <Button
            as={Link}
            className="mt-5"
            size="small"
            to="../1-intro"
            variant="secondary"
          >
            Opprett nytt refusjonskrav
          </Button>
        </Alert>
        <VStack gap="4">
          <OppsummeringRefusjon />
          <OppsummeringArbeidsgiverOgAnsatt />
          <OppsummeringOmsorgsdager />
          <OppsummeringMånedslønn />
        </VStack>
        <div className="flex justify-around">
          <Button
            as="a"
            download={`refusjon-omsorgspenger-søknad-kvittering-${getValues("meta.innsendtSøknadId")}.pdf`}
            href={hentInntektsmeldingPdfUrl(
              getValues("meta.innsendtSøknadId") as number,
            )}
            icon={<DownloadIcon />}
            iconPosition="left"
            variant="tertiary"
          >
            Last ned PDF
          </Button>
        </div>
      </div>
    </FormProvider>
  );
};

const OppsummeringRefusjon = () => {
  const { getValues, formState } =
    useRefusjonOmsorgspengerArbeidsgiverFormContext();
  return (
    <FormSummary>
      <FormSummaryHeader>
        <FormSummaryHeading level="3">Om refusjon</FormSummaryHeading>
        {!getValues("meta.innsendtSøknadId") && (
          <FormSummaryEditLink as={Link} to="../1-intro" />
        )}
      </FormSummaryHeader>
      <FormSummaryAnswers>
        <FormSummaryAnswer>
          <FormSummaryLabel>
            Utbetaler dere lønn under fraværet, og krever refusjon?
          </FormSummaryLabel>
          <FormSummaryValue>
            {getValues("harUtbetaltLønn") ? "Ja" : "Nei"}
          </FormSummaryValue>
          <ErrorMessage message={formState.errors.harUtbetaltLønn?.message} />
        </FormSummaryAnswer>
        <FormSummaryAnswer>
          <FormSummaryLabel>
            Hvilket år søker dere refusjon for?
          </FormSummaryLabel>
          <FormSummaryValue>
            {getValues("årForRefusjon")}
            <ErrorMessage message={formState.errors.årForRefusjon?.message} />
          </FormSummaryValue>
        </FormSummaryAnswer>
      </FormSummaryAnswers>
    </FormSummary>
  );
};

const OppsummeringArbeidsgiverOgAnsatt = () => {
  const { getValues, formState } =
    useRefusjonOmsorgspengerArbeidsgiverFormContext();
  const innloggetBruker = useInnloggetBruker();
  return (
    <FormSummary>
      <FormSummaryHeader>
        <FormSummaryHeading level="3">
          Arbeidsgiver og den ansatte
        </FormSummaryHeading>
        {!getValues("meta.innsendtSøknadId") && (
          <FormSummaryEditLink as={Link} to="../2-ansatt-og-arbeidsgiver" />
        )}
      </FormSummaryHeader>
      <FormSummaryAnswers>
        <FormSummaryAnswer>
          <FormSummaryAnswer>
            <FormSummaryLabel>Virksomhetsnavn</FormSummaryLabel>
            <FormSummaryValue>
              {innloggetBruker.organisasjonsnavn}
            </FormSummaryValue>
          </FormSummaryAnswer>
          <FormSummaryAnswer>
            <FormSummaryLabel>Org.nr. for underenhet</FormSummaryLabel>
            <FormSummaryValue>
              {getValues("organisasjonsnummer")}
              <ErrorMessage
                message={formState.errors?.organisasjonsnummer?.message}
              />
            </FormSummaryValue>
          </FormSummaryAnswer>
        </FormSummaryAnswer>
        <FormSummaryAnswer>
          <FormSummaryLabel>Kontaktperson og innsender</FormSummaryLabel>
          <FormSummaryValue>
            {getValues("kontaktperson.navn")} (tlf.{" "}
            {getValues("kontaktperson.telefonnummer")})
            <ErrorMessage
              message={
                formState.errors.kontaktperson?.message ||
                formState.errors.kontaktperson?.telefonnummer?.message
              }
            />
          </FormSummaryValue>
        </FormSummaryAnswer>
        <FormSummaryAnswer>
          <FormSummaryLabel>Den ansatte</FormSummaryLabel>
          <FormSummaryValue>
            {lagFulltNavn({
              fornavn: getValues("ansattesFornavn")!,
              etternavn: getValues("ansattesEtternavn")!,
            })}
            , {formatFodselsnummer(getValues("ansattesFødselsnummer"))}
            <ErrorMessage
              message={formState.errors.ansattesFødselsnummer?.message}
            />
          </FormSummaryValue>
        </FormSummaryAnswer>
      </FormSummaryAnswers>
    </FormSummary>
  );
};

const OppsummeringOmsorgsdager = () => {
  const { getValues, formState } =
    useRefusjonOmsorgspengerArbeidsgiverFormContext();
  const fraværHeleDager = getValues("fraværHeleDager");
  const harFraværHeleDager = (fraværHeleDager?.length ?? 0) > 0;
  const fraværDelerAvDagen = getValues("fraværDelerAvDagen");
  const harFraværDelerAvDagen = (fraværDelerAvDagen?.length ?? 0) > 0;
  return (
    <FormSummary>
      <FormSummaryHeader>
        <FormSummaryHeading level="3">
          Omsorgsdager dere søker utbetaling for
        </FormSummaryHeading>
        {!getValues("meta.innsendtSøknadId") && (
          <FormSummaryEditLink as={Link} to="../3-omsorgsdager" />
        )}
      </FormSummaryHeader>
      <FormSummaryAnswers>
        <FormSummaryAnswer>
          <FormSummaryLabel>
            Har dere dekket de 10 første omsorgsdagene i år?
          </FormSummaryLabel>
          <FormSummaryValue>
            {getValues("harDekket10FørsteOmsorgsdager") ? "Ja" : "Nei"}
            <ErrorMessage
              message={formState.errors.harDekket10FørsteOmsorgsdager?.message}
            />
          </FormSummaryValue>
        </FormSummaryAnswer>
        <FormSummaryAnswer>
          <FormSummaryLabel>Dager med fravær hele dagen</FormSummaryLabel>
          <FormSummaryValue>
            {harFraværHeleDager ? (
              <List>
                {fraværHeleDager?.map((periode, index) =>
                  periode.fom && periode.tom ? (
                    <ListItem key={index}>
                      {new Date(periode.fom).toLocaleDateString("nb-no")}–
                      {new Date(periode.tom).toLocaleDateString("nb-no")}
                    </ListItem>
                  ) : null,
                )}
              </List>
            ) : (
              "Ingen dager med fravær hele dagen"
            )}
            <ErrorMessage message={formState.errors.fraværHeleDager?.message} />
          </FormSummaryValue>
        </FormSummaryAnswer>
        <FormSummaryAnswer>
          <FormSummaryLabel>
            Dager med fravær bare deler av dagen
          </FormSummaryLabel>
          <FormSummaryValue>
            {harFraværDelerAvDagen ? (
              <List>
                {fraværDelerAvDagen?.map((fravær, index) => (
                  <ListItem key={index}>
                    {fravær.dato
                      ? new Date(fravær.dato).toLocaleDateString("nb-no")
                      : null}
                    : {fravær.timer}{" "}
                    {Number(fravær.timer) === 1 ? "time" : "timer"}
                  </ListItem>
                ))}
              </List>
            ) : (
              "Ingen dager med fravær bare deler av dagen"
            )}
            <ErrorMessage
              message={formState.errors.fraværDelerAvDagen?.message}
            />
          </FormSummaryValue>
        </FormSummaryAnswer>
      </FormSummaryAnswers>
    </FormSummary>
  );
};

export const OppsummeringMånedslønn = () => {
  const { getValues, formState } =
    useRefusjonOmsorgspengerArbeidsgiverFormContext();
  return (
    <FormSummary>
      <FormSummaryHeader>
        <FormSummaryHeading level="3">
          Beregnet månedslønn for refusjon
        </FormSummaryHeading>
        {!getValues("meta.innsendtSøknadId") && (
          <FormSummaryEditLink as={Link} to="../4-refusjon" />
        )}
      </FormSummaryHeader>
      <FormSummaryAnswers>
        <FormSummaryAnswer>
          <FormSummaryLabel>Beregnet månedslønn</FormSummaryLabel>
          <FormSummaryValue>
            {formatKroner(
              getValues("korrigertInntekt") || getValues("inntekt"),
            )}
            <ErrorMessage
              message={
                formState.errors.korrigertInntekt?.message ||
                formState.errors.inntekt?.message
              }
            />
          </FormSummaryValue>
        </FormSummaryAnswer>
        {!!getValues("endringAvInntektÅrsaker")?.length && (
          <FormSummaryAnswer>
            <FormSummaryLabel>Årsaker til endring av inntekt</FormSummaryLabel>
            <FormSummaryValue>
              {getValues("endringAvInntektÅrsaker")?.map((årsak) => (
                <div key={årsak.årsak}>
                  {endringsårsak.find((a) => a.value === årsak.årsak)?.label}
                  {årsak.fom && (
                    <>
                      {" "}
                      {new Date(årsak.fom).toLocaleDateString("nb-no")}
                      {årsak.tom &&
                        ` til ${new Date(årsak.tom).toLocaleDateString("nb-no")}`}
                    </>
                  )}
                </div>
              ))}
              <ErrorMessage
                message={formState.errors.endringAvInntektÅrsaker?.message}
              />
            </FormSummaryValue>
          </FormSummaryAnswer>
        )}
      </FormSummaryAnswers>
    </FormSummary>
  );
};

const ErrorMessage = ({ message }: { message?: string }) => {
  if (!message) {
    return null;
  }
  return <Alert variant="error">{message}</Alert>;
};
