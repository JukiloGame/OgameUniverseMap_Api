import type { PositionRow, PlayerData } from "../types/types";

export function parseXmlToJson(xmlText: string): PositionRow[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, "application/xml");
  const err = doc.querySelector("parsererror");
  if (err) throw new Error("Failed to parse XML: " + err.textContent);

  const rows: PositionRow[] = [];
  const posNodes = Array.from(doc.querySelectorAll("position,planet"));

  posNodes.forEach((node) => {
    const g = node.getAttribute("galaxy") || node.getAttribute("gal");
    const s = node.getAttribute("system") || node.getAttribute("sys");
    const p = node.getAttribute("position") || node.getAttribute("pos");

    if (g && s && p) {
      const playerNode = node.querySelector("player");
      const player: PlayerData | null = playerNode
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
