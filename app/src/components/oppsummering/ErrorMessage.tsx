import { Alert } from "@navikt/ds-react";

export const ErrorMessage = ({ message }: { message?: string }) => {
  if (!message) {
    return null;
  }
  return <Alert variant="error">{message}</Alert>;
};
