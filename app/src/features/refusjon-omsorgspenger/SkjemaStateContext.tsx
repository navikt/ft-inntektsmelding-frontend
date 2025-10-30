import { zodResolver } from "@hookform/resolvers/zod";
import { getRouteApi } from "@tanstack/react-router";
import type { Resolver } from "react-hook-form";
import { DeepPartial } from "react-hook-form";
import { FormProvider, useForm, useFormContext } from "react-hook-form";

import { lagFulltNavn } from "~/utils";

import {
  RefusjonOmsorgspengerFormData,
  RefusjonOmsorgspengerFormDataInput,
} from "./zodSchemas.tsx";
import { RefusjonOmsorgspengerSchemaMedValidering } from "./zodSchemas.tsx";

export const RefusjonOmsorgspengerArbeidsgiverForm = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const route = getRouteApi("/refusjon-omsorgspenger/$organisasjonsnummer");

  const { innloggetBruker } = route.useLoaderData();

  const defaultValues: DeepPartial<RefusjonOmsorgspengerFormDataInput> = {
    meta: {
      step: 1,
      skalKorrigereInntekt: false,
    },
    fraværHeleDager: [],
    fraværDelerAvDagen: [],
    dagerSomSkalTrekkes: [],
    kontaktperson: {
      navn: innloggetBruker?.fornavn ? lagFulltNavn(innloggetBruker) : "",
      telefonnummer: innloggetBruker?.telefon || "",
    },
    endringAvInntektÅrsaker: [
      {
        årsak: "",
        fom: "",
        tom: "",
      },
    ],
  };

  const form = useForm<RefusjonOmsorgspengerFormData>({
    resolver: zodResolver(
      RefusjonOmsorgspengerSchemaMedValidering,
    ) as Resolver<RefusjonOmsorgspengerFormData>,
    defaultValues,
    mode: "onSubmit",
    reValidateMode: "onBlur",
  });

  return <FormProvider {...form}>{children}</FormProvider>;
};

export const useSkjemaState = () => {
  return useFormContext<RefusjonOmsorgspengerFormData>();
};
