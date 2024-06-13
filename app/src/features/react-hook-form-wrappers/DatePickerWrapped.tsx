import type { DateInputProps } from "@navikt/ds-react";
import { DatePicker, useDatepicker } from "@navikt/ds-react";
import { useController } from "react-hook-form";

type DatePickerWrappedProps = { name: string; rules?: any } & DateInputProps;

export function DatePickerWrapped({
  name,
  rules = {},
  ...dateInputProps
}: DatePickerWrappedProps) {
  const { field, fieldState } = useController({
    name,
    rules,
  });
  const datePickerProperties = useDatepicker({
    onDateChange: async (date) => {
      field.onChange(date ? date : undefined); // TODO: format date to string
    },
    // defaultSelected: defaultDate ? new Date(defaultDate) : undefined, // TODO:
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
