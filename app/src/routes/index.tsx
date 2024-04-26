import { BodyLong } from "@navikt/ds-react";
import { setBreadcrumbs } from "@navikt/nav-dekoratoren-moduler";
import { createFileRoute } from "@tanstack/react-router";

import { RotLayout } from "../features/rot-layout/RotLayout";

export const Route = createFileRoute("/")({
  component: () => (
    <RotLayout tittel="Inntektsmelding" ytelse="Pleiepenger">
      <Breadcrumbs />
      <BodyLong spacing>
        For at vi skal utbetale riktig beløp i forbindelse med sykmelding, må
        dere bekrefte eller oppdatere opplysningene vi har om den ansatte og
        sykefraværet. Vi gjør dere oppmerksom på at den ansatte vil få tilgang
        til å se innsendt informasjon etter personopplysningslovens artikkel 15
        og forvaltningsloven § 18.
      </BodyLong>
      <BodyLong>
        Da dette sykefraværet er innenfor samme arbeidsgiverperiode som forrige
        sykefravær trenger vi bare informasjon om inntekt og refusjon.
      </BodyLong>
    </RotLayout>
  ),
});

const Breadcrumbs = () => {
  setBreadcrumbs([
    { title: "Min side arbeidsgiver", url: "/" },
    {
      title: "Inntektsmelding",
      url: "/inntektsmelding",
    },
  ]);
  return null;
};
