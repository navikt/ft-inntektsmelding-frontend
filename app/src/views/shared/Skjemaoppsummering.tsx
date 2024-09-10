import { FormSummary, VStack } from "@navikt/ds-react";
import { Link } from "@tanstack/react-router";

import { OpplysningerDto } from "~/api/queries";
import { InntektsmeldingSkjemaStateValid } from "~/features/InntektsmeldingSkjemaState";
import { ÅrsaksType } from "~/types/api-models";
import {
  formatDatoKort,
  formatDatoLang,
  formatFødselsnummer,
  formatKroner,
  formatYtelsesnavn,
  slåSammenTilFulltNavn,
} from "~/utils";

type SkjemaoppsummeringProps = {
  opplysninger: OpplysningerDto;
  skjemaState: InntektsmeldingSkjemaStateValid;
};
export const Skjemaoppsummering = ({
  opplysninger,
  skjemaState,
}: SkjemaoppsummeringProps) => {
  // TODO: bør vi ha en deepEquals mellom current og forrige, og ikke tillate submit dersom ikke faktisk har gjort en endring.

  return (
    <VStack gap="4">
      <FormSummary>
        <FormSummary.Header>
          <FormSummary.Heading level="3">
            Arbeidsgiver og den ansatte
          </FormSummary.Heading>
          <FormSummary.EditLink as={Link} to="../dine-opplysninger" />
        </FormSummary.Header>
        <FormSummary.Answers>
          <FormSummary.Answer>
            <FormSummary.Label>Arbeidsgiver</FormSummary.Label>
            <FormSummary.Value>
              <FormSummary.Answers>
                <FormSummary.Answer>
                  <FormSummary.Label>Virksomhetsnavn</FormSummary.Label>
                  <FormSummary.Value>
                    {opplysninger.arbeidsgiver.organisasjonNavn}
                  </FormSummary.Value>
                </FormSummary.Answer>
                <FormSummary.Answer>
                  <FormSummary.Label>Org. nr. for underenhet</FormSummary.Label>
                  <FormSummary.Value>
                    {opplysninger.arbeidsgiver.organisasjonNummer}
                  </FormSummary.Value>
                </FormSummary.Answer>
              </FormSummary.Answers>
            </FormSummary.Value>
          </FormSummary.Answer>
          <FormSummary.Answer>
            <FormSummary.Label>Kontaktperson og innsender</FormSummary.Label>
            <FormSummary.Value>
              {formatterKontaktperson(skjemaState.kontaktperson)}
            </FormSummary.Value>
          </FormSummary.Answer>
          <FormSummary.Answer>
            <FormSummary.Label>Den ansatte</FormSummary.Label>
            <FormSummary.Value>
              {slåSammenTilFulltNavn(opplysninger.person)}
              {", "}({formatFødselsnummer(opplysninger.person.fødselsnummer)})
            </FormSummary.Value>
          </FormSummary.Answer>
        </FormSummary.Answers>
      </FormSummary>

      <FormSummary>
        <FormSummary.Header>
          <FormSummary.Heading level="3">
            Første dag med {formatYtelsesnavn(opplysninger.ytelse)}
          </FormSummary.Heading>
        </FormSummary.Header>
        <FormSummary.Answers>
          <FormSummary.Answer>
            <FormSummary.Label>Fra og med</FormSummary.Label>
            <FormSummary.Value>
              {formatDatoLang(new Date(opplysninger.startdatoPermisjon))}
            </FormSummary.Value>
          </FormSummary.Answer>
        </FormSummary.Answers>
      </FormSummary>

      <FormSummary>
        <FormSummary.Header>
          <FormSummary.Heading level="3">Månedslønn</FormSummary.Heading>
          <FormSummary.EditLink
            as={Link}
            to="../inntekt-og-refusjon#beregnet-manedslonn"
          />
        </FormSummary.Header>
        <FormSummary.Answers>
          <FormSummary.Answer>
            <FormSummary.Label>
              Beregnet månedslønn basert på de tre siste, fulle månedene før{" "}
              {formatYtelsesnavn(opplysninger.ytelse)}
            </FormSummary.Label>
            <FormSummary.Value>
              {formatKroner(skjemaState.inntekt)}
            </FormSummary.Value>
          </FormSummary.Answer>
          {skjemaState.inntektEndringsÅrsak && (
            <>
              <FormSummary.Answer>
                <FormSummary.Label>Korrigert månedslønn</FormSummary.Label>
                <FormSummary.Value>
                  {formatKroner(
                    skjemaState.inntektEndringsÅrsak.korrigertInntekt,
                  )}
                </FormSummary.Value>
              </FormSummary.Answer>
              <FormSummary.Answer>
                <FormSummary.Label>Korrigert grunnet</FormSummary.Label>
                <FormSummary.Value>
                  {formatInntektsendrignsGrunn(
                    skjemaState.inntektEndringsÅrsak.årsak,
                  )}
                </FormSummary.Value>
              </FormSummary.Answer>
              {skjemaState.inntektEndringsÅrsak.fom && (
                <FormSummary.Answer>
                  <FormSummary.Label>Fra og med</FormSummary.Label>
                  <FormSummary.Value>
                    {formatDatoLang(
                      new Date(skjemaState.inntektEndringsÅrsak.fom),
                    )}
                  </FormSummary.Value>
                </FormSummary.Answer>
              )}
              {skjemaState.inntektEndringsÅrsak.tom && (
                <FormSummary.Answer>
                  <FormSummary.Label>Til og med</FormSummary.Label>
                  <FormSummary.Value>
                    {formatDatoLang(
                      new Date(skjemaState.inntektEndringsÅrsak.tom),
                    )}
                  </FormSummary.Value>
                </FormSummary.Answer>
              )}
            </>
          )}
        </FormSummary.Answers>
      </FormSummary>

      <FormSummary>
        <FormSummary.Header>
          <FormSummary.Heading level="3">Refusjon</FormSummary.Heading>
          <FormSummary.EditLink
            as={Link}
            to="../inntekt-og-refusjon#refusjon"
          />
        </FormSummary.Header>
        <FormSummary.Answers>
          <FormSummary.Answer>
            <FormSummary.Label>
              Skal dere betale lønn til {opplysninger.person.fornavn} og ha
              refusjon fra NAV?
            </FormSummary.Label>
            <FormSummary.Value>
              {skjemaState.skalRefunderes ? "Ja" : "Nei"}
            </FormSummary.Value>
          </FormSummary.Answer>
          {skjemaState.skalRefunderes && (
            <FormSummary.Answer>
              <FormSummary.Label>Refusjonsbeløp per måned</FormSummary.Label>
              <FormSummary.Value>
                {formatKroner(skjemaState.refusjonsbeløpPerMåned)}
              </FormSummary.Value>
            </FormSummary.Answer>
          )}
          <FormSummary.Answer>
            <FormSummary.Label>
              Vil det være endringer i refusjon i løpet av perioden{" "}
              {opplysninger.person.fornavn} er i permisjon?
            </FormSummary.Label>
            <FormSummary.Value>
              {skjemaState.endringIRefusjon ? "Ja" : "Nei"}
            </FormSummary.Value>
          </FormSummary.Answer>
          {skjemaState.endringIRefusjon && (
            <FormSummary.Answer>
              <FormSummary.Label>Endringer i refusjon</FormSummary.Label>
              <FormSummary.Value>
                <FormSummary.Answers>
                  {skjemaState.refusjonsendringer.map((endring) => (
                    <FormSummary.Answer
                      key={endring.fom.toString() + endring.beløp}
                    >
                      <FormSummary.Label>
                        Refusjonsbeløp per måned
                      </FormSummary.Label>
                      <FormSummary.Value>
                        {formatKroner(endring.beløp)} (fra og med{" "}
                        {formatDatoLang(new Date(endring.fom))})
                      </FormSummary.Value>
                    </FormSummary.Answer>
                  ))}
                </FormSummary.Answers>
              </FormSummary.Value>
            </FormSummary.Answer>
          )}
        </FormSummary.Answers>
      </FormSummary>

      <FormSummary>
        <FormSummary.Header>
          <FormSummary.Heading level="3">Naturalytelser</FormSummary.Heading>
          <FormSummary.EditLink
            as={Link}
            to="../inntekt-og-refusjon#naturalytelser"
          />
        </FormSummary.Header>
        <FormSummary.Answers>
          <FormSummary.Answer>
            <FormSummary.Label>
              Har {opplysninger.person.fornavn} naturalytelser som faller bort
              ved fraværet?
            </FormSummary.Label>
            <FormSummary.Value>
              {skjemaState.misterNaturalytelser ? "Ja" : "Nei"}
            </FormSummary.Value>
          </FormSummary.Answer>
          {skjemaState.misterNaturalytelser && (
            <FormSummary.Answer>
              <FormSummary.Label>
                Naturalytelser som faller bort
              </FormSummary.Label>
              <FormSummary.Value>
                <FormSummary.Answers>
                  {skjemaState.naturalytelserSomMistes.map((naturalytelse) => {
                    return (
                      <FormSummary.Answer key={naturalytelse.navn}>
                        <FormSummary.Label>
                          {formatYtelsesnavn(naturalytelse.navn, true)}
                        </FormSummary.Label>
                        <FormSummary.Value>
                          {`Verdi ${formatKroner(naturalytelse.beløp)} (${formaterPeriodeStreng(naturalytelse)}) `}
                        </FormSummary.Value>
                      </FormSummary.Answer>
                    );
                  })}
                </FormSummary.Answers>
              </FormSummary.Value>
            </FormSummary.Answer>
          )}
        </FormSummary.Answers>
      </FormSummary>
    </VStack>
  );
};

/**
 * Gir en streng på formatet "fra og med DATO, til og med DATO" hvis begge datoene er satt. Ellers kun den ene.
 */
function formaterPeriodeStreng({ fom, tom }: { fom?: Date; tom?: Date }) {
  const fomStreng = fom ? `fra og med ${formatDatoKort(new Date(fom))}` : "";
  const tomStreng = tom ? `til og med ${formatDatoKort(new Date(tom))}` : "";

  return [fomStreng, tomStreng].filter(Boolean).join(", ");
}

const formatterKontaktperson = (
  kontaktperson: InntektsmeldingSkjemaStateValid["kontaktperson"],
) => {
  if (!kontaktperson) {
    return "";
  }
  return `${kontaktperson.navn}, ${kontaktperson.telefonnummer}`;
};

const formatInntektsendrignsGrunn = (årsak: ÅrsaksType) => {
  switch (årsak) {
    case "Tariffendring": {
      return "Tariffendring";
    }
    case "FeilInntekt": {
      return "Varig feil inntekt";
    }
    default: {
      return årsak;
    }
  }
};
