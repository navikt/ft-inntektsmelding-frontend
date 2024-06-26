import { Detail, Heading, HStack, Page } from "@navikt/ds-react";

import { HjelpetekstToggle } from "~/features/Hjelpetekst.tsx";

import { Illustrasjon } from "./Illustrasjon";

type RotLayoutProps = {
  /** Tittelen på viewet man er i, som "Ny inntektsmelding", eller "Endring, inntektsmelding" */
  tittel: string;
  /** Undertittel, typisk navn på arbeidssted og ansatt */
  undertittel?: React.ReactNode;
  /** Innholdet i viewet */
  children: React.ReactNode;
};

/**
 * Layout som deles på tvers av alle views.
 * Dette burde være den ytterste komponenten på alle sider.
 */
export const RotLayout = ({
  tittel,
  undertittel,
  children,
}: RotLayoutProps) => {
  return (
    <Page background="bg-subtle">
      <Page.Block className="bg-bg-default border-border-focus-on-inverted border-b-4 py-5">
        <Page.Block width="md">
          <HStack align="center">
            <Illustrasjon />
            <div className="ml-4">
              <Heading level="1" size="large">
                {tittel}
              </Heading>
              {undertittel && <Detail as="div">{undertittel}</Detail>}
            </div>
          </HStack>
        </Page.Block>
      </Page.Block>
      <Page.Block className="mt-4" width="md">
        <HjelpetekstToggle />
      </Page.Block>
      <Page.Block width="md">{children}</Page.Block>
    </Page>
  );
};
