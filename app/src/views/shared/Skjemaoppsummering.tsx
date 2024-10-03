import { FormSummary, List, VStack } from "@navikt/ds-react";
import { Link } from "@tanstack/react-router";

import { InntektsmeldingSkjemaStateValid } from "~/features/InntektsmeldingSkjemaState";
import { endringsårsak } from "~/features/skjema-moduler/Inntekt.tsx";
import { REFUSJON_RADIO_VALG } from "~/features/skjema-moduler/UtbetalingOgRefusjon.tsx";
import type { OpplysningerDto } from "~/types/api-models.ts";
import {
  capitalize,
  formatDatoKort,
  formatDatoLang,
  formatFødselsnummer,
  formatKroner,
  formatYtelsesnavn,
  gjennomsnittInntekt,
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

      <InntektSummary opplysninger={opplysninger} skjemaState={skjemaState} />
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
              Betaler dere lønn under fraværet og krever refusjon?
            </FormSummary.Label>
            <FormSummary.Value>
              {REFUSJON_RADIO_VALG[skjemaState.skalRefunderes]}
            </FormSummary.Value>
          </FormSummary.Answer>
          {skjemaState.skalRefunderes === "JA_LIK_REFUSJON" && (
            <FormSummary.Answer>
              <FormSummary.Label>Refusjonsbeløp per måned</FormSummary.Label>
              <FormSummary.Value>
                {formatKroner(skjemaState.refusjonsbeløpPerMåned)}
              </FormSummary.Value>
            </FormSummary.Answer>
          )}
          {skjemaState.skalRefunderes === "JA_VARIERENDE_REFUSJON" && (
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
                      <FormSummary.Answer
                        key={`${naturalytelse.navn}-${naturalytelse.fom}`}
                      >
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

function InntektSummary({
  skjemaState,
  opplysninger,
}: SkjemaoppsummeringProps) {
  // Hvis oppsummeringen vises etter utfylt skjema (url: .../oppsummering) så er "korrigertInntekt" populert og vi bruker den som lønn.
  // Hvis den brukes til å vise eksisterende IM (url: .../vis) så må vi bruke registrert inntekt,
  // og sammenligne med gj.snitt fra opplysninger for å bedømme om den har blitt endret eller ikke.
  const harEndretInntekt = skjemaState.endringAvInntektÅrsaker.length > 0;
  const estimertInntekt = gjennomsnittInntekt(opplysninger.inntekter);
  const gjeldendeInntekt = skjemaState.korrigertInntekt ?? skjemaState.inntekt;

  return (
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
          <FormSummary.Label>Beregnet månedslønn</FormSummary.Label>
          <FormSummary.Value>
            {harEndretInntekt ? (
              <List>
                <List.Item>
                  Estimert:{" "}
                  <span className="line-through">
                    {formatKroner(estimertInntekt)}
                  </span>
                </List.Item>
                <List.Item>
                  Endret til: {formatKroner(gjeldendeInntekt)}
                </List.Item>
              </List>
            ) : (
              formatKroner(gjeldendeInntekt)
            )}
          </FormSummary.Value>
        </FormSummary.Answer>
        {harEndretInntekt && (
          <>
            <FormSummary.Answer>
              <FormSummary.Label>Årsaker</FormSummary.Label>
              <FormSummary.Value>
                <FormSummary.Answers>
                  {skjemaState.endringAvInntektÅrsaker.map(
                    ({ årsak, fom, tom, bleKjentFom }) => {
                      const periodeStreng = formaterPeriodeStreng({
                        fom,
                        tom: bleKjentFom || tom,
                      });
                      return (
                        <FormSummary.Answer key={[årsak, fom, tom].join("-")}>
                          <FormSummary.Label>
                            {
                              endringsårsak.find((a) => a.value === årsak)
                                ?.label
                            }
                          </FormSummary.Label>
                          <FormSummary.Value>
                            {capitalize(periodeStreng)}
                          </FormSummary.Value>
                        </FormSummary.Answer>
                      );
                    },
                  )}
                </FormSummary.Answers>
              </FormSummary.Value>
            </FormSummary.Answer>
          </>
        )}
      </FormSummary.Answers>
    </FormSummary>
  );
}

/**
 * Gir en streng på formatet "fra og med DATO, til og med DATO" hvis begge datoene er satt. Ellers kun den ene.
 */
function formaterPeriodeStreng({
  fom,
  tom,
}: {
  fom?: Date | string;
  tom?: Date | string;
}) {
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
