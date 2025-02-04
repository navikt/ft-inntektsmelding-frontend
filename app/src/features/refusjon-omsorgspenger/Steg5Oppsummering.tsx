import { ArrowLeftIcon, PaperplaneIcon } from "@navikt/aksel-icons";
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

import { useDocumentTitle } from "../useDocumentTitle";
import { OmsorgspengerFremgangsindikator } from "./OmsorgspengerFremgangsindikator.tsx";
import { useRefusjonOmsorgspengerArbeidsgiverFormContext } from "./RefusjonOmsorgspengerArbeidsgiverForm";

export const RefusjonOmsorgspengerArbeidsgiverSteg5 = () => {
  useDocumentTitle(
    "Oppsummering – søknad om refusjon av omsorgspenger for arbeidsgiver",
  );
  const navigate = useNavigate();
  return (
    <div>
      <Heading level="1" size="large">
        Oppsummering
      </Heading>
      <OmsorgspengerFremgangsindikator aktivtSteg={5} />
      <VStack gap="4">
        <OppsummeringArbeidsgiverOgAnsatt />
        <OppsummeringRefusjon />
        <OppsummeringOmsorgsdager />
        <OppsummeringMånedslønn />
      </VStack>
      <div className="flex gap-4">
        <Button
          as={Link}
          icon={<ArrowLeftIcon />}
          to="../4-refusjon"
          variant="secondary"
        >
          Forrige steg
        </Button>
        <Button
          icon={<PaperplaneIcon />}
          iconPosition="right"
          onClick={() => {
            alert("Søknad ikke egentlig sendt inn, men vi kan late som");
            navigate({
              from: "/refusjon-omsorgspenger/$organisasjonsnummer/5-oppsummering",
              to: "../6-kvittering",
            });
          }}
          variant="primary"
        >
          Send inn
        </Button>
      </div>
    </div>
  );
};

const OppsummeringRefusjon = () => {
  const { getValues } = useRefusjonOmsorgspengerArbeidsgiverFormContext();
  return (
    <FormSummary>
      <FormSummaryHeader>
        <FormSummaryHeading level="3">Refusjon</FormSummaryHeading>
        <FormSummaryEditLink as={Link} to="../4-refusjon" />
      </FormSummaryHeader>
      <FormSummaryAnswers>
        <FormSummaryAnswer>
          <FormSummaryLabel>
            Utbetaler dere lønn under fraværet, og krever refusjon?
          </FormSummaryLabel>
          <FormSummaryValue>
            {getValues("skalRefunderes") ? "Ja" : "Nei"}
          </FormSummaryValue>
        </FormSummaryAnswer>
        <FormSummaryAnswer>
          <FormSummaryLabel>
            Hvilket år søker dere refusjon for?
          </FormSummaryLabel>
          <FormSummaryValue>{getValues("årForRefusjon")}</FormSummaryValue>
        </FormSummaryAnswer>
      </FormSummaryAnswers>
    </FormSummary>
  );
};

const OppsummeringArbeidsgiverOgAnsatt = () => {
  const { getValues } = useRefusjonOmsorgspengerArbeidsgiverFormContext();
  return (
    <FormSummary>
      <FormSummaryHeader>
        <FormSummaryHeading level="3">
          Arbeidsgiver og den ansatte
        </FormSummaryHeading>
        <FormSummaryEditLink as={Link} to="../2-ansatt-og-arbeidsgiver" />
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
                <FormSummaryLabel>Org.nr. for underenhet</FormSummaryLabel>
                <FormSummaryValue>123456789</FormSummaryValue>
              </FormSummaryAnswer>
            </FormSummaryAnswers>
          </FormSummaryValue>
        </FormSummaryAnswer>
        <FormSummaryAnswer>
          <FormSummaryLabel>Kontaktperson og innsender</FormSummaryLabel>
          <FormSummaryValue>
            {getValues("kontaktperson.navn")} (tlf.{" "}
            {getValues("kontaktperson.telefonnummer")})
          </FormSummaryValue>
        </FormSummaryAnswer>
        <FormSummaryAnswer>
          <FormSummaryLabel>Den ansatte</FormSummaryLabel>
          <FormSummaryValue>
            {"Place Holdersen"},{" "}
            {getValues("ansattesFødselsnummer")?.slice(0, 6)}
          </FormSummaryValue>
        </FormSummaryAnswer>
      </FormSummaryAnswers>
    </FormSummary>
  );
};

const OppsummeringOmsorgsdager = () => {
  const { getValues } = useRefusjonOmsorgspengerArbeidsgiverFormContext();
  const fraværHeleDager = getValues("fraværHeleDager");
  const harFraværHeleDager = (fraværHeleDager?.length ?? 0) > 0;
  const fraværDelerAvDagen = getValues("fraværDelerAvDagen");
  const harFraværDelerAvDagen = (fraværDelerAvDagen?.length ?? 0) > 0;
  return (
    <FormSummary>
      <FormSummaryHeader>
        <FormSummaryHeading level="3">
          Omsorgsdager dere søker utbetaling for
        </FormSummaryHeading>
        <FormSummaryEditLink as={Link} to="../3-omsorgsdager" />
      </FormSummaryHeader>
      <FormSummaryAnswers>
        <FormSummaryAnswer>
          <FormSummaryLabel>
            Har dere dekket de 10 første omsorgsdagene i år?
          </FormSummaryLabel>
          <FormSummaryValue>
            {getValues("harDekket10FørsteOmsorgsdager") ? "Ja" : "Nei"}
          </FormSummaryValue>
        </FormSummaryAnswer>
        <FormSummaryAnswer>
          <FormSummaryLabel>Dager med fravær hele dagen</FormSummaryLabel>
          <FormSummaryValue>
            {harFraværHeleDager ? (
              <List>
                {fraværHeleDager?.map((periode, index) =>
                  periode.fom && periode.tom ? (
                    <ListItem key={index}>
                      {new Date(periode.fom).toLocaleDateString("nb-no")}–
                      {periode.tom
                        ? new Date(periode.tom).toLocaleDateString("nb-no")
                        : "I dag"}
                    </ListItem>
                  ) : null,
                )}
              </List>
            ) : (
              "Ingen dager med fravær hele dagen"
            )}
          </FormSummaryValue>
        </FormSummaryAnswer>
        <FormSummaryAnswer>
          <FormSummaryLabel>
            Dager med fravær bare deler av dagen
          </FormSummaryLabel>
          <FormSummaryValue>
            {harFraværDelerAvDagen ? (
              <List>
                {fraværDelerAvDagen?.map((fravær, index) => (
                  <ListItem key={index}>
                    {fravær.dato
                      ? new Date(fravær.dato).toLocaleDateString("nb-no")
                      : null}
                    : {fravær.timerFravær}{" "}
                    {fravær.timerFravær === 1 ? "time" : "timer"} (
                    {fravær.normalArbeidstid} timer normal arbeidstid)
                  </ListItem>
                ))}
              </List>
            ) : (
              "Ingen dager med fravær bare deler av dagen"
            )}
          </FormSummaryValue>
        </FormSummaryAnswer>
      </FormSummaryAnswers>
    </FormSummary>
  );
};

export const OppsummeringMånedslønn = () => {
  const { getValues } = useRefusjonOmsorgspengerArbeidsgiverFormContext();
  return (
    <FormSummary>
      <FormSummaryHeader>
        <FormSummaryHeading level="3">
          Beregnet månedslønn og refusjonskrav
        </FormSummaryHeading>
        <FormSummaryEditLink as={Link} to="../4-refusjon" />
      </FormSummaryHeader>
      <FormSummaryAnswers>
        <FormSummaryAnswer>
          <FormSummaryLabel>
            Beregnet månedslønn og refusjonskrav
          </FormSummaryLabel>
          <FormSummaryValue>{getValues("inntekt")} kr</FormSummaryValue>
        </FormSummaryAnswer>
      </FormSummaryAnswers>
    </FormSummary>
  );
};
