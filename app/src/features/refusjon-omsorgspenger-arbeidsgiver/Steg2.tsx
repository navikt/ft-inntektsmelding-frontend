import { Heading } from "@navikt/ds-react";

import { RotLayout } from "~/features/rot-layout/RotLayout";

import { Informasjonsseksjon } from "../Informasjonsseksjon";
import { Fremgangsindikator } from "./Fremgangsindikator";

export const RefusjonOmsorgspengerArbeidsgiverSteg2 = () => {
  return (
    <RotLayout tittel="Søknad om refusjon for omsorgspenger">
      <div>
        <Heading level="1" size="large">
          Den ansatte og arbeidsgiver
        </Heading>
        <Fremgangsindikator aktivtSteg={2} />
        <Informasjonsseksjon></Informasjonsseksjon>
      </div>
    </RotLayout>
  );
};
