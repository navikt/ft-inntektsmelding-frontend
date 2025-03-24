import {
  ArrowLeftIcon,
  ArrowRightIcon,
  PlusIcon,
  TrashIcon,
} from "@navikt/aksel-icons";
import {
  Alert,
  BodyLong,
  BodyShort,
  Button,
  GuidePanel,
  Heading,
  HStack,
  Label,
  List,
  Radio,
  RadioGroup,
  TextField,
  VStack,
} from "@navikt/ds-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useFieldArray } from "react-hook-form";

import { HjelpetekstAlert, HjelpetekstReadMore } from "../Hjelpetekst.tsx";
import { DatePickerWrapped } from "../react-hook-form-wrappers/DatePickerWrapped";
import { DateRangePickerWrapped } from "../react-hook-form-wrappers/DateRangePickerWrapped";
import { useDocumentTitle } from "../useDocumentTitle";
import { OmsorgspengerFremgangsindikator } from "./OmsorgspengerFremgangsindikator.tsx";
import { useRefusjonOmsorgspengerArbeidsgiverFormContext } from "./RefusjonOmsorgspengerArbeidsgiverForm";
import {
  beregnGyldigDatoIntervall,
  utledDefaultMonthDatepicker,
} from "./utils.ts";

export const RefusjonOmsorgspengerArbeidsgiverSteg3 = () => {
  useDocumentTitle(
    "Omsorgsdager - søknad om refusjon av omsorgspenger for arbeidsgiver",
  );

  const { register, formState, watch, handleSubmit, getValues, setValue } =
    useRefusjonOmsorgspengerArbeidsgiverFormContext();

  const navigate = useNavigate();

  const årForRefusjon = watch("årForRefusjon");

  useEffect(() => {
    setValue("meta.step", 3);
    if (getValues("meta.harSendtSøknad")) {
      navigate({
        from: "/refusjon-omsorgspenger/$organisasjonsnummer/3-omsorgsdager",
        to: "../6-kvittering",
      });
    }
  }, []);

  // useEffect(() => {
  //   if (!getValues("årForRefusjon") || !getValues("harUtbetaltLønn")) {
  //     navigate({
  //       from: "/refusjon-omsorgspenger/$organisasjonsnummer/3-omsorgsdager",
  //       to: "../1-intro",
  //     });
  //   }
  // }, [getValues("årForRefusjon"), getValues("harUtbetaltLønn")]);

  const onSubmit = handleSubmit(() => {
    navigate({
      from: "/refusjon-omsorgspenger/$organisasjonsnummer/3-omsorgsdager",
      to: "../4-refusjon",
    });
  });

  const { name, ...harDekket10FørsteOmsorgsdagerRadioGroupProps } = register(
    "harDekket10FørsteOmsorgsdager",
    {
      required:
        "Du må svare på om dere har dekket de 10 første omsorgsdagene i år",
    },
  );

  return (
    <div className="bg-bg-default rounded-md flex flex-col gap-6">
      <Heading level="1" size="large">
        Omsorgsdager dere søker refusjon for
      </Heading>
      <OmsorgspengerFremgangsindikator aktivtSteg={3} />
      <GuidePanel className="mb-4">
        <BodyLong>
          Her oppgir du hvilke dager dere har utbetalt lønn og søker om refusjon
          fordi den ansatte har brukt omsorgsdager. Dagene må være innenfor
          samme kalenderår og kan ikke være frem i tid.
        </BodyLong>
        <BodyLong>
          Hvis dere kun har betalt lønn for deler av fraværet, må den ansatte
          selv søke om omsorgspenger for de dagene dere ikke har utbetalt lønn.
        </BodyLong>
      </GuidePanel>
      <form onSubmit={onSubmit}>
        <VStack gap="4">
          <RadioGroup
            error={formState.errors.harDekket10FørsteOmsorgsdager?.message}
            legend={`Har dere dekket de 10 første omsorgsdagene i ${årForRefusjon}?`}
            name={name}
          >
            <Radio value="ja" {...harDekket10FørsteOmsorgsdagerRadioGroupProps}>
              Ja
            </Radio>
            <Radio
              value="nei"
              {...harDekket10FørsteOmsorgsdagerRadioGroupProps}
            >
              Nei
            </Radio>
          </RadioGroup>
          <TiFørsteOmsorgsdagerInfo />
          {formState.errors.fraværHeleDager?.message && (
            <Alert aria-live="polite" variant="error">
              <BodyLong>{formState.errors.fraværHeleDager.message}</BodyLong>
            </Alert>
          )}
          <VStack gap="8">
            <FraværHeleDagen />
            <FraværDelerAvDagen />
          </VStack>
          <HjelpetekstReadMore header="Eksempler på hvordan du oppgir og omregner arbeidstid">
            <Label>Eksempel 1:</Label>
            <BodyLong>
              Arbeidstaker jobber vanligvis 7,5 timer per dag og har vært borte
              en halv dag.
            </BodyLong>
            <List>
              <List.Item className="my-8">
                Fraværet utgjør 3,75 timer, som skal avrundes til nærmeste halve
                time. Dette betyr at du oppgir 4 timer i refusjonskravet. Ved
                flere halve dager kan det oppgis som 3,5 og 4 timer annenhver
                dag.
              </List.Item>
              <Label>Eksempel 2:</Label>
              <BodyLong>
                Arbeidstaker jobber vanligvis 9 timer per dag og er borte i 4 av
                disse. Du deler da antall timer fravær på antall timer
                arbeidstakeren skulle jobbet. Tallet du får ganger du med 7,5.
              </BodyLong>
              <List.Item className="my-8">
                4 timer fravær / 9 timer arbeidstid = 0,440,44 × 7,5 = 3,33
                timer, som avrundes til 3,5 timer i refusjonskravet
              </List.Item>
              <BodyLong>
                Du kan regne på samme måste om ordinær arbeidstid er over eller
                under 7,5 time.
              </BodyLong>
            </List>
          </HjelpetekstReadMore>

          <div className="flex gap-4 mt-8">
            <Button
              as={Link}
              icon={<ArrowLeftIcon />}
              to="../2-ansatt-og-arbeidsgiver"
              variant="secondary"
            >
              Forrige steg
            </Button>
            <Button
              icon={<ArrowRightIcon />}
              iconPosition="right"
              type="submit"
              variant="primary"
            >
              Neste steg
            </Button>
          </div>
        </VStack>
      </form>
    </div>
  );
};

const FraværHeleDagen = () => {
  const { control, watch, clearErrors, setValue } =
    useRefusjonOmsorgspengerArbeidsgiverFormContext();

  useEffect(() => {
    setValue("meta.step", 3);
  }, []);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "fraværHeleDager",
  });

  const årForRefusjon = Number(watch("årForRefusjon"));
  const { minDato, maxDato } = beregnGyldigDatoIntervall(årForRefusjon);

  return (
    <VStack gap="4">
      <Heading level="3" size="small">
        Hele dager dere søker refusjon for
      </Heading>
      {fields.map((periode, index) => (
        <HStack
          className="border-l-4 border-bg-subtle pl-4 py-2"
          gap="4"
          key={periode.id}
        >
          <DateRangePickerWrapped
            datepickerProps={{
              defaultMonth: utledDefaultMonthDatepicker(årForRefusjon),
            }}
            maxDato={maxDato}
            minDato={minDato}
            name={`fraværHeleDager.${index}`}
          />
          <div>
            <Button
              aria-label="Slett periode"
              className="md:mt-10"
              icon={<TrashIcon />}
              onClick={() => {
                remove(index);
              }}
              size="small"
              type="button"
              variant="tertiary"
            >
              Slett
            </Button>
          </div>
        </HStack>
      ))}
      <div>
        <Button
          icon={<PlusIcon />}
          onClick={() => {
            append({ fom: "", tom: "" });
            clearErrors("fraværHeleDager");
          }}
          size="small"
          type="button"
          variant="secondary"
        >
          Legg til periode
        </Button>
      </div>
    </VStack>
  );
};

const FraværDelerAvDagen = () => {
  const { control, register, formState, watch, clearErrors, setValue } =
    useRefusjonOmsorgspengerArbeidsgiverFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "fraværDelerAvDagen",
  });
  const årForRefusjon = Number(watch("årForRefusjon"));

  const { minDato, maxDato } = beregnGyldigDatoIntervall(årForRefusjon);
  return (
    <VStack gap="2">
      <Heading level="3" size="small">
        Delvise dager dere søker refusjon for
      </Heading>
      <BodyLong className="text-text-subtle" size="small">
        Timer skal avrundes til nærmeste halve time og beregnes basert på en 7,5
        timers arbeidsdag. Hvis arbeidstakeren har en annen ordinær arbeidstid,
        må fraværet omregnes.
      </BodyLong>
      {fields.map((periode, index) => {
        return (
          <HStack
            align="start"
            className="border-l-4 border-bg-subtle pl-4 py-2"
            gap="4"
            key={periode.id}
          >
            <DatePickerWrapped
              datepickerProps={{
                toDate: maxDato,
                fromDate: minDato,
                defaultMonth: utledDefaultMonthDatepicker(årForRefusjon),
              }}
              key={periode.id}
              label="Dato"
              name={`fraværDelerAvDagen.${index}.dato`}
              rules={{
                required: "Du må oppgi dato",
              }}
            />
            <TextField
              label="Timer fravær"
              {...register(`fraværDelerAvDagen.${index}.timer`, {
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value;
                  const valueWithoutCommas = value.replaceAll(",", ".");
                  setValue(
                    `fraværDelerAvDagen.${index}.timer`,
                    valueWithoutCommas as unknown as string,
                  );
                },
              })}
              error={
                formState.touchedFields.fraværDelerAvDagen?.[index]?.timer &&
                formState.errors.fraværDelerAvDagen?.[index]?.timer?.message
              }
            />
            <div>
              <Button
                aria-label="Slett periode"
                className="md:mt-10"
                icon={<TrashIcon />}
                onClick={() => {
                  remove(index);
                }}
                size="small"
                type="button"
                variant="tertiary"
              >
                Slett
              </Button>
            </div>
          </HStack>
        );
      })}
      <div>
        <Button
          icon={<PlusIcon />}
          onClick={() => {
            append({ dato: "", timer: "" });
            clearErrors("fraværDelerAvDagen");
          }}
          size="small"
          type="button"
          variant="secondary"
        >
          Legg til dag
        </Button>
      </div>
    </VStack>
  );
};

const TiFørsteOmsorgsdagerInfo = () => {
  const { watch } = useRefusjonOmsorgspengerArbeidsgiverFormContext();
  const harDekket10FørsteOmsorgsdager = watch("harDekket10FørsteOmsorgsdager");
  if (harDekket10FørsteOmsorgsdager === "ja") {
    return (
      <HjelpetekstAlert>
        <BodyShort>
          Du kan søke om utbetaling fra NAV fra og med den 11. dagen.
        </BodyShort>
        <BodyShort>
          Hvis den ansatte har kronisk sykt barn over 13 år, og ingen andre barn
          under 12 år, kan du søke om utbetaling fra første fraværsdag.
        </BodyShort>
      </HjelpetekstAlert>
    );
  }

  if (harDekket10FørsteOmsorgsdager === "nei") {
    return (
      <HjelpetekstAlert>
        <VStack gap="4">
          <BodyLong>
            Bedriften må dekke de første 10 omsorgsdagene hvert kalenderår for
            ansatte som har barn under 12 år, eller som fyller 12 år det
            gjeldende året. Du kan søke om utbetaling fra NAV fra og med den 11.
            dagen.
          </BodyLong>
          <BodyLong>
            Hvis den ansatte har kronisk sykt barn over 13 år, og ingen andre
            barn under 12 år, kan du søke om utbetaling fra første fraværsdag.
          </BodyLong>
        </VStack>
      </HjelpetekstAlert>
    );
  }
};
