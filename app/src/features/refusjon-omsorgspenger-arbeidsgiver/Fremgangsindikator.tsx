import { FormProgress } from "@navikt/ds-react";
import { Link } from "@tanstack/react-router";

type FremgangsindikatorProps = {
  aktivtSteg: 1 | 2 | 3 | 4 | 5;
};
export const Fremgangsindikator = ({ aktivtSteg }: FremgangsindikatorProps) => {
  return (
    <FormProgress activeStep={aktivtSteg} className="col-span-2" totalSteps={3}>
      <FormProgress.Step as={Link} to="../1">
        Refusjon
      </FormProgress.Step>
      <FormProgress.Step as={Link} to="../2">
        Den ansatte og arbeidsgiver
      </FormProgress.Step>
      <FormProgress.Step as={Link} to="../3">
        Omsorgsdager
      </FormProgress.Step>
      <FormProgress.Step as={Link} to="../4">
        Beregnet månedslønn
      </FormProgress.Step>
      <FormProgress.Step as={Link} to="../5">
        Oppsummering
      </FormProgress.Step>
    </FormProgress>
  );
};
