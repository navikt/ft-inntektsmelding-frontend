import { ArrowLeftIcon, ArrowRightIcon } from "@navikt/aksel-icons";
import {
  BodyLong,
  Button,
  Heading,
  Radio,
  RadioGroup,
  ReadMore,
  VStack,
} from "@navikt/ds-react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { FormProvider, useForm, useFormContext } from "react-hook-form";

import type { OpplysningerDto } from "~/api/queries.ts";
import { hentOpplysningerData } from "~/api/queries.ts";
import { HjelpetekstReadMore } from "~/features/Hjelpetekst";
import { InformasjonsseksjonMedKilde } from "~/features/InformasjonsseksjonMedKilde";
import { useInntektsmeldingSkjema } from "~/features/InntektsmeldingSkjemaState";
import { Fremgangsindikator } from "~/features/skjema-moduler/Fremgangsindikator.tsx";
import { Inntekt } from "~/features/skjema-moduler/Inntekt.tsx";
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

type InntektOgRefusjonForm = {
  skalRefunderes: "ja" | "nei";
  misterNaturalytelser: "ja" | "nei";
};

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
    },
  });
  const { handleSubmit } = formMethods;
  const navigate = useNavigate();

  const onSubmit = handleSubmit((skjemadata) => {
    setInntektsmeldingSkjemaState((prev) => ({
      ...prev,
      skalRefunderes: skjemadata.skalRefunderes === "ja",
      misterNaturalytelser: skjemadata.misterNaturalytelser === "ja",
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
            <Button icon={<ArrowRightIcon />} type="submit" variant="primary">
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

function Naturalytelser() {
  const { register, formState } = useFormContext<InntektOgRefusjonForm>();
  const { onChange, name, ...radioGroupProps } = register(
    "misterNaturalytelser",
    {
      required: "Du må svare på dette spørsmålet",
    },
  );
  return (
    <VStack gap="4">
      <hr />
      <Heading id="naturalytelser" level="4" size="medium">
        Naturalytelser
      </Heading>
      <HjelpetekstReadMore header="Hva er naturalytelser?">
        <BodyLong>
          Naturalytelser er skattepliktige goder eller fordeler en ansatt får
          fra arbeidsgiver på toppen av vanlig lønn.
          <br />
          Eksempler på naturalytelser er: Forsikring, bruk av firmabil,
          mobiltelefon og internett-abonnement.
        </BodyLong>
      </HjelpetekstReadMore>
      <RadioGroup
        error={formState.errors.misterNaturalytelser?.message}
        legend="Har den ansatte naturalytelser som faller bort ved fraværet?"
        name={name}
        onChange={(value) => onChange({ target: { value } })}
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

function UtbetalingOgRefusjon() {
  const { register, formState } = useFormContext<InntektOgRefusjonForm>();
  const { onChange, name, ...radioGroupProps } = register("skalRefunderes", {
    required: "Du må svare på dette spørsmålet",
  });
  return (
    <VStack gap="4">
      <hr />
      <Heading id="refusjon" level="4" size="medium">
        Utbetaling og refusjon
      </Heading>
      <ReadMore header="Hva vil det si å ha refusjon?">TODO</ReadMore>
      <RadioGroup
        error={formState.errors.skalRefunderes?.message}
        legend="Betaler dere lønn under fraværet og krever refusjon?"
        name={name}
        onChange={(value) => onChange({ target: { value } })}
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
