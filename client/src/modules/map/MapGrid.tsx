import React from "react";
import type { PositionRow } from "../types/types";

type MapGridProps = {
  rows: PositionRow[];
  maxPositions?: number; // default 15
  maxSystems?: number;   // default 499
};

export const MapGrid: React.FC<MapGridProps> = ({
  rows,
  maxPositions = 15,
  maxSystems = 499,
}) => {
  // Convertir rows en grid
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
    <div className="flex flex-col gap-6 p-4 bg-lineal-to-b from-black to-gray-900 text-white">
      {sortedGalaxies.map((gal) => {
        const systems = grid[gal];

        return (
          <div key={gal} className="flex flex-col gap-2">
            <h3 className="text-2xl font-bold mb-2">Galaxy {gal}</h3>
            <div className="flex overflow-x-auto pb-4">
              {Array.from({ length: maxSystems }, (_, sysIndex) => {
                const sysNum = sysIndex + 1;
                const positions = systems[sysNum] ?? {};

                return (
                  <div
                    key={sysNum}
                    className="flex flex-col items-center"
                  >
                    <span className="text-sm mb-1">{sysNum}</span>
                    <div className="flex flex-col">
                      {Array.from({ length: maxPositions }, (_, posIndex) => {
                        const posNum = posIndex + 1;
                        const cell = positions[posNum];
                        const occupied = cell?.player ? true : false;

                        return (
                          <div
                            key={posNum}
                            title={cell?.player ? cell.player.name : "Empty"}
                            className={`w-6 h-6 border ${
                              occupied ? "bg-red-600 border-red-700 hover:bg-red-500" : "bg-gray-800 border-gray-700"
                            }`}
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
