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
import { Link } from "@tanstack/react-router";

import { lagFulltNavn } from "~/utils.ts";

import { useDocumentTitle } from "../useDocumentTitle";
import { sendInntektsmeldingOmsorgspengerRefusjonMutation } from "./api/mutations.ts";
import { OmsorgspengerFremgangsindikator } from "./OmsorgspengerFremgangsindikator.tsx";
import { useRefusjonOmsorgspengerArbeidsgiverFormContext } from "./RefusjonOmsorgspengerArbeidsgiverForm";
import { useInnloggetBruker } from "./useInnloggetBruker.tsx";
import { mapSkjemaTilSendInntektsmeldingRequest } from "./utils.ts";

export const RefusjonOmsorgspengerArbeidsgiverSteg5 = () => {
  useDocumentTitle(
    "Oppsummering – søknad om refusjon av omsorgspenger for arbeidsgiver",
  );
  const { handleSubmit } = useRefusjonOmsorgspengerArbeidsgiverFormContext();
  const { mutate: sendInntektsmeldingOmsorgspengerRefusjon } =
    sendInntektsmeldingOmsorgspengerRefusjonMutation();
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
          onClick={handleSubmit((values) => {
            const request = mapSkjemaTilSendInntektsmeldingRequest(values);
            sendInntektsmeldingOmsorgspengerRefusjon(request);
          })}
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
            {getValues("harUtbetaltLønn") ? "Ja" : "Nei"}
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
  const innloggetBruker = useInnloggetBruker();
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
                <FormSummaryValue>
                  {innloggetBruker.organisasjonsnavn}
                </FormSummaryValue>
              </FormSummaryAnswer>
              <FormSummaryAnswer>
                <FormSummaryLabel>Org.nr. for underenhet</FormSummaryLabel>
                <FormSummaryValue>
                  {innloggetBruker.organisasjonsnummer}
                </FormSummaryValue>
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
            {lagFulltNavn({
              fornavn: getValues("ansattesFornavn")!,
              etternavn: getValues("ansattesEtternavn")!,
            })}
            , {getValues("ansattesFødselsnummer")?.slice(0, 6)}
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
                      {new Date(periode.tom).toLocaleDateString("nb-no")}
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
                    : {fravær.timer}{" "}
                    {Number(fravær.timer) === 1 ? "time" : "timer"}
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
          <FormSummaryValue>
            {getValues("korrigertInntekt") || getValues("inntekt")}
            {" "}
            kr
          </FormSummaryValue>
        </FormSummaryAnswer>
      </FormSummaryAnswers>
    </FormSummary>
  );
};
