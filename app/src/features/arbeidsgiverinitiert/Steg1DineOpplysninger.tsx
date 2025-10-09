import { useNavigate } from "@tanstack/react-router";

import { DineOpplysninger } from "../shared/DineOpplysninger";
import {
  InntektsmeldingSkjemaStateAGI,
  useInntektsmeldingSkjemaAGI,
} from "./SkjemaStateAGI";

export const Steg1DineOpplysningerAGI = () => {
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
      from: "/agi/dine-opplysninger",
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
