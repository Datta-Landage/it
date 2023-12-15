const express = require("express");
const bodyParser = require("body-parser");
const route = require("./Route/route");
const { default: mongoose } = require("mongoose");
const { Route } = require("express");
const cors = require("cors");
const app = express();

const pdfModel = require("./Models/pdfModel");

// Enable All CORS Requests for development use
app.use(cors());

app.get("/mypdfData", async (req, res) => {
  const pdfData = await pdfModel.find({ isDeleted: false });
  res.status(200).send({
    status: true,
    msg: "pdfData retrieved succesfully",
    data: pdfData,
  });
});
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

mongoose
  .connect(
    "mongodb+srv://qjoxqciedfjvrzyeyh:oVDaqdgLGKDxYT58@cluster0.kczadan.mongodb.net/schoolWebsite",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("MongoDb is connected"))
  .catch((err) => console.log(err));

app.use("/", route);

app.listen(process.env.PORT || 3000, function () {
  console.log("Express app running on port " + (process.env.PORT || 3000));
});
