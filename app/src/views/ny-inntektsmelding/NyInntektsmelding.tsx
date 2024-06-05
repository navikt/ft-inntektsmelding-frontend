import { setBreadcrumbs } from "@navikt/nav-dekoratoren-moduler";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi, Outlet } from "@tanstack/react-router";
import { useEffect } from "react";

import {
  forespørselQueryOptions,
  organisasjonQueryOptions,
  personinfoQueryOptions,
} from "~/api/queries.ts";
import { RotLayout } from "~/features/rot-layout/RotLayout";
import { capitalizeSetning } from "~/utils.ts";

const route = getRouteApi("/$id");

export const NyInntektsmelding = () => {
  const { id } = route.useParams();

  const forespørsel = useSuspenseQuery(forespørselQueryOptions(id)).data;
  const { data: brukerdata } = useQuery({
    ...personinfoQueryOptions(
      forespørsel.brukerAktørId,
      forespørsel.ytelseType,
    ),
    enabled: !!forespørsel,
  });
  const { data: organisasjonsData } = useQuery({
    ...organisasjonQueryOptions(forespørsel.organisasjonsnummer),
    enabled: !!forespørsel,
  });

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
      tittel={`Inntektsmelding ${forespørsel.ytelseType.toLowerCase().replace("_", " ")}`}
      undertittel={
        <div className="flex gap-3">
          <span>{organisasjonsData?.organisasjonNavn ?? ""}</span>
          <span>|</span>
          <span>{capitalizeSetning(brukerdata?.navn ?? "")}</span>
        </div>
      }
    >
      <Outlet />
    </RotLayout>
  );
};
