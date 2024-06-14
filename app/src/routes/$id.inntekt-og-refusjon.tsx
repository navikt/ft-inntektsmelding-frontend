import { ArrowLeftIcon, ArrowRightIcon } from "@navikt/aksel-icons";
import {
  BodyLong,
  Button,
  Heading,
  Radio,
  RadioGroup,
  VStack,
} from "@navikt/ds-react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { FormProvider, useForm, useFormContext } from "react-hook-form";

import type { OpplysningerDto } from "~/api/queries.ts";
import { hentOpplysningerData } from "~/api/queries.ts";
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
  capitalizeSetning,
  formatDatoLang,
  formatYtelsesnavn,
  leggTilGenitiv,
} from "~/utils.ts";

export const Route = createFileRoute("/$id/inntekt-og-refusjon")({
  component: InntektOgRefusjon,
  loader: ({ params }) => hentOpplysningerData(params.id),
});

export type InntektOgRefusjonForm = {
  skalRefunderes: "ja" | "nei";
  misterNaturalytelser: "ja" | "nei";
} & Pick<InntektsmeldingSkjemaState, "naturalytelserSomMistes">;

function InntektOgRefusjon() {
  const opplysninger = Route.useLoaderData();

  const { inntektsmeldingSkjemaState, setInntektsmeldingSkjemaState } =
    useInntektsmeldingSkjema();
  const formMethods = useForm<InntektOgRefusjonForm>({
    defaultValues: {
      skalRefunderes:
        inntektsmeldingSkjemaState.skalRefunderes === undefined
          ? undefined
          : inntektsmeldingSkjemaState.skalRefunderes
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
    },
  });
  const { handleSubmit } = formMethods;
  const navigate = useNavigate();

  const onSubmit = handleSubmit((skjemadata) => {
    const misterNaturalytelser = skjemadata.misterNaturalytelser === "ja";
    const naturalytelserSomMistes = misterNaturalytelser
      ? skjemadata.naturalytelserSomMistes
      : [];

    setInntektsmeldingSkjemaState((prev) => ({
      ...prev,
      skalRefunderes: skjemadata.skalRefunderes === "ja",
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
        kilde={`Fra søknaden til ${person.navn}`}
        tittel={`${capitalizeSetning(leggTilGenitiv(person.navn))} første dag med ${formatYtelsesnavn(ytelse)}`}
      >
        <BodyLong size="medium">{førsteDag}</BodyLong>
      </InformasjonsseksjonMedKilde>
      <HjelpetekstReadMore header="Hva hvis datoen ikke stemmer?">
        TODO
      </HjelpetekstReadMore>
    </VStack>
  );
}

function UtbetalingOgRefusjon() {
  const { register, formState } = useFormContext<InntektOgRefusjonForm>();
  const { name, ...radioGroupProps } = register("skalRefunderes", {
    required: "Du må svare på dette spørsmålet",
  });
  return (
    <VStack gap="4">
      <hr />
      <Heading id="refusjon" level="4" size="medium">
        Utbetaling og refusjon
      </Heading>
      <HjelpetekstReadMore header="Hva vil det si å ha refusjon?">
        TODO
      </HjelpetekstReadMore>
      <RadioGroup
        error={formState.errors.skalRefunderes?.message}
        legend="Betaler dere lønn under fraværet og krever refusjon?"
        name={name}
      >
        <Radio value="ja" {...radioGroupProps}>
          Ja
        </Radio>
        <Radio value="nei" {...radioGroupProps}>
          Nei
        </Radio>
      </RadioGroup>
    </VStack>
  );
}
