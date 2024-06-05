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
                    <FormSummary.Value>TODO</FormSummary.Value>
                  </FormSummary.Answer>
                  <FormSummary.Answer>
                    <FormSummary.Label>
                      Org. nr. for underenhet
                    </FormSummary.Label>
                    <FormSummary.Value>000000000</FormSummary.Value>
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
                      Todo Todosen, 815 493 00
                    </FormSummary.Value>
                  </FormSummary.Answer>
                  <FormSummary.Answer>
                    <FormSummary.Label>Kontaktperson</FormSummary.Label>
                    <FormSummary.Value>
                      André Todosen, 22 22 55 55
                    </FormSummary.Value>
                  </FormSummary.Answer>
                </FormSummary.Answers>
              </FormSummary.Value>
            </FormSummary.Answer>
            <FormSummary.Answer>
              <FormSummary.Label>Den ansatte</FormSummary.Label>
              <FormSummary.Value>Ann Sattesen, 010203 12345</FormSummary.Value>
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
                {pengeformatterer.format(12_345)}
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
              <FormSummary.Value>Ja</FormSummary.Value>
            </FormSummary.Answer>
            <FormSummary.Answer>
              <FormSummary.Label>Refusjonsbeløp per måned</FormSummary.Label>
              <FormSummary.Value>
                {pengeformatterer.format(12_345)}
              </FormSummary.Value>
            </FormSummary.Answer>
            <FormSummary.Answer>
              <FormSummary.Label>
                Vil det være endringer i refusjon i løpet av perioden FORNAVN er
                i permisjon?
              </FormSummary.Label>
              <FormSummary.Value>Nei</FormSummary.Value>
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
                Har FORNAVN naturalytelser som faller bort ved fraværet
              </FormSummary.Label>
              <FormSummary.Value>Nei</FormSummary.Value>
            </FormSummary.Answer>
          </FormSummary.Answers>
        </FormSummary>
      </div>
    </section>
  );
};
