export type PlayerData = {
  id?: string;
  name?: string;
  allianceId?: string;
};

export type PositionRow = {
  galaxy: number;
  system: number;
  position: number;
  player?: PlayerData | null;
};

export class OgameService {
  serverId: string;

  constructor(serverId: string) {
    this.serverId = serverId;
  }

  getUniverseUrl() {
    return `https://${this.serverId}.ogame.gameforge.com/api/universe.xml`;
  }

  async fetchXml(url: string) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.text();
  }

  parseXml(xmlText: string): Document {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, "application/xml");
    const err = doc.querySelector("parsererror");
    if (err) throw new Error("Failed to parse XML: " + err.textContent);
    return doc;
  }

  xmlDomToPositions(doc: Document): PositionRow[] {
    const rows: PositionRow[] = [];
    const posNodes = Array.from(doc.querySelectorAll("position,planet"));

    posNodes.forEach((node) => {
      const g = node.getAttribute("galaxy") || node.getAttribute("gal");
      const s = node.getAttribute("system") || node.getAttribute("sys");
      const p = node.getAttribute("position") || node.getAttribute("pos");

      if (g && s && p) {
        const playerNode = node.querySelector("player");
        const player = playerNode
          ? {
              id: playerNode.getAttribute("id") ?? undefined,
              name: playerNode.textContent?.trim() ?? undefined,
              allianceId: playerNode.getAttribute("allianceid") ?? undefined,
            }
          : null;

        rows.push({
          galaxy: Number(g),
          system: Number(s),
          position: Number(p),
          player,
        });
      }
    });

    return rows;
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
      const xml = await this.fetchXml(this.getUniverseUrl());
      const doc = this.parseXml(xml);
      const rows = this.xmlDomToPositions(doc);
      const grid = this.positionsToGrid(rows);
      return { rows, grid };
    } catch (err) {
      console.error("OgameService.getUniverse error:", err);
      return null;
    }
  }
}
