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
  DatePicker,
  GuidePanel,
  Heading,
  HStack,
  Radio,
  RadioGroup,
  TextField,
  useDatepicker,
  VStack,
} from "@navikt/ds-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useFieldArray } from "react-hook-form";

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
  const førsteDagAvIfjor = new Date(new Date().getFullYear() - 1, 0, 1);
  const { control } = useRefusjonOmsorgspengerArbeidsgiverFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "fraværHeleDager",
  });

  return (
    <VStack gap="4">
      <Heading level="3" size="small">
        Oppgi dager hvor den ansatte har hatt fravær hele dagen
      </Heading>
      {fields.map((periode, index) => (
        <HStack gap="4" key={periode.id}>
          <DateRangePickerWrapped
            maxDato={new Date()}
            minDato={førsteDagAvIfjor}
            name={`fraværHeleDager.${index}`}
            rules={{
              fom: { required: "Du må oppgi fra og med dato" },
              tom: { required: "Du må oppgi til og med dato" },
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
  const førsteDagAvIfjor = new Date(new Date().getFullYear() - 1, 0, 1);
  const { control } = useRefusjonOmsorgspengerArbeidsgiverFormContext();
  const { datepickerProps, inputProps } = useDatepicker({
    fromDate: førsteDagAvIfjor,
    toDate: new Date(),
    onDateChange: () => {},
  });
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
        <DatePicker {...datepickerProps} key={periode.id}>
          <HStack align="center" gap="4" justify="center" wrap>
            <DatePicker.Input {...inputProps} label="Dato" />
            <TextField label="Timer fravær" />
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
        </DatePicker>
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
