import { FormProgress } from "@navikt/ds-react";
import { Link } from "@tanstack/react-router";

type FremgangsindikatorProps = {
  aktivtSteg: 1 | 2 | 3;
};
export const Fremgangsindikator = ({ aktivtSteg }: FremgangsindikatorProps) => {
  return (
    <FormProgress activeStep={aktivtSteg} className="col-span-2" totalSteps={3}>
      <FormProgress.Step as={Link} href="../dine-opplysninger">
        Dine opplysninger
      </FormProgress.Step>
      <FormProgress.Step as={Link} href="../inntekt-og-refusjon">
        Inntekt og refusjon
      </FormProgress.Step>
      <FormProgress.Step as={Link} href="../oppsummering">
        Oppsummering
      </FormProgress.Step>
    </FormProgress>
  );
};
