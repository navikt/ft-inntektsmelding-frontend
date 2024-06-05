import type { SendInntektsmeldingRequestDto } from "~/types/api-models.ts";

const SERVER_URL = "fp-im-dialog/server/api";

export async function sendInntektsmelding(
  sendInntektsmeldingRequest: SendInntektsmeldingRequestDto,
) {
  const response = await fetch(`${SERVER_URL}/send-inntektsmelding`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sendInntektsmeldingRequest),
  });

  return (await response.json()) as unknown;
}
