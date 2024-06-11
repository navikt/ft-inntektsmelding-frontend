import { setBreadcrumbs } from "@navikt/nav-dekoratoren-moduler";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi, Outlet } from "@tanstack/react-router";
import { useEffect } from "react";

import { forespørselQueryOptions } from "~/api/queries.ts";
import { RotLayout } from "~/features/rot-layout/RotLayout";
import { capitalizeSetning } from "~/utils.ts";

const route = getRouteApi("/$id");

export const NyInntektsmelding = () => {
  const { id } = route.useParams();

  const inntektsmeldingDialogDto = useSuspenseQuery(
    forespørselQueryOptions(id),
  ).data;

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
      tittel={`Inntektsmelding ${inntektsmeldingDialogDto.ytelse.toLowerCase().replace("_", " ")}`}
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
