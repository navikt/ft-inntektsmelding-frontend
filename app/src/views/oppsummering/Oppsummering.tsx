import { FormSummary, Heading } from "@navikt/ds-react";
import { setBreadcrumbs } from "@navikt/nav-dekoratoren-moduler";
import { getRouteApi, Link } from "@tanstack/react-router";
import { useEffect } from "react";

import { Fremgangsindikator } from "~/features/skjema-moduler/Skjemafremgang";

const route = getRouteApi("/ny/$id/oppsummering");

export const Oppsummering = () => {
  const { id } = route.useParams();

  useEffect(() => {
    setBreadcrumbs([
      {
        title: "Min side – Arbeidsgiver",
        url: "/",
      },
      {
        title: "Inntektsmelding",
        url: `/ny/${id}`,
      },
      {
        title: "Oppsummering",
        url: `/ny/${id}/oppsummering`,
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
            <FormSummary.EditLink href="/ny/$id/inntekt-og-refusjon" />
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
            <FormSummary.EditLink href="/ny/$id/inntekt-og-refusjon" />
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
      </div>
    </section>
  );
};
