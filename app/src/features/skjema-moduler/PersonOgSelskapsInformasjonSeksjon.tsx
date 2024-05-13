import { BodyShort, Heading, HGrid, TextField } from "@navikt/ds-react";

type PersonOgSelskapsInformasjonSeksjonProps = {
  className?: string;
};

export const PersonOgSelskapsInformasjonSeksjon = ({
  className,
}: PersonOgSelskapsInformasjonSeksjonProps) => {
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
              <BodyShort>Navn Navnesen</BodyShort>
            </div>
            <div className="flex-1">
              <Heading level="3" size="xsmall">
                Personnummer
              </Heading>
              <BodyShort>010101 12345</BodyShort>
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
              <BodyShort>Firma AS</BodyShort>
            </div>
            <div className="flex-1">
              <Heading level="3" size="xsmall">
                Org. nummer for underenhet
              </Heading>
              <BodyShort>123 456 789</BodyShort>
            </div>
          </div>
          <div className="flex flex-column md:flex-row gap-2 flex-wrap">
            <div className="flex-1">
              <Heading level="3" size="xsmall">
                Innsender
              </Heading>
              <BodyShort>Inn Sendersen</BodyShort>
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
