import { FormProgress } from "@navikt/ds-react";

type FremgangsindikatorProps = {
  aktivtSteg: 1 | 2 | 3;
};
export const Fremgangsindikator = ({ aktivtSteg }: FremgangsindikatorProps) => {
  return (
    <FormProgress
      activeStep={aktivtSteg}
      className="col-span-2"
      interactiveSteps={false}
      totalSteps={3}
    >
      <FormProgress.Step>Dine opplysninger</FormProgress.Step>
      <FormProgress.Step>Inntekt og refusjon</FormProgress.Step>
      <FormProgress.Step>Oppsummering</FormProgress.Step>
    </FormProgress>
  );
};
