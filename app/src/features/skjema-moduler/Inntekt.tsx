import { PencilIcon } from "@navikt/aksel-icons";
import {
  BodyLong,
  BodyShort,
  Button,
  Heading,
  HGrid,
  Label,
  Link,
  List,
  Select,
  TextField,
} from "@navikt/ds-react";
import { ListItem } from "@navikt/ds-react/List";
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
        <HjelpetekstReadMore header="Har den ansatte hatt ferie eller fravær de siste tre månedene?">
          <div className="flex flex-col gap-2">
            <BodyLong>
              Hvis den ansatte har hatt ferietrekk i en lønnsutbetaling skal
              dette inngå som en del av gjennomsnittet for tre måneder. Du må da
              endre månedslønnen, slik at den representerer et snitt av lønnen
              den ansatte ville hatt uten ferietrekket.
            </BodyLong>
            <BodyLong>
              <strong>Har den ansatte vært borte mer enn 14 dager?</strong>
              <br />
              Hvis den ansatte har vært borte fra jobb i mer enn 14 dager,
              regnes arbeidsforholdet som avbrutt. Hvilken inntekt du oppgir
              avhenger av om den ansatte var tilbake fra jobb etter fraværet:
            </BodyLong>
            <List>
              <ListItem>
                Hvis den ansatte ikke har vært tilbake på jobb, skal du oppgi
                0,- i inntekt. NAV vurderer da søknaden ut fra opplysninger i
                A-meldingen.
              </ListItem>
              <ListItem>
                Hvis den ansatte har vært tilbake i mindre enn 3 måneder, må du
                fastsette månedsinntekten ut fra perioden den ansatte var
                tilbake:
                <List>
                  <ListItem>
                    Hvis den ansatte har fast månedslønn, er det denne du skal
                    bruke
                  </ListItem>
                  <ListItem>
                    Hvis den ansatte har hatt lovlig fravær, skal du bruke
                    inntekten som den ansatte ville hatt hvis han eller hun var
                    på jobb. Lovlig fravær kan for eksempel være på grunn av
                    ferie, sykefravær, foreldrepermisjon eller perioder med
                    pleiepenger.
                  </ListItem>
                  <ListItem>
                    Hvis den ansatte har varierende lønn, og ikke rakk å jobbe
                    tre hele måneder, må du fastsette inntekten for delvise
                    måneder slik: Utbetalt lønn / utførte arbeidsdager x avtalte
                    arbeidsdager for måneden.
                    <br />
                    <em>
                      Eks: Den ansatte skal ha stønad fra 17. november. Det var
                      avtalt 22 arbeidsdager for hele november, og den ansatte
                      jobbet 12 dager frem til første fraværsdag. På disse 12
                      dagene tjente den ansatte 22 000,-. Beregnet inntekt: 22
                      000 / 12 x 22 = 40 333,- månedslønn i november. Denne
                      inntekten tas med i snittet av tre måneder, sammen med
                      september og oktober.
                    </em>
                  </ListItem>
                </List>
              </ListItem>
            </List>
          </div>
        </HjelpetekstReadMore>
        <HjelpetekstReadMore header="Jobber den ansatte skift eller har timelønn?">
          <div className="flex flex-col gap-2">
            <BodyLong>
              Hvis den ansatte jobber skift eller har timelønn, skal fastsettes
              etter de samme reglene som arbeidstakere med fastlønn. Det betyr
              at du som hovedregel skal bruke et gjennomsnitt av inntekten fra
              de siste tre kalendermånedene.
            </BodyLong>
          </div>
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
