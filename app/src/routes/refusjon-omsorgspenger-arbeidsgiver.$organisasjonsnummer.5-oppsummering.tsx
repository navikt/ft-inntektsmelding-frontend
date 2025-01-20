import { createFileRoute } from '@tanstack/react-router'

import { RefusjonOmsorgspengerArbeidsgiverSteg5 } from '~/features/refusjon-omsorgspenger-arbeidsgiver/Steg5Oppsummering'

export const Route = createFileRoute(
  '/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/5-oppsummering',
)({
  component: RefusjonOmsorgspengerArbeidsgiverSteg5,
})
