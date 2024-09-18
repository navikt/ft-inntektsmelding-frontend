import { ArrowLeftIcon, ArrowRightIcon } from "@navikt/aksel-icons";
import {
  Alert,
  BodyLong,
  BodyShort,
  Button,
  Heading,
  Label,
  TextField,
} from "@navikt/ds-react";
import { Link } from "@tanstack/react-router";

import { Informasjonsseksjon } from "~/features/Informasjonsseksjon";
import { RotLayout } from "~/features/rot-layout/RotLayout";

import { Fremgangsindikator } from "./Fremgangsindikator";

export const RefusjonOmsorgspengerArbeidsgiverSteg2 = () => {
  return (
    <RotLayout medHvitBoks={true} tittel="Søknad om refusjon for omsorgspenger">
      <Heading level="1" size="large">
        Den ansatte og arbeidsgiver
      </Heading>
      <Fremgangsindikator aktivtSteg={2} />
      <Informasjonsseksjon tittel="Den ansatte">
        <div className="flex gap-4">
          <TextField
            className="flex-1"
            label="Ansattes fødselsnummer (11 siffer)"
          />
          <div className="flex-1">
            <Label>Navn</Label>
            <BodyShort>Navnerud Orama</BodyShort>
          </div>
        </div>
      </Informasjonsseksjon>
      <Informasjonsseksjon kilde="Fra Altinn" tittel="Arbeidsgiver">
        {/* TODO: Legg til støtte for flere arbeidsforhold */}
        <div className="flex gap-4">
          <div className="flex-1">
            <Label>Virksomhetsnavn</Label>
            <BodyShort>Proff Arbeidsgiver AS</BodyShort>
          </div>
          <div className="flex-1">
            <Label>Org.nr. for underenhet</Label>
            <BodyShort>123456789</BodyShort>
          </div>
        </div>
      </Informasjonsseksjon>
      <Informasjonsseksjon kilde="Fra Altinn" tittel="Kontaktinformasjon">
        <div className="flex gap-4 flex-wrap">
          <TextField className="flex-1" label="Navn" />
          <TextField className="flex-1" label="Telefonnummer" type="tel" />
        </div>
        <Alert variant="info">
          <Heading level="3" size="small">
            Stemmer opplysningene?
          </Heading>
          <BodyLong>
            Har vi spørsmål til refusjonskravet er det viktig at vi når rett
            person, bruk derfor direktenummer fremfor sentralbordnummer. Endre
            til annen kontaktperson dersom du vet du vil være utilgjengelig
            fremover.
          </BodyLong>
        </Alert>
      </Informasjonsseksjon>
      <div className="flex gap-4">
        <Button
          as={Link}
          icon={<ArrowLeftIcon />}
          to="../1-intro"
          variant="secondary"
        >
          Forrige steg
        </Button>
        <Button
          as={Link}
          icon={<ArrowRightIcon />}
          iconPosition="right"
          to="../3-omsorgsdager"
          variant="primary"
        >
          Neste steg
        </Button>
      </div>
    </RotLayout>
  );
};
