import { XMarkIcon } from "@navikt/aksel-icons";
import {
  Button,
  Detail,
  Heading,
  HStack,
  Page,
  PageProps,
} from "@navikt/ds-react";

import { HjelpetekstToggle } from "../Hjelpetekst";
import illustrasjonUrl from "./illustrasjon.svg";

type RotLayoutProps = {
  /** Tittelen på viewet man er i, som "Ny inntektsmelding", eller "Endring, inntektsmelding" */
  tittel: React.ReactNode;
  /** Undertittel, typisk navn på arbeidssted og ansatt */
  undertittel?: React.ReactNode;
  /** Innholdet i viewet */
  children: React.ReactNode;
  /** Bakgrunnen til siden */
  background?: PageProps["background"];
  /** Flagg som wrapper innholdet i en hvit boks */
  medHvitBoks?: boolean;
  /** Flagg som viser hjelpetekst-toggle */
  medHjelpetekstToggle?: boolean;
  /** Flagg som viser en avbryt knapp */
  medAvbrytKnapp?: boolean;
};

/**
 * Layout som deles på tvers av alle views.
 * Dette burde være den ytterste komponenten på alle sider.
 */
export const RotLayout = ({
  tittel,
  undertittel,
  children,
  medHjelpetekstToggle = false,
  background = "bg-subtle",
  medHvitBoks = false,
  medAvbrytKnapp = false,
}: RotLayoutProps) => {
  return (
    <main id="maincontent">
      <Page background={background}>
        <Page.Block className="bg-bg-default border-border-focus-on-inverted border-b-4 py-5">
          <Page.Block width="md">
            <HStack align="center">
              <img
                alt=""
                className="hidden md:block ml-3"
                height="52"
                src={illustrasjonUrl}
                width="52"
              />
              <div className="ml-4">
                <Heading level="1" size="large">
                  {tittel}
                </Heading>
                {undertittel && <Detail as="div">{undertittel}</Detail>}
              </div>
            </HStack>
          </Page.Block>
        </Page.Block>
        <Page.Block width="md">
          {medHjelpetekstToggle && <HjelpetekstToggle />}
          {medHvitBoks ? (
            <div className="bg-bg-default px-5 py-6 rounded-md flex gap-6 flex-col mt-2">
              {children}
            </div>
          ) : (
            children
          )}
        </Page.Block>
        {medAvbrytKnapp && (
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
      </Page>
    </main>
  );
};
