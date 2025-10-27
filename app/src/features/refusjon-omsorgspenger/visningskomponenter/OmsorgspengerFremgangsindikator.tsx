import { FormProgress } from "@navikt/ds-react";

type FremgangsindikatorProps = {
  aktivtSteg: 1 | 2 | 3 | 4 | 5;
};
export const OmsorgspengerFremgangsindikator = ({
  aktivtSteg,
}: FremgangsindikatorProps) => {
  return (
    <FormProgress
      activeStep={aktivtSteg}
      className="col-span-2"
      interactiveSteps={false}
      totalSteps={5}
    >
      <FormProgress.Step>Om refusjon</FormProgress.Step>
      <FormProgress.Step>Den ansatte og arbeidsgiver</FormProgress.Step>
      <FormProgress.Step>Omsorgsdager</FormProgress.Step>
      <FormProgress.Step>Beregnet månedslønn</FormProgress.Step>
      <FormProgress.Step>Oppsummering</FormProgress.Step>
    </FormProgress>
  );
};
