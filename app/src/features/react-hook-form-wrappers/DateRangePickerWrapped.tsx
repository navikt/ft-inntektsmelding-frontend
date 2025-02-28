import {
  DatePicker,
  DatePickerProps,
  HStack,
  useRangeDatepicker,
} from "@navikt/ds-react";
import { forwardRef } from "react";
import { RegisterOptions, useController } from "react-hook-form";

import { formatIsoDatostempel } from "~/utils";

type DateRangePickerWrappedProps = {
  name: string;
  minDato: Date;
  maxDato?: Date;
  rules?: {
    fom: RegisterOptions;
    tom: RegisterOptions;
  };
  datepickerProps?: DatePickerProps;
};

export const DateRangePickerWrapped = forwardRef<
  HTMLDivElement,
  DateRangePickerWrappedProps
>(({ name, minDato, maxDato, rules, datepickerProps }, ref) => {
  const { field: fromField, fieldState: fromFieldState } = useController({
    name: `${name}.fom`,
    rules: rules?.fom,
  });
  const { field: toField, fieldState: toFieldState } = useController({
    name: `${name}.tom`,
    rules: rules?.tom,
  });
  const {
    datepickerProps: useRangeDatepickerProps,
    toInputProps,
    fromInputProps,
  } = useRangeDatepicker({
    ...datepickerProps,
    fromDate: minDato,
    toDate: maxDato,
    onRangeChange: (dateRange) => {
      fromField.onChange(
        dateRange?.from ? formatIsoDatostempel(dateRange.from) : undefined,
      );
      toField.onChange(
        dateRange?.to ? formatIsoDatostempel(dateRange.to) : undefined,
      );
    },
    onValidate: (dateRange) => {
      if (dateRange?.from && dateRange?.to) {
        return dateRange.from <= dateRange.to;
      }
      return true;
    },
    defaultSelected: {
      from: fromField.value ? new Date(fromField.value) : undefined,
      to: toField.value ? new Date(toField.value) : undefined,
    },
  });
  return (
    <DatePicker {...useRangeDatepickerProps}>
      <HStack align="baseline" gap="4" ref={ref}>
        <DatePicker.Input
          {...fromInputProps}
          error={fromFieldState.isTouched && fromFieldState.error?.message}
          label="Fra og med"
          onBlur={fromField.onBlur}
          ref={fromField.ref}
        />
        <DatePicker.Input
          {...toInputProps}
          error={toFieldState.isTouched && toFieldState.error?.message}
          label="Til og med"
          onBlur={toField.onBlur}
          ref={toField.ref}
        />
      </HStack>
    </DatePicker>
  );
});

DateRangePickerWrapped.displayName = "DateRangePickerWrapped";
