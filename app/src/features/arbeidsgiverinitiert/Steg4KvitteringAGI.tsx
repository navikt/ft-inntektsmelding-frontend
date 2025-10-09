import { useOpplysninger } from "../inntektsmelding/useOpplysninger";
import { Kvittering } from "../shared/Kvittering";
import { useInntektsmeldingSkjemaAGI } from "./SkjemaStateAGI";

export const Steg4KvitteringAGI = () => {
  const opplysninger = useOpplysninger();
  const { gyldigInntektsmeldingSkjemaState } = useInntektsmeldingSkjemaAGI();

  return (
    <Kvittering
      breadcrumbUrl="/agi/kvittering"
      inntektsmeldingsId={gyldigInntektsmeldingSkjemaState?.id}
      opplysninger={opplysninger}
      skalRefunderes={gyldigInntektsmeldingSkjemaState?.skalRefunderes}
    />
  );
};
