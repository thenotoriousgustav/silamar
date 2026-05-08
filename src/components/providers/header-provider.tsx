"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from "react";

interface HeaderState {
  title: string | ReactNode;
  actions: ReactNode | null;
}

interface HeaderDispatch {
  setTitle: (title: string | ReactNode) => void;
  setActions: (actions: ReactNode | null) => void;
}

const HeaderStateContext = createContext<HeaderState | undefined>(undefined);
const HeaderDispatchContext = createContext<HeaderDispatch | undefined>(
  undefined,
);

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [title, setTitle] = useState<string | ReactNode>("");
  const [actions, setActions] = useState<ReactNode | null>(null);

  const state = useMemo(() => ({ title, actions }), [title, actions]);
  const dispatch = useMemo(() => ({ setTitle, setActions }), []);

  return (
    <HeaderStateContext.Provider value={state}>
      <HeaderDispatchContext.Provider value={dispatch}>
        {children}
      </HeaderDispatchContext.Provider>
    </HeaderStateContext.Provider>
  );
}

export function useHeader() {
  const state = useContext(HeaderStateContext);
  const dispatch = useContext(HeaderDispatchContext);

  if (state === undefined || dispatch === undefined) {
    throw new Error("useHeader must be used within a HeaderProvider");
  }

  return { ...state, ...dispatch };
}

/**
 * Use this hook when you ONLY need to set the header content.
 * This prevents unnecessary re-renders when the header content changes.
 */
export function useHeaderDispatch() {
  const context = useContext(HeaderDispatchContext);
  if (context === undefined) {
    throw new Error("useHeaderDispatch must be used within a HeaderProvider");
  }
  return context;
}
