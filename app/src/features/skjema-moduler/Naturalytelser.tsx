import { PlusIcon, TrashIcon } from "@navikt/aksel-icons";
import {
  BodyLong,
  Button,
  Heading,
  Radio,
  RadioGroup,
  Select,
  TextField,
  VStack,
} from "@navikt/ds-react";
import { useFieldArray, useFormContext } from "react-hook-form";

import { HjelpetekstReadMore } from "~/features/Hjelpetekst.tsx";
import { DatePickerWrapped } from "~/features/react-hook-form-wrappers/DatePickerWrapped.tsx";
import type { InntektOgRefusjonForm } from "~/routes/$id.inntekt-og-refusjon.tsx";
import type { Naturalytelsetype } from "~/types/api-models.ts";

export const NATURALYTELSE_SOM_MISTES_TEMPLATE = {
  fraOgMed: "",
  tilOgMed: "",
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
        <BodyLong>
          Naturalytelser er skattepliktige goder eller fordeler en ansatt får
          fra arbeidsgiver på toppen av vanlig lønn.
          <br />
          Eksempler på naturalytelser er: Forsikring, bruk av firmabil,
          mobiltelefon og internett-abonnement.
        </BodyLong>
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
  });

  return (
    <div className="flex flex-col gap-4">
      {fields.map((field, index) => {
        const { name, ...radioGroupProps } = register(
          `naturalytelserSomMistes.${index}.inkluderTom`,
          {
            required: "Du må svare på dette spørsmålet",
          },
        );
        return (
          <div className="border-l-4 border-bg-subtle p-4" key={field.id}>
            <div className="grid grid-cols-[1fr_min-content_140px_max-content] gap-4 items-start">
              <Select
                label="Naturalytelse som faller bort"
                {...register(`naturalytelserSomMistes.${index}.navn` as const, {
                  required: "Må oppgis",
                })}
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
                name={`naturalytelserSomMistes.${index}.fraOgMed` as const}
                rules={{ required: "Må oppgis" }}
              />

              <TextField
                {...register(
                  `naturalytelserSomMistes.${index}.beløp` as const,
                  {
                    min: { value: 1, message: "Må være mer enn 0" },
                  },
                )}
                autoComplete="off"
                error={
                  formState.errors?.naturalytelserSomMistes?.[index]?.beløp
                    ?.message
                }
                inputMode="numeric"
                label={<span>Verdi&nbsp;pr. måned</span>}
                size="medium"
              />
              <Button
                aria-label="fjern naturalytelse"
                className="mt-8"
                disabled={index === 0}
                icon={<TrashIcon />}
                onClick={() => remove(index)}
                variant="tertiary"
              >
                Slett
              </Button>
              <RadioGroup
                className="col-span-4"
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
                {watch(`naturalytelserSomMistes.${index}.inkluderTom`) ===
                  "ja" && (
                  <DatePickerWrapped
                    label="Til og med"
                    name={`naturalytelserSomMistes.${index}.tilOgMed` as const}
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
        size="small"
        type="button"
        variant="secondary"
      >
        Legg til naturalytelse
      </Button>
    </div>
  );
}
