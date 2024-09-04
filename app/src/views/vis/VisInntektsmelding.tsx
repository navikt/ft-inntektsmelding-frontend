import { getRouteApi } from "@tanstack/react-router";

import { useInntektsmeldingSkjema } from "~/features/InntektsmeldingSkjemaState.tsx";
import { Skjemaoppsummering } from "~/views/shared/Skjemaoppsummering.tsx";

const route = getRouteApi("/$id");

export const VisInntektsmelding = () => {
  const { opplysninger, eksisterendeInntektsmeldinger } = route.useLoaderData();
  const { setInntektsmeldingSkjemaState } = useInntektsmeldingSkjema();

  const [sisteInntektsmelding] = eksisterendeInntektsmeldinger;

  if (!sisteInntektsmelding) {
    return null;
  }

  setInntektsmeldingSkjemaState(sisteInntektsmelding);

  return (
    <div>
      <Skjemaoppsummering
        opplysninger={opplysninger}
        skjemaState={sisteInntektsmelding}
      />
    </div>
  );
};
