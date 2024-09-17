import { ArrowLeftIcon, ArrowRightIcon } from "@navikt/aksel-icons";
import { Button } from "@navikt/ds-react";
import { Link } from "@tanstack/react-router";

type StegnavigasjonProps = {
  /** Enten lenke til en side, eller en funksjon som kalles når knappen trykkes */
  forrige?: string | (() => void);
  /** Enten lenke til en side, eller en funksjon som kalles når knappen trykkes */
  neste: string | (() => void);
  isNesteDisabled?: boolean;
};

export const Stegnavigasjon = ({
  forrige,
  neste,
  isNesteDisabled,
}: StegnavigasjonProps) => {
  const forrigeProps =
    typeof forrige === "string"
      ? { as: Link, href: forrige }
      : { onClick: forrige };
  const nesteProps =
    typeof neste === "string" ? { as: Link, href: neste } : { onClick: neste };
  return (
    <div className="flex gap-4">
      {forrige && (
        <Button {...forrigeProps} icon={<ArrowLeftIcon />} variant="secondary">
          Forrige steg
        </Button>
      )}
      <Button
        {...nesteProps}
        disabled={isNesteDisabled}
        icon={<ArrowRightIcon />}
        iconPosition="right"
        variant="primary"
      >
        Neste steg
      </Button>
    </div>
  );
};
