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