import { OgameService } from "././OgameService";
import { parseXmlToJson } from "../utils/parseXmlToJson";
import type { PositionRow } from "../types/types";

export class UniverseService {
  service: OgameService;

  constructor(serverId: string) {
    this.service = new OgameService(serverId);
  }

  positionsToGrid(rows: PositionRow[]) {
    const grid: Record<string, any> = {};
    rows.forEach((r) => {
      const g = String(r.galaxy);
      const s = String(r.system);
      const p = String(r.position);
      if (!grid[g]) grid[g] = {};
      if (!grid[g][s]) grid[g][s] = {};
      grid[g][s][p] = r;
    });
    return grid;
  }

  async getUniverse() {
    try {
      const xml = await this.service.fetchXml();
      const rows = parseXmlToJson(xml);
      const grid = this.positionsToGrid(rows);
      return { rows, grid };
    } catch (err) {
      console.error("UniverseService.getUniverse error:", err);
      return null;
    }
  }
}
