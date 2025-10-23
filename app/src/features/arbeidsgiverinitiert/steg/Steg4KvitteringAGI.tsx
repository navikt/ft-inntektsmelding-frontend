import { useOpplysninger } from "../../shared/hooks/useOpplysninger";
import { Kvittering } from "../../shared/skjema-moduler/Kvittering";
import { useInntektsmeldingSkjemaAGI } from "../SkjemaStateContext";

export const Steg4KvitteringAGI = () => {
  const opplysninger = useOpplysninger();
  const { gyldigInntektsmeldingSkjemaState } = useInntektsmeldingSkjemaAGI();

  return (
    <Kvittering
      breadcrumbUrl="/agi/$id/kvittering"
      inntektsmeldingsId={gyldigInntektsmeldingSkjemaState?.id}
      opplysninger={opplysninger}
      skalRefunderes={gyldigInntektsmeldingSkjemaState?.skalRefunderes}
    />
  );
};
