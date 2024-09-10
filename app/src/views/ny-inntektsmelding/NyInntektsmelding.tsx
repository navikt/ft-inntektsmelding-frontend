import { setBreadcrumbs } from "@navikt/nav-dekoratoren-moduler";
import { getRouteApi, Outlet, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";

import { InntektsmeldingSkjemaStateProvider } from "~/features/InntektsmeldingSkjemaState";
import { RotLayout } from "~/features/rot-layout/RotLayout";
import { formatYtelsesnavn } from "~/utils.ts";

const route = getRouteApi("/$id");

export const NyInntektsmelding = () => {
  const { id } = route.useParams();
  const { opplysninger } = route.useLoaderData();
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
        tittel={`Inntektsmelding ${formatYtelsesnavn(opplysninger.ytelse)}`}
        undertittel={
          <div className="flex gap-3">
            <span>{opplysninger.arbeidsgiver.organisasjonNavn}</span>
            <span>|</span>
            <span>{opplysninger.arbeidsgiver.organisasjonNummer}</span>
          </div>
        }
      >
        <Outlet />
      </RotLayout>
    </InntektsmeldingSkjemaStateProvider>
  );
};
