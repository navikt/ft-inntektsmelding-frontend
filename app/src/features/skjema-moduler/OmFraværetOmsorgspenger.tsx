import { ArrowRightIcon } from "@navikt/aksel-icons";
import {
  Alert,
  BodyLong,
  BodyShort,
  Box,
  Button,
  Detail,
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
              denne inntektsmeldingen. Hvis dere ikke er pliktig til å betale
              for omsorgsdagene, men likevel har betalt og skal søke om
              refusjon, må dere sende refusjonskrav omsorgspenger.
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
          <div className="flex flex-col gap-4">
            <BodyLong>
              Hvis det er uenighet mellom den ansatte og arbeidsgiver om
              fraværet må dere i tillegg til inntektsmeldingen sende inn en
              forklaring. Forklaringen kan dere levere til den ansatte som
              laster den opp til saken.
            </BodyLong>
            <BodyLong>
              Hvis den ansatte har jobbet kortere enn fire uker hos dere trenger
              vi ikke noe forklaring utover inntektsmeldingen og registrering i
              a-ordningen.
            </BodyLong>
          </div>
        </Alert>
      )}
    </div>
  );
};

const Fraværsdager = ({ navn }: { navn?: string }) => {
  const opplysninger = useOpplysninger();

  return (
    <Box className="bg-bg-subtle p-4">
      <div className="flex justify-between">
        <Label size="small">{`Dager ${navn ? `${navn} har oppgitt fravær` : "med oppgitt fravær"}`}</Label>
        <BodyShort size="small">FRA SØKNAD</BodyShort>
      </div>
      <Theme theme="dark">
        <div className="bg-bg-subtle mt-4 flex flex-col text-text-default gap-4">
          {opplysninger.etterspurtePerioder &&
          opplysninger.etterspurtePerioder?.length > 0 ? (
            <div>
              <Label>Dager med oppgitt fravær</Label>
              <List className="flex flex-col gap-2 mt-1">
                {opplysninger.etterspurtePerioder?.map((periode) => (
                  <List.Item key={periode.fom}>
                    {new Date(periode.fom).toLocaleDateString("nb-NO")} -{" "}
                    {new Date(periode.tom).toLocaleDateString("nb-NO")}
                  </List.Item>
                ))}
              </List>
            </div>
          ) : (
            <BodyLong>Ingen dager med oppgitt fravær</BodyLong>
          )}
        </div>
      </Theme>
      <Detail className="mt-4">
        Hvis den ansatte har hatt fravær deler av dagen, viser vi kun datoen for
        fraværet og ikke antall timer.
      </Detail>
    </Box>
  );
};

export default OmFraværetOmsorgspenger;
