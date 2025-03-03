import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

import { SERVER_URL } from "~/api/mutations";
import { SendInntektsmeldingRequestDtoSchema } from "~/types/api-models.ts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const RefusjonOmsorgspengerDtoSchema =
  SendInntektsmeldingRequestDtoSchema.extend({
    omsorgspenger: z.object({
      fraværHeleDager: z.array(
        z.object({
          fom: z.string(),
          tom: z.string(),
        }),
      ),
      fraværDelerAvDagen: z.array(
        z.object({
          dato: z.string(),
          timer: z.string(),
        }),
      ),
      harUtbetaltPliktigeDager: z.boolean(),
    }),
  });

export type RefusjonOmsorgspengerDto = z.infer<
  typeof RefusjonOmsorgspengerDtoSchema
>;

export const sendInntektsmeldingOmsorgspengerRefusjonMutation = () =>
  useMutation({
    mutationFn: (request: RefusjonOmsorgspengerDto) => {
      return fetch(
        `${SERVER_URL}/imdialog/send-inntektsmelding/omsorgspenger-refusjon`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(request),
        },
      );
    },
  });
