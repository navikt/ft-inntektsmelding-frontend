import { PlusIcon, TrashIcon } from "@navikt/aksel-icons";
import {
  Alert,
  BodyLong,
  Button,
  Heading,
  Radio,
  RadioGroup,
  Select,
  Stack,
  VStack,
} from "@navikt/ds-react";
import { useFieldArray, useFormContext } from "react-hook-form";

import { HjelpetekstReadMore } from "~/features/Hjelpetekst.tsx";
import type { InntektOgRefusjonForm } from "~/features/inntektsmelding/Steg2InntektOgRefusjon";
import { DatePickerWrapped } from "~/features/react-hook-form-wrappers/DatePickerWrapped.tsx";
import {
  Naturalytelsetype,
  NaturalytelseTypeSchema,
} from "~/types/api-models.ts";

import { FormattertTallTextField } from "../react-hook-form-wrappers/FormattertTallTextField";

export const NATURALYTELSE_SOM_MISTES_TEMPLATE = {
  fom: undefined,
  tom: undefined,
  beløp: 0,
  navn: "" as const,
  inkluderTom: undefined,
};

export function Naturalytelser() {
  const { register, formState, watch } =
    useFormContext<InntektOgRefusjonForm>();
  const { name, ...radioGroupProps } = register("misterNaturalytelser", {
    required: "Du må svare på dette spørsmålet",
  });

  const misterNaturalytelser = watch("misterNaturalytelser");
  return (
    <VStack gap="4">
      <hr />
      <Heading id="naturalytelser" level="4" size="medium">
        Naturalytelser
      </Heading>
      <HjelpetekstReadMore header="Hva er naturalytelser?">
        <Stack gap="2">
          <BodyLong>
            Naturalytelser er goder som den ansatte får i tillegg til vanlig
            lønn. Dette kan være firmabil, elektronisk kommunikasjon
            (mobiltelefon/internett) eller personlig medlemskap på
            treningssenter.
          </BodyLong>
          <BodyLong>
            Naturalytelser skal beregnes til samme verdi som benyttes ved
            forskuddstrekk av skatt.
          </BodyLong>
        </Stack>
      </HjelpetekstReadMore>
      <RadioGroup
        error={formState.errors.misterNaturalytelser?.message}
        legend="Har den ansatte naturalytelser som faller bort ved fraværet?"
        name={name}
      >
        <Radio value="ja" {...radioGroupProps}>
          Ja
        </Radio>
        <Radio value="nei" {...radioGroupProps}>
          Nei
        </Radio>
      </RadioGroup>
      {misterNaturalytelser === "ja" ? <MisterNaturalytelser /> : undefined}
    </VStack>
  );
}

const naturalytelser: Record<Naturalytelsetype, string> = {
  ELEKTRISK_KOMMUNIKASJON: "Elektronisk kommunikasjon",
  AKSJER_GRUNNFONDSBEVIS_TIL_UNDERKURS:
    "Aksjer / grunnfondsbevis til underkurs",
  LOSJI: "Losji",
  KOST_DØGN: "Kost (døgn)",
  BESØKSREISER_HJEMMET_ANNET: "Besøksreiser i hjemmet annet",
  KOSTBESPARELSE_I_HJEMMET: "Kostbesparelse i hjemmet",
  RENTEFORDEL_LÅN: "Rentefordel lån",
  BIL: "Bil",
  KOST_DAGER: "Kost (dager)",
  BOLIG: "Bolig",
  SKATTEPLIKTIG_DEL_FORSIKRINGER: "Skattepliktig del av visse forsikringer",
  FRI_TRANSPORT: "Fri transport",
  OPSJONER: "Opsjoner",
  TILSKUDD_BARNEHAGEPLASS: "Tilskudd barnehageplass",
  BEDRIFTSBARNEHAGEPLASS: "Bedriftsbarnehageplass",
  YRKEBIL_TJENESTLIGBEHOV_KILOMETER: "Yrkesbil tjenestebehov kilometer",
  YRKEBIL_TJENESTLIGBEHOV_LISTEPRIS: "Yrkesbil tjenestebehov listepris",
  INNBETALING_TIL_UTENLANDSK_PENSJONSORDNING:
    "Innbetaling utenlandsk pensjonsordning",
  ANNET: "Annet",
};

function MisterNaturalytelser() {
  const { control, register, formState, watch } =
    useFormContext<InntektOgRefusjonForm>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "naturalytelserSomMistes",
    rules: {
      validate: (values) => {
        const errors = NaturalytelseTypeSchema.options.flatMap((type) => {
          const naturalytelseForType = values.filter((n) => n.navn === type);
          return naturalytelseForType.flatMap((naturalytelse, index) => {
            const nesteNaturalytelse = naturalytelseForType[index + 1];

            // Hvis nåværende naturalytelse løper evig, så kan det ikke eksistere et senere innslag. Da vil de overlappe.
            if (
              naturalytelse.tom === undefined &&
              nesteNaturalytelse !== undefined
            ) {
              return [type];
            }

            // Hvis neste periode sin fom er før nåværende har vi overlappende perioder.
            if (
              nesteNaturalytelse?.fom &&
              naturalytelse.tom &&
              nesteNaturalytelse.fom < naturalytelse.tom
            ) {
              return [type];
            }

            return [];
          });
        });
        return (
          errors.length === 0 ||
          `Naturalytelse ${naturalytelser[errors[0]]} har overlappende perioder`
        );
      },
    },
  });

  const overlappendePerioderError =
    formState.errors.naturalytelserSomMistes?.root;

  return (
    <div className="flex flex-col gap-4">
      {fields.map((field, index) => {
        const { name, ...radioGroupProps } = register(
          `naturalytelserSomMistes.${index}.inkluderTom`,
          {
            required: "Du må svare på dette spørsmålet",
          },
        );

        const skalInkludereTom =
          watch(`naturalytelserSomMistes.${index}.inkluderTom`) === "ja";

        const fom = watch(`naturalytelserSomMistes.${index}.fom`);

        return (
          <div className="border-l-4 border-bg-subtle p-4" key={field.id}>
            <div className="flex gap-4 flex-col items-start relative">
              <Select
                label="Naturalytelse som faller bort"
                {...register(`naturalytelserSomMistes.${index}.navn` as const, {
                  required: "Må oppgis",
                })}
                className="max-w-[60%]"
                error={
                  formState.errors?.naturalytelserSomMistes?.[index]?.navn
                    ?.message
                }
              >
                <option value="">Velg naturalytelse</option>
                {Object.entries(naturalytelser).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
              <DatePickerWrapped
                label="Fra og med"
                name={`naturalytelserSomMistes.${index}.fom` as const}
                rules={{ required: "Må oppgis" }}
              />

              <FormattertTallTextField
                inputMode="numeric"
                label={<span>Verdi&nbsp;pr. måned</span>}
                min={1}
                name={`naturalytelserSomMistes.${index}.beløp` as const}
                size="medium"
              />
              {index > 0 && (
                <Button
                  aria-label="fjern naturalytelse"
                  className="absolute top-8 right-1"
                  icon={<TrashIcon />}
                  onClick={() => remove(index)}
                  variant="tertiary"
                >
                  Slett
                </Button>
              )}
              <RadioGroup
                className="md:col-span-4"
                error={
                  formState.errors.naturalytelserSomMistes?.[index]?.inkluderTom
                    ?.message
                }
                legend="Vil naturalytelsen komme tilbake i løpet av fraværet?"
                name={name}
              >
                <Radio value="ja" {...radioGroupProps}>
                  Ja
                </Radio>
                <Radio value="nei" {...radioGroupProps}>
                  Nei
                </Radio>
              </RadioGroup>
              <div className="col-span-4">
                {skalInkludereTom && (
                  <DatePickerWrapped
                    label="Til og med"
                    name={`naturalytelserSomMistes.${index}.tom` as const}
                    rules={{
                      validate: (tom: Date | undefined) => {
                        if (!fom) {
                          return true;
                        }
                        if (!tom) {
                          return "Må oppgis";
                        }

                        return (
                          new Date(tom) >= new Date(fom) ||
                          "Kan ikke være før fra dato"
                        );
                      },
                    }}
                    shouldUnregister
                  />
                )}
              </div>
            </div>
          </div>
        );
      })}
      <Button
        className="w-fit"
        icon={<PlusIcon />}
        iconPosition="left"
        onClick={() => append(NATURALYTELSE_SOM_MISTES_TEMPLATE)}
        size="medium"
        type="button"
        variant="secondary"
      >
        Legg til naturalytelse
      </Button>
      {overlappendePerioderError && (
        <Alert variant="error">{overlappendePerioderError.message}</Alert>
      )}
    </div>
  );
}
