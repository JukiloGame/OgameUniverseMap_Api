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

export const useOgameData = (mock = false) => {
  const [grid, setGrid] = useState<Record<string, any>>({});
  const [rows, setRows] = useState<PositionRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [isUrl, setIsUrl] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        let planets: any[] = [];

        if (mock) {
          // solo para pruebas
		  setIsUrl(false);
          const res = await fetch("/mocks/sampleUniverse.json");
          const data = await res.json();
          planets = data.planet ?? [];
        } else {
          // fetch XML de la API real
		  setIsUrl(true);
          const res = await fetch(`/ogame/api/universe.xml`);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const xmlText = await res.text();
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(xmlText, "application/xml");

          const parserror = xmlDoc.querySelector("parsererror");
          if (parserror) throw new Error("Error parseando XML: " + parserror.textContent);

          // extraer planet nodes
          const planetNodes = Array.from(xmlDoc.querySelectorAll("planet"));

          planets = planetNodes.map((node) => {
            const id = node.getAttribute("id") ?? undefined;
            const name = node.getAttribute("name") ?? undefined;
            const playerId = node.getAttribute("player") ?? undefined;
            const coords = node.getAttribute("coords") ?? "0:0:0";

            return {
              "@id": id,
              "@name": name,
              "@player": playerId,
              "@coords": coords,
            };
          });
        }

        // parsear rows y grid
        const parsedRows: PositionRow[] = planets.map((p) => {
          const [galaxy, system, position] = p["@coords"].split(":").map(Number);
          const player = p["@player"] ? { id: p["@player"], name: p["@name"] } : null;
          return { galaxy, system, position, player };
        });

        const parsedGrid: Record<string, any> = {};
        parsedRows.forEach((r) => {
          const g = String(r.galaxy);
          const s = String(r.system);
          const p = String(r.position);
          if (!parsedGrid[g]) parsedGrid[g] = {};
          if (!parsedGrid[g][s]) parsedGrid[g][s] = {};
          parsedGrid[g][s][p] = r;
        });

        setRows(parsedRows);
        setGrid(parsedGrid);
      } catch (e: any) {
        setError(e.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mock]);

  return { rows, grid, loading, error, isUrl };
};
