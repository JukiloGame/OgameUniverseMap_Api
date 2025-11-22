import React from "react";
import type { PositionRow } from "../api/OgameService";

type MapGridProps = {
  rows: PositionRow[];
  maxPositions?: number; // por defecto 15
  maxSystems?: number;   // por defecto 499
};

export const MapGrid: React.FC<MapGridProps> = ({
  rows,
  maxPositions = 15,
  maxSystems = 499,
}) => {
  // transformar rows en grid
  const grid: Record<string, Record<string, Record<string, PositionRow>>> = {};
  rows.forEach((r) => {
    const g = String(r.galaxy);
    const s = String(r.system);
    const p = String(r.position);

    if (!grid[g]) grid[g] = {};
    if (!grid[g][s]) grid[g][s] = {};
    grid[g][s][p] = r;
  });

  const sortedGalaxies = Object.keys(grid).sort((a, b) => Number(a) - Number(b));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {sortedGalaxies.map((gal) => {
        const systems = grid[gal];

        return (
          <div key={gal}>
            <h3>Galaxy {gal}</h3>
            <div
              style={{
                display: "flex",
                gap: 2,
                overflowX: "auto",
                paddingBottom: 10,
              }}
            >
              {Array.from({ length: maxSystems }, (_, sysIndex) => {
                const sysNum = sysIndex + 1;
                const positions = systems[sysNum] ?? {};

                return (
                  <div
                    key={sysNum}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <span style={{ fontSize: 10 }}>{sysNum}</span>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                      }}
                    >
                      {Array.from({ length: maxPositions }, (_, posIndex) => {
                        const posNum = posIndex + 1;
                        const cell = positions[posNum];
                        const occupied = cell?.player ? true : false;

                        return (
                          <div
                            key={posNum}
                            title={cell?.player ? `${cell.player.name}` : "Empty"}
                            style={{
                              width: 20,
                              height: 20,
                              backgroundColor: occupied ? "red" : "lightgray",
                              border: "1px solid #999",
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
