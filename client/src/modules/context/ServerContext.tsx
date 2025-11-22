import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

export type Server = { number: number; language: string; label: string; id: string };

type ServerContextType = {
  server: Server | null;
  setServer: (s: Server) => void;
};

const ServerContext = createContext<ServerContextType | undefined>(undefined);

export const ServerProvider = ({ children }: { children: ReactNode }) => {
  const [server, setServer] = useState<Server | null>(null);
  return (
    <ServerContext.Provider value={{ server, setServer }}>
      {children}
    </ServerContext.Provider>
  );
};

export const useServer = () => {
  const context = useContext(ServerContext);
  if (!context) throw new Error("useServer must be used within ServerProvider");
  return context;
};
