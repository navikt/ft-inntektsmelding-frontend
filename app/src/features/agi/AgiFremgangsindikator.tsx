import { FormProgress } from "@navikt/ds-react";

type FremgangsindikatorProps = {
  aktivtSteg: 1 | 2 | 3 | 4;
};
export const AgiFremgangsindikator = ({ aktivtSteg }: FremgangsindikatorProps) => {
  return (
    <FormProgress
      activeStep={aktivtSteg}
      className="col-span-2"
      interactiveSteps={false}
      totalSteps={4}
    >
      <FormProgress.Step>Opprett</FormProgress.Step>
      <FormProgress.Step>Dine opplysninger</FormProgress.Step>
      <FormProgress.Step>Inntekt og refusjon</FormProgress.Step>
      <FormProgress.Step>Oppsummering</FormProgress.Step>
    </FormProgress>
  );
};
