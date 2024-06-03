import type { SendInntektsmeldingRequestDto } from "~/types/api-models.ts";

const FT_INNTEKTSMELDING_BACKEND_URL = `/server/api/imdialog`;

export async function sendInntektsmelding(
  sendInntektsmeldingRequest: SendInntektsmeldingRequestDto,
) {
  const response = await fetch(
    `${FT_INNTEKTSMELDING_BACKEND_URL}/send-inntektsmelding`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sendInntektsmeldingRequest),
    },
  );

  return (await response.json()) as unknown;
}
