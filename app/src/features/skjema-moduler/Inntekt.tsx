import { PencilIcon } from "@navikt/aksel-icons";
import {
  Alert,
  BodyLong,
  BodyShort,
  Button,
  Heading,
  HGrid,
  Label,
  Link,
  ReadMore,
} from "@navikt/ds-react";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { Fragment } from "react";

import { inntektQueryOptions, personinfoQueryOptions } from "~/api/queries.ts";
import { InformasjonsseksjonMedKilde } from "~/features/skjema-moduler/PersonOgSelskapsInformasjonSeksjon.tsx";
import type {
  ForespørselEntitet,
  MånedsinntektResponsDto,
} from "~/types/api-models.ts";
import { capitalizeSetning, formatKroner, leggTilGenitiv } from "~/utils.ts";

type InntektProps = {
  forespørsel: ForespørselEntitet;
};
export function Inntekt({ forespørsel }: InntektProps) {
  const førsteDag = capitalizeSetning(
    format(forespørsel.skjæringstidspunkt, "dd.MM yyyy", {
      locale: nb,
    }),
  );

  const { data: brukerdata } = useSuspenseQuery(
    personinfoQueryOptions(forespørsel.brukerAktørId, forespørsel.ytelseType),
  );

  const inntekt = useQuery(
    inntektQueryOptions({
      ytelse: forespørsel.ytelseType,
      aktorId: forespørsel.brukerAktørId,
      arbeidsgiverIdent: forespørsel.organisasjonsnummer,
      // arbeidsgiverIdent: "896929119", Bruk disse for å faktisk få data
      // aktorId: "2242003545158",
      startdato: format(new Date(), "yyyy-MM-dd"),
    }),
  );

  return (
    <div className="flex flex-col gap-4">
      <hr />
      <Heading level="4" size="medium">
        Beregnet månedslønn
      </Heading>
      <InformasjonsseksjonMedKilde
        kilde="Fra A-Ordningen"
        tittel={`${capitalizeSetning(leggTilGenitiv(brukerdata.navn))} lønn fra de siste tre månedene før ${førsteDag}`}
      >
        <HGrid columns={{ md: "max-content 1fr" }} gap="4">
          {inntekt.data?.map((inntekt) => (
            <Fragment key={inntekt.fom}>
              <span>{navnPåMåned(inntekt.fom)}:</span>
              <Label as="span">{formatKroner(inntekt.beløp)}</Label>
            </Fragment>
          ))}
        </HGrid>
      </InformasjonsseksjonMedKilde>
      <BodyShort>Beregnet månedslønn</BodyShort>
      <strong>{formatKroner(gjennomsnittInntekt(inntekt.data ?? []))}</strong>
      <BodyShort>
        Gjennomsnittet av de siste tre månedene før {førsteDag}
      </BodyShort>
      <Button
        className="w-max"
        icon={<PencilIcon />}
        size="small"
        variant="secondary"
      >
        Endre månedslønn
      </Button>
      <Alert variant="info">
        <Heading level="4" size="xsmall">
          Når må du endre månedslønnen?
        </Heading>
        <BodyLong>
          Hvis den ansatte nylig har fått varig lønnsendring, endring i
          arbeidstid, hatt ubetalt fri eller har andre endringer i lønn må
          månedslønnen korrigeres. Overtid skal ikke inkluderes. Beregningen
          skal gjøres etter{" "}
          <Link
            href="https://lovdata.no/lov/1997-02-28-19/§8-28"
            target="_blank"
          >
            folketrygdloven §8-28.
          </Link>
        </BodyLong>
      </Alert>
      <div className="flex flex-col gap-2">
        <ReadMore header="Hvordan beregne ved fravær i beregningsperioden?">
          TODO
        </ReadMore>
        <ReadMore header="Hvordan beregne ved turnusarbeid eller deltidsstilling?">
          TODO
        </ReadMore>
      </div>
    </div>
  );
}

function gjennomsnittInntekt(inntekter: MånedsinntektResponsDto[]) {
  const summerteInntekter = inntekter.reduce((sum, inntekt) => {
    return sum + inntekt.beløp;
  }, 0);

  return summerteInntekter / (inntekter.length || 1);
}

function navnPåMåned(date: string) {
  const måned = new Intl.DateTimeFormat("no", { month: "long" }).format(
    new Date(date),
  );

  return capitalizeSetning(måned);
}
