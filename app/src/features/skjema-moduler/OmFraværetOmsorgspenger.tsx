import { ArrowRightIcon } from "@navikt/aksel-icons";
import {
  Alert,
  BodyLong,
  BodyShort,
  Box,
  Button,
  Dropdown,
  Heading,
  Label,
  List,
  Radio,
  RadioGroup,
  Theme,
} from "@navikt/ds-react";
import { createLink } from "@tanstack/react-router";
import { useFormContext } from "react-hook-form";

import { lagFulltNavn } from "~/utils";

import { InntektOgRefusjonForm } from "../inntektsmelding/Steg2InntektOgRefusjon";
import { useOpplysninger } from "../inntektsmelding/useOpplysninger";

const OmFraværetOmsorgspenger = () => {
  const { register, formState, watch } =
    useFormContext<InntektOgRefusjonForm>();
  const opplysninger = useOpplysninger();

  const { name, ...radioGroupProps } = register("skalRefunderes", {
    required: "Du må svare på dette spørsmålet",
  });

  const ButtonLink = createLink(Button);
  return (
    <div className="flex gap-4 flex-col">
      <Heading id="om-fraværet-omsorgspenger" level="4" size="medium">
        Om fraværet
      </Heading>
      <Fraværsdager navn={lagFulltNavn(opplysninger.innsender)} />
      <ÅrsakTilSøknad
        kilde="fra søknad"
        tittel="Årsak til søknad"
        årsak="TODO: årsak til søknad"
      />
      <RadioGroup
        className="mt-5"
        error={formState.errors.skalRefunderes?.message}
        legend="Har dere utbetalt lønn for dette fraværet?"
        name={name}
      >
        <Radio value="JA_LIK_REFUSJON" {...radioGroupProps}>
          Ja
        </Radio>
        <Radio value="NEI" {...radioGroupProps}>
          Nei
        </Radio>
      </RadioGroup>
      {watch("skalRefunderes") === "JA_LIK_REFUSJON" && (
        <Alert variant="info">
          <div className="flex flex-col gap-4">
            <BodyLong>
              Har dere utbetalt full lønn for fraværet skal dere ikke sende inn
              inntektsmeldingen. Hvis dere ikke er pliktig til å betale for
              omsorgsdagene, men likevel har betalt og skal søke om refusjon, må
              dere sende refusjonskrav omsorgspenger.
            </BodyLong>

            <BodyLong>
              Har dere kun utbetalt delvis lønn for fraværet må dere sende inn
              forklaring på hva/hvilke dager dere har utbetalt i tillegg til å
              sende inn denne inntektsmeldingen.
            </BodyLong>
          </div>
          <ButtonLink
            className="mt-4"
            icon={<ArrowRightIcon />}
            iconPosition="right"
            params={{
              organisasjonsnummer: opplysninger.arbeidsgiver.organisasjonNummer,
            }}
            size="small"
            to="/refusjon-omsorgspenger/$organisasjonsnummer/1-intro"
          >
            Gå til refusjonskrav
          </ButtonLink>
        </Alert>
      )}
      {watch("skalRefunderes") === "NEI" && (
        <Alert variant="info">
          <BodyLong>TODO: koble til årsak til søknad</BodyLong>
        </Alert>
      )}
    </div>
  );
};

const Fraværsdager = ({ navn }: { navn?: string }) => {
  const innsending = {
    heleDager: [],
    delviseDager: [],
  };
  return (
    <Box className="bg-bg-subtle p-4">
      <div className="flex justify-between">
        <Label size="small">{`Dager ${navn ? `${navn} har oppgitt fravær` : "med oppgitt fravær"}`}</Label>
        <BodyShort size="small">FRA SØKNAD</BodyShort>
      </div>
      <Theme theme="dark">
        <div className="bg-bg-subtle mt-4 flex flex-col text-text-default gap-4">
          {innsending.heleDager && innsending.heleDager?.length > 0 && (
            <div>
              <Label>Hele dager dere søkte refusjon for</Label>
              <List className="flex flex-col gap-2 mt-1">
                {innsending.heleDager?.map((dag) => (
                  <List.Item key={dag.fom}>
                    {new Date(dag.fom).toLocaleDateString("nb-NO")} -{" "}
                    {new Date(dag.tom).toLocaleDateString("nb-NO")}
                  </List.Item>
                ))}
              </List>
            </div>
          )}
          {innsending.delviseDager && innsending.delviseDager?.length > 0 && (
            <div>
              <Dropdown.Menu.Divider />
              <div className="mt-4">
                <Label>Delvise dager dere søkte refusjon for</Label>
                <List className="flex flex-col gap-2 mt-1">
                  {innsending.delviseDager?.map((dag) => (
                    <List.Item key={dag.dato}>
                      {new Date(dag.dato).toLocaleDateString("nb-NO")} -{" "}
                      {dag.timer} timer
                    </List.Item>
                  ))}
                </List>
              </div>
            </div>
          )}
        </div>
      </Theme>
    </Box>
  );
};

const ÅrsakTilSøknad = ({
  tittel,
  kilde,
  årsak,
}: {
  tittel: string;
  kilde: string;
  årsak: string;
}) => {
  return (
    <div className="bg-bg-subtle p-4">
      <div className="flex justify-between">
        <Label size="small">{tittel}</Label>
        <BodyShort className="uppercase" size="small">
          {kilde}
        </BodyShort>
      </div>
      <BodyShort className="mt-2" size="small">
        {årsak}
      </BodyShort>
    </div>
  );
};

export default OmFraværetOmsorgspenger;
