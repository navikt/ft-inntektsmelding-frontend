import { ArrowLeftIcon, ArrowRightIcon } from "@navikt/aksel-icons";
import { BodyLong, Button, Heading, VStack } from "@navikt/ds-react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { FormProvider, useForm } from "react-hook-form";

import {
  HjelpetekstReadMore,
  HjelpetekstToggle,
} from "~/features/Hjelpetekst.tsx";
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
import { useDocumentTitle } from "~/features/useDocumentTitle";
import type { EndringAvInntektÅrsaker } from "~/types/api-models.ts";
import { Naturalytelsetype } from "~/types/api-models.ts";
import {
  capitalize,
  capitalizeSetning,
  formatDatoLang,
  formatYtelsesnavn,
  gjennomsnittInntekt,
  leggTilGenitiv,
} from "~/utils.ts";
import { useOpplysninger } from "~/views/ny-inntektsmelding/OpplysningerContext";

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
  "refusjon" | "inntekt" | "korrigertInntekt"
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
  const opplysninger = useOpplysninger();
  useDocumentTitle(
    `Inntekt og refusjon – inntektsmelding for ${formatYtelsesnavn(opplysninger.ytelse)}`,
  );

  const { inntektsmeldingSkjemaState, setInntektsmeldingSkjemaState } =
    useInntektsmeldingSkjema();

  const gjennomsnittInntektFraAOrdning = gjennomsnittInntekt(
    opplysninger.inntekter,
  );

  const inntekt =
    inntektsmeldingSkjemaState.inntekt || gjennomsnittInntektFraAOrdning;

  const formMethods = useForm<InntektOgRefusjonForm>({
    defaultValues: {
      // Denne ligger i formet, men brukes ikke annet enn for submit
      inntekt,
      korrigertInntekt:
        (inntektsmeldingSkjemaState.korrigertInntekt ??
        inntektsmeldingSkjemaState.endringAvInntektÅrsaker.length > 0)
          ? inntektsmeldingSkjemaState.inntekt
          : undefined,
      endringAvInntektÅrsaker:
        inntektsmeldingSkjemaState.endringAvInntektÅrsaker.length === 0
          ? [{ årsak: "" }]
          : inntektsmeldingSkjemaState.endringAvInntektÅrsaker,
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
      refusjon:
        inntektsmeldingSkjemaState.refusjon.length === 0
          ? [
              { fom: opplysninger.startdatoPermisjon, beløp: inntekt },
              { fom: undefined, beløp: 0 },
            ]
          : inntektsmeldingSkjemaState.refusjon.length === 1
            ? [
                ...inntektsmeldingSkjemaState.refusjon,
                { fom: undefined, beløp: 0 },
              ]
            : inntektsmeldingSkjemaState.refusjon,
    },
  });

  const { handleSubmit } = formMethods;
  const navigate = useNavigate();

  const onSubmit = handleSubmit((skjemadata) => {
    const { refusjon, inntekt, skalRefunderes, korrigertInntekt } = skjemadata;

    const misterNaturalytelser = skjemadata.misterNaturalytelser === "ja";
    const naturalytelserSomMistes = misterNaturalytelser
      ? skjemadata.naturalytelserSomMistes.map((naturalYtelse) => ({
          ...naturalYtelse,
          inkluderTom: naturalYtelse.inkluderTom === "ja",
        }))
      : [];
    const endringAvInntektÅrsaker = korrigertInntekt
      ? skjemadata.endringAvInntektÅrsaker
      : [];

    setInntektsmeldingSkjemaState((prev) => ({
      ...prev,
      inntekt,
      korrigertInntekt,
      endringAvInntektÅrsaker,
      refusjon,
      skalRefunderes,
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
          <Ytelsesperiode />
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

function Ytelsesperiode() {
  const opplysninger = useOpplysninger();
  const { startdatoPermisjon, person, ytelse } = opplysninger;

  const førsteDag = capitalize(formatDatoLang(new Date(startdatoPermisjon)));

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
      <HjelpetekstReadMore header="Hva betyr dette?">
        <>
          Dette er den første dagen den ansatte har søkt om{" "}
          {formatYtelsesnavn(ytelse)}. Det betyr at NAV trenger opplysninger om
          den ansattes inntekt på denne datoen. Vi baserer oss på datoen som er
          oppgitt i søknaden, du kan derfor ikke endre denne i
          inntektsmeldingen. <br />
          <br />
          Hvis du er usikker på om dette er riktig dato for første fraværsdag,
          må du kontakte den ansatte før du sender inntektsmeldingen. Hvis den
          ansatte endrer søknadsperioden, vil du få en ny oppgave med riktig
          dato for første fraværsdag.
        </>
      </HjelpetekstReadMore>
    </VStack>
  );
}
