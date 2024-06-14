import { setBreadcrumbs } from "@navikt/nav-dekoratoren-moduler";
import { getRouteApi, Outlet } from "@tanstack/react-router";
import { useEffect } from "react";

import { RotLayout } from "~/features/rot-layout/RotLayout";
import {
  capitalizeSetning,
  formatYtelsesnavn,
  slåSammenTilFulltNavn,
} from "~/utils.ts";

const route = getRouteApi("/$id");

export const NyInntektsmelding = () => {
  const { id } = route.useParams();
  const opplysninger = route.useLoaderData();

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
      tittel={`Inntektsmelding ${formatYtelsesnavn(opplysninger.ytelse)}`}
      undertittel={
        <div className="flex gap-3">
          <span>{opplysninger.arbeidsgiver.organisasjonNavn}</span>
          <span>|</span>
          <span>
            {capitalizeSetning(
              slåSammenTilFulltNavn(
                opplysninger.person.fornavn,
                opplysninger.person.mellomnavn,
                opplysninger.person.etternavn,
              ),
            )}
          </span>
        </div>
      }
    >
      <Outlet />
    </RotLayout>
  );
};
