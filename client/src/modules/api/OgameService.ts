export class OgameService {
  serverId: string;

  constructor(serverId: string) {
    this.serverId = serverId;
  }

  getUniverseUrl() {
    return `https://${this.serverId}.ogame.gameforge.com/api/universe.xml`;
  }

  async fetchXml(): Promise<string> {
    const res = await fetch(this.getUniverseUrl());
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.text();
  }
}
