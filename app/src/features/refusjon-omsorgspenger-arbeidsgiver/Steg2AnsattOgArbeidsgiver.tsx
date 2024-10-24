import { ArrowLeftIcon, ArrowRightIcon } from "@navikt/aksel-icons";
import {
  Alert,
  BodyLong,
  BodyShort,
  Button,
  Heading,
  Label,
  Loader,
  Select,
  TextField,
} from "@navikt/ds-react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";

import { Informasjonsseksjon } from "~/features/Informasjonsseksjon";
import { RotLayout } from "~/features/rot-layout/RotLayout";
import { formatNavn } from "~/utils";

import { useDocumentTitle } from "../useDocumentTitle";
import { slåOppPersondataOptions } from "./api/queries";
import { OmsorgspengerFremgangsindikator } from "./OmsorgspengerFremgangsindikator.tsx";
import { useRefusjonOmsorgspengerArbeidsgiverFormContext } from "./RefusjonOmsorgspengerArbeidsgiverForm";

export const RefusjonOmsorgspengerArbeidsgiverSteg2 = () => {
  useDocumentTitle(
    "Ansatt og arbeidsgiver – søknad om refusjon av omsorgspenger for arbeidsgiver",
  );
  const navigate = useNavigate();
  const { register, formState, watch, handleSubmit } =
    useRefusjonOmsorgspengerArbeidsgiverFormContext();
  const fødselsnummer = watch("ansattesFødselsnummer");
  const { data, error, isLoading } = useQuery(
    slåOppPersondataOptions(fødselsnummer ?? ""),
  );

  const fantIngenPersoner =
    error && "feilkode" in error && error.feilkode === "fant ingen personer";
  const harFlereEnnEttArbeidsforhold =
    data?.arbeidsforhold && data.arbeidsforhold.length > 1;
  const harEttArbeidsforhold =
    data?.arbeidsforhold && data.arbeidsforhold.length === 1;

  const onSubmit = handleSubmit(() => {
    navigate({
      from: "/refusjon-omsorgspenger-arbeidsgiver/2-ansatt-og-arbeidsgiver",
      to: "../3-omsorgsdager",
    });
  });

  return (
    <RotLayout medHvitBoks={true} tittel="Søknad om refusjon for omsorgspenger">
      <Heading level="1" size="large">
        Den ansatte og arbeidsgiver
      </Heading>
      <OmsorgspengerFremgangsindikator aktivtSteg={2} />
      <form className="space-y-4" onSubmit={onSubmit}>
        <Informasjonsseksjon tittel="Den ansatte">
          <div className="flex gap-4 flex-col md:flex-row">
            <TextField
              className="flex-1"
              label="Ansattes fødselsnummer (11 siffer)"
              {...register("ansattesFødselsnummer", {
                required: "Du må fylle ut fødselsnummeret til den ansatte",
              })}
              error={formState.errors.ansattesFødselsnummer?.message}
            />
            <div className="flex-1">
              <Label>Navn</Label>
              {isLoading ? (
                <Loader className="block mt-5" title="Henter informasjon" />
              ) : fantIngenPersoner ? (
                <BodyShort>
                  Fant ingen personer som du har tilgang til å se
                  arbeidsforholdet til. Dobbeltsjekk fødselsnummer og prøv
                  igjen.
                </BodyShort>
              ) : error ? (
                <BodyShort>Kunne ikke hente data</BodyShort>
              ) : (
                <BodyShort>{formatNavn(data?.navn)}</BodyShort>
              )}
            </div>
          </div>
        </Informasjonsseksjon>
        {data && (
          <Informasjonsseksjon kilde="Fra Altinn" tittel="Arbeidsgiver">
            {harFlereEnnEttArbeidsforhold ? (
              <Select
                label="Velg arbeidsforhold"
                {...register("valgtArbeidsforhold", {
                  required: "Du må velge et arbeidsforhold",
                })}
                error={formState.errors.valgtArbeidsforhold?.message}
              >
                {data.arbeidsforhold.map((arbeidsforhold) => (
                  <option
                    key={arbeidsforhold.underenhetId}
                    value={arbeidsforhold.underenhetId}
                  >
                    {arbeidsforhold.navn} ({arbeidsforhold.underenhetId})
                  </option>
                ))}
              </Select>
            ) : harEttArbeidsforhold ? (
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label>Virksomhetsnavn</Label>
                  <BodyShort>{data.arbeidsforhold[0].navn}</BodyShort>
                </div>
                <div className="flex-1">
                  <Label>Org.nr. for underenhet</Label>
                  <BodyShort>{data.arbeidsforhold[0].underenhetId}</BodyShort>
                </div>
              </div>
            ) : (
              <Alert variant="warning">
                <BodyLong>
                  Kunne ikke finne noen arbeidsforhold for {data.navn}. Vent
                  litt, og prøv igjen.
                </BodyLong>
              </Alert>
            )}
          </Informasjonsseksjon>
        )}
        <Informasjonsseksjon
          kilde="Fra Altinn og Folkeregisteret"
          tittel="Kontaktinformasjon"
        >
          <div className="flex gap-4 flex-col md:flex-row">
            <div className="flex-1">
              <TextField
                // TODO: Legg til default navn
                label="Navn"
                {...register("kontaktperson.navn", {
                  required: "Du må fylle ut navnet til kontaktpersonen",
                  maxLength: {
                    value: 100,
                    message: "Navn kan ikke være lenger enn 100 tegn",
                  },
                })}
                error={formState.errors.kontaktperson?.navn?.message}
              />
            </div>
            <div className="flex-1">
              <TextField
                label="Telefonnummer"
                type="tel"
                {...register("kontaktperson.telefonnummer", {
                  required:
                    "Du må fylle ut telefonnummeret til kontaktpersonen",
                })}
                error={formState.errors.kontaktperson?.telefonnummer?.message}
              />
            </div>
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
            icon={<ArrowRightIcon />}
            iconPosition="right"
            type="submit"
            variant="primary"
          >
            Neste steg
          </Button>
        </div>
      </form>
    </RotLayout>
  );
};
