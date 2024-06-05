import { FormProgress } from "@navikt/ds-react";
import { Link } from "@tanstack/react-router";

type FremgangsindikatorProps = {
  aktivtSteg: 1 | 2 | 3;
};

// TODO: beholde at stegindikator er åpen ved step-navigasjon?
export const Fremgangsindikator = ({ aktivtSteg }: FremgangsindikatorProps) => {
  return (
    <FormProgress activeStep={aktivtSteg} className="col-span-2" totalSteps={3}>
      <FormProgress.Step as={Link} to="../dine-opplysninger">
        Dine opplysninger
      </FormProgress.Step>
      <FormProgress.Step as={Link} to="../inntekt-og-refusjon">
        Den ansattes opplysninger
      </FormProgress.Step>
      <FormProgress.Step as={Link} to="../oppsummering">
        Oppsummering
      </FormProgress.Step>
    </FormProgress>
  );
};
