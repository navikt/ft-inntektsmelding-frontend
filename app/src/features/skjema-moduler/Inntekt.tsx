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
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { Fragment } from "react";
import { useFormContext } from "react-hook-form";

import type { OpplysningerDto } from "~/api/queries";
import {
  HjelpetekstAlert,
  HjelpetekstReadMore,
} from "~/features/Hjelpetekst.tsx";
import { DatePickerWrapped } from "~/features/react-hook-form-wrappers/DatePickerWrapped.tsx";
import type { InntektOgRefusjonForm } from "~/routes/$id.inntekt-og-refusjon.tsx";
import type { ÅrsaksType } from "~/types/api-models.ts";
import {
  capitalizeSetning,
  formatDatoKort,
  formatKroner,
  gjennomsnittInntekt,
  leggTilGenitiv,
} from "~/utils.ts";

import { InformasjonsseksjonMedKilde } from "../InformasjonsseksjonMedKilde";
import { useDisclosure } from "../useDisclosure";

type InntektProps = {
  opplysninger: OpplysningerDto;
};
export function Inntekt({ opplysninger }: InntektProps) {
  const { startdatoPermisjon, person, inntekter } = opplysninger;
  const { watch } = useFormContext<InntektOgRefusjonForm>();
  const inntektEndringsÅrsak = watch("inntektEndringsÅrsak");
  const { isOpen, onOpen, onClose } = useDisclosure(!!inntektEndringsÅrsak);

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

      {isOpen ? (
        <EndreMånedslønn onClose={onClose} opplysninger={opplysninger} />
      ) : (
        <>
          <BodyShort>Beregnet månedslønn</BodyShort>
          <strong>{formatKroner(gjennomsnittInntekt(inntekter ?? []))}</strong>
          <BodyShort>
            Gjennomsnittet av de siste tre månedene før {førsteDag}
          </BodyShort>
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
        </>
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

// const endringsårsak = [
//   { value: "FERIE", label: "Ferie" },
//   { value: "VARIG_LØNNSENDRING", label: "Varig lønnsendring" },
//   { value: "PERMISJON", label: "Permisjon" },
//   { value: "PERMITTERING", label: "Permittering" },
//   { value: "NY_STILLING", label: "Ny stilling" },
//   { value: "NY_STILLINGSPROSENT", label: "Ny stillingsprosent" },
//   { value: "BONUS", label: "Bonus" },
//   { value: "NYANSATT", label: "Nyansatt" },
//   { value: "SYKEFRAVÆR", label: "Sykefravær" },
//   {
//     value: "FERIETREKK_UTBETALING_AV_FERIEPENGER",
//     label: "Ferietrekk / utbetaling av feriepenger",
//   },
//   {
//     value: "MANGELFULL_ELLER_URIKTIG_RAPPORTERING_TIL_AORDNINGEN",
//     label: "Mangelfull eller uriktig rapportering til A-ordningen",
//   },
// ];

const endringsårsak2 = [
  { value: "Tariffendring", label: "Tariffendring" },
  { value: "FeilInntekt", label: "Varig feil inntekt" },
];

const NØDVENDIGE_FELTER_FOR_ÅRSAK: Record<
  ÅrsaksType,
  { fom: boolean; tom: boolean }
> = {
  Tariffendring: { fom: true, tom: true },
  FeilInntekt: { fom: true, tom: false },
};

type EndreMånedslønnProps = {
  onClose: () => void;
  opplysninger: OpplysningerDto;
};
const EndreMånedslønn = ({ onClose, opplysninger }: EndreMånedslønnProps) => {
  const { startdatoPermisjon } = opplysninger;

  const { register, watch, formState, unregister } =
    useFormContext<InntektOgRefusjonForm>();

  const tilbakestillOgLukk = () => {
    unregister("inntektEndringsÅrsak");
    onClose();
  };

  const årsak = watch("inntektEndringsÅrsak.årsak");
  const inntekt = watch("inntekt");

  return (
    <div>
      <div className="flex items-start gap-4">
        <TextField
          {...register("inntektEndringsÅrsak.korrigertInntekt", {
            min: { value: 1, message: "Må være mer enn 0" },
            required: "Må oppgis",
            value: inntekt,
            shouldUnregister: true,
          })}
          error={
            formState.errors.inntektEndringsÅrsak?.korrigertInntekt?.message
          }
          inputMode="numeric"
          label={`Månedsinntekt ${formatDatoKort(new Date(startdatoPermisjon))}`}
        />

        <Select
          className="flex-1"
          error={formState.errors.inntektEndringsÅrsak?.årsak?.message}
          label="Velg endringsårsak"
          {...register("inntektEndringsÅrsak.årsak", {
            required: "Må oppgis",
            shouldUnregister: true,
          })}
        >
          <option value="">Velg endringsårsak</option>
          {Object.values(endringsårsak2).map((årsak) => (
            <option key={årsak.value} value={årsak.value}>
              {årsak.label}
            </option>
          ))}
        </Select>
        <Button
          className="mt-8"
          onClick={tilbakestillOgLukk}
          variant="tertiary"
        >
          Tilbakestill
        </Button>
      </div>
      <div className="flex gap-4 mt-4">
        {NØDVENDIGE_FELTER_FOR_ÅRSAK[årsak]?.fom ? (
          <DatePickerWrapped
            label="Fra og med"
            name="inntektEndringsÅrsak.fom"
            rules={{ required: "Må oppgis" }}
          />
        ) : undefined}
        {NØDVENDIGE_FELTER_FOR_ÅRSAK[årsak]?.tom ? (
          <DatePickerWrapped
            label="Til og med"
            name="inntektEndringsÅrsak.tom"
            rules={{ required: "Må oppgis" }}
          />
        ) : undefined}
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
