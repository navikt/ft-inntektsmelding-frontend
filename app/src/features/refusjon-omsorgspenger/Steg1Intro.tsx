import { ArrowRightIcon } from "@navikt/aksel-icons";
import {
  Alert,
  BodyLong,
  Button,
  GuidePanel,
  Heading,
  Link,
  Radio,
  RadioGroup,
  VStack,
} from "@navikt/ds-react";
import { useNavigate } from "@tanstack/react-router";

import { capitalizeSetning } from "~/utils.ts";

import { useDocumentTitle } from "../useDocumentTitle";
import { OmsorgspengerFremgangsindikator } from "./OmsorgspengerFremgangsindikator.tsx";
import { useRefusjonOmsorgspengerArbeidsgiverFormContext } from "./RefusjonOmsorgspengerArbeidsgiverForm";
import { useInnloggetBruker } from "./useInnloggetBruker";

export const RefusjonOmsorgspengerArbeidsgiverSteg1 = () => {
  useDocumentTitle("Søknad om refusjon av omsorgspenger for arbeidsgiver");

  const innloggetBruker = useInnloggetBruker();

  const navigate = useNavigate();
  const iÅr = new Date().getFullYear();
  const iFjor = iÅr - 1;

  const { register, formState, watch, handleSubmit } =
    useRefusjonOmsorgspengerArbeidsgiverFormContext();
  const harUtbetaltLønn = watch("harUtbetaltLønn");

  const onSubmit = handleSubmit(() => {
    navigate({
      from: "/refusjon-omsorgspenger/$organisasjonsnummer/1-intro",
      to: "../2-ansatt-og-arbeidsgiver",
    });
  });

  const { name: harUtbetaltLønnName, ...harUtbetaltLønnRadioGroupProps } =
    register("harUtbetaltLønn");

  const { name: årForRefusjonName, ...årForRefusjonRadioGroupProps } =
    register("årForRefusjon");

  return (
    <div>
      <Heading level="1" size="large">
        Refusjon
      </Heading>
      <OmsorgspengerFremgangsindikator aktivtSteg={1} />
      <GuidePanel className="mb-4">
        <VStack gap="4">
          <Heading level="2" size="medium">
            Hei {capitalizeSetning(innloggetBruker.fornavn)}!
          </Heading>
          <BodyLong>
            Dere kan søke om refusjon av omsorgspenger for bruk av omsorgsdager
            opptil tre måneder tilbake i tid, regnet fra måneden før vi mottar
            søknaden deres.
          </BodyLong>
          <BodyLong>
            Dere kan kun søke om utbetaling for ett og samme år. Det betyr at
            hvis dere skal søke om utbetaling for både {iFjor} og {iÅr}, må dere
            sende to separate søknader.
          </BodyLong>
        </VStack>
      </GuidePanel>
      <form onSubmit={onSubmit}>
        <VStack gap="4">
          <RadioGroup
            error={formState.errors.harUtbetaltLønn?.message}
            legend="Har dere utbetalt lønn under fraværet, og krever refusjon?"
            name={harUtbetaltLønnName}
          >
            <Radio value="ja" {...harUtbetaltLønnRadioGroupProps}>
              Ja
            </Radio>
            <Radio value="nei" {...harUtbetaltLønnRadioGroupProps}>
              Nei
            </Radio>
          </RadioGroup>
          {harUtbetaltLønn === "nei" && (
            <Alert variant="warning">
              <Heading level="3" size="small" spacing>
                Arbeidsgivers plikt til å betale omsorgsdager
              </Heading>
              <BodyLong spacing>
                Hvis arbeidstakeren har jobbet hos dere i 4 uker eller mer,
                plikter dere å utbetale lønn for alle omsorgsdagene som
                arbeidstakeren har rett til å bruke.
              </BodyLong>
              <BodyLong>
                Hvis den ansatte har vært i jobb i mindre enn 4 uker, kan den
                ansatte søke om utbetaling direkte fra Nav. Den ansatte må søke
                om omsorgspenger før dere kan sende inn inntektsmelding. Varsel
                med oppgave blir tilgjengelig i{" "}
                <Link href="/saksoversikt">saksoversikten</Link> når den ansatte
                har sendt inn søknad til oss.
              </BodyLong>
            </Alert>
          )}
          <RadioGroup
            error={formState.errors.årForRefusjon?.message}
            legend="Hvilket år søker dere refusjon for?"
            name={årForRefusjonName}
          >
            <Radio value={String(iFjor)} {...årForRefusjonRadioGroupProps}>
              {iFjor}
            </Radio>
            <Radio value={String(iÅr)} {...årForRefusjonRadioGroupProps}>
              {iÅr}
            </Radio>
          </RadioGroup>

          <div>
            <Button
              disabled={harUtbetaltLønn === "nei"}
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
