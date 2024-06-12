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
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { Fragment } from "react";

import type { ForespørselDto } from "~/api/queries";
import { InformasjonsseksjonMedKilde } from "~/features/skjema-moduler/PersonOgSelskapsInformasjonSeksjon.tsx";
import type { MånedsinntektResponsDto } from "~/types/api-models.ts";
import { capitalizeSetning, formatKroner, leggTilGenitiv } from "~/utils.ts";

type InntektProps = {
  inntektsmeldingDialogDto: ForespørselDto;
};
export function Inntekt({ inntektsmeldingDialogDto }: InntektProps) {
  const { startdatoPermisjon, person, inntekter } = inntektsmeldingDialogDto;

  const førsteDag = capitalizeSetning(
    format(startdatoPermisjon, "dd.MM yyyy", {
      locale: nb,
    }),
  );

  return (
    <div className="flex flex-col gap-4">
      <hr />
      <Heading id="beregnet-manedslonn" level="4" size="medium">
        Beregnet månedslønn
      </Heading>
      {/*TODO: Hva skal vi vise når man ikke finner inntekt siste 3mnd*/}
      <InformasjonsseksjonMedKilde
        kilde="Fra A-Ordningen"
        tittel={`${capitalizeSetning(leggTilGenitiv(person.navn))} lønn fra de siste tre månedene før ${førsteDag}`}
      >
        <HGrid columns={{ md: "max-content 1fr" }} gap="4">
          {inntekter?.map((inntekt) => (
            <Fragment key={inntekt.fom}>
              <span>{navnPåMåned(inntekt.fom)}:</span>
              <Label as="span">{formatKroner(inntekt.beløp)}</Label>
            </Fragment>
          ))}
        </HGrid>
      </InformasjonsseksjonMedKilde>
      <BodyShort>Beregnet månedslønn</BodyShort>
      <strong>{formatKroner(gjennomsnittInntekt(inntekter ?? []))}</strong>
      <BodyShort>
        Gjennomsnittet av de siste tre månedene før {førsteDag}
      </BodyShort>
      <Button
        className="w-max"
        icon={<PencilIcon />}
        size="small"
        type="button"
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
  if (!inntekter) {
    return 0;
  }
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
