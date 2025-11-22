// server.js
import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = 3001;

app.get("/api/:serverId/universe.xml", async (req, res) => {
  const { serverId } = req.params;
  const url = `https://${serverId}.ogame.gameforge.com/api/universe.xml`;

  try {
    const response = await fetch(url);
    const text = await response.text();
    res.setHeader("Content-Type", "application/xml");
    res.send(text);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to fetch universe");
  }
});

app.listen(PORT, () => console.log(`Proxy server running on http://localhost:${PORT}`));
