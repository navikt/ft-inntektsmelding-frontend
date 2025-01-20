import { createFileRoute } from '@tanstack/react-router'

import { RefusjonOmsorgspengerArbeidsgiverSteg3 } from '~/features/refusjon-omsorgspenger-arbeidsgiver/Steg3Omsorgsdager'

export const Route = createFileRoute(
  '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/3-omsorgsdager',
)({
  component: RefusjonOmsorgspengerArbeidsgiverSteg3,
})
