const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/hisse/:sembol', async (req, res) => {
  try {
    const sembol = req.params.sembol;
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${sembol}?interval=1d&range=1d`;
    const response = await fetch(url);
    const json = await response.json();
    const result = json?.chart?.result?.[0]?.meta;
    if (!result) {
      return res.status(404).json({ error: "Veri bulunamadı" });
    }
    const fiyat = result.regularMarketPrice;
    const prev = result.previousClose;
    const degisim = prev ? ((fiyat - prev) / prev) * 100 : null;
    res.json({ fiyat, degisim });
  } catch (e) {
    res.status(500).json({ error: "Sunucu hatası", detay: e.message });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Proxy çalışıyor");
});
