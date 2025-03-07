import {
  ArrowLeftIcon,
  ArrowRightIcon,
  PlusIcon,
  TrashIcon,
} from "@navikt/aksel-icons";
import {
  Alert,
  BodyLong,
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

import { HjelpetekstReadMore } from "../Hjelpetekst.tsx";
import { DatePickerWrapped } from "../react-hook-form-wrappers/DatePickerWrapped";
import { DateRangePickerWrapped } from "../react-hook-form-wrappers/DateRangePickerWrapped";
import { useDocumentTitle } from "../useDocumentTitle";
import { OmsorgspengerFremgangsindikator } from "./OmsorgspengerFremgangsindikator.tsx";
import { useRefusjonOmsorgspengerArbeidsgiverFormContext } from "./RefusjonOmsorgspengerArbeidsgiverForm";
import {
  beregnGyldigDatoIntervall,
  hasAbsenceInDateRange,
  utledDefaultMonthDatepicker,
} from "./utils.ts";

export const RefusjonOmsorgspengerArbeidsgiverSteg3 = () => {
  useDocumentTitle(
    "Omsorgsdager - søknad om refusjon av omsorgspenger for arbeidsgiver",
  );

  const { register, formState, watch, handleSubmit, getValues, setValue } =
    useRefusjonOmsorgspengerArbeidsgiverFormContext();

  const navigate = useNavigate();

  useEffect(() => {
    setValue("meta.step", 3);
    if (getValues("meta.harSendtSøknad")) {
      navigate({
        from: "/refusjon-omsorgspenger/$organisasjonsnummer/3-omsorgsdager",
        to: "../6-kvittering",
      });
    }

    if (!getValues("årForRefusjon") || !getValues("harUtbetaltLønn")) {
      navigate({
        from: "/refusjon-omsorgspenger/$organisasjonsnummer/3-omsorgsdager",
        to: "../1-intro",
      });
    }
  }, []);

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

  const harDekket10FørsteOmsorgsdager = watch("harDekket10FørsteOmsorgsdager");
  const fraværHeleDager = watch("fraværHeleDager");
  const fraværDelerAvDagen = watch("fraværDelerAvDagen");
  const årForRefusjon = watch("årForRefusjon");

  const fraværErInnenforDatoer = hasAbsenceInDateRange(
    fraværHeleDager,
    fraværDelerAvDagen,
    new Date(`${årForRefusjon}-01-01`),
    new Date(`${årForRefusjon}-01-10`),
  );
  return (
    <div>
      <Heading level="1" size="large">
        Omsorgsdager dere søker utbetaling for
      </Heading>
      <OmsorgspengerFremgangsindikator aktivtSteg={3} />
      <GuidePanel className="mb-4">
        <BodyLong>
          Her oppgir du de dagene dere har utbetalt lønn, og krever refusjon
          fordi den ansatte brukte omsorgsdag.
        </BodyLong>
        <BodyLong>
          Hvis dere kun har betalt lønn for deler av fraværet, må den ansatte
          selv søke om utbetaling av omsorgspenger for de dagene dere ikke
          utbetalte lønn.
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
          {harDekket10FørsteOmsorgsdager === "nei" && (
            <TiFørsteOmsorgsdagerInfo />
          )}
          {formState.errors.fraværHeleDager?.message && (
            <Alert aria-live="polite" variant="error">
              <BodyLong>{formState.errors.fraværHeleDager.message}</BodyLong>
            </Alert>
          )}
          <FraværHeleDagen />
          <FraværDelerAvDagen />

          {fraværErInnenforDatoer && harDekket10FørsteOmsorgsdager === "ja" && (
            <TiFørsteOmsorgsdagerInfo />
          )}
          <HjelpetekstReadMore header="Har den ansatte hatt en varig lønnsendring?">
            Hvis dere krever refusjon for flere perioder, og den ansatte har
            hatt varig lønnsendring mellom periodene, må dere sende to
            refusjonskrav for periodene før og etter lønnsendring.
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
        Oppgi dager hvor den ansatte har hatt fravær hele dagen
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
            rules={{
              fom: {
                validate: (value) => {
                  if (!value) {
                    return "Du må oppgi fra og med dato";
                  }
                },
              },
              tom: {
                validate: (value) => {
                  if (!value) {
                    return "Du må oppgi til og med dato";
                  }
                  if (periode.fom && value < periode.fom) {
                    return "Til og med dato må være etter fra og med dato";
                  }
                },
              },
            }}
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
    <VStack gap="4">
      <Heading level="3" size="small">
        Oppgi dager hvor den ansatte har hatt fravær bare deler av dagen
      </Heading>
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
                validate: (value) => {
                  if (!value) {
                    return "Du må oppgi antall timer";
                  }
                  if (Number.isNaN(Number(value))) {
                    return "Antall timer må være et tall";
                  }
                  if (Number(value) <= 0) {
                    return "Antall timer må være høyere enn 0";
                  }
                  if (Number(value) > 24) {
                    return "Antall timer kan ikke være mer enn 24";
                  }
                },
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
  return (
    <Alert variant="info">
      <VStack gap="4">
        <Label>Arbeidsgivers plikt til å utbetale omsorgsdager</Label>
        <BodyLong>
          Som hovedregel har arbeidsgiver plikt til å dekke de første ti
          omsorgsdagene i hvert kalenderår.
        </BodyLong>
        <List>
          Du kan unntaksvis kreve refusjon for de første 10 dagene hvis:
          <List.Item>
            den ansatte ikke hadde jobbet fire uker før fraværet.
          </List.Item>
          <List.Item>
            den ansatte sine barn fyller/er fylt 13 år, men har fått ekstra
            omsorgsdager for et barn på grunn av langvarig/kronisk sykdom eller
            funksjonshemning.
          </List.Item>
        </List>
      </VStack>
    </Alert>
  );
};
