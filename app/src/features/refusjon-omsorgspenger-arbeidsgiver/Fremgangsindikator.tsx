import { FormProgress } from "@navikt/ds-react";
import { Link } from "@tanstack/react-router";

type FremgangsindikatorProps = {
  aktivtSteg: 1 | 2 | 3 | 4 | 5;
};
export const Fremgangsindikator = ({ aktivtSteg }: FremgangsindikatorProps) => {
  return (
    <FormProgress activeStep={aktivtSteg} className="col-span-2" totalSteps={5}>
      <FormProgress.Step as={Link} to="../1-intro">
        Refusjon
      </FormProgress.Step>
      <FormProgress.Step as={Link} to="../2-ansatt-og-arbeidsgiver">
        Den ansatte og arbeidsgiver
      </FormProgress.Step>
      <FormProgress.Step as={Link} to="../3-omsorgsdager">
        Omsorgsdager
      </FormProgress.Step>
      <FormProgress.Step as={Link} to="../4-refusjon">
        Beregnet månedslønn
      </FormProgress.Step>
      <FormProgress.Step as={Link} to="../5-oppsummering">
        Oppsummering
      </FormProgress.Step>
    </FormProgress>
  );
};
