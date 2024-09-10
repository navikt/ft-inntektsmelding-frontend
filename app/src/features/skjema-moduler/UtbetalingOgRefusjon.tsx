import { PencilIcon, PlusIcon, TrashIcon } from "@navikt/aksel-icons";
import {
  Alert,
  BodyLong,
  Button,
  Heading,
  HStack,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  VStack,
} from "@navikt/ds-react";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { Fragment, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import { hentGrunnbeløpOptions, OpplysningerDto } from "~/api/queries.ts";
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
        <Stack gap="2">
          <BodyLong>
            Refusjon er når arbeidsgiver utbetaler lønn som vanlig til den
            ansatte, og får tilbakebetalt stønaden direkte fra NAV. Dette kalles
            ofte å forskuttere lønn, som man krever refundert fra NAV. Vi
            utbetaler da stønaden til kontonummeret som er registrert i Altinn.
          </BodyLong>
          <BodyLong>
            Noen arbeidsgivere er forpliktet til å forskuttere ut fra
            tariffavtaler, mens andre arbeidsgivere velger selv om de ønsker en
            slik ordning. Hvis dere velger å forskuttere lønn, er det viktig at
            dere har en god dialog med arbeidstakeren om utfallet av søknaden.
          </BodyLong>
        </Stack>
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

function Refusjon({ opplysninger }: UtbetalingOgRefusjonProps) {
  const { register, formState, watch } =
    useFormContext<InntektOgRefusjonForm>();
  const { name, ...radioGroupProps } = register("endringIRefusjon", {
    required: "Du må svare på dette spørsmålet",
    shouldUnregister: true,
  });

  const [skalEndreBeløp, setSkalEndreBeløp] = useState(false);

  const endringIRefusjon = watch("endringIRefusjon");
  const refusjonsbeløpPerMåned = watch("refusjonsbeløpPerMåned");
  const GRUNNBELØP = useQuery(hentGrunnbeløpOptions()).data;
  const refusjonsbeløpPerMånedSomNummer = Number(refusjonsbeløpPerMåned);
  const erRefusjonOver6G =
    !Number.isNaN(refusjonsbeløpPerMånedSomNummer) &&
    refusjonsbeløpPerMånedSomNummer > 6 * GRUNNBELØP;

  return (
    <div className="bg-bg-subtle p-4 flex flex-col gap-4 rounded-md">
      {skalEndreBeløp ? (
        <Stack gap="4">
          <HStack gap="4">
            <TextField
              {...register("refusjonsbeløpPerMåned")}
              autoFocus
              label="Refusjonsbeløp pr. måned"
            />
            <Button
              className="mt-8"
              onClick={() => setSkalEndreBeløp(false)}
              variant="tertiary"
            >
              Tilbakestill
            </Button>
          </HStack>
          {erRefusjonOver6G && (
            <Alert variant="info">
              NAV utbetaler opptil 6G av årslønnen. Du skal likevel føre opp den
              lønnen dere utbetaler til den ansatte i sin helhet.
            </Alert>
          )}
        </Stack>
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
      <HjelpetekstReadMore header="Har den ansatte delvis fravær i perioden?">
        <BodyLong>
          Hvis den ansatte skal kombinere stønad fra NAV med arbeid, vil NAV
          redusere utbetalingen ut fra opplysningene fra den ansatte. Du oppgir
          derfor den månedslønnen dere utbetaler til den ansatte, uavhengig av
          hvor mye den ansatte skal jobbe.
        </BodyLong>
      </HjelpetekstReadMore>
      <RadioGroup
        error={formState.errors.endringIRefusjon?.message}
        legend={`Vil det være endringer i refusjon i løpet av perioden ${opplysninger.person.fornavn} er i permisjon?`}
        name={name}
      >
        <Radio value="ja" {...radioGroupProps}>
          Ja
        </Radio>
        <Radio value="nei" {...radioGroupProps}>
          Nei
        </Radio>
      </RadioGroup>
      <HjelpetekstReadMore header="Hvilke endringer må du informere NAV om?">
        <Stack gap="2">
          <BodyLong>
            Her skal du registrere endringer som påvirker refusjonen fra NAV.
          </BodyLong>
          <BodyLong>
            Dette kan være på grunn av endret stillingsprosent som gjør at
            lønnen dere forskutterer endrer seg i perioden
          </BodyLong>
          <BodyLong>
            Hvis dere skal slutte å forskuttere lønn i perioden, registrerer du
            det som en endring her. Dette kan være fordi arbeidsforholdet
            opphører, eller fordi dere kun forskutterer en begrenset periode. Du
            skriver da 0,- i refusjon fra den datoen dere ikke lengre
            forskutterer lønn.
          </BodyLong>
          <BodyLong>
            Du trenger ikke å informere om endringer fordi den ansatte jobber
            mer eller mindre i en periode.
          </BodyLong>
        </Stack>
      </HjelpetekstReadMore>
      {endringIRefusjon === "ja" ? <RefusjonsPerioder /> : undefined}
    </div>
  );
}

export const ENDRING_I_REFUSJON_TEMPLATE = {
  fom: undefined,
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
            name={`refusjonsendringer.${index}.fom` as const}
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
