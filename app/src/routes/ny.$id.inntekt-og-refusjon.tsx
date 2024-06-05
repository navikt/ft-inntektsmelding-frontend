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
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { nb } from "date-fns/locale";

import {
  forespørselQueryOptions,
  personinfoQueryOptions,
} from "~/api/queries.ts";
import { Inntekt } from "~/features/skjema-moduler/Inntekt.tsx";
import { InformasjonsseksjonMedKilde } from "~/features/skjema-moduler/PersonOgSelskapsInformasjonSeksjon.tsx";
import { Fremgangsindikator } from "~/features/skjema-moduler/Skjemafremgang.tsx";
import type { ForespørselEntitet } from "~/types/api-models.ts";
import { capitalizeSetning, leggTilGenitiv } from "~/utils.ts";

export const Route = createFileRoute("/ny/$id/inntekt-og-refusjon")({
  component: InntektOgRefusjon,
});

function InntektOgRefusjon() {
  const { id } = Route.useParams();
  const forespørsel = useSuspenseQuery(forespørselQueryOptions(id)).data;

  return (
    <section className="mt-6">
      <form className="bg-bg-default px-5 py-6 rounded-md flex gap-6 flex-col">
        <Heading level="3" size="large">
          Inntekt og refusjon
        </Heading>
        <Fremgangsindikator aktivtSteg={2} />
        <ForeldrepengePeriode forespørsel={forespørsel} />
        <Inntekt forespørsel={forespørsel} />
        <UtbetalingOgRefusjon />
        <Naturalytelser />
        <div className="flex gap-4 justify-center">
          <Button
            as={Link}
            icon={<ArrowLeftIcon />}
            to="../dine-opplysninger"
            variant="secondary"
            // TODO: bruker knapper som lenker? Ser ut til å miste Router sin type-safety
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
  forespørsel: ForespørselEntitet;
};
function ForeldrepengePeriode({ forespørsel }: ForeldrepengePeriodeProps) {
  const { data: brukerdata } = useSuspenseQuery(
    personinfoQueryOptions(forespørsel.brukerAktørId, forespørsel.ytelseType),
  );

  const førsteDag = capitalizeSetning(
    format(forespørsel.skjæringstidspunkt, "EEEE dd.MMMM yyyy", {
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
        kilde={`Fra søknaden til ${brukerdata.navn}`}
        tittel={`${capitalizeSetning(leggTilGenitiv(brukerdata.navn))} første dag med foreldrepenger`}
      >
        <BodyLong size="medium">{førsteDag}</BodyLong>
      </InformasjonsseksjonMedKilde>
      <ReadMore header="Hva hvis datoen ikke stemmer?">TODO</ReadMore>
    </VStack>
  );
}

function Naturalytelser() {
  return (
    <VStack gap="4">
      <hr />
      <Heading level="4" size="medium">
        Naturalytelser
      </Heading>
      <ReadMore header="Hva er naturalytelser?">
        <BodyLong>
          Naturalytelser er skattepliktige goder eller fordeler en ansatt får
          fra arbeidsgiver på toppen av vanlig lønn.
          <br />
          Eksempler på naturalytelser er: Forsikring, bruk av firmabil,
          mobiltelefon og internett-abonnement.
        </BodyLong>
      </ReadMore>
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
      <Heading level="4" size="medium">
        Utbetaling og refusjon
      </Heading>
      <ReadMore header="Hva vil det si å ha refusjon?">TODO</ReadMore>
      <RadioGroup legend="Betaler dere lønn under fraværet og krever refusjon?">
        {/*TODO: hvordan representere ja/nei radio best egentlig?*/}
        <Radio value="JA">Ja</Radio>
        <Radio value="NEI">Nei</Radio>
      </RadioGroup>
    </VStack>
  );
}
