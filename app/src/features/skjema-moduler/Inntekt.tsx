import { PencilIcon } from "@navikt/aksel-icons";
import {
  BodyLong,
  BodyShort,
  Button,
  Heading,
  HGrid,
  Label,
  Link,
  Select,
  TextField,
} from "@navikt/ds-react";
import { getRouteApi } from "@tanstack/react-router";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { Fragment } from "react";

import type { OpplysningerDto } from "~/api/queries";
import {
  HjelpetekstAlert,
  HjelpetekstReadMore,
} from "~/features/Hjelpetekst.tsx";
import {

  capitalizeSetning,
  formatDatoKort,
  formatKroner,
 gjennomsnittInntekt, leggTilGenitiv,
} from "~/utils.ts";

import { InformasjonsseksjonMedKilde } from "../InformasjonsseksjonMedKilde";
import { useInntektsmeldingSkjema } from "../InntektsmeldingSkjemaState";
import { useDisclosure } from "../useDisclosure";

const Route = getRouteApi("/$id/inntekt-og-refusjon");

type InntektOgRefusjonForm = {
  korrigertMånedslønn: number;
  endringsårsak: string;
  ekstraData: { [key: string]: string }[];
};

type InntektProps = {
  opplysninger: OpplysningerDto;
};
export function Inntekt({ opplysninger }: InntektProps) {
  const { startdatoPermisjon, person, inntekter } = opplysninger;
  const { isOpen, onOpen, onClose } = useDisclosure();

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
        tittel={`${capitalizeSetning(leggTilGenitiv(person.fornavn))} lønn fra de siste tre månedene før ${førsteDag}`}
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
      {isOpen ? (
        <EndreMånedslønn onClose={onClose} />
      ) : (
        <Button
          className="w-max"
          icon={<PencilIcon />}
          onClick={onOpen}
          size="small"
          type="button"
          variant="secondary"
        >
          Endre månedslønn
        </Button>
      )}
      <HjelpetekstAlert>
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
      </HjelpetekstAlert>
      <div className="flex flex-col gap-2">
        <HjelpetekstReadMore header="Hvordan beregne ved fravær i beregningsperioden?">
          TODO
        </HjelpetekstReadMore>
        <HjelpetekstReadMore header="Hvordan beregne ved turnusarbeid eller deltidsstilling?">
          TODO
        </HjelpetekstReadMore>
      </div>
    </div>
  );
}

const endringsårsak = [
  { value: "FERIE", label: "Ferie" },
  { value: "VARIG_LØNNSENDRING", label: "Varig lønnsendring" },
  { value: "PERMISJON", label: "Permisjon" },
  { value: "PERMITTERING", label: "Permittering" },
  { value: "NY_STILLING", label: "Ny stilling" },
  { value: "NY_STILLINGSPROSENT", label: "Ny stillingsprosent" },
  { value: "BONUS", label: "Bonus" },
  { value: "NYANSATT", label: "Nyansatt" },
  { value: "SYKEFRAVÆR", label: "Sykefravær" },
  {
    value: "FERIETREKK_UTBETALING_AV_FERIEPENGER",
    label: "Ferietrekk / utbetaling av feriepenger",
  },
  {
    value: "MANGELFULL_ELLER_URIKTIG_RAPPORTERING_TIL_AORDNINGEN",
    label: "Mangelfull eller uriktig rapportering til A-ordningen",
  },
];

type EndreMånedslønnProps = {
  onClose: () => void;
};
const EndreMånedslønn = ({ onClose }: EndreMånedslønnProps) => {
  const { startdatoPermisjon } = Route.useLoaderData();
  const { inntektsmeldingSkjemaState } = useInntektsmeldingSkjema();
  return (
    <div>
      <div className="flex align-center gap-4">
        <TextField
          label={`Månedsinntekt ${formatDatoKort(new Date(startdatoPermisjon))}`}
        />
        <Select label="Endringsårsak">
          {Object.values(endringsårsak).map((årsak) => (
            <option key={årsak.value} value={årsak.value}>
              {årsak.label}
            </option>
          ))}
        </Select>
        <Button onClick={onClose} variant="tertiary">
          Tilbakestill
        </Button>
        {/* TODO: Legg til egne felter for  */}
      </div>
    </div>
  );
};

function navnPåMåned(date: string) {
  const måned = new Intl.DateTimeFormat("no", { month: "long" }).format(
    new Date(date),
  );

  return capitalizeSetning(måned);
}
