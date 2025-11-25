import { useState, useEffect } from "react";
import { ServerSelector } from "./components/ServerSelector";
import { useOgameData } from "./hooks/useOgameData";
import { MapGrid } from "./modules/map/MapGrid";
import type { Server } from "./modules/context/ServerContext";

export default function App() {
  const [servers, setServers] = useState<Server[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    fetch("/ogservers/api/servers")
      .then(res => res.json())
      .then(data => setServers(data));
  }, []);

  const serverId = selected; // "267-es"

  const { rows, loading } = useOgameData(serverId);

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-4">OGame Universe Map</h1>

      <ServerSelector
        servers={servers}
        onSelect={(lang: string, num: number) => setSelected(`${num}-${lang}`)}
      />

      {loading && <p>Cargando universo...</p>}

      {!loading && rows.length > 0 && (
        <MapGrid rows={rows} />
      )}
    </div>
  );
}
