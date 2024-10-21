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
  Radio,
  RadioGroup,
  TextField,
  VStack,
} from "@navikt/ds-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useFieldArray } from "react-hook-form";

import { DatePickerWrapped } from "../react-hook-form-wrappers/DatePickerWrapped";
import { DateRangePickerWrapped } from "../react-hook-form-wrappers/DateRangePickerWrapped";
import { RotLayout } from "../rot-layout/RotLayout";
import { useDocumentTitle } from "../useDocumentTitle";
import { Fremgangsindikator } from "./Fremgangsindikator";
import { useRefusjonOmsorgspengerArbeidsgiverFormContext } from "./RefusjonOmsorgspengerArbeidsgiverForm";

export const RefusjonOmsorgspengerArbeidsgiverSteg3 = () => {
  useDocumentTitle(
    "Omsorgsdager – søknad om refusjon av omsorgspenger for arbeidsgiver",
  );

  const { register, formState, watch, handleSubmit } =
    useRefusjonOmsorgspengerArbeidsgiverFormContext();

  const navigate = useNavigate();
  const onSubmit = handleSubmit(() => {
    navigate({
      from: "/refusjon-omsorgspenger-arbeidsgiver/3-omsorgsdager",
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
  return (
    <RotLayout medHvitBoks={true} tittel="Søknad om refusjon for omsorgspenger">
      <Heading level="1" size="large">
        Omsorgsdager dere søker utbetaling for
      </Heading>
      <Fremgangsindikator aktivtSteg={3} />
      <GuidePanel>
        <BodyLong>
          Oppgi kun dager dere søker refusjon for. Har det vært en varig
          lønnsendring mellom perioder som dere ønsker vi skal ta hensyn til, må
          dere sende inn to søknader med periodene før og etter lønnsendring.
        </BodyLong>
      </GuidePanel>
      <form onSubmit={onSubmit}>
        <VStack gap="4">
          <RadioGroup
            error={formState.errors.harDekket10FørsteOmsorgsdager?.message}
            legend="Har dere dekket de 10 første omsorgsdagene i år?"
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
            <Alert variant="info">
              <VStack gap="4">
                <BodyLong>
                  Bedriften må dekke de første 10 omsorgsdagene hvert kalenderår
                  for ansatte som har barn under 12 år, eller som fyller 12 år
                  det gjeldende året. Du kan søke om utbetaling fra NAV fra og
                  med den 11. dagen.
                </BodyLong>
                <BodyLong>
                  Hvis den ansatte har kronisk sykt barn over 13 år, og ingen
                  andre barn under 12 år, kan du søke om utbetaling fra første
                  fraværsdag.
                </BodyLong>
              </VStack>
            </Alert>
          )}
          <FraværHeleDagen />
          <FraværDelerAvDagen />

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
    </RotLayout>
  );
};

const FraværHeleDagen = () => {
  const { control, watch } = useRefusjonOmsorgspengerArbeidsgiverFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "fraværHeleDager",
  });

  const årForRefusjon = Number(watch("årForRefusjon"));
  const iDag = new Date();
  const førsteDagAvIfjor = new Date(new Date().getFullYear() - 1, 0, 1);
  const maxDato = årForRefusjon
    ? new Date(årForRefusjon, iDag.getMonth(), iDag.getDate())
    : new Date();
  const minDato = årForRefusjon
    ? new Date(årForRefusjon, 0, 1)
    : førsteDagAvIfjor;

  return (
    <VStack gap="4">
      <Heading level="3" size="small">
        Oppgi dager hvor den ansatte har hatt fravær hele dagen
      </Heading>
      {fields.map((periode, index) => (
        <HStack gap="4" key={periode.id}>
          <DateRangePickerWrapped
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
              aria-label="Fjern periode"
              className="mt-8"
              icon={<TrashIcon />}
              onClick={() => {
                remove(index);
              }}
              type="button"
            >
              Fjern periode
            </Button>
          </div>
        </HStack>
      ))}
      <div>
        <Button
          icon={<PlusIcon />}
          onClick={() => {
            append({});
          }}
          size="medium"
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
  const { control, register, formState } =
    useRefusjonOmsorgspengerArbeidsgiverFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "fraværDelerAvDagen",
  });
  return (
    <VStack gap="4">
      <Heading level="3" size="small">
        Oppgi dager hvor den ansatte har hatt fravær bare deler av dagen
      </Heading>
      {fields.map((periode, index) => (
        <HStack align="center" gap="4" key={periode.id} wrap>
          <DatePickerWrapped
            key={periode.id}
            label="Dato"
            name={`fraværDelerAvDagen.${index}.dato`}
            rules={{
              required: "Du må oppgi dato",
            }}
          />
          <TextField
            label="Timer fravær"
            {...register(`fraværDelerAvDagen.${index}.antallTimer`, {
              validate: (value) => {
                if (!value) {
                  return "Du må oppgi antall timer";
                }
                if (Number.isNaN(Number(value))) {
                  return "Antall timer må være et tall";
                }
                if (value <= 0) {
                  return "Antall timer må være høyere enn 0";
                }
                if (value > 24) {
                  return "Antall timer kan ikke være mer enn 24";
                }
              },
            })}
            error={
              formState.errors.fraværDelerAvDagen?.[index]?.antallTimer?.message
            }
          />
          <div>
            <Button
              aria-label="Fjern periode"
              className="mt-8"
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
            append({});
          }}
          size="medium"
          type="button"
          variant="secondary"
        >
          Legg til dag
        </Button>
      </div>
    </VStack>
  );
};
