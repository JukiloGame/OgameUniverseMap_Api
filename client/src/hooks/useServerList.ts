import { useState, useEffect } from "react";

export const useServerList = () => {
  const [servers, setServers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/ogservers/api/servers")
      .then(res => res.json())
      .then(data => setServers(data))
      .finally(() => setLoading(false));
  }, []);

  return { servers, loading };
};
