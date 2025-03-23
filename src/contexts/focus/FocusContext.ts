import { createContext } from "react";

type FocusContextType = {
  postCommentsRef: React.RefObject<{ focusInput: () => void } | null>;
};

export const FocusContext = createContext<FocusContextType | undefined>(undefined);
