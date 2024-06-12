import { setBreadcrumbs } from "@navikt/nav-dekoratoren-moduler";
import { getRouteApi, Outlet } from "@tanstack/react-router";
import { useEffect } from "react";

import { RotLayout } from "~/features/rot-layout/RotLayout";
import { capitalizeSetning, formatYtelsesnavn } from "~/utils.ts";

const route = getRouteApi("/$id");

export const NyInntektsmelding = () => {
  const { id } = route.useParams();
  const inntektsmeldingDialogDto = route.useLoaderData();

  useEffect(() => {
    setBreadcrumbs([
      {
        title: "Min side – Arbeidsgiver",
        url: "/",
      },
      {
        title: "Inntektsmelding",
        url: `${id}`,
      },
    ]);
  }, [id]);

  return (
    <RotLayout
      tittel={`Inntektsmelding ${formatYtelsesnavn(inntektsmeldingDialogDto.ytelse)}`}
      undertittel={
        <div className="flex gap-3">
          <span>{inntektsmeldingDialogDto.arbeidsgiver.organisasjonNavn}</span>
          <span>|</span>
          <span>{capitalizeSetning(inntektsmeldingDialogDto.person.navn)}</span>
        </div>
      }
    >
      <Outlet />
    </RotLayout>
  );
};
