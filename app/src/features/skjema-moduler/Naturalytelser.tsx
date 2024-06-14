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
import clsx from "clsx";
import { Fragment } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { z } from "zod";

import { HjelpetekstReadMore } from "~/features/Hjelpetekst.tsx";
import type { InntektsmeldingSkjemaState } from "~/features/InntektsmeldingSkjemaState.tsx";
import { DatePickerWrapped } from "~/features/react-hook-form-wrappers/DatePickerWrapped.tsx";
import type { InntektOgRefusjonForm } from "~/routes/$id.inntekt-og-refusjon.tsx";

export const DEFAULT_NATURALYTELSE_SOM_MISTES = {
  fraOgMed: "",
  beløp: 0,
  navn: "",
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

const naturalytelser = [
  "ELEKTRISK_KOMMUNIKASJON",
  "AKSJER_GRUNNFONDSBEVIS_TIL_UNDERKURS",
  "LOSJI",
  "KOST_DØGN",
  "BESØKSREISER_HJEMMET_ANNET",
  "KOSTBESPARELSE_I_HJEMMET",
  "RENTEFORDEL_LÅN",
  "BIL",
  "KOST_DAGER",
  "BOLIG",
  "SKATTEPLIKTIG_DEL_FORSIKRINGER",
  "FRI_TRANSPORT",
  "OPSJONER",
  "TILSKUDD_BARNEHAGEPLASS",
  "ANNET",
  "BEDRIFTSBARNEHAGEPLASS",
  "YRKEBIL_TJENESTLIGBEHOV_KILOMETER",
  "YRKEBIL_TJENESTLIGBEHOV_LISTEPRIS",
  "INNBETALING_TIL_UTENLANDSK_PENSJONSORDNING",
];

type FormType = Pick<InntektsmeldingSkjemaState, "naturalytelserSomMistes">;
function MisterNaturalytelser() {
  const { control, register, formState } = useFormContext<FormType>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "naturalytelserSomMistes",
  });

  return (
    <div className="grid grid-cols-[1fr_min-content_min-content_max-content] gap-4 items-start">
      {fields.map((field, index) => (
        <Fragment key={field.id}>
          <Select
            hideLabel={index > 0}
            label="Naturalytelse som faller bort"
            {...register(`naturalytelserSomMistes.${index}.navn` as const, {
              required: "Må oppgis",
            })}
            error={
              formState.errors?.naturalytelserSomMistes?.[index]?.navn?.message
            }
          >
            <option value="">Velg naturalytelse</option>
            {naturalytelser.map((naturalYtelse) => (
              <option key={naturalYtelse} value={naturalYtelse}>
                {naturalYtelse}
              </option>
            ))}
          </Select>
          <DatePickerWrapped
            hideLabel={index > 0}
            label="Fra og med"
            name={`naturalytelserSomMistes.${index}.fraOgMed` as const}
            rules={{ required: "Må oppgis" }}
          />
          <TextField
            {...register(`naturalytelserSomMistes.${index}.beløp` as const, {
              validate: (value) => {
                const { success } = z.coerce.number().gt(0).safeParse(value);

                return success || "Må være mer enn 0";
              },
            })}
            error={
              formState.errors?.naturalytelserSomMistes?.[index]?.beløp?.message
            }
            hideLabel={index > 0}
            label={<span>Verdi&nbsp;pr.måned</span>}
            size="medium"
          />
          <Button
            className={clsx({ "mt-8": index === 0 })}
            disabled={index === 0}
            icon={<TrashIcon />}
            onClick={() => remove(index)}
            variant="secondary"
          />
        </Fragment>
      ))}
      <Button
        className="w-fit"
        icon={<PlusIcon />}
        onClick={() => append(DEFAULT_NATURALYTELSE_SOM_MISTES)}
        size="small"
        type="button"
        variant="secondary"
      >
        Legg til naturalytelse
      </Button>
    </div>
  );
}
