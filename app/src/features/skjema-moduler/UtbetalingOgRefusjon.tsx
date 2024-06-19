import { PencilIcon, PlusIcon, TrashIcon } from "@navikt/aksel-icons";
import {
  Button,
  Heading,
  HStack,
  Radio,
  RadioGroup,
  TextField,
  VStack,
} from "@navikt/ds-react";
import clsx from "clsx";
import { Fragment, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import type { OpplysningerDto } from "~/api/queries.ts";
import { HjelpetekstReadMore } from "~/features/Hjelpetekst.tsx";
import { DatePickerWrapped } from "~/features/react-hook-form-wrappers/DatePickerWrapped.tsx";
import type { InntektOgRefusjonForm } from "~/routes/$id.inntekt-og-refusjon.tsx";
import { formatKroner } from "~/utils.ts";

type UtbetalingOgRefusjonProps = {
  opplysninger: OpplysningerDto;
};
export function UtbetalingOgRefusjon({
  opplysninger,
}: UtbetalingOgRefusjonProps) {
  const { register, formState, watch } =
    useFormContext<InntektOgRefusjonForm>();
  const { name, ...radioGroupProps } = register("skalRefunderes", {
    required: "Du må svare på dette spørsmålet",
  });

  const skalRefunderes = watch("skalRefunderes");
  return (
    <VStack gap="4">
      <hr />
      <Heading id="refusjon" level="4" size="medium">
        Utbetaling og refusjon
      </Heading>
      <HjelpetekstReadMore header="Hva vil det si å ha refusjon?">
        TODO
      </HjelpetekstReadMore>
      <RadioGroup
        error={formState.errors.skalRefunderes?.message}
        legend="Betaler dere lønn under fraværet og krever refusjon?"
        name={name}
      >
        <Radio value="ja" {...radioGroupProps}>
          Ja
        </Radio>
        <Radio value="nei" {...radioGroupProps}>
          Nei
        </Radio>
      </RadioGroup>
      {skalRefunderes === "ja" ? (
        <Refusjon opplysninger={opplysninger} />
      ) : undefined}
    </VStack>
  );
}

// @ts-expect-error -- trenger kanskje senere
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Refusjon({ opplysninger }: UtbetalingOgRefusjonProps) {
  const { register, formState, watch } =
    useFormContext<InntektOgRefusjonForm>();
  const { name, ...radioGroupProps } = register("endringIRefusjon", {
    required: "Du må svare på dette spørsmålet",
    shouldUnregister: true,
  });

  const [skalEndreBeløp, setSkalEndreBeløp] = useState(false); // TODO: dynamisk default

  const endringIRefusjon = watch("endringIRefusjon");
  const refusjonsbeløpPerMåned = watch("refusjonsbeløpPerMåned");

  return (
    <div className="bg-bg-subtle p-4 flex flex-col gap-4 rounded-md">
      {skalEndreBeløp ? (
        <HStack gap="4">
          <TextField
            autoFocus
            {...register("refusjonsbeløpPerMåned")}
            label="Refusjonsbeløp pr. måned"
          />
          <Button
            className="mt-8"
            onClick={() => setSkalEndreBeløp(false)}
            variant="tertiary"
          >
            Tilbakestill
          </Button>
          {/*TODO: Alert dersom over 6G*/}
        </HStack>
      ) : (
        <>
          <span>Refusjonsbeløp per måned</span>
          <Heading level="3" size="medium">
            {formatKroner(refusjonsbeløpPerMåned)}
          </Heading>
          <Button
            className="w-fit"
            icon={<PencilIcon />}
            iconPosition="left"
            onClick={() => setSkalEndreBeløp(true)}
            size="small"
            variant="secondary"
          >
            Endre refusjonsbeløp
          </Button>
        </>
      )}
      <RadioGroup
        error={formState.errors.endringIRefusjon?.message}
        legend="Vil det være endringer i refusjon i løpet av perioden Ola er i permisjon?"
        name={name}
      >
        <Radio value="ja" {...radioGroupProps}>
          Ja
        </Radio>
        <Radio value="nei" {...radioGroupProps}>
          Nei
        </Radio>
      </RadioGroup>
      {endringIRefusjon === "ja" ? <RefusjonsPerioder /> : undefined}
    </div>
  );
}

export const ENDRING_I_REFUSJON_TEMPLATE = {
  fraOgMed: "",
  beløp: 0,
};
function RefusjonsPerioder() {
  const { control, register, formState } =
    useFormContext<InntektOgRefusjonForm>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "refusjonsendringer",
  });

  return (
    <div className="grid grid-cols-[220px_min-content_min-content] gap-4 items-start">
      {fields.map((field, index) => (
        <Fragment key={field.id}>
          <TextField
            {...register(`refusjonsendringer.${index}.beløp` as const)}
            error={
              formState.errors?.refusjonsendringer?.[index]?.beløp?.message
            }
            hideLabel={index > 0}
            inputMode="numeric"
            label={<span>Endret refusjon per måned</span>}
            size="medium"
          />
          <DatePickerWrapped
            hideLabel={index > 0}
            label="Dato for endring"
            name={`refusjonsendringer.${index}.fraOgMed` as const}
            rules={{ required: "Må oppgis" }}
          />
          <Button
            aria-label="fjern refusjonsendring"
            className={clsx({ "mt-8": index === 0 })}
            disabled={index === 0}
            icon={<TrashIcon />}
            onClick={() => remove(index)}
            variant="tertiary"
          />
        </Fragment>
      ))}
      <Button
        className="w-fit"
        icon={<PlusIcon />}
        iconPosition="left"
        onClick={() => append(ENDRING_I_REFUSJON_TEMPLATE)}
        size="small"
        type="button"
        variant="secondary"
      >
        Legg til ny periode
      </Button>
    </div>
  );
}
