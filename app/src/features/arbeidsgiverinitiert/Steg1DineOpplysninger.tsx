import { useNavigate } from "@tanstack/react-router";

import { ARBEIDSGIVER_INITERT_ID } from "~/routes/opprett";

import { useOpplysninger } from "../inntektsmelding/useOpplysninger";
import { DineOpplysninger } from "../shared/DineOpplysninger";
import {
  InntektsmeldingSkjemaStateAGI,
  useInntektsmeldingSkjemaAGI,
} from "./SkjemaStateAGI";

export const Steg1DineOpplysningerAGI = () => {
  const opplysninger = useOpplysninger();
  const { inntektsmeldingSkjemaState, setInntektsmeldingSkjemaState } =
    useInntektsmeldingSkjemaAGI();
  const navigate = useNavigate();
  const onSubmit = (
    kontaktperson: InntektsmeldingSkjemaStateAGI["kontaktperson"],
  ) => {
    setInntektsmeldingSkjemaState((prev: InntektsmeldingSkjemaStateAGI) => ({
      ...prev,
      kontaktperson,
    }));
    navigate({
      from: "/agi/$id/dine-opplysninger",
      params: { id: opplysninger.forespørselUuid || ARBEIDSGIVER_INITERT_ID },
      to: "../refusjon",
    });
  };
  return (
    <DineOpplysninger
      inntektsmeldingSkjemaState={inntektsmeldingSkjemaState}
      onSubmit={onSubmit}
    />
  );
};
