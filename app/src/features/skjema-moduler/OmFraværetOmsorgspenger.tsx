import { Heading, Radio, RadioGroup } from "@navikt/ds-react";
import { useFormContext } from "react-hook-form";

import { InntektOgRefusjonForm } from "../inntektsmelding/Steg2InntektOgRefusjon";

const OmFraværetOmsorgspenger = () => {
  const { register, formState } = useFormContext<InntektOgRefusjonForm>();
  const { name, ...radioGroupProps } = register("skalRefunderes", {
    required: "Du må svare på dette spørsmålet",
  });
  return (
    <div className="flex gap-4 flex-col">
      <Heading id="om-fraværet-omsorgspenger" level="4" size="medium">
        Om fraværet
      </Heading>
      <RadioGroup
        error={formState.errors.skalRefunderes?.message}
        legend="Har dere betalt lønn for dette fraværet?"
        name={name}
      >
        <Radio value="JA_LIK_REFUSJON" {...radioGroupProps}>
          Ja
        </Radio>
        <Radio value="NEI" {...radioGroupProps}>
          Nei
        </Radio>
      </RadioGroup>
    </div>
  );
};

export default OmFraværetOmsorgspenger;
