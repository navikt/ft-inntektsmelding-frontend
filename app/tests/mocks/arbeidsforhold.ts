import { SlåOppArbeidstakerResponseDto } from "~/types/api-models.ts";

export const arbeidsforholdResponse = {
  fornavn: "MOMENTAN",
  etternavn: "TRAKT",
  arbeidsforhold: [
    {
      organisasjonsnavn: "HELDIG SPRUDLENDE TIGER AS",
      organisasjonsnummer: "315786940",
    },
  ],
  kjønn: "MANN",
} satisfies SlåOppArbeidstakerResponseDto;
