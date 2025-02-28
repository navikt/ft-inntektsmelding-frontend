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
            Her kan du søke om refusjon for en ansatt som har vært hjemme med
            sykt barn.
          </BodyLong>
          <BodyLong>
            {`Du kan søke for perioder inntil tre måneder tilbake i tid. Du kan
            kun søke om utbetaling innenfor ett kalenderår av gangen. Det betyr
            at hvis du skal søke om refusjon for perioder i både ${iFjor} og
            ${iÅr}, må du sende to separate søknader.`}
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
                Arbeidsgivers plikt til å utbetale omsorgsdager
              </Heading>
              <BodyLong spacing>
                Hvis den ansatte har jobbet hos dere i minst fire uker, plikter
                dere å utbetale lønn for alle omsorgsdagene som den ansatte har
                rett til å bruke.
              </BodyLong>
              <BodyLong>
                Hvis dere ikke har utbetalt lønn under fraværet, kan den ansatte
                selv søke om utbetaling av omsorgspenger. Når vi får søknad fra
                den ansatte, ber vi dere om en inntektsmelding som en oppgave i{" "}
                <Link href="/saksoversikt">saksoversikten</Link>.
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
