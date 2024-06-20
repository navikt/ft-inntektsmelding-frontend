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
  NaturalytelseRequestDto,
  RefusjonsperiodeRequestDto,
  SendInntektsmeldingRequestDto,
} from "~/types/api-models.ts";
import {
  formatDatoLang,
  formatFødselsnummer,
  formatIsoDatostempel,
  formatKroner,
  formatYtelsesnavn,
  gjennomsnittInntekt,
  slåSammenTilFulltNavn,
} from "~/utils";

const route = getRouteApi("/$id/oppsummering");

export const Oppsummering = () => {
  const opplysninger = useLoaderData({ from: "/$id" });
  const { inntektsmeldingSkjemaState } = useInntektsmeldingSkjema();

  const søknad = {
    ytelseType: "Foreldrepenger",
    oppstart: new Date("2024-01-01"),
  };

  const skjemadata = {
    dineOpplysninger: {
      arbeidsgiver: {
        virksomhetsnavn: "Eksempelhuset AS",
        orgnrForUnderenhet: "123 456 789",
        kontaktperson: [{ navn: "Test Personesen", telefon: "815 49 300" }],
      },
      arbeidstaker: {
        fornavn: "Ansa",
        etternavn: "Tesen",
        identitetsnummer: "01010123456",
      },
    },
    inntektOgRefusjon: {
      månedslønn: 45_000,
      refusjon: {
        refusjonBeløpPerMåned: 30_000,
        endringIRefusjon: false,
      },
      naturalytelser: false,
    },
  };

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
                {slåSammenTilFulltNavn(
                  opplysninger.person.fornavn,
                  opplysninger.person.mellomnavn,
                  opplysninger.person.etternavn,
                )}
                {", "}({formatFødselsnummer(opplysninger.person.fødselsnummer)})
              </FormSummary.Value>
            </FormSummary.Answer>
          </FormSummary.Answers>
        </FormSummary>

        <FormSummary>
          <FormSummary.Header>
            <FormSummary.Heading level="3">
              Første dag med {formatYtelsesnavn(søknad.ytelseType)}
            </FormSummary.Heading>
          </FormSummary.Header>
          <FormSummary.Answers>
            <FormSummary.Answer>
              <FormSummary.Label>Fra og med</FormSummary.Label>
              <FormSummary.Value>
                {formatDatoLang(søknad.oppstart)}
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
                {formatYtelsesnavn(søknad.ytelseType)}
              </FormSummary.Label>
              <FormSummary.Value>
                {formatKroner(skjemadata.inntektOgRefusjon.månedslønn)}
              </FormSummary.Value>
            </FormSummary.Answer>
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
                Skal dere betale lønn til{" "}
                {skjemadata.dineOpplysninger.arbeidstaker.fornavn} og ha
                refusjon fra NAV?
              </FormSummary.Label>
              <FormSummary.Value>
                {inntektsmeldingSkjemaState.skalRefunderes ? "Ja" : "Nei"}
              </FormSummary.Value>
            </FormSummary.Answer>
            {skjemadata.inntektOgRefusjon.refusjon && (
              <FormSummary.Answer>
                <FormSummary.Label>Refusjonsbeløp per måned</FormSummary.Label>
                <FormSummary.Value>
                  {formatKroner(
                    skjemadata.inntektOgRefusjon.refusjon.refusjonBeløpPerMåned,
                  )}
                </FormSummary.Value>
              </FormSummary.Answer>
            )}
            <FormSummary.Answer>
              <FormSummary.Label>
                Vil det være endringer i refusjon i løpet av perioden{" "}
                {skjemadata.dineOpplysninger.arbeidstaker.fornavn} er i
                permisjon?
              </FormSummary.Label>
              <FormSummary.Value>
                {inntektsmeldingSkjemaState.endringIRefusjon ? "Ja" : "Nei"}
              </FormSummary.Value>
            </FormSummary.Answer>
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
                Har {skjemadata.dineOpplysninger.arbeidstaker.fornavn}{" "}
                naturalytelser som faller bort ved fraværet?
              </FormSummary.Label>
              <FormSummary.Value>
                {inntektsmeldingSkjemaState.misterNaturalytelser ? "Ja" : "Nei"}
              </FormSummary.Value>
            </FormSummary.Answer>
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

type SendInnInntektsmeldingProps = {
  opplysninger: OpplysningerDto;
};
function SendInnInntektsmelding({ opplysninger }: SendInnInntektsmeldingProps) {
  const navigate = useNavigate();
  const { id } = route.useParams();

  const { inntektsmeldingSkjemaState } = useInntektsmeldingSkjema();

  const { mutate, error, isPending } = useMutation({
    mutationFn: async () => {
      const månedsLønn =
        inntektsmeldingSkjemaState.korrigertMånedslønn ??
        gjennomsnittInntekt(opplysninger.inntekter ?? []); // TODO: burde dette feltet alltid settes i formet, slik at korrigertMånedslønn i utgpkt er inntekt som så endres

      const inntektsmelding: SendInntektsmeldingRequestDto = {
        foresporselUuid: id,
        aktorId: opplysninger.person.aktørId,
        ytelse: opplysninger.ytelse,
        arbeidsgiverIdent: opplysninger.arbeidsgiver.organisasjonNummer,
        kontaktperson: inntektsmeldingSkjemaState.kontaktperson,
        startdato: opplysninger.startdatoPermisjon,
        inntekt: månedsLønn,
        refusjonsperioder: utledRefusjonsPerioder([
          ...inntektsmeldingSkjemaState.refusjonsendringer,
          { beløp: månedsLønn, fraOgMed: opplysninger.startdatoPermisjon },
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
    erBortfalt: true,
    tom: undefined, // Gjelder hele permisjonen
  }));
}

function utledRefusjonsPerioder(
  refusjonsPerioder: InntektsmeldingSkjemaState["refusjonsendringer"],
): RefusjonsperiodeRequestDto[] {
  const perioderSynkende = [...refusjonsPerioder].sort(
    (a, b) => new Date(b.fraOgMed).getTime() - new Date(a.fraOgMed).getTime(),
  );

  return perioderSynkende.map((currentValue, index, array) => {
    const forrigePeriode = array[index - 1];
    return {
      fom: formatIsoDatostempel(new Date(currentValue.fraOgMed)),
      beløp: currentValue.beløp,
      tom: forrigePeriode
        ? formatIsoDatostempel(new Date(forrigePeriode.fraOgMed))
        : undefined,
    };
  });
}
