import {
  Detail,
  Heading,
  HGrid,
  HStack,
  Label,
  VStack,
} from "@navikt/ds-react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Fragment } from "react";

import { inntektQueryOptions } from "~/api/queries.ts";

export function Inntekt() {
  const inntekt = useQuery(
    inntektQueryOptions({
      aktorId: "2242003545158",
      ytelse: "FORELDREPENGER",
      arbeidsgiverIdent: "896929119",
      startdato: format(new Date(), "yyyy-MM-dd"),
    }),
  );

  return (
    <>
      <Heading level="2" size="large">
        Månedslønn
      </Heading>
      <VStack gap="2">
        <HStack justify="space-between">
          <Label size="small">Utbetalt lønn de siste tre månedene: </Label>
          <Detail>fra A-ordningen</Detail>
        </HStack>
        <HGrid columns={{ md: 2 }} gap="6">
          {inntekt.data?.map((inntekt) => (
            <Fragment key={inntekt.fom}>
              <span>{navnPåMåned(inntekt.fom)}</span>
              <span>{inntekt.beløp}</span>
            </Fragment>
          ))}
        </HGrid>
      </VStack>
    </>
  );
}

function navnPåMåned(date: string) {
  const måned = new Intl.DateTimeFormat("no", { month: "long" }).format(
    new Date(date),
  );

  return måned.charAt(0).toUpperCase() + måned.slice(1);
}
