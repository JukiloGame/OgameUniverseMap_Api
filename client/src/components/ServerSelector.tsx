import { useState } from "react";
import type { Server } from "../modules/context/ServerContext";

type ServerSelectorProps = {
  servers: Server[];
  onSelect: (lang: string, num: number) => void;
};

export const ServerSelector = ({ servers, onSelect }: ServerSelectorProps) => {
  const [region, setRegion] = useState("");
  const [server, setServer] = useState("");

  const regions = [...new Set(servers.map((s: Server) => s.language))];

  const regionServers = servers.filter((s: Server) => s.language === region);

  return (
    <div className="flex gap-4 mb-6">

      <div>
        <label className="block mb-1 font-bold">Región</label>
        <select
          className="bg-gray-800 text-white p-2 rounded"
          value={region}
          onChange={(e) => {
            setRegion(e.target.value);
            setServer("");
          }}
        >
          <option value="">Selecciona región</option>
          {regions.map((r: any) => (
            <option key={r as string} value={r as string}>{(r as string).toUpperCase()}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 font-bold">Servidor</label>
        <select
          className="bg-gray-800 text-white p-2 rounded"
          value={server}
          onChange={(e) => {
            const value = e.target.value;
            setServer(value);

            const [num, lang] = value.split("-");
            onSelect(lang, Number(num));
          }}
          disabled={!region}
        >
          <option value="">Selecciona servidor</option>

          {regionServers.map((s: Server) => (
            <option key={s.number} value={`${s.number}-${s.language}`}>
              {s.label} (s{s.number})
            </option>
          ))}
        </select>
      </div>

    </div>
  );
};
