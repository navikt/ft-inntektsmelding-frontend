import { XMarkIcon } from "@navikt/aksel-icons";
import { Button, HStack } from "@navikt/ds-react";
import { setBreadcrumbs } from "@navikt/nav-dekoratoren-moduler";
import { Outlet, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";

import { RotLayout } from "../rot-layout/RotLayout";
import { RefusjonOmsorgspengerArbeidsgiverForm } from "./RefusjonOmsorgspengerArbeidsgiverForm";
import { useInnloggetBruker } from "./useInnloggetBruker";

export const RefusjonOmsorgspengerArbeidsgiverRotLayout = () => {
  const innloggetBruker = useInnloggetBruker();
  const location = useLocation();

  useEffect(() => {
    setBreadcrumbs([
      {
        title: "Min side – Arbeidsgiver",
        url: "/min-side-arbeidsgiver",
      },
      {
        title: "Søknad om refusjon for omsorgspenger",
        url: location.pathname,
      },
    ]);
  }, [location.pathname]);

  const erPåKvitteringssiden = location.pathname.includes("kvittering");
  return (
    <RefusjonOmsorgspengerArbeidsgiverForm>
      <RotLayout
        background={erPåKvitteringssiden ? "bg-default" : "bg-subtle"}
        medHvitBoks={!erPåKvitteringssiden}
        tittel="Søknad om refusjon for omsorgspenger"
        undertittel={
          <div className="flex gap-3">
            <span>{innloggetBruker.organisasjonsnavn}</span>
            <span aria-hidden="true">|</span>
            <span className="text-nowrap">
              Org.nr.: {innloggetBruker.organisasjonsnummer}
            </span>
          </div>
        }
      >
        <Outlet />
        {!erPåKvitteringssiden && (
          <HStack align="center" justify="center">
            <Button
              as="a"
              href="/min-side-arbeidsgiver"
              icon={<XMarkIcon />}
              variant="tertiary"
            >
              Avbryt
            </Button>
          </HStack>
        )}
      </RotLayout>
    </RefusjonOmsorgspengerArbeidsgiverForm>
  );
};
