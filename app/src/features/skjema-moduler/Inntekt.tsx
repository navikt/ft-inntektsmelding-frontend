import {
  ArrowUndoIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "@navikt/aksel-icons";
import {
  Alert,
  BodyLong,
  BodyShort,
  Button,
  Heading,
  HGrid,
  Label,
  Link,
  List,
  Select,
  Stack,
  TextField,
  VStack,
} from "@navikt/ds-react";
import { ListItem } from "@navikt/ds-react/List";
import { useLoaderData } from "@tanstack/react-router";
import clsx from "clsx";
import { Fragment } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import {
  HjelpetekstAlert,
  HjelpetekstReadMore,
} from "~/features/Hjelpetekst.tsx";
import { DatePickerWrapped } from "~/features/react-hook-form-wrappers/DatePickerWrapped.tsx";
import type { InntektOgRefusjonForm } from "~/routes/$id.inntekt-og-refusjon.tsx";
import {
  EndringAvInntektÅrsaker,
  OpplysningerDto,
} from "~/types/api-models.ts";
import {
  capitalizeSetning,
  formatDatoKort,
  formatKroner,
  gjennomsnittInntekt,
  leggTilGenitiv,
} from "~/utils.ts";

import { Informasjonsseksjon } from "../Informasjonsseksjon";
import { useDisclosure } from "../useDisclosure";

type InntektProps = {
  opplysninger: OpplysningerDto;
};
export function Inntekt({ opplysninger }: InntektProps) {
  const { startdatoPermisjon, person, inntekter } = opplysninger;
  const { watch } = useFormContext<InntektOgRefusjonForm>();
  const { isOpen, onOpen, onClose } = useDisclosure(
    !!watch("korrigertInntekt"),
  );
  const førsteDag = formatDatoKort(new Date(startdatoPermisjon));

  return (
    <div className="flex flex-col gap-4">
      <hr />
      <Heading id="beregnet-manedslonn" level="4" size="medium">
        Beregnet månedslønn
      </Heading>
      <Informasjonsseksjon
        kilde="Fra A-Ordningen"
        tittel={`${capitalizeSetning(leggTilGenitiv(person.fornavn))} lønn fra de siste tre månedene før ${førsteDag}`}
      >
        <HGrid columns={{ md: "max-content 1fr" }} gap="4">
          {/* TODO: Sorter på månedsnavn */}
          {inntekter?.map((inntekt) => (
            <Fragment key={inntekt.fom}>
              <span>{navnPåMåned(inntekt.fom)}:</span>
              <Label as="span">{formatKroner(inntekt.beløp) || "-"}</Label>
            </Fragment>
          ))}
        </HGrid>
      </Informasjonsseksjon>

      {inntekter.some((inntekt) => inntekt.beløp === undefined) && (
        <Alert variant="warning">
          <Heading size="xsmall" spacing>
            Lønnsopplysningene inneholder måneder uten rapportert inntekt
          </Heading>
          <BodyShort>
            Vi estimerer beregnet månedslønn til et snitt av innrapportert
            inntekt for de siste tre månedene. Hvis dere ser at det skal være en
            annen beregnet månedslønn, må dere endre dette manuelt.
          </BodyShort>
        </Alert>
      )}

      <VStack gap="1">
        <BodyShort>Beregnet månedslønn</BodyShort>
        <strong
          className={clsx(
            "text-heading-medium",
            isOpen && "text-text-subtle line-through",
          )}
        >
          {formatKroner(gjennomsnittInntekt(inntekter))}
        </strong>
        <BodyShort>
          Gjennomsnittet av de siste tre månedene før {førsteDag}
        </BodyShort>
      </VStack>
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
          Er månedslønnen riktig?
        </Heading>
        <BodyLong>
          Har den ansatte i løpet av de siste tre månedene fått varig
          lønnsendring, stillingsprosent eller hatt lovlig fravær som påvirker
          lønnsutbetalingen, skal månedslønnen korrigeres. Overtid skal ikke
          inkluderes. Beregningen skal gjøres etter{" "}
          <Link
            href="https://lovdata.no/nav/folketrygdloven/kap8/%C2%A78-28"
            target="_blank"
          >
            folketrygdloven §8-28.
          </Link>
        </BodyLong>
      </HjelpetekstAlert>
      <div className="flex flex-col gap-2">
        <HjelpetekstReadMore header="Har den ansatte hatt ferie eller fravær de siste tre månedene?">
          <Stack gap="2">
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
          </Stack>
        </HjelpetekstReadMore>
        <HjelpetekstReadMore header="Jobber den ansatte skift eller har timelønn?">
          <BodyLong>
            Hvis den ansatte jobber skift eller har timelønn, skal fastsettes
            etter de samme reglene som arbeidstakere med fastlønn. Det betyr at
            du som hovedregel skal bruke et gjennomsnitt av inntekten fra de
            siste tre kalendermånedene.
          </BodyLong>
        </HjelpetekstReadMore>
      </div>
    </div>
  );
}

export const endringsårsak = [
  { value: "FERIE", label: "Ferie" },
  { value: "VARIG_LØNNSENDRING", label: "Varig lønnsendring" },
  { value: "PERMISJON", label: "Permisjon" },
  { value: "PERMITTERING", label: "Permittering" },
  { value: "NY_STILLING", label: "Ny stilling" },
  { value: "NY_STILLINGSPROSENT", label: "Ny stillingsprosent" },
  { value: "BONUS", label: "Bonus" },
  { value: "NYANSATT", label: "Nyansatt" },
  { value: "SYKEFRAVÆR", label: "Sykefravær" },
  { value: "TARIFFENDRING", label: "Tariffendring" },
  {
    value: "FERIETREKK_ELLER_UTBETALING_AV_FERIEPENGER",
    label: "Ferietrekk / utbetaling av feriepenger",
  },
  {
    value: "MANGELFULL_RAPPORTERING_AORDNING",
    label: "Mangelfull eller uriktig rapportering til A-ordningen",
  },
] satisfies { value: EndringAvInntektÅrsaker; label: string }[];

type EndreMånedslønnProps = {
  onClose: () => void;
};
const EndreMånedslønn = ({ onClose }: EndreMånedslønnProps) => {
  const { register, watch, formState, unregister } =
    useFormContext<InntektOgRefusjonForm>();
  const tilbakestillOgLukk = () => {
    unregister("korrigertInntekt");
    onClose();
  };

  const inntekt = watch("inntekt");

  return (
    <>
      <div className="flex items-start gap-4">
        <TextField
          {...register("korrigertInntekt", {
            min: { value: 1, message: "Må være mer enn 0" },
            required: "Må oppgis",
            value: inntekt,
          })}
          error={formState.errors.korrigertInntekt?.message}
          inputMode="numeric"
          label="Endret månedsinntekt"
        />
        <Button
          className="mt-8"
          icon={<ArrowUndoIcon aria-hidden />}
          onClick={tilbakestillOgLukk}
          type="button"
          variant="tertiary"
        >
          Tilbakestill
        </Button>
      </div>
      <EndringsÅrsaker />
    </>
  );
};

export const ENDRINGSÅRSAK_TEMPLATE = {
  fom: undefined,
  tom: undefined,
  bleKjentFom: undefined,
  årsak: "" as const,
};

function EndringsÅrsaker() {
  const { eksisterendeInntektsmeldinger } = useLoaderData({ from: "/$id" });

  const { control, register, formState } =
    useFormContext<InntektOgRefusjonForm>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "endringAvInntektÅrsaker",
  });

  // Tariffendring skal kun være tilgjengelig dersom man endrer en IM, ikke for førstegangs-innsendelse
  const muligeÅrsakerValg =
    eksisterendeInntektsmeldinger.length > 0
      ? Object.values(endringsårsak)
      : Object.values(endringsårsak).filter(
          (årsak) => årsak.value !== "TARIFFENDRING",
        );

  return (
    <HGrid columns="1fr max-content max-content max-content" gap="4">
      {fields.map((field, index) => {
        return (
          <Fragment key={field.id}>
            <Select
              error={
                formState.errors?.endringAvInntektÅrsaker?.[index]?.årsak
                  ?.message
              }
              label="Hva er årsaken til endringen?"
              {...register(`endringAvInntektÅrsaker.${index}.årsak`, {
                required: "Må oppgis",
              })}
              className="lg:max-w-[50%]" // TODO: Pass på at den ikke er så bred til vanlig
            >
              <option value="">Velg endringsårsak</option>
              {muligeÅrsakerValg.map((årsak) => (
                <option key={årsak.value} value={årsak.value}>
                  {årsak.label}
                </option>
              ))}
            </Select>
            <ÅrsaksPerioder index={index} />
            {index > 0 ? (
              <Button
                aria-label="Fjern naturalytelse"
                className="mt-8"
                icon={<TrashIcon />}
                onClick={() => remove(index)}
                variant="tertiary"
              >
                Slett
              </Button>
            ) : (
              <div />
            )}
          </Fragment>
        );
      })}
      <Button
        className="w-fit"
        icon={<PlusIcon />}
        iconPosition="left"
        onClick={() => append(ENDRINGSÅRSAK_TEMPLATE)}
        size="small"
        type="button"
        variant="secondary"
      >
        Legg til ny endringsårsak
      </Button>
    </HGrid>
  );
}

function ÅrsaksPerioder({ index }: { index: number }) {
  const { watch } = useFormContext<InntektOgRefusjonForm>();
  const årsak = watch(`endringAvInntektÅrsaker.${index}.årsak`);

  // Spesialhåndtering av tariffendring
  if (årsak === "TARIFFENDRING") {
    return (
      <>
        <DatePickerWrapped
          label="Fra og med"
          name={`endringAvInntektÅrsaker.${index}.fom`}
          rules={{ required: "Må oppgis" }}
        />
        <DatePickerWrapped
          label="Ble kjent fra"
          name={`endringAvInntektÅrsaker.${index}.bleKjentFom`}
          rules={{ required: "Må oppgis" }}
        />
      </>
    );
  }

  return (
    <>
      {PÅKREVDE_ENDRINGSÅRSAK_FELTER[årsak].fom ? (
        <DatePickerWrapped
          label="Fra og med"
          name={`endringAvInntektÅrsaker.${index}.fom`}
          rules={{ required: "Må oppgis" }}
        />
      ) : (
        <div />
      )}
      {PÅKREVDE_ENDRINGSÅRSAK_FELTER[årsak].tom ? (
        <DatePickerWrapped
          label="Til og med"
          name={`endringAvInntektÅrsaker.${index}.tom`}
          rules={{ required: "Må oppgis" }}
        />
      ) : (
        <div />
      )}
    </>
  );
}

const PÅKREVDE_ENDRINGSÅRSAK_FELTER = {
  // Før man har valgt
  "": { fom: false, tom: false, bleKjentFom: false },

  // Har ingen ekstra felter
  BONUS: { fom: false, tom: false, bleKjentFom: false },
  NYANSATT: { fom: false, tom: false, bleKjentFom: false },
  FERIETREKK_ELLER_UTBETALING_AV_FERIEPENGER: {
    fom: false,
    tom: false,
    bleKjentFom: false,
  },
  MANGELFULL_RAPPORTERING_AORDNING: {
    fom: false,
    tom: false,
    bleKjentFom: false,
  },

  // Kun fom
  VARIG_LØNNSENDRING: { fom: true, tom: false, bleKjentFom: false },
  NY_STILLING: { fom: true, tom: false, bleKjentFom: false },
  NY_STILLINGSPROSENT: { fom: true, tom: false, bleKjentFom: false },

  // fom + tom
  FERIE: { fom: true, tom: true, bleKjentFom: false },
  PERMISJON: { fom: true, tom: true, bleKjentFom: false },
  PERMITTERING: { fom: true, tom: true, bleKjentFom: false },
  SYKEFRAVÆR: { fom: true, tom: true, bleKjentFom: false },

  // Tariffendring er noe for seg selv
  TARIFFENDRING: { fom: true, tom: false, bleKjentFom: true },
} satisfies Record<
  EndringAvInntektÅrsaker & "",
  { fom: boolean; tom: boolean; bleKjentFom: boolean }
>;

function navnPåMåned(date: string) {
  const måned = new Intl.DateTimeFormat("no", { month: "long" }).format(
    new Date(date),
  );

  return capitalizeSetning(måned);
}
