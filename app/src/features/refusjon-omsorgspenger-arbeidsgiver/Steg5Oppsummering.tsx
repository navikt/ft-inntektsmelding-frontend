import { AirplaneIcon, ArrowLeftIcon } from "@navikt/aksel-icons";
import { Button, Heading, List, VStack } from "@navikt/ds-react";
import {
  FormSummary,
  FormSummaryAnswer,
  FormSummaryAnswers,
  FormSummaryEditLink,
  FormSummaryHeader,
  FormSummaryHeading,
  FormSummaryLabel,
  FormSummaryValue,
} from "@navikt/ds-react/FormSummary";
import { ListItem } from "@navikt/ds-react/List";
import { Link, useNavigate } from "@tanstack/react-router";

import { RotLayout } from "~/features/rot-layout/RotLayout";

import { Fremgangsindikator } from "./Fremgangsindikator";
import { IndreLayout } from "./IndreLayout";

export const RefusjonOmsorgspengerArbeidsgiverSteg5 = () => {
  const navigate = useNavigate();
  return (
    <RotLayout tittel="Søknad om refusjon for omsorgspenger">
      <IndreLayout>
        <Heading level="1" size="large">
          Oppsummering
        </Heading>
        <Fremgangsindikator aktivtSteg={5} />
        <VStack gap="4">
          <OppsummeringRefusjon />
          <OppsummeringArbeidsgiverOgAnsatt />
          <OppsummeringOmsorgsdager />
          <OppsummeringMånedslønn />
        </VStack>
        <div className="flex gap-4">
          <Button
            as={Link}
            href="../4"
            icon={<ArrowLeftIcon />}
            variant="secondary"
          >
            Forrige steg
          </Button>
          <Button
            icon={<AirplaneIcon />}
            onClick={() => {
              alert("Søknad ikke egentlig sendt inn, men vi kan late som");
              navigate({
                to: "/refusjon-omsorgspenger-arbeidsgiver/6-kvittering",
              });
            }}
            variant="primary"
          >
            Send inn
          </Button>
        </div>
      </IndreLayout>
    </RotLayout>
  );
};

const OppsummeringRefusjon = () => {
  return (
    <FormSummary>
      <FormSummaryHeader>
        <FormSummaryHeading level="3">Refusjon</FormSummaryHeading>
        <FormSummaryEditLink as={Link} to="../1" />
      </FormSummaryHeader>
      <FormSummaryAnswers>
        <FormSummaryAnswer>
          <FormSummaryLabel>
            Utbetaler dere lønn under fraværet, og krever refusjon?
          </FormSummaryLabel>
          <FormSummaryValue>Ja</FormSummaryValue>
        </FormSummaryAnswer>
        <FormSummaryAnswer>
          <FormSummaryLabel>
            Hvilket år søker dere refusjon for?
          </FormSummaryLabel>
          <FormSummaryValue>2024</FormSummaryValue>
        </FormSummaryAnswer>
      </FormSummaryAnswers>
    </FormSummary>
  );
};

const OppsummeringArbeidsgiverOgAnsatt = () => {
  return (
    <FormSummary>
      <FormSummaryHeader>
        <FormSummaryHeading level="3">
          Arbeidsgiver og den ansatte
        </FormSummaryHeading>
        <FormSummaryEditLink as={Link} to="../2" />
      </FormSummaryHeader>
      <FormSummaryAnswers>
        <FormSummaryAnswer>
          <FormSummaryLabel>Arbeidsgiver</FormSummaryLabel>
          <FormSummaryValue>
            <FormSummaryAnswers>
              <FormSummaryAnswer>
                <FormSummaryLabel>Virksomhetsnavn</FormSummaryLabel>
                <FormSummaryValue>Place Holder AS</FormSummaryValue>
              </FormSummaryAnswer>
              <FormSummaryAnswer>
                <FormSummaryLabel>Org. nr. for underenhet</FormSummaryLabel>
                <FormSummaryValue>123456789</FormSummaryValue>
              </FormSummaryAnswer>
            </FormSummaryAnswers>
          </FormSummaryValue>
        </FormSummaryAnswer>
        <FormSummaryAnswer>
          <FormSummaryLabel>Kontaktperson og innsender</FormSummaryLabel>
          <FormSummaryValue>Kontakt Personesen, 92929292</FormSummaryValue>
        </FormSummaryAnswer>
        <FormSummaryAnswer>
          <FormSummaryLabel>Den ansatte</FormSummaryLabel>
          <FormSummaryValue>Ansatt Personesen, 1234567890</FormSummaryValue>
        </FormSummaryAnswer>
      </FormSummaryAnswers>
    </FormSummary>
  );
};

const OppsummeringOmsorgsdager = () => {
  return (
    <FormSummary>
      <FormSummaryHeader>
        <FormSummaryHeading level="3">
          Omsorgsdager dere søker utbetaling for
        </FormSummaryHeading>
        <FormSummaryEditLink as={Link} to="../3" />
      </FormSummaryHeader>
      <FormSummaryAnswers>
        <FormSummaryAnswer>
          <FormSummaryLabel>
            Har dere dekket de 10 første omsorgsdagene i år?
          </FormSummaryLabel>
          <FormSummaryValue>Ja</FormSummaryValue>
        </FormSummaryAnswer>
        <FormSummaryAnswer>
          <FormSummaryLabel>Dager med fravær hele dagen</FormSummaryLabel>
          <FormSummaryValue>
            <List>
              <ListItem>30.06.2024-31.07.2024</ListItem>
              <ListItem>30.09.2024-31.10.2024</ListItem>
            </List>
          </FormSummaryValue>
        </FormSummaryAnswer>
        <FormSummaryAnswer>
          <FormSummaryLabel>
            Dager med fravær bare deler av dagen
          </FormSummaryLabel>
          <FormSummaryValue>
            <List>
              <ListItem>30.02.2024, 1 time</ListItem>
              <ListItem>02.04.2024, 2 timer</ListItem>
              <ListItem>18.05.2024, 3.5 timer</ListItem>
              <ListItem>27.06.2024, 3 timer</ListItem>
            </List>
          </FormSummaryValue>
        </FormSummaryAnswer>
      </FormSummaryAnswers>
    </FormSummary>
  );
};

export const OppsummeringMånedslønn = () => {
  return (
    <FormSummary>
      <FormSummaryHeader>
        <FormSummaryHeading level="3">
          Beregnet månedslønn og refusjonskrav
        </FormSummaryHeading>
        <FormSummaryEditLink as={Link} to="../4" />
      </FormSummaryHeader>
      <FormSummaryAnswers>
        <FormSummaryAnswer>
          <FormSummaryLabel>
            Beregnet månedslønn og refusjonskrav
          </FormSummaryLabel>
          <FormSummaryValue>20 066 kr</FormSummaryValue>
        </FormSummaryAnswer>
      </FormSummaryAnswers>
    </FormSummary>
  );
};
