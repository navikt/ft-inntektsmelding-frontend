import { ArrowLeftIcon, ArrowRightIcon } from "@navikt/aksel-icons";
import { BodyLong, Button, Heading, VStack } from "@navikt/ds-react";
import {
  createFileRoute,
  Link,
  useLoaderData,
  useNavigate,
} from "@tanstack/react-router";
import { FormProvider, useForm } from "react-hook-form";

import type { OpplysningerDto } from "~/api/queries.ts";
import { HjelpetekstReadMore } from "~/features/Hjelpetekst";
import { InformasjonsseksjonMedKilde } from "~/features/InformasjonsseksjonMedKilde";
import type { InntektsmeldingSkjemaState } from "~/features/InntektsmeldingSkjemaState";
import { useInntektsmeldingSkjema } from "~/features/InntektsmeldingSkjemaState";
import { Fremgangsindikator } from "~/features/skjema-moduler/Fremgangsindikator";
import { Inntekt } from "~/features/skjema-moduler/Inntekt";
import {
  NATURALYTELSE_SOM_MISTES_TEMPLATE,
  Naturalytelser,
} from "~/features/skjema-moduler/Naturalytelser";
import {
  ENDRING_I_REFUSJON_TEMPLATE,
  UtbetalingOgRefusjon,
} from "~/features/skjema-moduler/UtbetalingOgRefusjon.tsx";
import {
  capitalizeSetning,
  formatDatoLang,
  formatYtelsesnavn,
  gjennomsnittInntekt,
  leggTilGenitiv,
} from "~/utils.ts";

export const Route = createFileRoute("/$id/inntekt-og-refusjon")({
  component: InntektOgRefusjon,
});

type JaNei = "ja" | "nei";

export type InntektOgRefusjonForm = {
  skalRefunderes: JaNei;
  endringIRefusjon: JaNei;
  misterNaturalytelser: JaNei;
} & Pick<
  InntektsmeldingSkjemaState,
  | "naturalytelserSomMistes"
  | "refusjonsendringer"
  | "refusjonsbeløpPerMåned"
  | "inntekt"
  | "inntektEndringsÅrsak"
>;

function InntektOgRefusjon() {
  const opplysninger = useLoaderData({ from: "/$id" });

  const { inntektsmeldingSkjemaState, setInntektsmeldingSkjemaState } =
    useInntektsmeldingSkjema();

  const gjennomsnikkInntektFraAOrdning = gjennomsnittInntekt(
    opplysninger.inntekter ?? [],
  );

  const formMethods = useForm<InntektOgRefusjonForm>({
    defaultValues: {
      // Denne ligger i formet, men brukes ikke annet enn for submit
      inntekt:
        inntektsmeldingSkjemaState.inntekt || gjennomsnikkInntektFraAOrdning,
      inntektEndringsÅrsak: inntektsmeldingSkjemaState.inntektEndringsÅrsak,
      refusjonsbeløpPerMåned:
        inntektsmeldingSkjemaState.refusjonsbeløpPerMåned ||
        gjennomsnikkInntektFraAOrdning,
      skalRefunderes:
        inntektsmeldingSkjemaState.skalRefunderes === undefined
          ? undefined
          : inntektsmeldingSkjemaState.skalRefunderes
            ? "ja"
            : "nei",
      endringIRefusjon:
        inntektsmeldingSkjemaState.endringIRefusjon === undefined
          ? undefined
          : inntektsmeldingSkjemaState.endringIRefusjon
            ? "ja"
            : "nei",
      misterNaturalytelser:
        inntektsmeldingSkjemaState.misterNaturalytelser === undefined
          ? undefined
          : inntektsmeldingSkjemaState.misterNaturalytelser
            ? "ja"
            : "nei",
      naturalytelserSomMistes:
        inntektsmeldingSkjemaState.naturalytelserSomMistes.length === 0
          ? [NATURALYTELSE_SOM_MISTES_TEMPLATE]
          : inntektsmeldingSkjemaState.naturalytelserSomMistes,
      refusjonsendringer:
        inntektsmeldingSkjemaState.refusjonsendringer.length === 0
          ? [ENDRING_I_REFUSJON_TEMPLATE]
          : inntektsmeldingSkjemaState.refusjonsendringer,
    },
  });
  const { handleSubmit } = formMethods;
  const navigate = useNavigate();

  const onSubmit = handleSubmit((skjemadata) => {
    const { refusjonsbeløpPerMåned, inntekt, inntektEndringsÅrsak } =
      skjemadata;
    const skalRefunderes = skjemadata.skalRefunderes === "ja";
    const endringIRefusjon = skjemadata.endringIRefusjon === "ja";
    const refusjonsendringer = endringIRefusjon
      ? skjemadata.refusjonsendringer
      : [];

    const misterNaturalytelser = skjemadata.misterNaturalytelser === "ja";
    const naturalytelserSomMistes = misterNaturalytelser
      ? skjemadata.naturalytelserSomMistes
      : [];

    setInntektsmeldingSkjemaState((prev) => ({
      ...prev,
      inntekt,
      inntektEndringsÅrsak,
      refusjonsbeløpPerMåned,
      skalRefunderes,
      endringIRefusjon,
      refusjonsendringer,
      misterNaturalytelser,
      naturalytelserSomMistes,
    }));
    navigate({
      from: "/$id/inntekt-og-refusjon",
      to: "../oppsummering",
    });
  });

  return (
    <FormProvider {...formMethods}>
      <section className="mt-4">
        <form
          className="bg-bg-default px-5 py-6 rounded-md flex gap-6 flex-col"
          onSubmit={onSubmit}
        >
          <Heading level="3" size="large">
            Inntekt og refusjon
          </Heading>
          <Fremgangsindikator aktivtSteg={2} />
          <Ytelsesperiode opplysninger={opplysninger} />
          <Inntekt opplysninger={opplysninger} />
          <UtbetalingOgRefusjon opplysninger={opplysninger} />
          <Naturalytelser />
          <div className="flex gap-4 justify-center">
            <Button
              as={Link}
              icon={<ArrowLeftIcon />}
              to="../dine-opplysninger"
              variant="secondary"
            >
              Forrige steg
            </Button>
            <Button
              icon={<ArrowRightIcon />}
              iconPosition="right"
              type="submit"
              variant="primary"
            >
              Neste steg
            </Button>
          </div>
        </form>
      </section>
    </FormProvider>
  );
}

type YtelsesperiodeProps = {
  opplysninger: OpplysningerDto;
};
function Ytelsesperiode({ opplysninger }: YtelsesperiodeProps) {
  const { startdatoPermisjon, person, ytelse } = opplysninger;

  const førsteDag = capitalizeSetning(
    formatDatoLang(new Date(startdatoPermisjon)),
  );

  return (
    <VStack gap="4">
      <hr />
      <Heading level="4" size="medium">
        Periode med {formatYtelsesnavn(ytelse)}
      </Heading>
      <InformasjonsseksjonMedKilde
        kilde={`Fra søknaden til ${person.fornavn}`}
        tittel={`${capitalizeSetning(leggTilGenitiv(person.fornavn))} første dag med ${formatYtelsesnavn(ytelse)}`}
      >
        <BodyLong size="medium">{førsteDag}</BodyLong>
      </InformasjonsseksjonMedKilde>
      <HjelpetekstReadMore header="Hva hvis datoen ikke stemmer?">
        TODO
      </HjelpetekstReadMore>
    </VStack>
  );
}
