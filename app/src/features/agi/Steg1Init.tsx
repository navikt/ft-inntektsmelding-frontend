import {
  Alert,
  BodyShort,
  Heading,
  HStack,
  Label,
  Radio,
  RadioGroup,
  TextField,
  VStack,
} from "@navikt/ds-react";
import { useMutation } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { z } from "zod";

import { hentPersonFraFnr } from "~/api/queries.ts";
import { DatePickerWrapped } from "~/features/react-hook-form-wrappers/DatePickerWrapped.tsx";
import { useDocumentTitle } from "~/features/useDocumentTitle.tsx";
import { SlåOppArbeidstakerResponseDto } from "~/types/api-models.ts";
import { formatYtelsesnavn } from "~/utils.ts";

const route = getRouteApi("/agi");

type FormType = {
  fnr: string;
  årsak: "ny_ansatt" | "unntatt_aaregister" | "annen_årsak" | "";
  førsteFraværsdag: string;
};

export const Steg1Init = () => {
  const { ytelseType } = route.useSearch();
  useDocumentTitle(
    `Opprett inntektsmelding for ${formatYtelsesnavn(ytelseType)}`,
  );

  const formMethods = useForm<FormType>({
    defaultValues: {
      fnr: "",
      årsak: "",
    },
  });

  const { name, ...radioGroupProps } = formMethods.register("årsak", {
    required: "Du må svare på dette spørsmålet",
  });

  const { mutate, data } = useMutation({
    mutationFn: async ({ fnr, førsteFraværsdag }: FormType) => {
      return hentPersonFraFnr(fnr, ytelseType, førsteFraværsdag);
    },
  });

  return (
    <FormProvider {...formMethods}>
      <section className="mt-2">
        <form onSubmit={formMethods.handleSubmit((values) => mutate(values))}>
          <div className="bg-bg-default px-5 py-6 rounded-md flex flex-col gap-6">
            <Heading level="3" size="large">
              Opprett manuell inntektsmelding
            </Heading>
            <RadioGroup
              // error={formState.errors.misterNaturalytelser?.message}
              legend="Har den ansatte naturalytelser som faller bort ved fraværet?"
              name={name}
            >
              <Radio value="ny_ansatt" {...radioGroupProps}>
                Ny ansatt som mottar ytelse fra NAV
              </Radio>
              <Radio
                description="(Ambassadepersonell, fiskere og utenlandske arbeidstakere)"
                value="unntatt_aaregister"
                {...radioGroupProps}
              >
                Unntatt registrering i Aa-registeret
              </Radio>
              <Radio value="annen_årsak" {...radioGroupProps}>
                Annen årsak
              </Radio>
            </RadioGroup>
            {formMethods.watch("årsak") === "ny_ansatt" && (
              <NyAnsattForm data={data} />
            )}
            {formMethods.watch("årsak") === "annen_årsak" && <AnnenÅrsak />}
          </div>
          <button type="submit">Test submit</button>
        </form>
      </section>
    </FormProvider>
  );
};

function NyAnsattForm({
  data,
}: {
  data?: z.infer<typeof SlåOppArbeidstakerResponseDto>;
}) {
  const formMethods = useFormContext<FormType>();
  return (
    <VStack gap="8">
      <HStack gap="10">
        <TextField
          {...formMethods.register("fnr")}
          label="Ansattes fødselsnummer"
        />
        {data && (
          <VStack gap="4">
            <Label>Navn</Label>
            <BodyShort>
              {data.fornavn} {data.etternavn}
            </BodyShort>
          </VStack>
        )}
      </HStack>
      <DatePickerWrapped
        label="Første fraværsdag"
        name="førsteFraværsdag"
        rules={{ required: "Må oppgis" }}
      />
      {data && (
        <VStack>
          <Label>Arbeidsgiver</Label>
          <BodyShort>
            Org.nr. {data.arbeidsforhold[0].organisasjonsnummer} -{" "}
            {data.arbeidsforhold[0].organisasjonsnavn}
          </BodyShort>
        </VStack>
      )}
    </VStack>
  );
}

function AnnenÅrsak() {
  return (
    <Alert variant="warning">
      <Heading level="2" size="small" spacing>
        Det er ikke mulig å opprette inntektsmelding for andre årsaker enda
      </Heading>
      <BodyShort>
        Den ansatte må søke om foreldrepenger før du kan sende inntektsmelding.
        Varsel med oppgave blir tilgjengelig i saksoversikten når den ansatte
        har sendt inn søknad til oss, men tidligst 4 uker før første fraværsdag.
        Trenger du hjelp, kontakt oss på tlf.&nbsp;55&nbsp;55&nbsp;33&nbsp;36.
      </BodyShort>
    </Alert>
  );
}
