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
import { endringsårsak } from "~/features/skjema-moduler/Inntekt";
import { formatKroner } from "~/utils";

import { ErrorMessage } from "./ErrorMessage";

export const OppsummeringMånedslønn = ({
  redigerbar,
}: {
  redigerbar: boolean;
}) => {
  const { getValues, formState } =
    useRefusjonOmsorgspengerArbeidsgiverFormContext();

  return (
    <FormSummary>
      <FormSummaryHeader>
        <FormSummaryHeading level="3">
          Beregnet månedslønn for refusjon
        </FormSummaryHeading>
        {redigerbar && <FormSummaryEditLink as={Link} to={"../4-refusjon"} />}
      </FormSummaryHeader>
      <FormSummaryAnswers>
        <FormSummaryAnswer>
          <FormSummaryLabel>Beregnet månedslønn</FormSummaryLabel>
          <FormSummaryValue>
            {formatKroner(
              getValues("korrigertInntekt") || getValues("inntekt"),
            )}
            <ErrorMessage
              message={
                formState.errors.korrigertInntekt?.message ||
                formState.errors.inntekt?.message
              }
            />
          </FormSummaryValue>
        </FormSummaryAnswer>
        {!!getValues("endringAvInntektÅrsaker")?.length && (
          <FormSummaryAnswer>
            <FormSummaryLabel>Årsaker til endring av inntekt</FormSummaryLabel>
            <FormSummaryValue>
              {getValues("endringAvInntektÅrsaker")?.map((årsak) => (
                <div key={årsak.årsak}>
                  {endringsårsak.find((a) => a.value === årsak.årsak)?.label}
                  {årsak.fom && (
                    <>
                      {" "}
                      {new Date(årsak.fom).toLocaleDateString("nb-no")}
                      {årsak.tom &&
                        ` til ${new Date(årsak.tom).toLocaleDateString("nb-no")}`}
                    </>
                  )}
                </div>
              ))}
              <ErrorMessage
                message={formState.errors.endringAvInntektÅrsaker?.message}
              />
            </FormSummaryValue>
          </FormSummaryAnswer>
        )}
      </FormSummaryAnswers>
    </FormSummary>
  );
};
