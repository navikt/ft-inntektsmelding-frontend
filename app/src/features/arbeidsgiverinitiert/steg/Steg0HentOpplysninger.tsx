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
  Select,
  TextField,
  VStack,
} from "@navikt/ds-react";
import { fnr } from "@navikt/fnrvalidator";
import { useMutation } from "@tanstack/react-query";
import { getRouteApi, useNavigate } from "@tanstack/react-router";
import { FormProvider, useForm, useFormContext } from "react-hook-form";

import { hentOpplysninger } from "~/api/queries.ts";
import { PersonOppslagError } from "~/features/shared/components/PersonOppslagFeil";
import { useDocumentTitle } from "~/features/shared/hooks/useDocumentTitle";
import { usePersonOppslag } from "~/features/shared/hooks/usePersonOppslag";
import { DatePickerWrapped } from "~/features/shared/react-hook-form-wrappers/DatePickerWrapped";
import { ARBEIDSGIVER_INITERT_ID } from "~/routes/opprett";
import {
  OpplysningerRequest,
  SlåOppArbeidstakerResponseDto,
} from "~/types/api-models.ts";
import { formatYtelsesnavn } from "~/utils.ts";

type FormType = {
  fødselsnummer: string;
  organisasjonsnummer: string;
  årsak: "ny_ansatt" | "unntatt_aaregister" | "annen_årsak" | "";
  førsteFraværsdag: string;
};

export const HentOpplysninger = () => {
  const route = getRouteApi("/opprett");
  const { ytelseType } = route.useSearch();
  const navigate = useNavigate();
  useDocumentTitle(
    `Opprett inntektsmelding for ${formatYtelsesnavn(ytelseType)}`,
  );

  const formMethods = useForm<FormType>({
    defaultValues: {
      fødselsnummer: "",
      årsak: "",
      organisasjonsnummer: "",
    },
  });

  const { name, ...radioGroupProps } = formMethods.register("årsak", {
    required: "Du må svare på dette spørsmålet",
  });

  const opprettOpplysningerMutation = useMutation({
    mutationFn: async (opplysningerRequest: OpplysningerRequest) => {
      return hentOpplysninger(opplysningerRequest);
    },
    onSuccess: (opplysninger) => {
      if (opplysninger.forespørselUuid === undefined) {
        // 1. Finner på en ID
        // 2. lagrer opplysningene i sessionStorage
        // 3. redirecter til samme sti som før
        // 4. komponenten leser ID og avgjør om den skal hente opplysninger fra Backend eller sessionstorage.
        const opplysningerMedId = {
          ...opplysninger,
          forespørselUuid: ARBEIDSGIVER_INITERT_ID,
        };

        // TODO: i denne er det litt mye data som lagres i sessionStorage.
        // hvis det kan forsvares må det dokumenteres i cookiebanner
        // hvis ikke, lagre i state og akseptere at det forsvinner i refresh
        sessionStorage.setItem(
          ARBEIDSGIVER_INITERT_ID,
          JSON.stringify(opplysningerMedId),
        );
        // hvis vi har noe skjemadata liggende fra tidligere innsendinger, så fjerner vi det
        sessionStorage.removeItem(`skjemadata-${ARBEIDSGIVER_INITERT_ID}`);

        return navigate({
          to: "/agi/$id/dine-opplysninger",
          params: {
            id: ARBEIDSGIVER_INITERT_ID,
          },
        });
      }

      // vi kan sende til /$id uavhengig av inntektsmeldingstype
      // fordi /$id.index.tsx sjekker om inntektsmeldingstype og redirecter til riktig sti
      return navigate({
        to: "/$id",
        params: { id: opplysninger.forespørselUuid },
      });
    },
  });

  const hentPersonMutation = usePersonOppslag();
  const isPending =
    hentPersonMutation.isPending || opprettOpplysningerMutation.isPending;

  return (
    <FormProvider {...formMethods}>
      <section className="mt-2">
        <form
          onSubmit={formMethods.handleSubmit((values) =>
            hentPersonMutation.mutate(
              {
                fødselsnummer: values.fødselsnummer,
                ytelse: ytelseType,
                førsteFraværsdag: values.førsteFraværsdag,
              },
              {
                onSuccess: (data) => {
                  if (data.arbeidsforhold.length === 1) {
                    return opprettOpplysningerMutation.mutate({
                      fødselsnummer: values.fødselsnummer,
                      førsteFraværsdag: values.førsteFraværsdag,
                      ytelseType,
                      organisasjonsnummer:
                        data.arbeidsforhold[0].organisasjonsnummer,
                    });
                  }
                },
              },
            ),
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
              <>
                <NyAnsattForm data={hentPersonMutation.data} />
                <Button
                  className="w-fit"
                  loading={isPending}
                  type="submit"
                  variant="secondary"
                >
                  Hent opplysninger
                </Button>
                <VelgArbeidsgiver data={hentPersonMutation.data} />
              </>
            )}
            {formMethods.watch("årsak") === "unntatt_aaregister" && (
              <UnntattAaregRegistrering />
            )}
            {formMethods.watch("årsak") === "annen_årsak" && <AnnenÅrsak />}
            <PersonOppslagError
              context="person_oppslag"
              error={hentPersonMutation.error}
              ytelse={ytelseType}
            />
            <HentOpplysningerError error={opprettOpplysningerMutation.error} />
            {(hentPersonMutation.data?.arbeidsforhold.length ?? 0) > 1 && (
              <Button
                className="w-fit"
                icon={<ArrowRightIcon />}
                iconPosition="right"
                loading={opprettOpplysningerMutation.isPending}
                onClick={() =>
                  opprettOpplysningerMutation.mutate({
                    organisasjonsnummer: formMethods.watch(
                      "organisasjonsnummer",
                    ),
                    fødselsnummer: formMethods.watch("fødselsnummer"),
                    førsteFraværsdag: formMethods.watch("førsteFraværsdag"),
                    ytelseType,
                  })
                }
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

function HentOpplysningerError({ error }: { error: Error | null }) {
  if (!error) {
    return null;
  }

  return <Alert variant="error">Kunne ikke hente personopplysninger</Alert>;
}

function UnntattAaregRegistrering() {
  return (
    <Alert variant="info">
      <Heading level="3" size="small">
        Du må sende inn inntektsmelding via Altinn
      </Heading>
      <BodyShort>
        Skal du sende inn inntektsmelding for en ansatt som er unntatt for
        registrering i Aa-registeret, må du enn så lenge sende inn
        inntektsmelding i Altinn.
      </BodyShort>
    </Alert>
  );
}

function VelgArbeidsgiver({ data }: { data?: SlåOppArbeidstakerResponseDto }) {
  const formMethods = useFormContext<FormType>();

  if (!data || data.arbeidsforhold.length <= 1) {
    return null;
  }

  return (
    <Select
      data-testid="steg-0-select-arbeidsgiver"
      description="Den ansatte har flere arbeidsforhold hos samme arbeidsgiver. Velg hvilken underenhet inntektsmeldingen gjelder for. "
      error={formMethods.formState.errors.organisasjonsnummer?.message}
      label="Arbeidsgiver"
      {...formMethods.register(`organisasjonsnummer`, {
        required: "Må oppgis",
      })}
    >
      <option value="">Velg Organisasjon</option>
      {data?.arbeidsforhold.map((arbeidsforhold) => (
        <option
          key={arbeidsforhold.organisasjonsnummer}
          value={arbeidsforhold.organisasjonsnummer}
        >
          {arbeidsforhold.organisasjonsnavn} (
          {arbeidsforhold.organisasjonsnummer})
        </option>
      ))}
    </Select>
  );
}

function NyAnsattForm({ data }: { data?: SlåOppArbeidstakerResponseDto }) {
  const formMethods = useFormContext<FormType>();

  return (
    <VStack gap="8">
      <HStack gap="10">
        <TextField
          {...formMethods.register("fødselsnummer", {
            required: "Må oppgis",
            validate: (value) =>
              (value && fnr(value).status === "valid") ||
              "Du må fylle ut et gyldig fødselsnummer",
          })}
          error={formMethods.formState.errors.fødselsnummer?.message}
          label="Ansattes fødselsnummer"
        />
        <VStack gap="4">
          <Label>Navn</Label>
          {data && (
            <BodyShort>
              {data.fornavn} {data.etternavn}
            </BodyShort>
          )}
        </VStack>
      </HStack>
      <DatePickerWrapped
        label="Første fraværsdag med refusjon"
        name="førsteFraværsdag"
        rules={{ required: "Må oppgis" }} // TODO: Forklare hvorfor det må oppgis
      />
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
        Den ansatte må søke om ytelse før du kan sende inntektsmelding. Varsel
        med oppgave blir tilgjengelig i saksoversikten når den ansatte har sendt
        inn søknad til oss, men tidligst 4 uker før første fraværsdag. Trenger
        du hjelp, kontakt oss på{" "}
        <a href="tel:55553336">tlf.&nbsp;55&nbsp;55&nbsp;33&nbsp;36.</a>
      </BodyShort>
    </Alert>
  );
}
