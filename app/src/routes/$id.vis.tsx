import {
  createFileRoute,
  getRouteApi,
  useNavigate,
} from "@tanstack/react-router";
import { useEffect } from "react";

import { VisInntektsmelding } from "~/features/inntektsmelding/VisInntektsmelding";

const InntektsmeldingContainer = () => {
  const route = getRouteApi("/$id");
  const { opplysninger } = route.useLoaderData();
  const navigate = useNavigate();
  useEffect(() => {
    if (opplysninger.ytelse === "OMSORGSPENGER") {
      navigate({
        to: "/refusjon-omsorgspenger/$organisasjonsnummer/vis",
        params: {
          organisasjonsnummer: opplysninger.arbeidsgiver.organisasjonNummer,
        },
        search: {
          id: opplysninger.forespørselUuid,
        },
      });
    }
  }, [opplysninger]);

  return <VisInntektsmelding />;
};
export const Route = createFileRoute("/$id/vis")({
  component: InntektsmeldingContainer,
});
