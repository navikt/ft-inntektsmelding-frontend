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
import { idnr } from "@navikt/fnrvalidator";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { Informasjonsseksjon } from "~/features/Informasjonsseksjon";
import { lagFulltNavn } from "~/utils.ts";

import { useDocumentTitle } from "../useDocumentTitle";
import { hentArbeidstakerOptions } from "./api/queries";
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
    hentArbeidstakerOptions(fødselsnummer ?? ""),
  );

  const fantIngenPersoner =
    error && "feilkode" in error && error.feilkode === "fant ingen personer";
  const harFlereEnnEttArbeidsforhold =
    data?.arbeidsforhold && data.arbeidsforhold.length > 1;
  const harEttArbeidsforhold =
    data?.arbeidsforhold && data.arbeidsforhold.length === 1;

  const onSubmit = handleSubmit(() => {
    navigate({
      from: "/refusjon-omsorgspenger/$organisasjonsnummer/2-ansatt-og-arbeidsgiver",
      to: "../3-omsorgsdager",
    });
  });

  const fulltNavn = data ? lagFulltNavn(data.personinformasjon) : "";

  return (
    <div>
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
                validate: (value) =>
                  (value && idnr(value).status === "valid") ||
                  "Du må fylle ut et gyldig fødselsnummer",
              })}
              error={formState.errors.ansattesFødselsnummer?.message}
            />
            <div className="flex-1 flex flex-col">
              <Label>Navn</Label>
              {isLoading ? (
                <Loader className="block mt-5" title="Henter informasjon" />
              ) : fantIngenPersoner ? (
                <BodyShort className="flex-1 flex flex-col justify-center">
                  Fant ingen personer som du har tilgang til å se
                  arbeidsforholdet til. Dobbeltsjekk fødselsnummer og prøv
                  igjen.
                </BodyShort>
              ) : error ? (
                <BodyShort className="flex-1 flex flex-col justify-center">
                  Kunne ikke hente data
                </BodyShort>
              ) : data ? (
                <BodyShort className="flex-1 flex flex-col justify-center">
                  {fulltNavn}
                  <input
                    type="hidden"
                    {...register("ansattesFornavn", {
                      value: data.personinformasjon.fornavn,
                    })}
                  />
                  <input
                    type="hidden"
                    {...register("ansattesEtternavn", {
                      value: data.personinformasjon.etternavn,
                    })}
                  />
                  <input
                    type="hidden"
                    {...register("ansattesAktørId", {
                      value: data.personinformasjon.aktørId,
                    })}
                  />
                </BodyShort>
              ) : null}
            </div>
          </div>
        </Informasjonsseksjon>
        {data && (
          <Informasjonsseksjon kilde="Fra Altinn" tittel="Arbeidsgiver">
            {harFlereEnnEttArbeidsforhold ? (
              <>
                <Select
                  label="Velg arbeidsforhold"
                  {...register("valgtArbeidsforhold", {
                    required: "Du må velge et arbeidsforhold",
                  })}
                  error={formState.errors.valgtArbeidsforhold?.message}
                >
                  {data.arbeidsforhold.map((arbeidsforhold) => (
                    <option
                      key={arbeidsforhold.arbeidsforholdId}
                      value={arbeidsforhold.arbeidsforholdId}
                    >
                      {arbeidsforhold.organisasjonsnummer} (
                      {arbeidsforhold.arbeidsforholdId})
                    </option>
                  ))}
                </Select>
                <input
                  type="hidden"
                  {...register("organisasjonsnummer", {
                    value: data.arbeidsforhold[0].organisasjonsnummer,
                  })}
                />
              </>
            ) : harEttArbeidsforhold ? (
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label>Virksomhetsnavn</Label>
                  <BodyShort>
                    {/* TODO: Hente ut navn på ansettelsesforhold */}
                    {data.arbeidsforhold[0].organisasjonsnummer}
                  </BodyShort>
                  <input
                    type="hidden"
                    {...register("organisasjonsnummer", {
                      value: data.arbeidsforhold[0].organisasjonsnummer,
                    })}
                  />
                </div>
                <div className="flex-1">
                  <Label>Org.nr. for underenhet</Label>
                  <BodyShort>
                    {data.arbeidsforhold[0].organisasjonsnummer}
                  </BodyShort>
                </div>
              </div>
            ) : (
              <Alert variant="warning">
                <BodyLong>
                  Kunne ikke finne noen arbeidsforhold for {fulltNavn}. Vent
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
                  validate: (data) =>
                    /^(\d{8}|\+\d+)$/.test(data) ||
                    "Telefonnummer må være 8 siffer eller ha landskode",
                })}
                error={formState.errors.kontaktperson?.telefonnummer?.message}
              />
            </div>
          </div>
          <Alert variant="info">
            <Heading level="3" size="xsmall" spacing>
              Er kontaktinformasjonen riktig?
            </Heading>
            <BodyLong>
              Hvis vi har spørsmål om inntektsmeldingen, er det viktig at vi får
              kontakt med deg. Bruk derfor direktenummeret ditt i stedet for
              nummeret til sentralbordet. Hvis du vet at du vil være
              utilgjengelig fremover, kan du endre til en annen kontaktperson.
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
    </div>
  );
};
