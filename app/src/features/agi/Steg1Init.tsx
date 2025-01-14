import { Heading } from "@navikt/ds-react";
import { getRouteApi, useNavigate } from "@tanstack/react-router";

import { AgiFremgangsindikator } from "~/features/agi/AgiFremgangsindikator.tsx";
import { useInntektsmeldingSkjema } from "~/features/InntektsmeldingSkjemaState.tsx";
import { useDocumentTitle } from "~/features/useDocumentTitle.tsx";
import { formatYtelsesnavn } from "~/utils.ts";

const route = getRouteApi("/agi");

export const Steg1Init = () => {
  const { ytelseType } = route.useSearch();
  useDocumentTitle(
    `Opprett inntektsmelding for ${formatYtelsesnavn(ytelseType)}`,
  );
  const { inntektsmeldingSkjemaState, setInntektsmeldingSkjemaState } =
    useInntektsmeldingSkjema();

  // const { register, handleSubmit, formState } =
  //   useForm<PersonOgSelskapsInformasjonForm>({
  //     defaultValues: {
  //       ...(inntektsmeldingSkjemaState.kontaktperson ?? {
  //         navn: innsenderNavn,
  //         telefonnummer: opplysninger.innsender.telefon,
  //       }),
  //     },
  //   });
  const navigate = useNavigate();

  // const onSubmit = handleSubmit((kontaktperson) => {
  //   setInntektsmeldingSkjemaState((prev) => ({ ...prev, kontaktperson }));
  //   navigate({
  //     from: "/agi/1",
  //     to: "../2",
  //   });
  // });

  return (
    <section className="mt-2">
      <form onSubmit={() => {}}>
        <div className="bg-bg-default px-5 py-6 rounded-md flex flex-col gap-6">
          <Heading level="3" size="large">
            Dine opplysninger
          </Heading>
          <AgiFremgangsindikator aktivtSteg={1} />
        </div>
      </form>
    </section>
  );
};
