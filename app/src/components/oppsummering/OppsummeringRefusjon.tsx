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

import { useSkjemaState } from "~/features/refusjon-omsorgspenger/SkjemaStateContext";

import { ErrorMessage } from "./ErrorMessage";

export const OppsummeringRefusjon = ({
  redigerbar = false,
}: {
  redigerbar: boolean;
}) => {
  const { getValues, formState } = useSkjemaState();
  return (
    <FormSummary>
      <FormSummaryHeader>
        <FormSummaryHeading level="3">Om refusjon</FormSummaryHeading>
        {redigerbar && <FormSummaryEditLink as={Link} to={"../4-refusjon"} />}
      </FormSummaryHeader>
      <FormSummaryAnswers>
        <FormSummaryAnswer>
          <FormSummaryLabel>
            Utbetaler dere lønn under fraværet, og krever refusjon?
          </FormSummaryLabel>
          <FormSummaryValue>
            {getValues("harUtbetaltLønn") ? "Ja" : "Nei"}
          </FormSummaryValue>
          <ErrorMessage message={formState.errors.harUtbetaltLønn?.message} />
        </FormSummaryAnswer>
        <FormSummaryAnswer>
          <FormSummaryLabel>
            Hvilket år søker dere refusjon for?
          </FormSummaryLabel>
          <FormSummaryValue>
            {getValues("årForRefusjon")}
            <ErrorMessage message={formState.errors.årForRefusjon?.message} />
          </FormSummaryValue>
        </FormSummaryAnswer>
      </FormSummaryAnswers>
    </FormSummary>
  );
};
