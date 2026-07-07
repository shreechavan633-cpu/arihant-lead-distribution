const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const salesmen = [
  {
    name: "Salesman 1",
    phone: "919111111111"
  },
  {
    name: "Salesman 2",
    phone: "919222222222"
  },
  {
    name: "Salesman 3",
    phone: "919333333333"
  }
];

function getCurrentIndex() {
  const data = JSON.parse(fs.readFileSync("counter.json", "utf8"));
  return data.currentIndex;
}

function saveCurrentIndex(index) {
  fs.writeFileSync(
    "counter.json",
    JSON.stringify({ currentIndex: index }, null, 2)
  );
}

app.post("/lead", (req, res) => {

  const lead = req.body;

  let currentIndex = getCurrentIndex();

  const salesman = salesmen[currentIndex];

  currentIndex = (currentIndex + 1) % salesmen.length;

  saveCurrentIndex(currentIndex);

  res.json({
    salesmanName: salesman.name,
    salesmanPhone: salesman.phone,
    lead: lead
  });

});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});