import express from "express";
import axios from "axios";
const { join } = require("path");
if (process.env.NODE_ENV !== "production") require("dotenv").config();

if (!process.env.APIKey || !process.env.APIHost) throw new Error("APIKey or APISecret not set");

const app = express();
const port = process.env.PORT || 3333;

app.use(express.json());
app.use(express.raw({ type: "application/vnd.custom-type" }));
app.use(express.text({ type: "text/html" }));
app.set("json spaces", 2);
app.set('views', join(__dirname, 'views'));
app.use(express.static(join(__dirname, "public")));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

const getIpInfo = async (ip: string) => {
  const response = await axios.get(`https://${process.env.APIHost}/${ip}?key=${process.env.APIKey}`)
  .then(res => res.data)
  .catch(err => {
    // Check status code
    if (err.response.status === 400) {
      return {
        ip: ip,
        error: "Invalid IP address or Private IP address"
      }
    } else if (err.response.status === 500) {
      return {
        ip: ip,
        error: "Internal server error"
      }
    } else {
      return {
        ip: ip,
        error: "Unknown error"
      }
    }
  })
  return response;
}

app.get("/", async (req, res) => {
  res.render("index");
});

app.get("/api/:ip", async (req, res) => {
  const { ip } = req.params;

  const ipInfo = await getIpInfo(ip);

  if (Object.keys(ipInfo).length === 0) {
    return res.status(404).json({ error: "IP not found" });
  }

  return res.json(ipInfo);

});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
