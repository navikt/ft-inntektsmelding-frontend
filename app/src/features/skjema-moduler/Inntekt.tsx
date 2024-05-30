import { Detail, Heading, HStack, Label, VStack } from "@navikt/ds-react";
import { useQuery } from "@tanstack/react-query";
import { format, subMonths } from "date-fns";

import { inntektQueryOptions } from "~/api/queries.ts";

export function Inntekt() {
  const inntekt = useQuery(
    inntektQueryOptions({
      ytelse: "FP",
      aktorId: "2715347149890",
      organisasjonsnummer: "974652277",
      startdato: format(subMonths(new Date(), 3), "yyyy-MM-dd"),
    }),
  );
  console.log(inntekt);

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
        <div></div>
      </VStack>
    </>
  );
}
