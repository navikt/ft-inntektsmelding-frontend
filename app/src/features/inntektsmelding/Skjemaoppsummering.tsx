import { FormSummary, List, VStack } from "@navikt/ds-react";
import {
  FormSummaryAnswer,
  FormSummaryAnswers,
  FormSummaryEditLink,
  FormSummaryHeader,
  FormSummaryHeading,
  FormSummaryLabel,
  FormSummaryValue,
} from "@navikt/ds-react/FormSummary";
import { ListItem } from "@navikt/ds-react/List";
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
  formatNavn,
  formatTelefonnummer,
  formatYtelsesnavn,
  lagFulltNavn,
} from "~/utils";

type SkjemaoppsummeringProps = {
  opplysninger: OpplysningerDto;
  skjemaState: InntektsmeldingSkjemaStateValid;
};

export const Skjemaoppsummering = ({
  opplysninger,
  skjemaState,
}: SkjemaoppsummeringProps) => {
  const kanEndres = opplysninger.forespørselStatus !== "UTGÅTT";

  if (opplysninger.ytelse === "OMSORGSPENGER") {
    const fravær = opplysninger.etterspurtePerioder;
    const harUtbetaltLønn = skjemaState.skalRefunderes === "JA_LIK_REFUSJON";
    return (
      <VStack gap="4">
        <ArbeidsgiverOgAnsattOppsummering
          kanEndres={kanEndres}
          opplysninger={opplysninger}
          skjemaState={skjemaState}
        />
        <FormSummary>
          <FormSummaryHeader>
            <FormSummaryHeading level="3">Om fraværet</FormSummaryHeading>
            <FormSummaryEditLink as={Link} to={"../inntekt-og-refusjon"} />
          </FormSummaryHeader>
          <FormSummaryAnswers>
            <FormSummaryAnswer>
              <FormSummaryLabel>Dager med oppgitt fravær</FormSummaryLabel>
              <FormSummaryValue>
                {fravær ? (
                  <List>
                    {fravær?.map((periode, index) =>
                      periode.fom && periode.tom ? (
                        <ListItem key={index}>
                          {formatDatoKort(new Date(periode.fom))}–
                          {formatDatoKort(new Date(periode.tom))}
                        </ListItem>
                      ) : null,
                    )}
                  </List>
                ) : (
                  "Ingen dager med oppgitt fravær"
                )}
              </FormSummaryValue>
            </FormSummaryAnswer>

            {harUtbetaltLønn !== undefined && (
              <FormSummaryAnswer>
                <FormSummaryLabel>
                  Har dere utbetalt lønn for dette fraværet?
                </FormSummaryLabel>
                <FormSummaryValue>
                  {harUtbetaltLønn ? "Ja" : "Nei"}
                </FormSummaryValue>
              </FormSummaryAnswer>
            )}
          </FormSummaryAnswers>
        </FormSummary>
        <InntektOppsummering
          kanEndres={kanEndres}
          opplysninger={opplysninger}
          skjemaState={skjemaState}
        />
      </VStack>
    );
  }
  return (
    <VStack gap="4">
      <ArbeidsgiverOgAnsattOppsummering
        kanEndres={kanEndres}
        opplysninger={opplysninger}
        skjemaState={skjemaState}
      />
      <FørsteDagOppsummering opplysninger={opplysninger} />
      <InntektOppsummering
        kanEndres={kanEndres}
        opplysninger={opplysninger}
        skjemaState={skjemaState}
      />
      <UtbetalingOgRefusjonOppsummering
        kanEndres={kanEndres}
        skjemaState={skjemaState}
      />
      <NaturalytelserOppsummering
        kanEndres={kanEndres}
        skjemaState={skjemaState}
      />
    </VStack>
  );
};

function InntektOppsummering({
  kanEndres,
  opplysninger,
  skjemaState,
}: SkjemaoppsummeringProps & { kanEndres: boolean }) {
  const harEndretInntekt = skjemaState.endringAvInntektÅrsaker.length > 0;
  const estimertInntekt = opplysninger.inntektsopplysninger.gjennomsnittLønn;
  const gjeldendeInntekt = skjemaState.korrigertInntekt ?? skjemaState.inntekt;

  return (
    <FormSummary>
      <FormSummary.Header>
        <FormSummary.Heading level="3">Månedslønn</FormSummary.Heading>
        {kanEndres && (
          <FormSummary.EditLink
            aria-label="Endre inntekt"
            as={Link}
            to="../inntekt-og-refusjon#beregnet-manedslonn"
          />
        )}
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
                    ({ årsak, fom, tom, bleKjentFom, ignorerTom }) => {
                      const periodeStreng = formaterPeriodeStreng({
                        fom,
                        tom: ignorerTom ? undefined : bleKjentFom || tom,
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

const ArbeidsgiverOgAnsattOppsummering = ({
  kanEndres,
  opplysninger,
  skjemaState,
}: SkjemaoppsummeringProps & { kanEndres: boolean }) => (
  <FormSummary>
    <FormSummary.Header>
      <FormSummary.Heading level="3">
        Arbeidsgiver og den ansatte
      </FormSummary.Heading>
      {kanEndres && (
        <FormSummary.EditLink
          aria-label="Endre dine opplysninger"
          as={Link}
          to="../dine-opplysninger"
        />
      )}
    </FormSummary.Header>
    <FormSummary.Answers>
      <FormSummary.Answer>
        <FormSummary.Label>Arbeidsgiver</FormSummary.Label>
        <FormSummary.Value>
          {opplysninger.arbeidsgiver.organisasjonNavn}, org.nr.{" "}
          {opplysninger.arbeidsgiver.organisasjonNummer}
        </FormSummary.Value>
      </FormSummary.Answer>
      <FormSummary.Answer>
        <FormSummary.Label>Kontaktperson</FormSummary.Label>
        <FormSummary.Value>
          {formatterKontaktperson(skjemaState.kontaktperson)}
        </FormSummary.Value>
      </FormSummary.Answer>
      <FormSummary.Answer>
        <FormSummary.Label>Den ansatte</FormSummary.Label>
        <FormSummary.Value>
          {lagFulltNavn(opplysninger.person)}
          {", f.nr. "}
          {formatFødselsnummer(opplysninger.person.fødselsnummer)}
        </FormSummary.Value>
      </FormSummary.Answer>
    </FormSummary.Answers>
  </FormSummary>
);

const FørsteDagOppsummering = ({
  opplysninger,
}: {
  opplysninger: OpplysningerDto;
}) => (
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
          {formatDatoLang(new Date(opplysninger.førsteUttaksdato))}
        </FormSummary.Value>
      </FormSummary.Answer>
    </FormSummary.Answers>
  </FormSummary>
);

const UtbetalingOgRefusjonOppsummering = ({
  kanEndres,
  skjemaState,
}: {
  kanEndres: boolean;
  skjemaState: InntektsmeldingSkjemaStateValid;
}) => (
  <FormSummary>
    <FormSummary.Header>
      <FormSummary.Heading level="3">
        Utbetaling og refusjon
      </FormSummary.Heading>
      {kanEndres && (
        <FormSummary.EditLink
          aria-label="Endre utbetaling og refusjon"
          as={Link}
          to="../inntekt-og-refusjon#refusjon"
        />
      )}
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
            {formatKroner(skjemaState.refusjon[0].beløp)}
          </FormSummary.Value>
        </FormSummary.Answer>
      )}
      {skjemaState.skalRefunderes === "JA_VARIERENDE_REFUSJON" && (
        <FormSummary.Answer>
          <FormSummary.Label>Endringer i refusjon</FormSummary.Label>
          <FormSummary.Value>
            <FormSummary.Answers>
              {skjemaState.refusjon.map((endring) => (
                <FormSummary.Answer
                  key={endring.fom!.toString() + endring?.beløp}
                >
                  <FormSummary.Label>
                    Refusjonsbeløp per måned
                  </FormSummary.Label>
                  <FormSummary.Value>
                    {formatKroner(endring.beløp)} (fra og med{" "}
                    {formatDatoLang(new Date(endring.fom!))})
                  </FormSummary.Value>
                </FormSummary.Answer>
              ))}
            </FormSummary.Answers>
          </FormSummary.Value>
        </FormSummary.Answer>
      )}
    </FormSummary.Answers>
  </FormSummary>
);

const NaturalytelserOppsummering = ({
  kanEndres,
  skjemaState,
}: {
  kanEndres: boolean;
  skjemaState: InntektsmeldingSkjemaStateValid;
}) => (
  <FormSummary>
    <FormSummary.Header>
      <FormSummary.Heading level="3">Naturalytelser</FormSummary.Heading>
      {kanEndres && (
        <FormSummary.EditLink
          aria-label="Endre naturalytelser"
          as={Link}
          to="../inntekt-og-refusjon#naturalytelser"
        />
      )}
    </FormSummary.Header>
    <FormSummary.Answers>
      <FormSummary.Answer>
        <FormSummary.Label>
          Har den ansatte naturalytelser som faller bort ved fraværet?
        </FormSummary.Label>
        <FormSummary.Value>
          {skjemaState.misterNaturalytelser ? "Ja" : "Nei"}
        </FormSummary.Value>
      </FormSummary.Answer>
      {skjemaState.misterNaturalytelser && (
        <FormSummary.Answer>
          <FormSummary.Label>Naturalytelser som faller bort</FormSummary.Label>
          <FormSummary.Value>
            <FormSummary.Answers>
              {skjemaState.bortfaltNaturalytelsePerioder.map(
                (naturalytelse) => {
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
                },
              )}
            </FormSummary.Answers>
          </FormSummary.Value>
        </FormSummary.Answer>
      )}
    </FormSummary.Answers>
  </FormSummary>
);

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
  return `${formatNavn(kontaktperson.navn)}, tlf. ${formatTelefonnummer(kontaktperson.telefonnummer)}`;
};
