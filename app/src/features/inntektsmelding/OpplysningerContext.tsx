import React, { createContext, useContext } from "react";

import { OpplysningerDto } from "~/types/api-models";

const OpplysningerContext = createContext<OpplysningerDto | null>(null);

export const useOpplysninger = () => {
  const context = useContext(OpplysningerContext);
  if (!context) {
    throw new Error(
      "useOpplysninger must be used within an OpplysningerProvider",
    );
  }
  return context;
};

type OpplysningerProviderProps = {
  opplysninger: OpplysningerDto;
  children: React.ReactNode;
};
export const OpplysningerProvider = ({
  opplysninger,
  children,
}: OpplysningerProviderProps) => {
  return (
    <OpplysningerContext.Provider value={opplysninger}>
      {children}
    </OpplysningerContext.Provider>
  );
};
