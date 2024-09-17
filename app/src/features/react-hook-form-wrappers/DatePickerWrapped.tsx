import type { DateInputProps } from "@navikt/ds-react";
import { DatePicker, useDatepicker } from "@navikt/ds-react";
import { useController } from "react-hook-form";

type DatePickerWrappedProps = {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- usikker på hvordan rules skal types, og om det er såå viktig.
  rules?: any;
  shouldUnregister?: boolean;
} & DateInputProps;

export function DatePickerWrapped({
  name,
  rules = {},
  shouldUnregister,
  ...dateInputProps
}: DatePickerWrappedProps) {
  const { field, fieldState } = useController({
    name,
    rules,
    shouldUnregister,
  });
  const datePickerProperties = useDatepicker({
    onDateChange: field.onChange,
    defaultSelected: field.value ? new Date(field.value) : undefined,
  });

  return (
    <DatePicker {...datePickerProperties.datepickerProps}>
      <DatePicker.Input
        error={fieldState.error?.message}
        {...dateInputProps}
        ref={field.ref}
        {...datePickerProperties.inputProps}
      />
    </DatePicker>
  );
}
