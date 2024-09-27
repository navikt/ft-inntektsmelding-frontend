import { ArrowLeftIcon, ArrowRightIcon } from "@navikt/aksel-icons";
import { BodyLong, Button, Heading, VStack } from "@navikt/ds-react";
import {
  createFileRoute,
  Link,
  useLoaderData,
  useNavigate,
} from "@tanstack/react-router";
import { FormProvider, useForm } from "react-hook-form";

import { HjelpetekstToggle } from "~/features/Hjelpetekst.tsx";
import { Informasjonsseksjon } from "~/features/Informasjonsseksjon";
import type { InntektsmeldingSkjemaState } from "~/features/InntektsmeldingSkjemaState";
import { useInntektsmeldingSkjema } from "~/features/InntektsmeldingSkjemaState";
import { Fremgangsindikator } from "~/features/skjema-moduler/Fremgangsindikator";
import { Inntekt } from "~/features/skjema-moduler/Inntekt";
import {
  NATURALYTELSE_SOM_MISTES_TEMPLATE,
  Naturalytelser,
} from "~/features/skjema-moduler/Naturalytelser";
import { UtbetalingOgRefusjon } from "~/features/skjema-moduler/UtbetalingOgRefusjon.tsx";
import type {
  EndringAvInntektÅrsaker,
  OpplysningerDto,
} from "~/types/api-models.ts";
import { Naturalytelsetype } from "~/types/api-models.ts";
import {
  capitalizeSetning,
  formatDatoLang,
  formatYtelsesnavn,
  gjennomsnittInntekt,
  leggTilGenitiv,
} from "~/utils.ts";

export const Route = createFileRoute("/$id/inntekt-og-refusjon")({
  component: () => (
    <>
      <HjelpetekstToggle />
      <InntektOgRefusjon />
    </>
  ),
});

type JaNei = "ja" | "nei";

export type InntektOgRefusjonForm = {
  skalRefunderes: "JA_LIK_REFUSJON" | "JA_VARIERENDE_REFUSJON" | "NEI";
  misterNaturalytelser: JaNei;
  naturalytelserSomMistes: NaturalytelserSomMistesForm[];
  endringAvInntektÅrsaker: EndringsÅrsakerForm[];
} & Pick<
  InntektsmeldingSkjemaState,
  | "refusjonsendringer"
  | "refusjonsbeløpPerMåned"
  | "inntekt"
  | "korrigertInntekt"
>;

type EndringsÅrsakerForm = {
  årsak: EndringAvInntektÅrsaker | "";
  fom?: string;
  tom?: string;
  bleKjentFom?: string;
};
type NaturalytelserSomMistesForm = {
  navn: Naturalytelsetype | "";
  beløp: number | string;
  fom?: string;
  tom?: string;
  inkluderTom?: JaNei;
};

function InntektOgRefusjon() {
  const { opplysninger } = useLoaderData({ from: "/$id" });

  const { inntektsmeldingSkjemaState, setInntektsmeldingSkjemaState } =
    useInntektsmeldingSkjema();

  const gjennomsnikkInntektFraAOrdning = gjennomsnittInntekt(
    opplysninger.inntekter,
  );

  const inntekt =
    inntektsmeldingSkjemaState.inntekt || gjennomsnikkInntektFraAOrdning;

  const formMethods = useForm<InntektOgRefusjonForm>({
    defaultValues: {
      // Denne ligger i formet, men brukes ikke annet enn for submit
      inntekt,
      korrigertInntekt: inntektsmeldingSkjemaState.korrigertInntekt,
      endringAvInntektÅrsaker:
        inntektsmeldingSkjemaState.endringAvInntektÅrsaker.length === 0
          ? [{ årsak: "" }]
          : inntektsmeldingSkjemaState.endringAvInntektÅrsaker,
      refusjonsbeløpPerMåned:
        inntektsmeldingSkjemaState.refusjonsbeløpPerMåned ||
        gjennomsnikkInntektFraAOrdning,
      skalRefunderes: inntektsmeldingSkjemaState.skalRefunderes,
      misterNaturalytelser: konverterTilRadioValg(
        inntektsmeldingSkjemaState.misterNaturalytelser,
      ),
      naturalytelserSomMistes:
        inntektsmeldingSkjemaState.naturalytelserSomMistes.length === 0
          ? [NATURALYTELSE_SOM_MISTES_TEMPLATE]
          : inntektsmeldingSkjemaState.naturalytelserSomMistes.map(
              (naturalYtelse) => ({
                ...naturalYtelse,
                inkluderTom: konverterTilRadioValg(naturalYtelse.inkluderTom),
              }),
            ),
      refusjonsendringer:
        inntektsmeldingSkjemaState.refusjonsendringer.length === 0
          ? [{ fom: opplysninger.startdatoPermisjon, beløp: inntekt }]
          : inntektsmeldingSkjemaState.refusjonsendringer,
    },
  });

  const { handleSubmit } = formMethods;
  const navigate = useNavigate();

  const onSubmit = handleSubmit((skjemadata) => {
    const {
      refusjonsbeløpPerMåned,
      inntekt,
      skalRefunderes,
      korrigertInntekt,
    } = skjemadata;

    const refusjonsendringer =
      skalRefunderes === "JA_VARIERENDE_REFUSJON"
        ? skjemadata.refusjonsendringer
        : [];

    const misterNaturalytelser = skjemadata.misterNaturalytelser === "ja";
    const naturalytelserSomMistes = misterNaturalytelser
      ? skjemadata.naturalytelserSomMistes.map((naturalYtelse) => ({
          ...naturalYtelse,
          inkluderTom: naturalYtelse.inkluderTom === "ja",
        }))
      : [];
    const endringAvInntektÅrsaker = korrigertInntekt ? skjemadata.endringAvInntektÅrsaker : [];

    setInntektsmeldingSkjemaState((prev) => ({
      ...prev,
      inntekt,
      korrigertInntekt,
      endringAvInntektÅrsaker,
      refusjonsbeløpPerMåned,
      skalRefunderes,
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
      <section className="mt-2">
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
          <UtbetalingOgRefusjon />
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

function konverterTilRadioValg(verdi: boolean | undefined) {
  return verdi === undefined ? undefined : verdi ? "ja" : "nei";
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
      <Informasjonsseksjon
        kilde={`Fra søknaden til ${person.fornavn}`}
        tittel={`${capitalizeSetning(leggTilGenitiv(person.fornavn))} første dag med ${formatYtelsesnavn(ytelse)}`}
      >
        <BodyLong size="medium">{førsteDag}</BodyLong>
      </Informasjonsseksjon>
    </VStack>
  );
}
