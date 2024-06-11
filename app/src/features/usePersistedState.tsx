import { useEffect, useState } from "react";

/** En useState versjon som lagrer innholdet til session storage.
 *
 * Session storage er en måte å lagre data på i nettleseren, som varer til
 * nettleservinduet lukkes. Dataen deles ikke på tvers av tabs eller vinduer.
 *
 * @param key - Nøkkelen som brukes for å lagre dataen i session storage.
 * @param defaultValue - Standardverdien som brukes om det ikke finnes noe lagret data.
 *
 * @example
 * ```tsx
 * const [count, setCount] = usePersistedState("count", 0);
 * ```
 */
export function usePersistedState<T = unknown>(key: string, defaultValue: T) {
  const [state, setState] = useState<T>(
    () => JSON.parse(sessionStorage.getItem(key) || "false") || defaultValue,
  );
  useEffect(() => {
    sessionStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);
  return [state, setState] as const;
}
