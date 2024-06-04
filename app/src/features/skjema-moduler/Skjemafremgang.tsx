import { FormProgress } from "@navikt/ds-react";

type FremgangsindikatorProps = {
  aktivtSteg: 1 | 2 | 3;
};
export const Fremgangsindikator = ({ aktivtSteg }: FremgangsindikatorProps) => {
  return (
    <FormProgress activeStep={aktivtSteg} className="col-span-2" totalSteps={3}>
      <FormProgress.Step href="#">Dine opplysninger</FormProgress.Step>
      <FormProgress.Step href="#">Den ansattes opplysninger</FormProgress.Step>
      <FormProgress.Step href="#">Oppsummering</FormProgress.Step>
    </FormProgress>
  );
};
