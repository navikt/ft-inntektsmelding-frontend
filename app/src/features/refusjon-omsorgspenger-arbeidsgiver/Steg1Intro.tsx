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
import { Link as RouterLink } from "@tanstack/react-router";
import { useState } from "react";

import { RotLayout } from "~/features/rot-layout/RotLayout";

import { useDocumentTitle } from "../useDocumentTitle";
import { Fremgangsindikator } from "./Fremgangsindikator";

export const RefusjonOmsorgspengerArbeidsgiverSteg1 = () => {
  useDocumentTitle("Søknad om refusjon av omsorgspenger for arbeidsgiver");
  const [harUtbetaltLønn, setHarUtbetaltLønn] = useState("");
  const iÅr = new Date().getFullYear();
  const iFjor = iÅr - 1;
  return (
    <RotLayout medHvitBoks={true} tittel="Søknad om refusjon for omsorgspenger">
      <Heading level="1" size="large">
        Refusjon
      </Heading>
      <Fremgangsindikator aktivtSteg={1} />
      <GuidePanel>
        <VStack gap="4">
          <Heading level="2" size="medium">
            Hei [navn]!
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
      <RadioGroup
        legend="Har dere utbetalt lønn under fraværet, og krever refusjon?"
        name="harUtbetaltLønn"
        onChange={setHarUtbetaltLønn}
        value={harUtbetaltLønn}
      >
        <Radio value="ja">Ja</Radio>
        <Radio value="nei">Nei</Radio>
      </RadioGroup>
      {harUtbetaltLønn === "nei" && (
        <Alert variant="warning">
          <Heading level="3" size="small" spacing>
            Arbeidsgivers plikt til å betale omsorgsdager
          </Heading>
          <BodyLong spacing>
            Hvis arbeidstakeren har jobbet hos dere i 4 uker eller mer, plikter
            dere å utbetale lønn for alle omsorgsdagene som arbeidstakeren har
            rett til å bruke.
          </BodyLong>
          <BodyLong>
            Hvis den ansatte har vært i jobb i mindre enn 4 uker, kan den
            ansatte søke om utbetaling direkte fra NAV. Den ansatte må søke om
            omsorgspenger før dere kan sende inn inntektsmelding. Varsel med
            oppgave blir tilgjengelig i{" "}
            <Link href="/saksoversikt">saksoversikten</Link> når den ansatte har
            sendt inn søknad til oss.
          </BodyLong>
        </Alert>
      )}
      <RadioGroup
        legend="Hvilket år søker dere refusjon for?"
        name="årForRefusjon"
      >
        <Radio value={iFjor}>{iFjor}</Radio>
        <Radio value={iÅr}>{iÅr}</Radio>
      </RadioGroup>

      <div>
        <Button
          as={RouterLink}
          disabled={harUtbetaltLønn === "nei"}
          icon={<ArrowRightIcon />}
          iconPosition="right"
          to="../2-ansatt-og-arbeidsgiver"
          variant="primary"
        >
          Neste steg
        </Button>
      </div>
    </RotLayout>
  );
};
