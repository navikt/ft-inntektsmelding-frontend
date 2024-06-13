import { ArrowLeftIcon, ArrowRightIcon } from "@navikt/aksel-icons";
import {
  BodyLong,
  Button,
  Heading,
  Radio,
  RadioGroup,
  VStack,
} from "@navikt/ds-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { nb } from "date-fns/locale";

import type { OpplysningerDto } from "~/api/queries.ts";
import { hentOpplysningerData } from "~/api/queries.ts";
import { HjelpetekstReadMore } from "~/features/HjelpeTekst.tsx";
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

  return (
    <section className="mt-4">
      <form className="bg-bg-default px-5 py-6 rounded-md flex gap-6 flex-col">
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
            variant="secondary"
          >
            Forrige steg
          </Button>
          <Button
            as={Link}
            icon={<ArrowRightIcon />}
            to="../oppsummering"
            variant="primary"
          >
            Neste steg
          </Button>
        </div>
      </form>
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
      <RadioGroup legend="Har den ansatte naturalytelser som faller bort ved fraværet?">
        {/*TODO: hvordan representere ja/nei radio best egentlig?*/}
        <Radio value="JA">Ja</Radio>
        <Radio value="NEI">Nei</Radio>
      </RadioGroup>
    </VStack>
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
