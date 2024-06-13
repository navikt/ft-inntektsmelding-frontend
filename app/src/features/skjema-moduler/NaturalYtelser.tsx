import { PlusIcon } from "@navikt/aksel-icons";
import {
  BodyLong,
  Button,
  Heading,
  Radio,
  Select,
  TextField,
  VStack,
} from "@navikt/ds-react";
import { Fragment } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import { HjelpetekstReadMore } from "~/features/Hjelpetekst.tsx";
import { DatePickerWrapped } from "~/features/react-hook-form-wrappers/DatePickerWrapped.tsx";
import { RadioGroupWrapped } from "~/features/react-hook-form-wrappers/RadioGroupWrapped.tsx";

export function Naturalytelser() {
  const misterNaturalYtelser = useFormContext().watch("misterNaturalYtelser");
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
      <RadioGroupWrapped
        legend="Har den ansatte naturalytelser som faller bort ved fraværet?"
        name="misterNaturalYtelser"
      >
        <Radio value={true}>Ja</Radio>
        <Radio value={false}>Nei</Radio>
      </RadioGroupWrapped>
      {misterNaturalYtelser ? <NaturalYtelserFallerBortForm /> : undefined}
    </VStack>
  );
}

const naturalYtelser = [
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
function NaturalYtelserFallerBortForm() {
  const { control, register, formState } = useFormContext();
  const { fields, append } = useFieldArray({
    control,
    name: "naturalYtelse",
  });

  console.log("errors", formState.errors);

  return (
    <div className="grid grid-cols-3 gap-4 items-start">
      {fields.map((field, index) => (
        <Fragment key={field.id}>
          <Select
            hideLabel={index > 0}
            label="Naturalytelse som faller bort"
            {...register(`naturalYtelse.${index}.ytelse` as const, {
              required: "Må oppgis",
            })}
            error={formState.errors?.naturalYtelse?.[index]?.ytelse?.message}
          >
            <option value="">Velg naturalytelse</option>
            {naturalYtelser.map((naturalYtelse) => (
              <option key={naturalYtelse} value={naturalYtelse}>
                {naturalYtelse}
              </option>
            ))}
          </Select>
          <DatePickerWrapped
            hideLabel={index > 0}
            label="Fra og med"
            name={`naturalYtelse.${index}.fom`}
            rules={{ required: "Må oppgis" }}
          />
          <TextField
            {...register(`naturalYtelse.${index}.verdi` as const, {
              required: "Må oppgis", // TODO: bedre validering
            })}
            error={formState.errors?.naturalYtelse?.[index]?.verdi?.message}
            hideLabel={index > 0}
            label="Verdi pr.måned"
            size="medium"
          />
        </Fragment>
      ))}
      <Button
        icon={<PlusIcon />}
        onClick={() => append({ fom: null, verdi: "" })}
        size="small"
        type="button"
        variant="secondary"
      >
        Legg til naturalytelse
      </Button>
    </div>
  );
}
