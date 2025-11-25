import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

/**
 * Proxy dinámico:
 * /ogapi/264-es/universe.xml
 *   -> https://s264-es.ogame.gameforge.com/api/universe.xml
 */
app.get("/ogapi/:server/universe.xml", async (req, res) => {
  const serverId = req.params.server; // ej: "264-es"
  const targetUrl = `https://s${serverId}.ogame.gameforge.com/api/universe.xml`;

  try {
    const response = await fetch(targetUrl);

    if (!response.ok) {
      return res
        .status(response.status)
        .send(`Error proxying universe.xml: ${response.status}`);
    }

    const xml = await response.text();
    res.set("Content-Type", "application/xml");
    res.send(xml);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).send("Proxy error");
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log("Proxy server running on port", PORT));
