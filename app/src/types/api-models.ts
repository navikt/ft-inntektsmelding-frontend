export type PersonInfoDto = {
  aktørId: string;
  fødselsnummer: string;
  navn: string;
};

export type OrganisasjonInfoDto = {
  organisasjonNavn: string;
  organisasjonNummer: string;
};

export type MånedsinntektResponsDto = {
  fom: string;
  tom: string;
  beløp: number;
  organisasjonsnummer: string;
};

export type HentInntektRequestDto = {
  aktorId: string;
  ytelse: Ytelsetype;
  organisasjonsnummer: string;
  startdato: string;
};

export type Ytelsetype =
  | "FORELDREPENGER"
  | "SVANGERSKAPSPENGER"
  | "PLEIEPENGER_SYKT_BARN"
  | "PLEIEPENGER_I_LIVETS_SLUTTFASE"
  | "OPPLÆRINGSPENGER"
  | "OMSORGSPENGER";
