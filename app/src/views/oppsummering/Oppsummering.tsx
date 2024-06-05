import { ArrowLeftIcon, PaperplaneIcon } from "@navikt/aksel-icons";
import { Alert, Button, FormSummary, Heading } from "@navikt/ds-react";
import { setBreadcrumbs } from "@navikt/nav-dekoratoren-moduler";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { sendInntektsmelding } from "~/api/mutations.ts";
import { forespørselQueryOptions } from "~/api/queries.ts";
import { Fremgangsindikator } from "~/features/skjema-moduler/Skjemafremgang";
import type { SendInntektsmeldingRequestDto } from "~/types/api-models.ts";
import { type ForespørselEntitet } from "~/types/api-models.ts";

const route = getRouteApi("/$id/oppsummering");

// TODO: linke til rett felt når man klikker "endre
export const Oppsummering = () => {
  const { id } = route.useParams();

  const forespørsel = useSuspenseQuery(forespørselQueryOptions(id)).data;

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

  const skjemadata = {
    dineOpplysninger: {
      arbeidsgiver: {
        virksomhetsnavn: "Eksempelhuset AS",
        orgnrForUnderenhet: "123 456 789",
        kontaktperson: [{ navn: "Test Personesen", telefon: "815 49 300" }],
      },
      ansatt: {
        fornavn: "Ansa",
        etternavn: "Tesen",
        identitetsnummer: "010101 23456",
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

  const pengeformatterer = new Intl.NumberFormat("nb-no", {
    style: "currency",
    currency: "NOK",
    maximumFractionDigits: 0,
  });

  return (
    <section>
      <div className="bg-bg-default mt-8 px-5 py-6 rounded-md flex flex-col gap-6">
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
                <FormSummary.Answers>
                  <FormSummary.Answer>
                    <FormSummary.Label>
                      Innsender og kontaktperson
                    </FormSummary.Label>
                    <FormSummary.Value>
                      {
                        skjemadata.dineOpplysninger.arbeidsgiver
                          .kontaktperson[0].navn
                      }
                      ,{" "}
                      {
                        skjemadata.dineOpplysninger.arbeidsgiver
                          .kontaktperson[0].telefon
                      }
                    </FormSummary.Value>
                  </FormSummary.Answer>
                </FormSummary.Answers>
              </FormSummary.Value>
            </FormSummary.Answer>
            <FormSummary.Answer>
              <FormSummary.Label>Den ansatte</FormSummary.Label>
              <FormSummary.Value>
                {skjemadata.dineOpplysninger.ansatt.fornavn}{" "}
                {skjemadata.dineOpplysninger.ansatt.etternavn}, (
                {skjemadata.dineOpplysninger.ansatt.identitetsnummer})
              </FormSummary.Value>
            </FormSummary.Answer>
          </FormSummary.Answers>
        </FormSummary>

        <FormSummary>
          <FormSummary.Header>
            <FormSummary.Heading level="3">
              Første dag med YTELSE
            </FormSummary.Heading>
          </FormSummary.Header>
          <FormSummary.Answers>
            <FormSummary.Answer>
              <FormSummary.Label>Fra og med</FormSummary.Label>
              <FormSummary.Value>01.01.2024</FormSummary.Value>
            </FormSummary.Answer>
          </FormSummary.Answers>
        </FormSummary>

        <FormSummary>
          <FormSummary.Header>
            <FormSummary.Heading level="3">Månedslønn</FormSummary.Heading>
            <FormSummary.EditLink as={Link} to="../inntekt-og-refusjon" />
          </FormSummary.Header>
          <FormSummary.Answers>
            <FormSummary.Answer>
              <FormSummary.Label>
                Beregnet månedslønn basert på de tre siste, fulle månedene før
                YTELSE
              </FormSummary.Label>
              <FormSummary.Value>
                {pengeformatterer.format(
                  skjemadata.inntektOgRefusjon.månedslønn,
                )}
              </FormSummary.Value>
            </FormSummary.Answer>
          </FormSummary.Answers>
        </FormSummary>

        <FormSummary>
          <FormSummary.Header>
            <FormSummary.Heading level="3">Refusjon</FormSummary.Heading>
            <FormSummary.EditLink as={Link} to="../inntekt-og-refusjon" />
          </FormSummary.Header>
          <FormSummary.Answers>
            <FormSummary.Answer>
              <FormSummary.Label>
                Skal dere betale lønn til FORNAVN og ha refusjon fra NAV?
              </FormSummary.Label>
              <FormSummary.Value>
                {skjemadata.inntektOgRefusjon.refusjon ? "Ja" : "Nei"}
              </FormSummary.Value>
            </FormSummary.Answer>
            <FormSummary.Answer>
              <FormSummary.Label>Refusjonsbeløp per måned</FormSummary.Label>
              <FormSummary.Value>
                {pengeformatterer.format(
                  skjemadata.inntektOgRefusjon.refusjon.refusjonBeløpPerMåned,
                )}
              </FormSummary.Value>
            </FormSummary.Answer>
            <FormSummary.Answer>
              <FormSummary.Label>
                Vil det være endringer i refusjon i løpet av perioden FORNAVN er
                i permisjon?
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
            <FormSummary.EditLink as={Link} to="../inntekt-og-refusjon" />
          </FormSummary.Header>
          <FormSummary.Answers>
            <FormSummary.Answer>
              <FormSummary.Label>
                Har {skjemadata.dineOpplysninger.ansatt.fornavn} naturalytelser
                som faller bort ved fraværet?
              </FormSummary.Label>
              <FormSummary.Value>
                {skjemadata.inntektOgRefusjon.naturalytelser ? "Ja" : "Nei"}
              </FormSummary.Value>
            </FormSummary.Answer>
          </FormSummary.Answers>
        </FormSummary>
        <SendInnInntektsmelding forespørsel={forespørsel} />
      </div>
    </section>
  );
};

type SendInnInntektsmeldingProps = {
  forespørsel: ForespørselEntitet;
};
function SendInnInntektsmelding({ forespørsel }: SendInnInntektsmeldingProps) {
  const navigate = useNavigate();

  const DUMMY_IM = {
    foresporselUuid: forespørsel.uuid,
    aktorId: forespørsel.brukerAktørId,
    ytelse: forespørsel.ytelseType,
    arbeidsgiverIdent: forespørsel.organisasjonsnummer,
    telefonnummer: "12345678",
    startdato: forespørsel.skjæringstidspunkt,
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
      navigate({ from: "/ny/$id/oppsummering", to: "../kvittering" });
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
