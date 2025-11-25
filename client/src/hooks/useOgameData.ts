import { useEffect, useState } from "react";

export type PlayerData = {
  id?: string;
  name?: string;
};

export type PositionRow = {
  galaxy: number;
  system: number;
  position: number;
  player?: PlayerData | null;
};

export const useOgameData = (serverId: string | null) => {
  const [rows, setRows] = useState<PositionRow[]>([]);
  const [grid, setGrid] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!serverId) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/ogapi/${serverId}/universe.xml`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const xmlText = await res.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "application/xml");

        const parserError = xmlDoc.querySelector("parsererror");
        if (parserError) throw new Error("Error parseando XML: " + parserError.textContent);

        const planetNodes = Array.from(xmlDoc.querySelectorAll("planet"));

        const parsedRows: PositionRow[] = planetNodes.map((node: any) => {
          const coords = node.getAttribute("coords") ?? "0:0:0";
          const [galaxy, system, position] = coords.split(":").map(Number);

          const playerId = node.getAttribute("player");
          const playerName = node.getAttribute("name");

          return {
            galaxy,
            system,
            position,
            player: playerId ? { id: playerId, name: playerName } : null,
          };
        });

        const parsedGrid: Record<string, any> = {};
        parsedRows.forEach((r) => {
          const g = r.galaxy;
          const s = r.system;
          const p = r.position;

          if (!parsedGrid[g]) parsedGrid[g] = {};
          if (!parsedGrid[g][s]) parsedGrid[g][s] = {};
          parsedGrid[g][s][p] = r;
        });

        setRows(parsedRows);
        setGrid(parsedGrid);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [serverId]);

  return { rows, grid, loading, error };
};
