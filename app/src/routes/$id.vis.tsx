import { createFileRoute } from "@tanstack/react-router";

import { VisInntektsmelding } from "~/features/inntektsmelding/visningskomponenter/VisInntektsmelding";

const InntektsmeldingContainer = () => {
  return <VisInntektsmelding />;
};
export const Route = createFileRoute("/$id/vis")({
  component: InntektsmeldingContainer,
});
