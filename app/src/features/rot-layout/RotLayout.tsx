import { Heading, HStack, Page } from "@navikt/ds-react";

import { Illustrasjon } from "./Illustrasjon";

type RotLayoutProps = {
  /** Navnet på ytelsen man sender inn inntektsmelding for */
  ytelse: string;
  /** Tittelen på viewet man er i, som "Ny inntektsmelding", eller "Endring, inntektsmelding" */
  tittel: string;
  /** Innholdet i viewet */
  children: React.ReactNode;
};
/**
 * Layout som deles på tvers av alle views.
 * Dette burde være den ytterste komponenten på alle sider.
 */
export const RotLayout = ({ ytelse, tittel, children }: RotLayoutProps) => {
  return (
    <Page background="bg-subtle">
      <Page.Block className="bg-bg-default border-border-focus-on-inverted border-b-4 py-5">
        <Page.Block width="lg">
          <HStack align="center">
            <Illustrasjon />
            <Heading className="ml-4" level="1" size="medium">
              Inntektsmelding – {ytelse}
            </Heading>
          </HStack>
        </Page.Block>
      </Page.Block>
      <Page.Block
        className="bg-surface-info-subtle mt-10"
        gutters={true}
        width="lg"
      >
        <Heading className="p-6" level="2" size="medium">
          {tittel}
        </Heading>
      </Page.Block>
      <Page.Block className="bg-bg-default py-4" gutters={true} width="lg">
        {children}
      </Page.Block>
    </Page>
  );
};
