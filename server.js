const express = require("express");
const puppeteer = require("puppeteer");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.json());

app.post("/api/bypass", async (req, res) => {
  const { cookie } = req.body;

  if (!cookie || !cookie.includes(".ROBLOSECURITY")) {
    return res.status(400).json({ message: "Invalid cookie." });
  }

  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox"]
    });
    const page = await browser.newPage();

    await page.setCookie({
      name: ".ROBLOSECURITY",
      value: cookie,
      domain: ".roblox.com",
      path: "/",
      httpOnly: true,
      secure: true
    });

    await page.goto("https://www.roblox.com/home", { waitUntil: "domcontentloaded" });

    const newCookies = await page.cookies();
    const refreshedCookie = newCookies.find(c => c.name === ".ROBLOSECURITY");

    await browser.close();

    if (refreshedCookie) {
      res.json({ refreshedCookie: refreshedCookie.value });
    } else {
      res.status(500).json({ message: "Failed to refresh cookie." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal error." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
