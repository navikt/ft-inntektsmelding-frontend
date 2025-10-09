import { getRouteApi } from "@tanstack/react-router";

import { useInntektsmeldingSkjema } from "~/features/InntektsmeldingSkjemaState";

import { Kvittering } from "../shared/Kvittering";
import { useOpplysninger } from "./useOpplysninger";

const route = getRouteApi("/$id");

export const Steg4Kvittering = () => {
  const { id } = route.useParams();
  const opplysninger = useOpplysninger();
  const { gyldigInntektsmeldingSkjemaState } = useInntektsmeldingSkjema();

  return (
    <Kvittering
      breadcrumbUrl={`/${id}/kvittering`}
      inntektsmeldingsId={gyldigInntektsmeldingSkjemaState?.id}
      opplysninger={opplysninger}
      skalRefunderes={gyldigInntektsmeldingSkjemaState?.skalRefunderes}
    />
  );
};
