"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface HeaderContextType {
  title: string | ReactNode;
  setTitle: (title: string | ReactNode) => void;
  actions: ReactNode | null;
  setActions: (actions: ReactNode | null) => void;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [title, setTitle] = useState<string | ReactNode>("");
  const [actions, setActions] = useState<ReactNode | null>(null);

  return (
    <HeaderContext.Provider value={{ title, setTitle, actions, setActions }}>
      {children}
    </HeaderContext.Provider>
  );
}

export function useHeader() {
  const context = useContext(HeaderContext);
  if (context === undefined) {
    throw new Error("useHeader must be used within a HeaderProvider");
  }
  return context;
}
