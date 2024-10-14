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
  }, [id]);

  return (
    <InntektsmeldingSkjemaStateProvider>
      <RotLayout
        background={
          location.pathname.includes("kvittering") ? "bg-default" : "bg-subtle"
        }
        tittel={`Inntektsmelding ${formatYtelsesnavn(opplysninger.ytelse)}`}
        undertittel={
          <div className="flex gap-3">
            <span>{opplysninger.arbeidsgiver.organisasjonNavn}</span>
            <span aria-hidden="true">|</span>
            <span className="text-nowrap">
              Org.nr.: {opplysninger.arbeidsgiver.organisasjonNummer}
            </span>
          </div>
        }
      >
        <Outlet />
      </RotLayout>
    </InntektsmeldingSkjemaStateProvider>
  );
};
