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
} from "@navikt/ds-react";
import { useState } from "react";

import { RotLayout } from "../rot-layout/RotLayout";
import { Fremgangsindikator } from "./Fremgangsindikator";
import { IndreLayout } from "./IndreLayout";
import { Stegnavigasjon } from "./Stegnavigasjon";

export const RefusjonOmsorgspengerArbeidsgiverSteg3 = () => {
  const [harDekket10FørsteOmsorgsdager, setHarDekket10FørsteOmsorgsdager] =
    useState<string>("");
  return (
    <RotLayout tittel="Søknad om refusjon for omsorgspenger">
      <IndreLayout>
        <Heading level="1" size="large">
          Omsorgsdager dere søker utbetaling for
        </Heading>
        <Fremgangsindikator aktivtSteg={3} />
        <GuidePanel>
          <BodyLong>
            Oppgi kun dager dere søker refusjon for. Har det vært en varig
            lønnsendring mellom perioder som dere ønsker vi skal ta hensyn til,
            må dere sende inn to søknader med periodene før og etter
            lønnsendring.
          </BodyLong>
        </GuidePanel>
        <RadioGroup
          legend="Har dere dekket de 10 første omsorgsdagene i år?"
          name="har-dekket-10-første-omsorgsdager"
          onChange={(event) =>
            setHarDekket10FørsteOmsorgsdager(event.target.value)
          }
          value={harDekket10FørsteOmsorgsdager}
        >
          <Radio value="ja">Ja</Radio>
          <Radio value="nei">Nei</Radio>
        </RadioGroup>
        {harDekket10FørsteOmsorgsdager === "nei" && (
          <Alert variant="info">
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
          </Alert>
        )}
        <FraværHeleDagen />
        <FraværDelerAvDagen />
        <Stegnavigasjon
          forrige="../2-ansatt-og-arbeidsgiver"
          neste="../4-refusjon"
        />
      </IndreLayout>
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
    <div>
      <Heading level="3" size="small">
        Oppgi dager hvor den ansatte har hatt fravær hele dagen
      </Heading>
      {perioder.map((periode) => (
        <DatePicker {...datepickerProps} key={periode.key}>
          <HStack gap="4" justify="center" wrap>
            <DatePicker.Input {...fromInputProps} label="Fra og med" />
            <DatePicker.Input {...toInputProps} label="Til og med" />
            <Button
              aria-label="Fjern periode"
              icon={<TrashIcon />}
              onClick={() => {
                setPerioder((prev) =>
                  prev.filter((p) => p.key !== periode.key),
                );
              }}
              variant="tertiary"
            >
              Slett
            </Button>
          </HStack>
        </DatePicker>
      ))}
      <Button
        icon={<PlusIcon />}
        onClick={() => {
          setPerioder((prev) => [
            ...prev,
            { key: (prev.at(-1)?.key ?? 0) + 1 },
          ]);
        }}
        variant="secondary"
      >
        Legg til periode
      </Button>
    </div>
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
    <div>
      <Heading level="3" size="small">
        Oppgi dager hvor den ansatte har hatt fravær bare deler av dagen
      </Heading>
      {perioder.map((periode) => (
        <DatePicker {...datepickerProps} key={periode.key}>
          <HStack gap="4" justify="center" wrap>
            <DatePicker.Input {...inputProps} label="Dato" />
            <TextField label="Timer fravær" />
            <Button
              aria-label="Fjern periode"
              icon={<TrashIcon />}
              onClick={() => {
                setPerioder((prev) =>
                  prev.filter((p) => p.key !== periode.key),
                );
              }}
              variant="tertiary"
            >
              Slett
            </Button>
          </HStack>
        </DatePicker>
      ))}
      <Button
        icon={<PlusIcon />}
        onClick={() => {
          setPerioder((prev) => [
            ...prev,
            { key: (prev.at(-1)?.key ?? 0) + 1 },
          ]);
        }}
        variant="secondary"
      >
        Legg til dag
      </Button>
      <div className="flex gap-4">
        <Button icon={<ArrowLeftIcon />} variant="secondary">
          Forrige steg
        </Button>
        <Button
          icon={<ArrowRightIcon />}
          iconPosition="right"
          variant="primary"
        >
          Neste steg
        </Button>
      </div>
    </div>
  );
};
