import { Detail, Label } from "@navikt/ds-react";
import clsx from "clsx";

type InformasjonsseksjonProps = {
  kilde?: string;
  tittel: string;
  children: React.ReactNode;
  className?: string;
};
export const Informasjonsseksjon = ({
  children,
  kilde,
  tittel,
  className,
}: InformasjonsseksjonProps) => {
  return (
    <div
      className={clsx(
        "bg-bg-subtle p-4 flex flex-col gap-4 rounded-md flex-1",
        className,
      )}
    >
      <div className="flex justify-between items-center">
        <Label size="small">{tittel}</Label>
        {kilde && (
          <Detail className="uppercase flex items-center">{kilde}</Detail>
        )}
      </div>
      {children}
    </div>
  );
};