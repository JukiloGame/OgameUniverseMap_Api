import { useOgameData } from "./hooks/useOgameData";
import {MapGrid} from "./modules/map/MapGrid";

export default function App() {
  const { grid, rows, loading, error, isUrl } = useOgameData(false); // true = mock

      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ padding: 5 }}>
      <h1>OGame Map MVP</h1>
      <h2>{isUrl ? "URL" : "Json Test"}</h2>
      <MapGrid rows = {rows}/>
    </div>
  );
}
