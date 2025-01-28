import { XMarkIcon } from "@navikt/aksel-icons";
import { Button, HStack } from "@navikt/ds-react";
import { setBreadcrumbs } from "@navikt/nav-dekoratoren-moduler";
import { getRouteApi, Outlet, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";

import { InntektsmeldingSkjemaStateProvider } from "~/features/InntektsmeldingSkjemaState";
import { RotLayout } from "~/features/rot-layout/RotLayout";
import { formatYtelsesnavn } from "~/utils.ts";

import { useOpplysninger } from "./useOpplysninger";

const route = getRouteApi("/$id");

export const InntektsmeldingRootLayout = () => {
  const { id } = route.useParams();
  const opplysninger = useOpplysninger();

  return (
    <InntektsmeldingRootLayoutComponent
      skjemaId={id}
      ytelse={opplysninger.ytelse}
      {...opplysninger.arbeidsgiver}
    />
  );
};

type InntektsmeldingRootLayoutProps = {
  ytelse: string;
  organisasjonNavn: string;
  organisasjonNummer: string;
  skjemaId: string;
};
export const InntektsmeldingRootLayoutComponent = (
  props: InntektsmeldingRootLayoutProps,
) => {
  const location = useLocation();

  useEffect(() => {
    setBreadcrumbs([
      {
        title: "Min side – Arbeidsgiver",
        url: "/min-side-arbeidsgiver",
      },
      {
        title: "Inntektsmelding",
        url: location.pathname,
      },
    ]);
  }, []);

  const erPåKvitteringssiden = location.pathname.includes("kvittering");

  return (
    <InntektsmeldingSkjemaStateProvider skjemaId={props.skjemaId}>
      <RotLayout
        background={erPåKvitteringssiden ? "bg-default" : "bg-subtle"}
        tittel={`Inntektsmelding ${formatYtelsesnavn(props.ytelse)}`}
        undertittel={
          <div className="flex gap-3">
            <span>{props.organisasjonNavn}</span>
            <span aria-hidden="true">|</span>
            <span className="text-nowrap">
              Org.nr.: {props.organisasjonNummer}
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
    </InntektsmeldingSkjemaStateProvider>
  );
};
