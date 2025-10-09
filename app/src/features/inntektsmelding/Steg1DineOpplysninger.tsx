import { useNavigate } from "@tanstack/react-router";

import {
  InntektsmeldingSkjemaState,
  useInntektsmeldingSkjema,
} from "~/features/InntektsmeldingSkjemaState";

import { DineOpplysninger } from "../shared/DineOpplysninger";

export const Steg1DineOpplysninger = () => {
  const { inntektsmeldingSkjemaState, setInntektsmeldingSkjemaState } =
    useInntektsmeldingSkjema();
  const navigate = useNavigate();
  const handleSubmit = (
    kontaktperson: InntektsmeldingSkjemaState["kontaktperson"],
  ) => {
    setInntektsmeldingSkjemaState((prev: InntektsmeldingSkjemaState) => ({
      ...prev,
      kontaktperson,
    }));
    navigate({
      from: "/$id/dine-opplysninger",
      to: "../inntekt-og-refusjon",
    });
  };

  return (
    <DineOpplysninger
      inntektsmeldingSkjemaState={inntektsmeldingSkjemaState}
      onSubmit={handleSubmit}
    />
  );
};
