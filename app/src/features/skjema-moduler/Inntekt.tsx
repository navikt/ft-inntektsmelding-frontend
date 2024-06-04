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
  VStack,
} from "@navikt/ds-react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Fragment } from "react";

import { inntektQueryOptions } from "~/api/queries.ts";
import { InformasjonsseksjonMedKilde } from "~/features/skjema-moduler/PersonOgSelskapsInformasjonSeksjon.tsx";
import type { MånedsinntektResponsDto } from "~/types/api-models.ts";

export function Inntekt() {
  const inntekt = useQuery(
    inntektQueryOptions({
      aktorId: "2242003545158", //TODO: Dynamisk
      ytelse: "FORELDREPENGER",
      arbeidsgiverIdent: "896929119",
      startdato: format(new Date(), "yyyy-MM-dd"),
    }),
  );

  return (
    <VStack gap="4">
      <hr />
      <Heading level="4" size="medium">
        Beregnet månedslønn
      </Heading>
      <InformasjonsseksjonMedKilde
        kilde="Fra A-Ordningen"
        tittel="{PERSON}s lønn fra de siste tre månedene før {DATO}"
      >
        <HGrid columns={{ md: "max-content 1fr" }} gap="4">
          {inntekt.data?.map((inntekt) => (
            <Fragment key={inntekt.fom}>
              <span>{navnPåMåned(inntekt.fom)}:</span>
              <Label as="span">
                {Intl.NumberFormat("nb-no", {
                  style: "currency",
                  currency: "NOK",
                  maximumFractionDigits: 0,
                }).format(inntekt.beløp)}
              </Label>
            </Fragment>
          ))}
        </HGrid>
      </InformasjonsseksjonMedKilde>
      <BodyShort>Beregnet månedslønn</BodyShort>
      <b>{formatKroner(gjennomsnittInntekt(inntekt.data ?? []))}</b>
      <BodyShort>Gjennomsnittet av de siste tre månedene før DATO</BodyShort>
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
      <VStack gap="2">
        <ReadMore header="Hvordan beregne ved fravær i beregningsperioden?">
          TODO
        </ReadMore>
        <ReadMore header="Hvordan beregne ved turnusarbeid eller deltidsstilling?">
          TODO
        </ReadMore>
      </VStack>
    </VStack>
  );
}

// TODO: util
function formatKroner(kroner: number) {
  return Intl.NumberFormat("nb-no", {
    style: "currency",
    currency: "NOK",
    maximumFractionDigits: 0,
  }).format(kroner);
}

function gjennomsnittInntekt(inntekter: MånedsinntektResponsDto[]) {
  const summerteInntekter = inntekter.reduce((sum, inntekt) => {
    return sum + inntekt.beløp;
  }, 0);

  return summerteInntekter / inntekter.length;
}

function navnPåMåned(date: string) {
  const måned = new Intl.DateTimeFormat("no", { month: "long" }).format(
    new Date(date),
  );

  return måned.charAt(0).toUpperCase() + måned.slice(1);
}
