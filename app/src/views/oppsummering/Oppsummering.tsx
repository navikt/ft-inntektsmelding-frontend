import { ArrowLeftIcon, PaperplaneIcon } from "@navikt/aksel-icons";
import {
  Alert,
  BodyLong,
  Button,
  FormSummary,
  Heading,
  Stack,
} from "@navikt/ds-react";
import { useMutation } from "@tanstack/react-query";
import {
  getRouteApi,
  Link,
  useLoaderData,
  useNavigate,
} from "@tanstack/react-router";

import { sendInntektsmelding } from "~/api/mutations.ts";
import type { OpplysningerDto } from "~/api/queries";
import {
  InntektsmeldingSkjemaState,
  InntektsmeldingSkjemaStateValid,
  useInntektsmeldingSkjema,
} from "~/features/InntektsmeldingSkjemaState";
import { Fremgangsindikator } from "~/features/skjema-moduler/Fremgangsindikator";
import type {
  ÅrsaksType,
  NaturalytelseRequestDto,
  RefusjonsendringRequestDto,
} from "~/types/api-models.ts";
import {
  formatDatoKort,
  formatDatoLang,
  formatFødselsnummer,
  formatIsoDatostempel,
  formatKroner,
  formatYtelsesnavn,
  slåSammenTilFulltNavn,
} from "~/utils";

const route = getRouteApi("/$id");

export const Oppsummering = () => {
  const { opplysninger } = useLoaderData({ from: "/$id" });
  const { id } = route.useParams();

  const { inntektsmeldingSkjemaState, gyldigInntektsmeldingSkjemaState } =
    useInntektsmeldingSkjema();

  if (!gyldigInntektsmeldingSkjemaState) {
    return (
      <Alert variant="error">
        <Stack gap="4">
          <BodyLong>
            Noe gikk galt med utfyllingen av inntektsmeldingen din. Du må
            dessverre begynne på nytt.
          </BodyLong>
          <Button
            as={Link}
            params={{ id }}
            size="small"
            to="/$id"
            variant="secondary-neutral"
          >
            Start på nytt
          </Button>
        </Stack>
      </Alert>
    );
  }

  return (
    <section>
      <div className="bg-bg-default mt-6 px-5 py-6 rounded-md flex flex-col gap-6">
        <Heading level="2" size="large">
          Oppsummering
        </Heading>
        <Fremgangsindikator aktivtSteg={3} />
        <FormSummary>
          <FormSummary.Header>
            <FormSummary.Heading level="3">
              Arbeidsgiver og den ansatte
            </FormSummary.Heading>
            <FormSummary.EditLink as={Link} to="../dine-opplysninger" />
          </FormSummary.Header>
          <FormSummary.Answers>
            <FormSummary.Answer>
              <FormSummary.Label>Arbeidsgiver</FormSummary.Label>
              <FormSummary.Value>
                <FormSummary.Answers>
                  <FormSummary.Answer>
                    <FormSummary.Label>Virksomhetsnavn</FormSummary.Label>
                    <FormSummary.Value>
                      {opplysninger.arbeidsgiver.organisasjonNavn}
                    </FormSummary.Value>
                  </FormSummary.Answer>
                  <FormSummary.Answer>
                    <FormSummary.Label>
                      Org. nr. for underenhet
                    </FormSummary.Label>
                    <FormSummary.Value>
                      {opplysninger.arbeidsgiver.organisasjonNummer}
                    </FormSummary.Value>
                  </FormSummary.Answer>
                </FormSummary.Answers>
              </FormSummary.Value>
            </FormSummary.Answer>
            <FormSummary.Answer>
              <FormSummary.Label>Kontaktperson og innsender</FormSummary.Label>
              <FormSummary.Value>
                {formatterKontaktperson(
                  inntektsmeldingSkjemaState.kontaktperson,
                )}
              </FormSummary.Value>
            </FormSummary.Answer>
            <FormSummary.Answer>
              <FormSummary.Label>Den ansatte</FormSummary.Label>
              <FormSummary.Value>
                {slåSammenTilFulltNavn(opplysninger.person)}
                {", "}({formatFødselsnummer(opplysninger.person.fødselsnummer)})
              </FormSummary.Value>
            </FormSummary.Answer>
          </FormSummary.Answers>
        </FormSummary>

        <FormSummary>
          <FormSummary.Header>
            <FormSummary.Heading level="3">
              Første dag med {formatYtelsesnavn(opplysninger.ytelse)}
            </FormSummary.Heading>
          </FormSummary.Header>
          <FormSummary.Answers>
            <FormSummary.Answer>
              <FormSummary.Label>Fra og med</FormSummary.Label>
              <FormSummary.Value>
                {formatDatoLang(new Date(opplysninger.startdatoPermisjon))}
              </FormSummary.Value>
            </FormSummary.Answer>
          </FormSummary.Answers>
        </FormSummary>

        <FormSummary>
          <FormSummary.Header>
            <FormSummary.Heading level="3">Månedslønn</FormSummary.Heading>
            <FormSummary.EditLink
              as={Link}
              to="../inntekt-og-refusjon#beregnet-manedslonn"
            />
          </FormSummary.Header>
          <FormSummary.Answers>
            <FormSummary.Answer>
              <FormSummary.Label>
                Beregnet månedslønn basert på de tre siste, fulle månedene før{" "}
                {formatYtelsesnavn(opplysninger.ytelse)}
              </FormSummary.Label>
              <FormSummary.Value>
                {formatKroner(inntektsmeldingSkjemaState.inntekt)}
              </FormSummary.Value>
            </FormSummary.Answer>
            {inntektsmeldingSkjemaState.inntektEndringsÅrsak && (
              <>
                <FormSummary.Answer>
                  <FormSummary.Label>Korrigert månedslønn</FormSummary.Label>
                  <FormSummary.Value>
                    {formatKroner(
                      inntektsmeldingSkjemaState.inntektEndringsÅrsak
                        .korrigertInntekt,
                    )}
                  </FormSummary.Value>
                </FormSummary.Answer>
                <FormSummary.Answer>
                  <FormSummary.Label>Korrigert grunnet</FormSummary.Label>
                  <FormSummary.Value>
                    {formatInntektsendrignsGrunn(
                      inntektsmeldingSkjemaState.inntektEndringsÅrsak.årsak,
                    )}
                  </FormSummary.Value>
                </FormSummary.Answer>
                {inntektsmeldingSkjemaState.inntektEndringsÅrsak.fom && (
                  <FormSummary.Answer>
                    <FormSummary.Label>Fra og med</FormSummary.Label>
                    <FormSummary.Value>
                      {formatDatoLang(
                        new Date(
                          inntektsmeldingSkjemaState.inntektEndringsÅrsak.fom,
                        ),
                      )}
                    </FormSummary.Value>
                  </FormSummary.Answer>
                )}
                {inntektsmeldingSkjemaState.inntektEndringsÅrsak.tom && (
                  <FormSummary.Answer>
                    <FormSummary.Label>Til og med</FormSummary.Label>
                    <FormSummary.Value>
                      {formatDatoLang(
                        new Date(
                          inntektsmeldingSkjemaState.inntektEndringsÅrsak.tom,
                        ),
                      )}
                    </FormSummary.Value>
                  </FormSummary.Answer>
                )}
              </>
            )}
          </FormSummary.Answers>
        </FormSummary>

        <FormSummary>
          <FormSummary.Header>
            <FormSummary.Heading level="3">Refusjon</FormSummary.Heading>
            <FormSummary.EditLink
              as={Link}
              to="../inntekt-og-refusjon#refusjon"
            />
          </FormSummary.Header>
          <FormSummary.Answers>
            <FormSummary.Answer>
              <FormSummary.Label>
                Skal dere betale lønn til {opplysninger.person.fornavn} og ha
                refusjon fra NAV?
              </FormSummary.Label>
              <FormSummary.Value>
                {inntektsmeldingSkjemaState.skalRefunderes ? "Ja" : "Nei"}
              </FormSummary.Value>
            </FormSummary.Answer>
            {inntektsmeldingSkjemaState.skalRefunderes && (
              <FormSummary.Answer>
                <FormSummary.Label>Refusjonsbeløp per måned</FormSummary.Label>
                <FormSummary.Value>
                  {formatKroner(
                    inntektsmeldingSkjemaState.refusjonsbeløpPerMåned,
                  )}
                </FormSummary.Value>
              </FormSummary.Answer>
            )}
            <FormSummary.Answer>
              <FormSummary.Label>
                Vil det være endringer i refusjon i løpet av perioden{" "}
                {opplysninger.person.fornavn} er i permisjon?
              </FormSummary.Label>
              <FormSummary.Value>
                {inntektsmeldingSkjemaState.endringIRefusjon ? "Ja" : "Nei"}
              </FormSummary.Value>
            </FormSummary.Answer>
            {inntektsmeldingSkjemaState.endringIRefusjon && (
              <FormSummary.Answer>
                <FormSummary.Label>Endringer i refusjon</FormSummary.Label>
                <FormSummary.Value>
                  <FormSummary.Answers>
                    {inntektsmeldingSkjemaState.refusjonsendringer.map(
                      (endring) => (
                        <FormSummary.Answer key={endring.fom + endring.beløp}>
                          <FormSummary.Label>
                            Refusjonsbeløp per måned
                          </FormSummary.Label>
                          <FormSummary.Value>
                            {formatKroner(endring.beløp)} (fra og med{" "}
                            {formatDatoLang(new Date(endring.fom))})
                          </FormSummary.Value>
                        </FormSummary.Answer>
                      ),
                    )}
                  </FormSummary.Answers>
                </FormSummary.Value>
              </FormSummary.Answer>
            )}
          </FormSummary.Answers>
        </FormSummary>

        <FormSummary>
          <FormSummary.Header>
            <FormSummary.Heading level="3">Naturalytelser</FormSummary.Heading>
            <FormSummary.EditLink
              as={Link}
              to="../inntekt-og-refusjon#naturalytelser"
            />
          </FormSummary.Header>
          <FormSummary.Answers>
            <FormSummary.Answer>
              <FormSummary.Label>
                Har {opplysninger.person.fornavn} naturalytelser som faller bort
                ved fraværet?
              </FormSummary.Label>
              <FormSummary.Value>
                {inntektsmeldingSkjemaState.misterNaturalytelser ? "Ja" : "Nei"}
              </FormSummary.Value>
            </FormSummary.Answer>
            {inntektsmeldingSkjemaState.misterNaturalytelser && (
              <FormSummary.Answer>
                <FormSummary.Label>
                  Naturalytelser som faller bort
                </FormSummary.Label>
                <FormSummary.Value>
                  <FormSummary.Answers>
                    {inntektsmeldingSkjemaState.naturalytelserSomMistes.map(
                      (naturalytelse) => {
                        return (
                          <FormSummary.Answer key={naturalytelse.navn}>
                            <FormSummary.Label>
                              {formatYtelsesnavn(naturalytelse.navn, true)}
                            </FormSummary.Label>
                            <FormSummary.Value>
                              {`Verdi ${formatKroner(naturalytelse.beløp)} (${formaterPeriodeStreng(naturalytelse)}) `}
                            </FormSummary.Value>
                          </FormSummary.Answer>
                        );
                      },
                    )}
                  </FormSummary.Answers>
                </FormSummary.Value>
              </FormSummary.Answer>
            )}
          </FormSummary.Answers>
        </FormSummary>
        <SendInnInntektsmelding opplysninger={opplysninger} />
      </div>
    </section>
  );
};

/**
 * Gir en streng på formatet "fra og med DATO, til og med DATO" hvis begge datoene er satt. Ellers kun den ene.
 */
function formaterPeriodeStreng({ fom, tom }: { fom?: string; tom?: string }) {
  const fomStreng = fom ? `fra og med ${formatDatoKort(new Date(fom))}` : "";
  const tomStreng = tom ? `til og med ${formatDatoKort(new Date(tom))}` : "";

  return [fomStreng, tomStreng].filter(Boolean).join(", ");
}

const formatterKontaktperson = (
  kontaktperson: InntektsmeldingSkjemaState["kontaktperson"],
) => {
  if (!kontaktperson) {
    return "";
  }
  return `${kontaktperson.navn}, ${kontaktperson.telefonnummer}`;
};

const formatInntektsendrignsGrunn = (årsak: ÅrsaksType) => {
  switch (årsak) {
    case "Tariffendring": {
      return "Tariffendring";
    }
    case "FeilInntekt": {
      return "Varig feil inntekt";
    }
    default: {
      return årsak;
    }
  }
};

type SendInnInntektsmeldingProps = {
  opplysninger: OpplysningerDto;
};
function SendInnInntektsmelding({ opplysninger }: SendInnInntektsmeldingProps) {
  const navigate = useNavigate();
  const { id } = route.useParams();

  const { gyldigInntektsmeldingSkjemaState } = useInntektsmeldingSkjema();

  const { mutate, error, isPending } = useMutation({
    mutationFn: async (skjemaState: InntektsmeldingSkjemaStateValid) => {
      const gjeldendeInntekt =
        skjemaState.inntektEndringsÅrsak?.korrigertInntekt ??
        skjemaState.inntekt;

      const inntektsmelding = {
        foresporselUuid: id,
        aktorId: opplysninger.person.aktørId,
        ytelse: opplysninger.ytelse,
        arbeidsgiverIdent: opplysninger.arbeidsgiver.organisasjonNummer,
        kontaktperson: skjemaState.kontaktperson,
        startdato: opplysninger.startdatoPermisjon,
        inntekt: gjeldendeInntekt,
        refusjon: skjemaState.refusjonsbeløpPerMåned,
        // inntektEndringsÅrsak: skjemaState.inntektEndringsÅrsak, // Send inn når BE har støtte for det
        refusjonsendringer: utledRefusjonsPerioder([
          ...skjemaState.refusjonsendringer,
          {
            beløp: gjeldendeInntekt,
            fom: opplysninger.startdatoPermisjon,
          },
        ]),
        bortfaltNaturalytelsePerioder: konverterNaturalytelsePerioder(
          skjemaState.naturalytelserSomMistes,
        ),
      };

      return sendInntektsmelding(inntektsmelding);
    },
    onSuccess: () => {
      navigate({
        from: "/$id/oppsummering",
        to: "../kvittering",
      });
    },
  });
  if (!gyldigInntektsmeldingSkjemaState) {
    return null;
  }

  return (
    <>
      {/*TODO: hvordan feilmeldinger viser man mot bruker?*/}
      {error ? <Alert variant="error">Noe gikk galt.</Alert> : undefined}
      <div className="flex gap-4 justify-center">
        <Button
          as={Link}
          icon={<ArrowLeftIcon />}
          to="../inntekt-og-refusjon"
          variant="secondary"
        >
          Forrige steg
        </Button>
        <Button
          icon={<PaperplaneIcon />}
          loading={isPending}
          onClick={() => mutate(gyldigInntektsmeldingSkjemaState)}
          variant="primary"
        >
          Send inn
        </Button>
      </div>
    </>
  );
}

function konverterNaturalytelsePerioder(
  naturalytelsePerioder: InntektsmeldingSkjemaStateValid["naturalytelserSomMistes"],
): NaturalytelseRequestDto[] {
  return naturalytelsePerioder.map((periode) => ({
    naturalytelsetype: periode.navn,
    fom: formatIsoDatostempel(new Date(periode.fom)),
    beløp: periode.beløp,
    tom: periode.tom,
  }));
}

function utledRefusjonsPerioder(
  refusjonsendringer: InntektsmeldingSkjemaStateValid["refusjonsendringer"],
): RefusjonsendringRequestDto[] {
  return refusjonsendringer.map((endring) => ({
    fom: endring.fom,
    beløp: endring.beløp,
  }));
}
