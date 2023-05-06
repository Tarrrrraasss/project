const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

mongoose.connect(
  "mongodb+srv://fedoruk:GBWYw0pjYkM2aDVH@cluster0.duxotud.mongodb.net/reagents",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const Chemical = mongoose.model("Chemical", {
  name: String,
  quantity: Number,
  unit: String,
  price: Number,
  lastAdded: Date,
});

// GET all reagents
app.get("/reagents", async (req, res) => {
  try {
    const reagents = await Chemical.find();
    res.send(reagents);
  } catch (err) {
    res.status(500).send(err);
  }
});

// POST new reagents
app.post("/reagents", async (req, res) => {
  const { name, quantity, unit, price } = req.body;
  const reagents = new Chemical({
    name,
    quantity,
    unit,
    price,
    lastAdded: new Date(),
  });
  try {
    await reagents.save();
    res.send(reagents);
  } catch (err) {
    res.status(500).send(err);
  }
});

// PUT withdraw reagents by id
app.put("/reagents/:id", async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  try {
    // Check if reagents exists
    const reagents = await Chemical.findById(id);
    if (!reagents) throw new Error("Reagents not found");
    // Check if enough quantity
    if (reagents.quantity < quantity) throw new Error("Not enough quantity");
    // Update quantity and balance
    reagents.quantity -= quantity;
    await reagents.save();
    res.send(reagents);
  } catch (err) {
    res.status(500).send(err);
  }
});

// GET statistics for the last month
app.get("/reagents/stats", async (req, res) => {
  try {
    const currentMonth = new Date().getMonth();
    const reagents = await Chemical.find();
    if (reagents.length === 0) {
      return res.status(404).send("No reagents in the database.");
    }
    const added = reagents.reduce((acc, reagents) => {
      if (
        !reagents.lastAdded ||
        reagents.lastAdded.getMonth() !== currentMonth
      ) {
        return acc;
      }
      return acc + reagents.quantity;
    }, 0);
    const withdrawn = reagents.reduce((acc, reagents) => {
      if (
        !reagents.lastAdded ||
        reagents.lastAdded.getMonth() !== currentMonth
      ) {
        return acc;
      }
      return acc + reagents.quantity;
    }, 0);

    const balance = reagents.reduce(
      (acc, reagents) => acc + reagents.price * reagents.quantity,
      0
    );
    res.send({ added, withdrawn, balance });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error.");
  }
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
