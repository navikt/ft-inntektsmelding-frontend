import { ArrowLeftIcon, ArrowRightIcon } from "@navikt/aksel-icons";
import { Button, Heading } from "@navikt/ds-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { useOpplysninger } from "~/features/shared/hooks/useOpplysninger.tsx";
import { Fremgangsindikator } from "~/features/shared/skjema-moduler/Fremgangsindikator.tsx";
import { ARBEIDSGIVER_INITERT_ID } from "~/routes/opprett";
import { formatYtelsesnavn } from "~/utils";

import { useDocumentTitle } from "../../shared/hooks/useDocumentTitle.tsx";
import { useScrollToTopOnMount } from "../../shared/hooks/useScrollToTopOnMount.tsx";
import { DatePickerWrapped } from "../../shared/react-hook-form-wrappers/DatePickerWrapped.tsx";
import { UtbetalingOgRefusjon } from "../../shared/skjema-moduler/UtbetalingOgRefusjon.tsx";
import { useInntektsmeldingSkjemaAGI } from "../SkjemaStateContext";
import { InntektsmeldingSkjemaStateAGI } from "../zodSchemas.tsx";

export type RefusjonForm = {
  meta: {
    skalKorrigereInntekt: boolean;
  };
  skalRefunderes: "JA_LIK_REFUSJON" | "JA_VARIERENDE_REFUSJON" | "NEI";
  førsteFraværsdag: string;
} & Pick<InntektsmeldingSkjemaStateAGI, "refusjon">;

export function Steg2Refusjon() {
  useScrollToTopOnMount();
  const opplysninger = useOpplysninger();
  useDocumentTitle(
    `Refusjon - inntektsmelding for ${formatYtelsesnavn(opplysninger.ytelse)}`,
  );

  const { inntektsmeldingSkjemaState, setInntektsmeldingSkjemaState } =
    useInntektsmeldingSkjemaAGI();

  const defaultInntekt = opplysninger.inntektsopplysninger.gjennomsnittLønn;

  const formMethods = useForm<RefusjonForm>({
    defaultValues: {
      førsteFraværsdag: opplysninger.førsteUttaksdato,
      refusjon:
        inntektsmeldingSkjemaState.refusjon.length === 0
          ? [
              {
                fom: opplysninger.førsteUttaksdato,
                beløp: defaultInntekt,
              },
              { fom: undefined, beløp: 0 },
            ]
          : inntektsmeldingSkjemaState.refusjon.length === 1
            ? [
                ...inntektsmeldingSkjemaState.refusjon,
                { fom: undefined, beløp: 0 },
              ]
            : inntektsmeldingSkjemaState.refusjon,
      skalRefunderes: inntektsmeldingSkjemaState.skalRefunderes,
    },
  });

  const { handleSubmit, watch, setValue } = formMethods;

  watch("førsteFraværsdag");
  const førsteFraværsdag = watch("førsteFraværsdag");

  useEffect(() => {
    if (førsteFraværsdag) {
      const refusjon = watch("refusjon");

      setValue("refusjon", [
        {
          fom: førsteFraværsdag,
          beløp: refusjon[0]?.beløp,
        },
        ...refusjon.slice(1),
      ]);
    }
  }, [førsteFraværsdag]);

  const skalRefunderes = watch("skalRefunderes");
  useEffect(() => {
    if (skalRefunderes && skalRefunderes === "JA_LIK_REFUSJON") {
      const refusjon = watch("refusjon");
      setValue("refusjon", [refusjon[0]]);
    }
  }, [skalRefunderes, førsteFraværsdag]);

  const navigate = useNavigate();
  const onSubmit = handleSubmit((skjemadata) => {
    const { refusjon, skalRefunderes, førsteFraværsdag } = skjemadata;

    setInntektsmeldingSkjemaState((prev: InntektsmeldingSkjemaStateAGI) => ({
      ...prev,
      førsteFraværsdag,
      refusjon,
      skalRefunderes,
    }));
    navigate({
      from: "/agi/$id/refusjon",
      params: { id: opplysninger.forespørselUuid || ARBEIDSGIVER_INITERT_ID },
      to: "../oppsummering",
    });
  });

  return (
    <FormProvider {...formMethods}>
      <section className="mt-2">
        <form
          className="bg-bg-default px-5 py-6 rounded-md flex gap-6 flex-col"
          onSubmit={onSubmit}
        >
          <Heading level="3" size="large">
            Refusjon
          </Heading>
          <Fremgangsindikator aktivtSteg={2} />
          <DatePickerWrapped
            label="Første fraværsdag med refusjon"
            name="førsteFraværsdag"
            rules={{ required: "Må oppgis" }} // TODO: Forklare hvorfor det må oppgis
          />

          <UtbetalingOgRefusjon />
          <div className="flex gap-4 justify-center">
            <Button
              as={Link}
              icon={<ArrowLeftIcon />}
              to="../dine-opplysninger"
              variant="secondary"
            >
              Forrige steg
            </Button>
            <Button
              disabled={watch("skalRefunderes") === "NEI"}
              icon={<ArrowRightIcon />}
              iconPosition="right"
              type="submit"
              variant="primary"
            >
              Neste steg
            </Button>
          </div>
        </form>
      </section>
    </FormProvider>
  );
}
