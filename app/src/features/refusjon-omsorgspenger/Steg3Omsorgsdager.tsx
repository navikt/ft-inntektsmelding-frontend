import "@navikt/ds-css/darkside";

import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  PlusIcon,
  TrashIcon,
} from "@navikt/aksel-icons";
import {
  Accordion,
  Alert,
  BodyLong,
  BodyShort,
  Box,
  Button,
  Dropdown,
  GuidePanel,
  Heading,
  HStack,
  Label,
  List,
  Radio,
  RadioGroup,
  TextField,
  VStack,
} from "@navikt/ds-react";
import { Theme } from "@navikt/ds-react/Theme";
import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useFieldArray } from "react-hook-form";

import { HjelpetekstAlert, HjelpetekstReadMore } from "../Hjelpetekst.tsx";
import { DatePickerWrapped } from "../react-hook-form-wrappers/DatePickerWrapped";
import { DateRangePickerWrapped } from "../react-hook-form-wrappers/DateRangePickerWrapped";
import { useDocumentTitle } from "../useDocumentTitle";
import { useHentInntektsmeldingForÅr } from "./api/queries.ts";
import { OmsorgspengerFremgangsindikator } from "./OmsorgspengerFremgangsindikator.tsx";
import { useRefusjonOmsorgspengerArbeidsgiverFormContext } from "./RefusjonOmsorgspengerArbeidsgiverForm";
import {
  beregnGyldigDatoIntervall,
  utledDefaultMonthDatepicker,
} from "./utils.ts";

export const RefusjonOmsorgspengerArbeidsgiverSteg3 = () => {
  useDocumentTitle(
    "Omsorgsdager - søknad om refusjon av omsorgspenger for arbeidsgiver",
  );

  const { register, formState, watch, handleSubmit, getValues, setValue } =
    useRefusjonOmsorgspengerArbeidsgiverFormContext();

  const årForRefusjon = watch("årForRefusjon");

  const navigate = useNavigate();

  useEffect(() => {
    setValue("meta.step", 3);
    if (getValues("meta.harSendtSøknad")) {
      navigate({
        from: "/refusjon-omsorgspenger/$organisasjonsnummer/3-omsorgsdager",
        to: "../6-kvittering",
      });
    }
  }, []);

  // useEffect(() => {
  //   if (!getValues("årForRefusjon") || !getValues("harUtbetaltLønn")) {
  //     navigate({
  //       from: "/refusjon-omsorgspenger/$organisasjonsnummer/3-omsorgsdager",
  //       to: "../1-intro",
  //     });
  //   }
  // }, [getValues("årForRefusjon"), getValues("harUtbetaltLønn")]);

  const onSubmit = handleSubmit(() => {
    navigate({
      from: "/refusjon-omsorgspenger/$organisasjonsnummer/3-omsorgsdager",
      to: "../4-refusjon",
    });
  });

  const { name, ...harDekket10FørsteOmsorgsdagerRadioGroupProps } = register(
    "harDekket10FørsteOmsorgsdager",
    {
      required:
        "Du må svare på om dere har dekket de 10 første omsorgsdagene i år",
    },
  );

  return (
    <div className="bg-bg-default rounded-md flex flex-col gap-6">
      <Heading level="1" size="large">
        Omsorgsdager dere søker refusjon for
      </Heading>
      <OmsorgspengerFremgangsindikator aktivtSteg={3} />
      <GuidePanel className="mb-4">
        <BodyLong>
          Her oppgir du hvilke dager dere har utbetalt lønn og søker om refusjon
          fordi den ansatte har brukt omsorgsdager. Dagene må være innenfor
          samme kalenderår og kan ikke være frem i tid.
        </BodyLong>
        <BodyLong>
          Hvis dere kun har betalt lønn for deler av fraværet, må den ansatte
          selv søke om omsorgspenger for de dagene dere ikke har utbetalt lønn.
        </BodyLong>
      </GuidePanel>
      <form onSubmit={onSubmit}>
        <VStack gap="4">
          <RadioGroup
            error={formState.errors.harDekket10FørsteOmsorgsdager?.message}
            legend={`Har dere dekket de 10 første omsorgsdagene i ${årForRefusjon}?`}
            name={name}
          >
            <Radio value="ja" {...harDekket10FørsteOmsorgsdagerRadioGroupProps}>
              Ja
            </Radio>
            <Radio
              value="nei"
              {...harDekket10FørsteOmsorgsdagerRadioGroupProps}
            >
              Nei
            </Radio>
          </RadioGroup>
          <TiFørsteOmsorgsdagerInfo />
          {formState.errors.fraværHeleDager?.message && (
            <Alert aria-live="polite" variant="error">
              <BodyLong>{formState.errors.fraværHeleDager.message}</BodyLong>
            </Alert>
          )}
          <VStack gap="8">
            <TidligereInnsendinger årForRefusjon={årForRefusjon} />
            <FraværHeleDagen />
            <FraværDelerAvDagen />
            <DagerSomSkalTrekkes />
          </VStack>

          <div className="flex gap-4 mt-8">
            <Button
              as={Link}
              icon={<ArrowLeftIcon />}
              to="../2-ansatt-og-arbeidsgiver"
              variant="secondary"
            >
              Forrige steg
            </Button>
            <Button
              icon={<ArrowRightIcon />}
              iconPosition="right"
              type="submit"
              variant="primary"
            >
              Neste steg
            </Button>
          </div>
        </VStack>
      </form>
    </div>
  );
};

const FraværHeleDagen = () => {
  const { control, watch, clearErrors, setValue } =
    useRefusjonOmsorgspengerArbeidsgiverFormContext();

  useEffect(() => {
    setValue("meta.step", 3);
  }, []);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "fraværHeleDager",
  });

  const årForRefusjon = Number(watch("årForRefusjon"));
  const { minDato, maxDato } = beregnGyldigDatoIntervall(årForRefusjon);

  return (
    <VStack gap="4">
      <Heading level="3" size="small">
        Hele dager dere søker refusjon for
      </Heading>
      {fields.map((periode, index) => (
        <HStack
          className="border-l-4 border-bg-subtle pl-4 py-2"
          gap="4"
          key={periode.id}
        >
          <DateRangePickerWrapped
            datepickerProps={{
              defaultMonth: utledDefaultMonthDatepicker(årForRefusjon),
            }}
            maxDato={maxDato}
            minDato={minDato}
            name={`fraværHeleDager.${index}`}
          />
          <div>
            <Button
              aria-label="Slett periode"
              className="md:mt-10"
              icon={<TrashIcon />}
              onClick={() => {
                remove(index);
              }}
              size="small"
              type="button"
              variant="tertiary"
            >
              Slett
            </Button>
          </div>
        </HStack>
      ))}
      <div>
        <Button
          icon={<PlusIcon />}
          onClick={() => {
            append({ fom: "", tom: "" }, { shouldFocus: false });
            clearErrors("fraværHeleDager");
          }}
          size="small"
          type="button"
          variant="secondary"
        >
          Legg til periode
        </Button>
      </div>
    </VStack>
  );
};

const FraværDelerAvDagen = () => {
  const { control, register, formState, watch, clearErrors, setValue } =
    useRefusjonOmsorgspengerArbeidsgiverFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "fraværDelerAvDagen",
  });
  const årForRefusjon = Number(watch("årForRefusjon"));

  const { minDato, maxDato } = beregnGyldigDatoIntervall(årForRefusjon);
  return (
    <VStack gap="2">
      <Heading level="3" size="small">
        Delvise dager dere søker refusjon for
      </Heading>

      {fields.map((periode, index) => {
        return (
          <HStack
            align="start"
            className="border-l-4 border-bg-subtle pl-4 py-2"
            gap="4"
            key={periode.id}
          >
            <DatePickerWrapped
              datepickerProps={{
                toDate: maxDato,
                fromDate: minDato,
                defaultMonth: utledDefaultMonthDatepicker(årForRefusjon),
              }}
              key={periode.id}
              label="Dato"
              name={`fraværDelerAvDagen.${index}.dato`}
              rules={{
                required: "Du må oppgi dato",
              }}
            />
            <TextField
              label="Timer fravær"
              {...register(`fraværDelerAvDagen.${index}.timer`, {
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value;
                  const valueWithoutCommas = value.replaceAll(",", ".");
                  setValue(
                    `fraværDelerAvDagen.${index}.timer`,
                    valueWithoutCommas as unknown as string,
                  );
                },
              })}
              error={
                formState.touchedFields.fraværDelerAvDagen?.[index]?.timer &&
                formState.errors.fraværDelerAvDagen?.[index]?.timer?.message
              }
            />
            <div>
              <Button
                aria-label="Slett periode"
                className="md:mt-10"
                icon={<TrashIcon />}
                onClick={() => {
                  remove(index);
                }}
                size="small"
                type="button"
                variant="tertiary"
              >
                Slett
              </Button>
            </div>
          </HStack>
        );
      })}
      {fields.length > 0 && (
        <>
          <BodyLong className="text-text-subtle" size="small">
            Timer skal avrundes til nærmeste halve time og beregnes basert på en
            7,5 timers arbeidsdag. Hvis arbeidstakeren har en annen ordinær
            arbeidstid, må fraværet omregnes.
          </BodyLong>
          <HjelpetekstReadMore header="Eksempler på hvordan du oppgir og omregner arbeidstid">
            <Label>Eksempel 1:</Label>
            <BodyLong>
              Arbeidstaker jobber vanligvis 7,5 timer per dag og har vært borte
              en halv dag.
            </BodyLong>
            <List>
              <List.Item className="my-8">
                Fraværet utgjør 3,75 timer, som skal avrundes til nærmeste halve
                time. Dette betyr at du oppgir 4 timer i refusjonskravet. Ved
                flere halve dager kan det oppgis som 3,5 og 4 timer annenhver
                dag.
              </List.Item>
              <Label>Eksempel 2:</Label>
              <BodyLong>
                Arbeidstaker jobber vanligvis 9 timer per dag og er borte i 4 av
                disse. Du deler da antall timer fravær på antall timer
                arbeidstakeren skulle jobbet. Tallet du får ganger du med 7,5.
              </BodyLong>
              <List.Item className="my-8">
                4 timer fravær / 9 timer arbeidstid = 0,440,44 × 7,5 = 3,33
                timer, som avrundes til 3,5 timer i refusjonskravet
              </List.Item>
              <BodyLong>
                Du kan regne på samme måste om ordinær arbeidstid er over eller
                under 7,5 time.
              </BodyLong>
            </List>
          </HjelpetekstReadMore>
        </>
      )}
      <div>
        <Button
          icon={<PlusIcon />}
          onClick={() => {
            append({ dato: "", timer: "" }, { shouldFocus: false });
            clearErrors("fraværDelerAvDagen");
          }}
          size="small"
          type="button"
          variant="secondary"
        >
          Legg til dag
        </Button>
      </div>
    </VStack>
  );
};

const DagerSomSkalTrekkes = () => {
  const { control, watch, clearErrors } =
    useRefusjonOmsorgspengerArbeidsgiverFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "dagerSomSkalTrekkes",
  });

  const årForRefusjon = Number(watch("årForRefusjon"));
  const { minDato, maxDato } = beregnGyldigDatoIntervall(årForRefusjon);

  return (
    <VStack gap="4">
      <Heading level="3" size="small">
        Dager dere ønsker å trekke
      </Heading>
      {fields.map((periode, index) => (
        <HStack
          className="border-l-4 border-bg-subtle pl-4 py-2"
          gap="4"
          key={periode.id}
        >
          <DateRangePickerWrapped
            datepickerProps={{
              defaultMonth: utledDefaultMonthDatepicker(årForRefusjon),
            }}
            maxDato={maxDato}
            minDato={minDato}
            name={`dagerSomSkalTrekkes.${index}`}
          />
          <div>
            <Button
              aria-label="Slett periode"
              className="md:mt-10"
              icon={<TrashIcon />}
              onClick={() => {
                remove(index);
              }}
              size="small"
              type="button"
              variant="tertiary"
            >
              Slett
            </Button>
          </div>
        </HStack>
      ))}
      <div>
        <Button
          icon={<PlusIcon />}
          onClick={() => {
            append({ fom: "", tom: "" }, { shouldFocus: false });
            clearErrors("dagerSomSkalTrekkes");
          }}
          size="small"
          type="button"
          variant="secondary"
        >
          Legg til periode
        </Button>
      </div>
    </VStack>
  );
};

const TiFørsteOmsorgsdagerInfo = () => {
  const { watch } = useRefusjonOmsorgspengerArbeidsgiverFormContext();
  const harDekket10FørsteOmsorgsdager = watch("harDekket10FørsteOmsorgsdager");
  if (harDekket10FørsteOmsorgsdager === "ja") {
    return (
      <HjelpetekstAlert>
        <BodyShort>
          Du kan søke om utbetaling fra NAV fra og med den 11. dagen.
        </BodyShort>
        <BodyShort>
          Hvis den ansatte har kronisk sykt barn over 13 år, og ingen andre barn
          under 12 år, kan du søke om utbetaling fra første fraværsdag.
        </BodyShort>
      </HjelpetekstAlert>
    );
  }

  if (harDekket10FørsteOmsorgsdager === "nei") {
    return (
      <HjelpetekstAlert>
        <VStack gap="4">
          <BodyLong>
            Bedriften må dekke de første 10 omsorgsdagene hvert kalenderår for
            ansatte som har barn under 12 år, eller som fyller 12 år det
            gjeldende året. Du kan søke om utbetaling fra NAV fra og med den 11.
            dagen.
          </BodyLong>
          <BodyLong>
            Hvis den ansatte har kronisk sykt barn over 13 år, og ingen andre
            barn under 12 år, kan du søke om utbetaling fra første fraværsdag.
          </BodyLong>
        </VStack>
      </HjelpetekstAlert>
    );
  }
};

const TidligereInnsendinger = ({
  årForRefusjon,
}: {
  årForRefusjon: string;
}) => {
  const { watch } = useRefusjonOmsorgspengerArbeidsgiverFormContext();
  const ansattesAktørId = watch("ansattesAktørId");
  const organisasjonsnummer = watch("organisasjonsnummer");

  const { data: inntektsmeldinger } = useHentInntektsmeldingForÅr({
    aktørId: ansattesAktørId as string,
    arbeidsgiverIdent: organisasjonsnummer as string,
    år: årForRefusjon as string,
  });

  const tidligereInnsendinger =
    inntektsmeldinger?.map((inntektsmelding) => {
      return {
        id: inntektsmelding.id,
        opprettetDato: new Date(inntektsmelding.opprettetTidspunkt),
        heleDager: inntektsmelding.omsorgspenger.fraværHeleDager,
        delviseDager: inntektsmelding.omsorgspenger.fraværDelerAvDagen?.filter(
          (dag) => Number(dag.timer) > 0,
        ),
        dagerSomSkalTrekkes:
          inntektsmelding.omsorgspenger.fraværDelerAvDagen?.filter(
            (dag) => Number(dag.timer) === 0,
          ),
      };
    }) || [];

  const [antallInnsendingerSomSkalVises, setAntallInnsendingerSomSkalVises] =
    useState(5);

  const visFlereInnsendinger = () => {
    setAntallInnsendingerSomSkalVises(antallInnsendingerSomSkalVises + 5);
  };

  const innsendingerSomSkalVises = tidligereInnsendinger?.slice(
    0,
    antallInnsendingerSomSkalVises,
  );

  return (
    <Box className="bg-bg-subtle p-4">
      <div className="flex justify-between">
        <Label size="small">
          {`Tidligere innsendinger for ${årForRefusjon}`}
        </Label>
        <BodyShort size="small">FRA NAV</BodyShort>
      </div>
      <Theme theme="dark">
        <Accordion className="bg-bg-subtle mt-4" indent>
          <div className="flex flex-col gap-4 text-text-default">
            {innsendingerSomSkalVises?.map((innsending) => (
              <Accordion.Item key={innsending.id}>
                <Accordion.Header className="text-text-action">
                  Refusjonskrav - sendt inn{" "}
                  {innsending.opprettetDato.toLocaleDateString("nb-NO")}
                </Accordion.Header>
                <Accordion.Content className="pl-5 mt-4 !border-l-2 !border-solid border-surface-neutral-subtle">
                  <div className="flex flex-col gap-4">
                    {innsending.heleDager &&
                      innsending.heleDager?.length > 0 && (
                        <div>
                          <Label>Hele dager dere søkte refusjon for</Label>
                          <List className="flex flex-col gap-2 mt-1">
                            {innsending.heleDager?.map((dag) => (
                              <List.Item key={dag.fom}>
                                {new Date(dag.fom).toLocaleDateString("nb-NO")}{" "}
                                -{" "}
                                {new Date(dag.tom).toLocaleDateString("nb-NO")}
                              </List.Item>
                            ))}
                          </List>
                        </div>
                      )}
                    {innsending.delviseDager &&
                      innsending.delviseDager?.length > 0 && (
                        <div>
                          <Dropdown.Menu.Divider />
                          <div className="mt-4">
                            <Label>Delvise dager dere søkte refusjon for</Label>
                            <List className="flex flex-col gap-2 mt-1">
                              {innsending.delviseDager?.map((dag) => (
                                <List.Item key={dag.dato}>
                                  {new Date(dag.dato).toLocaleDateString(
                                    "nb-NO",
                                  )}{" "}
                                  - {dag.timer} timer
                                </List.Item>
                              ))}
                            </List>
                          </div>
                        </div>
                      )}
                    {innsending.dagerSomSkalTrekkes &&
                      innsending.dagerSomSkalTrekkes?.length > 0 && (
                        <div>
                          <Dropdown.Menu.Divider />
                          <div className="mt-4">
                            <Label>Dager dere ønsker å trekke</Label>
                            <List className="flex flex-col gap-2 mt-1">
                              {innsending.dagerSomSkalTrekkes?.map((dag) => (
                                <List.Item key={dag.dato}>
                                  {new Date(dag.dato).toLocaleDateString(
                                    "nb-NO",
                                  )}
                                </List.Item>
                              ))}
                            </List>
                          </div>
                        </div>
                      )}
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </div>
        </Accordion>
      </Theme>
      {tidligereInnsendinger.length > antallInnsendingerSomSkalVises && (
        <Button
          className="mt-4"
          icon={<ArrowDownIcon />}
          onClick={visFlereInnsendinger}
          type="button"
          variant="tertiary"
        >
          Vis flere
        </Button>
      )}
    </Box>
  );
};
