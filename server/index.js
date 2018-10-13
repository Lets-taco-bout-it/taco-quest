const express = require("express");
const bodyParser = require("body-parser");
const massive = require("massive");
const cors = require("cors");
const controller = require("./controller");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = express();

//middleware
app.use(bodyParser.json());
app.use(cors());

//massive
massive(process.env.CONNECTION_STRING, { scripts: path.join(__dirname, "db") })
  .then(dbInstance => {
    app.set("db", dbInstance);
  })
  .catch(err => console.log(err));

//Endpoints
//Level One
app.get("/api/lvl1", controller.getLvl1);
app.post("/api/lvl1", controller.postLvl1);
//Level Two
app.get("/api/lvl2", controller.getLvl2);
app.post("api/lvl2", controller.postLvl2);
//Level Three
app.get("/api/lvl3", controller.getLvl3);
app.post("api/lvl3", controller.postLvl3);

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
