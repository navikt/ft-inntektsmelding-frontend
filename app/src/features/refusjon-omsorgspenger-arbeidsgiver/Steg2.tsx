import {
  Alert,
  BodyLong,
  BodyShort,
  Heading,
  Label,
  TextField,
} from "@navikt/ds-react";

import { RotLayout } from "~/features/rot-layout/RotLayout";

import { Informasjonsseksjon } from "../Informasjonsseksjon";
import { Fremgangsindikator } from "./Fremgangsindikator";
import { Stegnavigasjon } from "./Stegnavigasjon";

export const RefusjonOmsorgspengerArbeidsgiverSteg2 = () => {
  return (
    <RotLayout tittel="Søknad om refusjon for omsorgspenger">
      <div>
        <Heading level="1" size="large">
          Den ansatte og arbeidsgiver
        </Heading>
        <Fremgangsindikator aktivtSteg={2} />
        <Informasjonsseksjon tittel="Den ansatte">
          <div className="flex flex-col gap-2">
            <TextField label="Ansattes fødselsnummer (11 siffer)" />
            <div>
              <Label>Navn</Label>
              <BodyShort>Navnerud Orama</BodyShort>
            </div>
          </div>
        </Informasjonsseksjon>
        <Informasjonsseksjon tittel="Arbeidsgiver">
          {/* TODO: Legg til støtte for flere arbeidsforhold */}
          <div className="flex flex-col gap-2">
            <div>
              <Label>Virksomhetsnavn</Label>
              <BodyShort>Proff Arbeidsgiver AS</BodyShort>
            </div>
            <div>
              <Label>Org.nr. for underenhet</Label>
              <BodyShort>123456789</BodyShort>
            </div>
          </div>
        </Informasjonsseksjon>
        <Informasjonsseksjon tittel="Kontaktinformasjon">
          <div className="flex flex-col gap-2">
            <TextField label="Navn" />
            <TextField label="Telefonnummer" type="tel" />
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
        <Stegnavigasjon forrige="../1" neste="../3" />
      </div>
    </RotLayout>
  );
};
