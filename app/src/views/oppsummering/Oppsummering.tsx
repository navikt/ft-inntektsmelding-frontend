import { ArrowLeftIcon, PaperplaneIcon } from "@navikt/aksel-icons";
import { Alert, Button, FormSummary, Heading } from "@navikt/ds-react";
import { useMutation } from "@tanstack/react-query";
import {
  getRouteApi,
  Link,
  useLoaderData,
  useNavigate,
} from "@tanstack/react-router";

import { sendInntektsmelding } from "~/api/mutations.ts";
import type { OpplysningerDto } from "~/api/queries";
import type { InntektsmeldingSkjemaState } from "~/features/InntektsmeldingSkjemaState";
import { useInntektsmeldingSkjema } from "~/features/InntektsmeldingSkjemaState";
import { Fremgangsindikator } from "~/features/skjema-moduler/Fremgangsindikator";
import type {
  ÅrsaksType,
  NaturalytelseRequestDto,
  RefusjonsEndringRequestDto,
  SendInntektsmeldingRequestDto,
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
  const opplysninger = useLoaderData({ from: "/$id" });
  const { inntektsmeldingSkjemaState } = useInntektsmeldingSkjema();

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
                        <FormSummary.Answer
                          key={endring.fraOgMed + endring.beløp}
                        >
                          <FormSummary.Label>
                            Refusjonsbeløp per måned
                          </FormSummary.Label>
                          <FormSummary.Value>
                            {formatKroner(endring.beløp)} (fra og med{" "}
                            {formatDatoLang(new Date(endring.fraOgMed))})
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
                      (naturalytelse) => (
                        <FormSummary.Answer key={naturalytelse.navn}>
                          <FormSummary.Label>
                            {formatYtelsesnavn(naturalytelse.navn, true)}
                          </FormSummary.Label>
                          <FormSummary.Value>
                            Verdi {formatKroner(naturalytelse.beløp)} (fra og
                            med{" "}
                            {formatDatoKort(new Date(naturalytelse.fraOgMed))})
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
        <SendInnInntektsmelding opplysninger={opplysninger} />
      </div>
    </section>
  );
};

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

  const { inntektsmeldingSkjemaState } = useInntektsmeldingSkjema();

  const { mutate, error, isPending } = useMutation({
    mutationFn: async () => {
      const gjeldendeInntekt =
        inntektsmeldingSkjemaState.inntektEndringsÅrsak?.korrigertInntekt ??
        inntektsmeldingSkjemaState.inntekt;
      const inntektsmelding: SendInntektsmeldingRequestDto = {
        foresporselUuid: id,
        aktorId: opplysninger.person.aktørId,
        ytelse: opplysninger.ytelse,
        arbeidsgiverIdent: opplysninger.arbeidsgiver.organisasjonNummer,
        // @ts-expect-error -- Fiks når vi har løst overgang med undefined i skjema til en safe payload for IM.
        kontaktperson: inntektsmeldingSkjemaState.kontaktperson,
        startdato: opplysninger.startdatoPermisjon,
        inntekt: gjeldendeInntekt,
        // inntektEndringsÅrsak: inntektsmeldingSkjemaState.inntektEndringsÅrsak, // Send inn når BE har støtte for det
        refusjonsendringer: utledRefusjonsPerioder([
          ...inntektsmeldingSkjemaState.refusjonsendringer,
          {
            beløp: gjeldendeInntekt,
            fraOgMed: opplysninger.startdatoPermisjon,
          },
        ]),
        bortfaltNaturaltytelsePerioder: konverterNaturalytelsePerioder(
          inntektsmeldingSkjemaState.naturalytelserSomMistes,
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
          onClick={() => mutate()}
          variant="primary"
        >
          Send inn
        </Button>
      </div>
    </>
  );
}

function konverterNaturalytelsePerioder(
  naturalytelsePerioder: InntektsmeldingSkjemaState["naturalytelserSomMistes"],
): NaturalytelseRequestDto[] {
  // TODO: hvordan skille mellom optional typer og
  // @ts-expect-error --  se TODO
  return naturalytelsePerioder.map((periode) => ({
    naturalytelsetype: periode.navn,
    fom: formatIsoDatostempel(new Date(periode.fraOgMed)),
    beløp: periode.beløp,
    tom: periode.tilOgMed,
  }));
}

function utledRefusjonsPerioder(
  refusjonsendringer: InntektsmeldingSkjemaState["refusjonsendringer"],
): RefusjonsEndringRequestDto[] {
  return refusjonsendringer.map((endring) => ({
    fom: endring.fraOgMed,
    beløp: endring.beløp,
  }));
}
