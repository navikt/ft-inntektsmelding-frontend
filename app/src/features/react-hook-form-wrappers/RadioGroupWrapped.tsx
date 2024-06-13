import type { RadioGroupProps } from "@navikt/ds-react";
import { RadioGroup } from "@navikt/ds-react";
import { useController } from "react-hook-form";

type RadioGroupWrappedProps = { name: string; rules?: any } & RadioGroupProps;

export function RadioGroupWrapped({
  name,
  rules,
  ...rest
}: RadioGroupWrappedProps) {
  const { field, fieldState } = useController({
    name,
    rules,
  });

  return (
    <RadioGroup
      {...field}
      error={fieldState.error?.message}
      name={name}
      {...rest}
    >
      {rest.children}
    </RadioGroup>
  );
}
