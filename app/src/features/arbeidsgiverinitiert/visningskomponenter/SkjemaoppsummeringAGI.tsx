import { OpplysningerDto } from "~/types/api-models";

import {
  ArbeidsgiverOgAnsattOppsummering,
  RefusjonOppsummering,
  UtbetalingOgRefusjonOppsummering,
} from "../../inntektsmelding/visningskomponenter/Skjemaoppsummering.tsx";
import { InntektsmeldingSkjemaStateValidAGI } from "../zodSchemas.tsx";

export const SkjemaoppsummeringAGI = ({
  opplysninger,
  gyldigInntektsmeldingSkjemaState,
}: {
  opplysninger: OpplysningerDto;
  gyldigInntektsmeldingSkjemaState: InntektsmeldingSkjemaStateValidAGI;
}) => {
  return (
    <>
      <ArbeidsgiverOgAnsattOppsummering
        editPath="/agi/$id/dine-opplysninger"
        kanEndres={true}
        opplysninger={opplysninger}
        skjemaState={gyldigInntektsmeldingSkjemaState}
      />
      <RefusjonOppsummering
        editPath="/agi/$id/refusjon"
        kanEndres={true}
        opplysninger={opplysninger}
      />
      <UtbetalingOgRefusjonOppsummering
        editPath="/agi/$id/refusjon"
        kanEndres={true}
        skjemaState={gyldigInntektsmeldingSkjemaState}
      />
    </>
  );
};
