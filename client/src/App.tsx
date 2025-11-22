import { useOgameData } from "./hooks/useOgameData";

export default function App() {
  const { grid, rows, loading, error, isUrl } = useOgameData(false); // true = mock

  return (
    <div style={{ padding: 20 }}>
      <h1>OGame Map MVP</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <h2>{isUrl ? "URL" : "Json Test"}</h2>
      <pre>{JSON.stringify(grid, null, 2)}</pre>
    </div>
  );
}
