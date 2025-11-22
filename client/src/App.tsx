import { useOgameData } from "./hooks/useOgameData";
import {MapGrid} from "./modules/map/MapGrid";

export default function App() {
  const { grid, rows, loading, error, isUrl } = useOgameData(false); // true = mock

      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error: {error}</p>;

  return (
    <div className="min-h-screen bg-lineal-to-b from-black to-gray-900 text-white font-sans p-4">
      <h1 className="text-3xl font-bold mb-6">OGame Map</h1>
      <h2 className="text-1xl font-bold mb-4">{isUrl ? "URL" : "Json Test"}</h2>
      <MapGrid rows = {rows}/>
    </div>
  );
}
