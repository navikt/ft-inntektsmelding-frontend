import { List } from "@navikt/ds-react";
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

import { useRefusjonOmsorgspengerArbeidsgiverFormContext } from "~/features/refusjon-omsorgspenger/RefusjonOmsorgspengerArbeidsgiverForm";

import { ErrorMessage } from "./ErrorMessage";

export const OppsummeringOmsorgsdager = ({
  redigerbar,
}: {
  redigerbar: boolean;
}) => {
  const { getValues, formState } =
    useRefusjonOmsorgspengerArbeidsgiverFormContext();

  const fraværHeleDager = getValues("fraværHeleDager");
  const harFraværHeleDager = (fraværHeleDager?.length ?? 0) > 0;
  const fraværDelerAvDagen = getValues("fraværDelerAvDagen");
  const harFraværDelerAvDagen = (fraværDelerAvDagen?.length ?? 0) > 0;
  const dagerSomSkalTrekkes = getValues("dagerSomSkalTrekkes");
  const harDagerSomSkalTrekkes = (dagerSomSkalTrekkes?.length ?? 0) > 0;
  return (
    <FormSummary>
      <FormSummaryHeader>
        <FormSummaryHeading level="3">
          Omsorgsdager dere søker utbetaling for
        </FormSummaryHeading>
        {redigerbar && (
          <FormSummaryEditLink as={Link} to={"../3-omsorgsdager"} />
        )}
      </FormSummaryHeader>
      <FormSummaryAnswers>
        <FormSummaryAnswer>
          <FormSummaryLabel>
            Har dere dekket de 10 første omsorgsdagene i år?
          </FormSummaryLabel>
          <FormSummaryValue>
            {getValues("harDekket10FørsteOmsorgsdager") ? "Ja" : "Nei"}
            <ErrorMessage
              message={formState.errors.harDekket10FørsteOmsorgsdager?.message}
            />
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
            <ErrorMessage message={formState.errors.fraværHeleDager?.message} />
          </FormSummaryValue>
        </FormSummaryAnswer>
        <FormSummaryAnswer>
          <FormSummaryLabel>
            Dager med fravær bare deler av dagen
          </FormSummaryLabel>
          <FormSummaryValue>
            {harFraværDelerAvDagen ? (
              <List>
                {fraværDelerAvDagen
                  ?.filter((fravær) => Number(fravær.timer) > 0)
                  .map((fravær, index) => (
                    <ListItem key={index}>
                      {new Date(fravær.dato).toLocaleDateString("nb-no")}
                      {fravær.timer &&
                        ` (${fravær.timer} ${
                          Number(fravær.timer) === 1 ? "time" : "timer"
                        })`}
                    </ListItem>
                  ))}
              </List>
            ) : (
              "Ingen dager med fravær bare deler av dagen"
            )}
            <ErrorMessage
              message={formState.errors.fraværDelerAvDagen?.message}
            />
          </FormSummaryValue>
        </FormSummaryAnswer>
        {harDagerSomSkalTrekkes && (
          <FormSummaryAnswer>
            <FormSummaryLabel>Dager som skal trekkes</FormSummaryLabel>
            <FormSummaryValue>
              <List>
                {dagerSomSkalTrekkes?.map((dag, index) => (
                  <ListItem key={index}>
                    {new Date(dag.fom).toLocaleDateString("nb-no")}–
                    {new Date(dag.tom).toLocaleDateString("nb-no")}
                  </ListItem>
                ))}
              </List>
            </FormSummaryValue>
          </FormSummaryAnswer>
        )}
      </FormSummaryAnswers>
    </FormSummary>
  );
};
