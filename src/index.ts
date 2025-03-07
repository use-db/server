var express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
let bodyParser = require("body-parser");
let jsonParser = bodyParser.json();
var mongoose = require("mongoose");
let performQuery = require("./processQuery");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connection successful");
});

app.get("/", (req: any, res: any) => {
  return res.send("Received a GET HTTP method");
});
app.post("/get-collections", jsonParser, async (req: any, res: any) => {
  try {
    return res.json({
      success: true,
      data: JSON.stringify(
        await mongoose.connection.db.listCollections().toArray()
      ),
    });
  } catch (err) {
    return res.json({
      success: false,
      data: JSON.stringify(`Error in getting collections ${err}`),
    });
  }
});
app.post("/query", jsonParser, async (req: any, res: any) => {
  try {
    return res.json(await performQuery(req.body));
  } catch (err) {
    return res.json({
      success: false,
      data: JSON.stringify(`Error in processig query ${err}`),
    });
  }
});

app.listen(process.env.PORT, () =>
  console.log(`Listening on port ${process.env.PORT}!`)
);
