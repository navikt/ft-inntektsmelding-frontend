import { ArrowLeftIcon, PaperplaneIcon } from "@navikt/aksel-icons";
import { Alert, Button, FormSummary, Heading } from "@navikt/ds-react";
import { setBreadcrumbs } from "@navikt/nav-dekoratoren-moduler";
import { useMutation } from "@tanstack/react-query";
import { getRouteApi, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { sendInntektsmelding } from "~/api/mutations.ts";
import type { InntektsmeldingSkjemaState } from "~/features/InntektsmeldingSkjemaState";
import { useInntektsmeldingSkjema } from "~/features/InntektsmeldingSkjemaState";
import { Fremgangsindikator } from "~/features/skjema-moduler/Fremgangsindikator";
import type {
  InntektsmeldingDialogDto,
  SendInntektsmeldingRequestDto,
} from "~/types/api-models.ts";
import {
  formatDatoLang,
  formatIdentitetsnummer,
  formatKroner,
  formatYtelsesnavn,
} from "~/utils";

const route = getRouteApi("/$id/oppsummering");

export const Oppsummering = () => {
  const { id } = route.useParams();
  const inntektsmeldingDialogDto = route.useLoaderData();

  useEffect(() => {
    setBreadcrumbs([
      {
        title: "Min side – Arbeidsgiver",
        url: "/",
      },
      {
        title: "Inntektsmelding",
        url: `/${id}`,
      },
      {
        title: "Oppsummering",
        url: `/${id}/oppsummering`,
      },
    ]);
  }, [id]);

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
                      {skjemadata.dineOpplysninger.arbeidsgiver.virksomhetsnavn}
                    </FormSummary.Value>
                  </FormSummary.Answer>
                  <FormSummary.Answer>
                    <FormSummary.Label>
                      Org. nr. for underenhet
                    </FormSummary.Label>
                    <FormSummary.Value>
                      {
                        skjemadata.dineOpplysninger.arbeidsgiver
                          .orgnrForUnderenhet
                      }
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
                {skjemadata.dineOpplysninger.arbeidstaker.fornavn}{" "}
                {skjemadata.dineOpplysninger.arbeidstaker.etternavn} (
                {formatIdentitetsnummer(
                  skjemadata.dineOpplysninger.arbeidstaker.identitetsnummer,
                )}
                )
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
                {skjemadata.inntektOgRefusjon.refusjon ? "Ja" : "Nei"}
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
                {skjemadata.inntektOgRefusjon.refusjon?.endringIRefusjon
                  ? "Ja"
                  : "Nei"}
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
                {skjemadata.inntektOgRefusjon.naturalytelser ? "Ja" : "Nei"}
              </FormSummary.Value>
            </FormSummary.Answer>
          </FormSummary.Answers>
        </FormSummary>
        <SendInnInntektsmelding
          inntektsmeldingDialogDto={inntektsmeldingDialogDto}
        />
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
  return `${kontaktperson.navn}, ${kontaktperson.telefon}`;
};

type SendInnInntektsmeldingProps = {
  inntektsmeldingDialogDto: InntektsmeldingDialogDto;
};
function SendInnInntektsmelding({
  inntektsmeldingDialogDto,
}: SendInnInntektsmeldingProps) {
  const navigate = useNavigate();

  const DUMMY_IM = {
    foresporselUuid: "123", // TODO
    aktorId: inntektsmeldingDialogDto.person.aktørId,
    ytelse: inntektsmeldingDialogDto.ytelse,
    arbeidsgiverIdent: inntektsmeldingDialogDto.arbeidsgiver.organisasjonNummer,
    telefonnummer: "12345678",
    startdato: inntektsmeldingDialogDto.startdatoPermisjon,
    inntekt: 30_000,
    refusjonsperioder: [],
    bortfaltNaturaltytelsePerioder: [],
  };

  const { mutate, error, isPending } = useMutation<
    unknown,
    unknown,
    SendInntektsmeldingRequestDto
  >({
    mutationFn: sendInntektsmelding,
    onSuccess: () => {
      navigate({ from: "/$id/oppsummering", to: "../kvittering" });
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
          onClick={() => mutate(DUMMY_IM)}
          variant="primary"
        >
          Send inn
        </Button>
      </div>
    </>
  );
}
