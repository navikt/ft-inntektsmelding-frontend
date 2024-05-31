import {
  BodyShort,
  Heading,
  HGrid,
  Skeleton,
  TextField,
} from "@navikt/ds-react";
import { useQuery } from "@tanstack/react-query";

import {
  organisasjonQueryOptions,
  personinfoQueryOptions,
} from "~/api/queries";
import type { ForespørselEntitet } from "~/types/api-models.ts";

type PersonOgSelskapsInformasjonSeksjonProps = {
  className?: string;
  forespørsel: ForespørselEntitet;
};

export const PersonOgSelskapsInformasjonSeksjon = ({
  forespørsel,
  className,
}: PersonOgSelskapsInformasjonSeksjonProps) => {
  const personinfoQuery = useQuery(
    personinfoQueryOptions(forespørsel.brukerAktørId, forespørsel.ytelseType),
  );

  const organisasjonQuery = useQuery(
    organisasjonQueryOptions(forespørsel.organisasjonsnummer),
  );

  return (
    <section className={className}>
      <HGrid columns={{ xs: 1, md: 2 }} gap="6">
        <div className="flex-1">
          <Heading className="mb-4" level="2" size="medium">
            Den ansatte
          </Heading>
          <div className="flex flex-row gap-2">
            <div className="flex-1">
              <Heading level="3" size="xsmall">
                Navn
              </Heading>
              <BodyShort>
                {personinfoQuery.data?.navn ?? <Skeleton />}
              </BodyShort>
            </div>
            <div className="flex-1">
              <Heading level="3" size="xsmall">
                Personnummer
              </Heading>
              <BodyShort>
                {personinfoQuery.data?.fødselsnummer ?? <Skeleton />}
              </BodyShort>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 flex-1">
          <Heading level="2" size="medium">
            Arbeidsgiveren
          </Heading>
          <div className="flex flex-row gap-2 flex-wrap">
            <div className="flex-1">
              <Heading level="3" size="xsmall">
                Virksomhetsnavn
              </Heading>
              <BodyShort>
                {organisasjonQuery.data?.organisasjonNavn ?? <Skeleton />}
              </BodyShort>
            </div>
            <div className="flex-1">
              <Heading level="3" size="xsmall">
                Org. nummer for underenhet
              </Heading>
              <BodyShort>
                {organisasjonQuery.data?.organisasjonNummer ?? <Skeleton />}
              </BodyShort>
            </div>
          </div>
          <div className="flex flex-column md:flex-row gap-2 flex-wrap">
            <div className="flex-1">
              <Heading level="3" size="xsmall">
                Innsender
              </Heading>
              <BodyShort>TODO</BodyShort>
            </div>
            <div className="flex-1">
              <TextField
                label="Telefonnummer, innsender"
                name="telefonnummer-innsender"
                size="medium"
              />
            </div>
          </div>
        </div>
      </HGrid>
    </section>
  );
};
