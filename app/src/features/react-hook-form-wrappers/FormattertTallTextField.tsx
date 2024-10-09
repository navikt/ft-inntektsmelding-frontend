import { TextField, TextFieldProps } from "@navikt/ds-react";
import { Controller, ControllerProps } from "react-hook-form";

type FormattertTallTextFieldProps = TextFieldProps & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  name: string;
  rules?: ControllerProps["rules"];
};

/** Et tekstfelt som formaterer innholdet til et tall med tusenvise mellomrom. */
export const FormattertTallTextField = ({
  defaultValue,
  onChange: externalOnChange = () => {},
  control,
  name,
  rules,
  ...rest
}: FormattertTallTextFieldProps) => {
  return (
    <Controller
      control={control}
      defaultValue={defaultValue}
      name={name}
      render={({ field }) => {
        const { onChange, value, ref } = field;

        return (
          <TextField
            {...rest}
            aria-label={value}
            onChange={(e) => {
              // Remove spaces from the input value
              const newValue = e.target.value.replaceAll(/\s+/g, "");
              onChange(newValue);
              externalOnChange(e);
            }}
            ref={ref}
            value={formatTall(value)}
          />
        );
      }}
      rules={rules}
    />
  );
};

/** Formatterer en inputverdi til et tall med tusenvise mellomrom.
 *
 * Om det ikke er et tall, returneres inputverdien.
 */
const formatTall = (value: string) => {
  if (value === "") {
    return "";
  }

  const cleanValue = value.toString().replaceAll(/\s+/g, "");

  // Parse to number
  const numberValue = Number(cleanValue);

  if (Number.isNaN(numberValue)) {
    return value;
  }

  return new Intl.NumberFormat("nb-NO").format(numberValue);
};
