import { createFileRoute, Outlet } from "@tanstack/react-router";

import { RefusjonOmsorgspengerArbeidsgiverForm } from "~/features/refusjon-omsorgspenger-arbeidsgiver/RefusjonOmsorgspengerArbeidsgiverForm";

export const Route = createFileRoute("/refusjon-omsorgspenger-arbeidsgiver")({
  component: () => (
    <RefusjonOmsorgspengerArbeidsgiverForm>
      <Outlet />
    </RefusjonOmsorgspengerArbeidsgiverForm>
  ),
});
