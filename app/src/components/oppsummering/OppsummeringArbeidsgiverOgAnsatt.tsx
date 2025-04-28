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
import { Link } from "@tanstack/react-router";

import { useRefusjonOmsorgspengerArbeidsgiverFormContext } from "~/features/refusjon-omsorgspenger/RefusjonOmsorgspengerArbeidsgiverForm";
import { useInnloggetBruker } from "~/features/refusjon-omsorgspenger/useInnloggetBruker";
import { formatFodselsnummer, lagFulltNavn } from "~/utils";

import { ErrorMessage } from "./ErrorMessage";

export const OppsummeringArbeidsgiverOgAnsatt = ({
  redigerbar,
}: {
  redigerbar: boolean;
}) => {
  const { getValues, formState } =
    useRefusjonOmsorgspengerArbeidsgiverFormContext();
  const innloggetBruker = useInnloggetBruker();
  return (
    <FormSummary>
      <FormSummaryHeader>
        <FormSummaryHeading level="3">
          Arbeidsgiver og den ansatte
        </FormSummaryHeading>
        {redigerbar && (
          <FormSummaryEditLink as={Link} to="../2-ansatt-og-arbeidsgiver" />
        )}
      </FormSummaryHeader>
      <FormSummaryAnswers>
        <FormSummaryAnswer>
          <FormSummaryAnswer>
            <FormSummaryLabel>Virksomhetsnavn</FormSummaryLabel>
            <FormSummaryValue>
              {innloggetBruker.organisasjonsnavn}
            </FormSummaryValue>
          </FormSummaryAnswer>
          <FormSummaryAnswer>
            <FormSummaryLabel>Org.nr. for underenhet</FormSummaryLabel>
            <FormSummaryValue>
              {getValues("organisasjonsnummer")}
              <ErrorMessage
                message={formState.errors?.organisasjonsnummer?.message}
              />
            </FormSummaryValue>
          </FormSummaryAnswer>
        </FormSummaryAnswer>
        <FormSummaryAnswer>
          <FormSummaryLabel>Kontaktperson og innsender</FormSummaryLabel>
          <FormSummaryValue>
            {getValues("kontaktperson.navn")} (tlf.{" "}
            {getValues("kontaktperson.telefonnummer")})
            <ErrorMessage
              message={
                formState.errors.kontaktperson?.message ||
                formState.errors.kontaktperson?.telefonnummer?.message
              }
            />
          </FormSummaryValue>
        </FormSummaryAnswer>
        <FormSummaryAnswer>
          <FormSummaryLabel>Den ansatte</FormSummaryLabel>
          <FormSummaryValue>
            {lagFulltNavn({
              fornavn: getValues("ansattesFornavn")!,
              etternavn: getValues("ansattesEtternavn")!,
            })}
            , {formatFodselsnummer(getValues("ansattesFødselsnummer"))}
            <ErrorMessage
              message={formState.errors.ansattesFødselsnummer?.message}
            />
          </FormSummaryValue>
        </FormSummaryAnswer>
      </FormSummaryAnswers>
    </FormSummary>
  );
};
