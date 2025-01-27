import { ArrowRightIcon } from "@navikt/aksel-icons";
import {
  Alert,
  BodyShort,
  Button,
  Heading,
  HStack,
  Label,
  Radio,
  RadioGroup,
  TextField,
  VStack,
} from "@navikt/ds-react";
import { useMutation } from "@tanstack/react-query";
import { getRouteApi, useNavigate } from "@tanstack/react-router";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { z } from "zod";

import { hentOpplysninger, hentPersonFraFnr } from "~/api/queries.ts";
import { DatePickerWrapped } from "~/features/react-hook-form-wrappers/DatePickerWrapped.tsx";
import { useDocumentTitle } from "~/features/useDocumentTitle.tsx";
import { SlåOppArbeidstakerResponseDto } from "~/types/api-models.ts";
import { formatYtelsesnavn } from "~/utils.ts";

const route = getRouteApi("/opprett");

type FormType = {
  fødselsnummer: string;
  årsak: "ny_ansatt" | "unntatt_aaregister" | "annen_årsak" | "";
  førsteFraværsdag: string;
};

export const HentOpplysninger = () => {
  const { ytelseType } = route.useSearch();
  const navigate = useNavigate();
  useDocumentTitle(
    `Opprett inntektsmelding for ${formatYtelsesnavn(ytelseType)}`,
  );

  const formMethods = useForm<FormType>({
    defaultValues: {
      fødselsnummer: "",
      årsak: "",
    },
  });

  const { name, ...radioGroupProps } = formMethods.register("årsak", {
    required: "Du må svare på dette spørsmålet",
  });

  const hentPersonMutation = useMutation({
    mutationFn: async ({ fødselsnummer, førsteFraværsdag }: FormType) => {
      return hentPersonFraFnr(fødselsnummer, ytelseType, førsteFraværsdag);
    },
  });

  const opprettOpplysningerMutation = useMutation({
    mutationFn: async () => {
      const values = formMethods.watch();
      return hentOpplysninger({
        førsteFraværsdag: values.førsteFraværsdag,
        organisasjonsnummer:
          hentPersonMutation.data?.arbeidsforhold[0].organisasjonsnummer ?? "", //TODO: fiks senere
        fødselsnummer: values.fødselsnummer,
        ytelseType,
      });
    },
    onSuccess: (opplysninger) => {
      if (opplysninger.forespørselUuid === undefined) {
        // 1. Finner på en ID
        // 2. lagrer opplysningene i sessionStorage
        // 3. redirecter til samme sti som før
        // 4. komponenten leser ID og avgjør om den skal hente opplysninger fra Backend eller sessionstorage.
        const fakeId = "custom-id";
        const opplysningerMedId = {
          ...opplysninger,
          forespørselUuid: fakeId,
        };
        sessionStorage.setItem(fakeId, JSON.stringify(opplysningerMedId));

        return navigate({
          to: "/$id",
          params: { id: fakeId },
        });
      }

      return navigate({
        to: "/$id",
        params: { id: opplysninger.forespørselUuid },
      });
    },
  });

  return (
    <FormProvider {...formMethods}>
      <section className="mt-2">
        <form
          onSubmit={formMethods.handleSubmit((values) =>
            hentPersonMutation.mutate(values),
          )}
        >
          <div className="bg-bg-default px-5 py-6 rounded-md flex flex-col gap-6">
            <Heading level="3" size="large">
              Opprett manuell inntektsmelding
            </Heading>
            <RadioGroup
              error={formMethods.formState.errors.årsak?.message}
              legend="Årsak til at du vil opprette inntektsmelding"
              name={name}
            >
              <Radio value="ny_ansatt" {...radioGroupProps}>
                Ny ansatt som mottar ytelse fra Nav
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
              <NyAnsattForm data={hentPersonMutation.data} />
            )}
            {formMethods.watch("årsak") === "annen_årsak" && <AnnenÅrsak />}
            <Button
              className="w-fit"
              icon={<ArrowRightIcon />}
              iconPosition="right"
              loading={hentPersonMutation.isPending}
              type="submit"
            >
              Hent person
            </Button>
            {hentPersonMutation.data && (
              <Button
                className="w-fit"
                icon={<ArrowRightIcon />}
                iconPosition="right"
                loading={opprettOpplysningerMutation.isPending}
                onClick={() => opprettOpplysningerMutation.mutate()}
                type="button"
              >
                Opprett inntektsmelding
              </Button>
            )}
          </div>
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
          {...formMethods.register("fødselsnummer", {
            required: "Må oppgis",
            validate: (value) =>
              /^\d{11}$/.test(value) || "Fødselsnummer må være 11 siffer",
          })}
          error={formMethods.formState.errors.fødselsnummer?.message}
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
        rules={{ required: "Må oppgis" }} // TODO: Forklare hvorfor det må oppgis
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
        Trenger du hjelp, kontakt oss på{" "}
        <a href="tel:55553336">tlf.&nbsp;55&nbsp;55&nbsp;33&nbsp;36.</a>
      </BodyShort>
    </Alert>
  );
}
