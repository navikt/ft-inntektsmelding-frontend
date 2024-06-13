import { ArrowLeftIcon, ArrowRightIcon, PlusIcon } from "@navikt/aksel-icons";
import {
  BodyLong,
  Button,
  Heading,
  Radio,
  RadioGroup,
  ReadMore,
  Select,
  TextField,
  VStack,
} from "@navikt/ds-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { Fragment } from "react";
import {
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";

import type { OpplysningerDto } from "~/api/queries.ts";
import { hentOpplysningerData } from "~/api/queries.ts";
import { HjelpetekstReadMore } from "~/features/Hjelpetekst.tsx";
import { DatePickerWrapped } from "~/features/react-hook-form-wrappers/DatePickerWrapped.tsx";
import { RadioGroupWrapped } from "~/features/react-hook-form-wrappers/RadioGroupWrapped.tsx";
import { Fremgangsindikator } from "~/features/skjema-moduler/Fremgangsindikator.tsx";
import { Inntekt } from "~/features/skjema-moduler/Inntekt.tsx";
import { InformasjonsseksjonMedKilde } from "~/features/skjema-moduler/PersonOgSelskapsInformasjonSeksjon.tsx";
import { capitalizeSetning, leggTilGenitiv } from "~/utils.ts";

export const Route = createFileRoute("/$id/inntekt-og-refusjon")({
  component: InntektOgRefusjon,
  loader: ({ params }) => hentOpplysningerData(params.id),
});

function InntektOgRefusjon() {
  const opplysninger = Route.useLoaderData();
  const methods = useForm({
    defaultValues: {
      misterNaturalYtelser: null,
    },
  });

  console.log("values", methods.watch());

  const onSubmit = methods.handleSubmit((v) => {
    console.log(v);
    // setInntektsmeldingSkjemaState((prev) => ({ ...prev, kontaktperson }));
  });

  return (
    <section className="mt-4">
      <FormProvider {...methods}>
        <form
          className="bg-bg-default px-5 py-6 rounded-md flex gap-6 flex-col"
          onSubmit={onSubmit}
        >
          <Heading level="3" size="large">
            Inntekt og refusjon
          </Heading>
          <Fremgangsindikator aktivtSteg={2} />
          <ForeldrepengePeriode opplysninger={opplysninger} />
          <Inntekt opplysninger={opplysninger} />
          <UtbetalingOgRefusjon />
          <Naturalytelser />
          <div className="flex gap-4 justify-center">
            <Button
              as={Link}
              icon={<ArrowLeftIcon />}
              to="../dine-opplysninger"
              type="button"
              variant="secondary"
            >
              Forrige steg
            </Button>
            <Button
              // as={Link}
              // to="../oppsummering"
              icon={<ArrowRightIcon />}
              type="submit"
              variant="primary"
            >
              Neste steg
            </Button>
          </div>
        </form>
      </FormProvider>
    </section>
  );
}

type ForeldrepengePeriodeProps = {
  opplysninger: OpplysningerDto;
};
function ForeldrepengePeriode({ opplysninger }: ForeldrepengePeriodeProps) {
  const { startdatoPermisjon, person } = opplysninger;

  const førsteDag = capitalizeSetning(
    format(startdatoPermisjon, "EEEE dd.MMMM yyyy", {
      locale: nb,
    }),
  );

  return (
    <VStack gap="4">
      <hr />
      <Heading level="4" size="medium">
        Periode med foreldrepenger
      </Heading>
      <InformasjonsseksjonMedKilde
        kilde={`Fra søknaden til ${person.navn}`}
        tittel={`${capitalizeSetning(leggTilGenitiv(person.navn))} første dag med foreldrepenger`}
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
  const misterNaturalYtelser = useFormContext().watch("misterNaturalYtelser");
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
      <RadioGroupWrapped
        legend="Har den ansatte naturalytelser som faller bort ved fraværet?"
        name="misterNaturalYtelser"
      >
        <Radio value={true}>Ja</Radio>
        <Radio value={false}>Nei</Radio>
      </RadioGroupWrapped>
      {misterNaturalYtelser ? <NaturalYtelserFallerBortForm /> : undefined}
    </VStack>
  );
}

const naturalYtelser = [
  "ELEKTRISK_KOMMUNIKASJON",
  "AKSJER_GRUNNFONDSBEVIS_TIL_UNDERKURS",
  "LOSJI",
  "KOST_DØGN",
  "BESØKSREISER_HJEMMET_ANNET",
  "KOSTBESPARELSE_I_HJEMMET",
  "RENTEFORDEL_LÅN",
  "BIL",
  "KOST_DAGER",
  "BOLIG",
  "SKATTEPLIKTIG_DEL_FORSIKRINGER",
  "FRI_TRANSPORT",
  "OPSJONER",
  "TILSKUDD_BARNEHAGEPLASS",
  "ANNET",
  "BEDRIFTSBARNEHAGEPLASS",
  "YRKEBIL_TJENESTLIGBEHOV_KILOMETER",
  "YRKEBIL_TJENESTLIGBEHOV_LISTEPRIS",
  "INNBETALING_TIL_UTENLANDSK_PENSJONSORDNING",
];
function NaturalYtelserFallerBortForm() {
  const { control, register, formState } = useFormContext();
  const { fields, append } = useFieldArray({
    control,
    name: "naturalYtelse",
  });

  console.log("errors", formState.errors);

  return (
    <div className="grid grid-cols-3 gap-4 items-start">
      {fields.map((field, index) => (
        <Fragment key={field.id}>
          <Select
            hideLabel={index > 0}
            label="Naturalytelse som faller bort"
            {...register(`naturalYtelse.${index}.ytelse` as const, {
              required: "Må oppgis",
            })}
            error={formState.errors?.naturalYtelse?.[index]?.ytelse?.message}
          >
            <option value="">Velg naturalytelse</option>
            {naturalYtelser.map((naturalYtelse) => (
              <option key={naturalYtelse} value={naturalYtelse}>
                {naturalYtelse}
              </option>
            ))}
          </Select>
          <DatePickerWrapped
            hideLabel={index > 0}
            label="Fra og med"
            name={`naturalYtelse.${index}.fom`}
            rules={{ required: "Må oppgis" }}
          />
          <TextField
            {...register(`naturalYtelse.${index}.verdi` as const, {
              required: "Må oppgis", // TODO: bedre validering
            })}
            error={formState.errors?.naturalYtelse?.[index]?.verdi?.message}
            hideLabel={index > 0}
            label="Verdi pr.måned"
            size="medium"
          />
        </Fragment>
      ))}
      <Button
        icon={<PlusIcon />}
        onClick={() => append({ fom: null, verdi: "" })}
        size="small"
        type="button"
        variant="secondary"
      >
        Legg til naturalytelse
      </Button>
    </div>
  );
}

function UtbetalingOgRefusjon() {
  return (
    <VStack gap="4">
      <hr />
      <Heading id="refusjon" level="4" size="medium">
        Utbetaling og refusjon
      </Heading>
      <HjelpetekstReadMore header="Hva vil det si å ha refusjon?">
        TODO
      </HjelpetekstReadMore>
      <RadioGroup legend="Betaler dere lønn under fraværet og krever refusjon?">
        {/*TODO: hvordan representere ja/nei radio best egentlig?*/}
        <Radio value="JA">Ja</Radio>
        <Radio value="NEI">Nei</Radio>
      </RadioGroup>
    </VStack>
  );
}
