import {BodyShort, Detail} from "@navikt/ds-react";
import clsx from "clsx";

type InformasjonsseksjonMedKildeProps = {
  kilde: string;
  tittel: string;
  children: React.ReactNode;
  className?: string;
};
export const InformasjonsseksjonMedKilde = ({
  children,
  kilde,
  tittel,
  className,
}: InformasjonsseksjonMedKildeProps) => {
  return (
    <div
      className={clsx(
        "bg-bg-subtle p-4 flex flex-col gap-4 rounded-md flex-1",
        className,
      )}
    >
      <div className="flex justify-between items-center">
        <BodyShort size="small">
          <strong>{tittel}</strong>
        </BodyShort>
        <Detail className="uppercase flex items-center">{kilde}</Detail>
      </div>
      {children}
    </div>
  );
};
