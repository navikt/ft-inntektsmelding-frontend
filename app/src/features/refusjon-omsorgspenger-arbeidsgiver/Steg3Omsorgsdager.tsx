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
  useRangeDatepicker,
  VStack,
} from "@navikt/ds-react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

import { RotLayout } from "../rot-layout/RotLayout";
import { useDocumentTitle } from "../useDocumentTitle";
import { Fremgangsindikator } from "./Fremgangsindikator";

export const RefusjonOmsorgspengerArbeidsgiverSteg3 = () => {
  useDocumentTitle(
    "Omsorgsdager – søknad om refusjon av omsorgspenger for arbeidsgiver",
  );
  const [harDekket10FørsteOmsorgsdager, setHarDekket10FørsteOmsorgsdager] =
    useState("");
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
      <RadioGroup
        legend="Har dere dekket de 10 første omsorgsdagene i år?"
        name="har-dekket-10-første-omsorgsdager"
        onChange={setHarDekket10FørsteOmsorgsdager}
        value={harDekket10FørsteOmsorgsdager}
      >
        <Radio value="ja">Ja</Radio>
        <Radio value="nei">Nei</Radio>
      </RadioGroup>
      {harDekket10FørsteOmsorgsdager === "nei" && (
        <Alert variant="info">
          <VStack gap="4">
            <BodyLong>
              Bedriften må dekke de første 10 omsorgsdagene hvert kalenderår for
              ansatte som har barn under 12 år, eller som fyller 12 år det
              gjeldende året. Du kan søke om utbetaling fra NAV fra og med den
              11. dagen.
            </BodyLong>
            <BodyLong>
              Hvis den ansatte har kronisk sykt barn over 13 år, og ingen andre
              barn under 12 år, kan du søke om utbetaling fra første fraværsdag.
            </BodyLong>
          </VStack>
        </Alert>
      )}
      <FraværHeleDagen />
      <FraværDelerAvDagen />

      <div className="flex gap-4">
        <Button
          as={Link}
          icon={<ArrowLeftIcon />}
          to="../2-ansatt-og-arbeidsgiver"
          variant="secondary"
        >
          Forrige steg
        </Button>
        <Button
          as={Link}
          icon={<ArrowRightIcon />}
          iconPosition="right"
          to="../4-refusjon"
          variant="primary"
        >
          Neste steg
        </Button>
      </div>
    </RotLayout>
  );
};

const FraværHeleDagen = () => {
  const [perioder, setPerioder] = useState<
    { key: number; from?: Date; to?: Date }[]
  >([]);
  const førsteDagAvIfjor = new Date(new Date().getFullYear() - 1, 0, 1);
  const { datepickerProps, toInputProps, fromInputProps } = useRangeDatepicker({
    fromDate: førsteDagAvIfjor,
    toDate: new Date(),
    onRangeChange: () => {},
  });

  return (
    <VStack gap="4">
      <Heading level="3" size="small">
        Oppgi dager hvor den ansatte har hatt fravær hele dagen
      </Heading>
      {perioder.map((periode) => (
        <DatePicker {...datepickerProps} key={periode.key}>
          <HStack align="center" gap="4" justify="center" wrap>
            <DatePicker.Input {...fromInputProps} label="Fra og med" />
            <DatePicker.Input {...toInputProps} label="Til og med" />
            <div>
              <Button
                aria-label="Fjern periode"
                className="mt-8"
                icon={<TrashIcon />}
                onClick={() => {
                  setPerioder((prev) =>
                    prev.filter((p) => p.key !== periode.key),
                  );
                }}
                size="small"
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
            setPerioder((prev) => [
              ...prev,
              { key: (prev.at(-1)?.key ?? 0) + 1 },
            ]);
          }}
          size="small"
          variant="secondary"
        >
          Legg til periode
        </Button>
      </div>
    </VStack>
  );
};

const FraværDelerAvDagen = () => {
  const [perioder, setPerioder] = useState<
    { key: number; date?: Date; hours?: number }[]
  >([]);
  const førsteDagAvIfjor = new Date(new Date().getFullYear() - 1, 0, 1);
  const { datepickerProps, inputProps } = useDatepicker({
    fromDate: førsteDagAvIfjor,
    toDate: new Date(),
    onDateChange: () => {},
  });
  return (
    <VStack gap="4">
      <Heading level="3" size="small">
        Oppgi dager hvor den ansatte har hatt fravær bare deler av dagen
      </Heading>
      {perioder.map((periode) => (
        <DatePicker {...datepickerProps} key={periode.key}>
          <HStack align="center" gap="4" justify="center" wrap>
            <DatePicker.Input {...inputProps} label="Dato" />
            <TextField label="Timer fravær" />
            <div>
              <Button
                aria-label="Fjern periode"
                className="mt-8"
                icon={<TrashIcon />}
                onClick={() => {
                  setPerioder((prev) =>
                    prev.filter((p) => p.key !== periode.key),
                  );
                }}
                size="small"
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
            setPerioder((prev) => [
              ...prev,
              { key: (prev.at(-1)?.key ?? 0) + 1 },
            ]);
          }}
          size="small"
          variant="secondary"
        >
          Legg til dag
        </Button>
      </div>
    </VStack>
  );
};
