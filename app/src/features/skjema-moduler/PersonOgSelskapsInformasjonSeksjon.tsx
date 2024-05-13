import {
  BodyShort,
  Heading,
  HGrid,
  Skeleton,
  TextField,
} from "@navikt/ds-react";
import { useQuery } from "@tanstack/react-query";

type PersonOgSelskapsInformasjonSeksjonProps = {
  className?: string;
};

export const PersonOgSelskapsInformasjonSeksjon = ({
  className,
}: PersonOgSelskapsInformasjonSeksjonProps) => {
  const { data } = useQuery<typeof mockData>({
    queryKey: ["personOgSelskapsInformasjon"],
    queryFn: () => mockData,
  });
  return (
    <section className={className}>
      <HGrid columns={{ xs: 1, md: 2 }} gap="6">
        <div className="flex-1">
          <Heading level="2" size="medium">
            Den ansatte
          </Heading>
          <div className="flex flex-row gap-2">
            <div className="flex-1">
              <Heading level="3" size="xsmall">
                Navn
              </Heading>
              <BodyShort>{data?.arbeidstaker.navn ?? <Skeleton />}</BodyShort>
            </div>
            <div className="flex-1">
              <Heading level="3" size="xsmall">
                Personnummer
              </Heading>
              <BodyShort>
                {data?.arbeidstaker.personnummer ?? <Skeleton />}
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
                {data?.arbeidsgiver.virksomhetsnavn ?? <Skeleton />}
              </BodyShort>
            </div>
            <div className="flex-1">
              <Heading level="3" size="xsmall">
                Org. nummer for underenhet
              </Heading>
              <BodyShort>
                {data?.arbeidsgiver.orgNummerForUnderenhet ?? <Skeleton />}
              </BodyShort>
            </div>
          </div>
          <div className="flex flex-column md:flex-row gap-2 flex-wrap">
            <div className="flex-1">
              <Heading level="3" size="xsmall">
                Innsender
              </Heading>
              <BodyShort>
                {data?.arbeidsgiver.innsender ?? <Skeleton />}
              </BodyShort>
            </div>
            <div className="flex-1">
              <TextField
                defaultValue={data?.arbeidsgiver.telefonnummerInnsender}
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

const mockData = {
  arbeidstaker: {
    navn: "Navn Navnesen",
    personnummer: "010101 12345",
  },
  arbeidsgiver: {
    virksomhetsnavn: "Firma AS",
    orgNummerForUnderenhet: "123 456 789",
    innsender: "Inn Sendersen",
    telefonnummerInnsender: "22 22 55 55",
  },
};
