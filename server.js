require("dotenv").config();

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const PORT = process.env.PORT || 3000;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
app.use(cors());
app.use(express.json());

app.use(express.static(__dirname));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});
const salesmen = [
  {
    name: "Mittal-Arihant Kurta House",
    phone: "919274732279"
  },
  {
    name: "Ankit-Arihant Kurta House",
    phone: "919016932279"
  },
  {
    name: "Vicky-Arihant Kurta House",
    phone: "916354932279"
  }
];

async function getCurrentIndex() {
  const { data, error } = await supabase
    .from("counter")
    .select("current_index")
    .eq("id", 1)
    .single();

  if (error) throw error;

  return data.current_index;
}

async function saveCurrentIndex(index) {
  const { error } = await supabase
    .from("counter")
    .update({ current_index: index })
    .eq("id", 1);

  if (error) throw error;
}

app.post("/lead", async (req, res) => {
  try {
    const lead = req.body;

    // Get current salesman index
    let currentIndex = await getCurrentIndex();

    // Select salesman
    const salesman = salesmen[currentIndex];

console.log("Selected salesman:", salesman);

console.log("Lead being inserted:", {
  name: lead.name,
  phone: lead.phone,
  assigned_to: salesman.name
});

    // Save lead to Supabase
    const { error } = await supabase
      .from("leads")
      .insert([
        {
          name: lead.name,
          phone: lead.phone,
          assigned_to: salesman.name
        }
      ]);

    if (error) {
      return res.status(500).json(error);
    }

    // Update round robin
    currentIndex = (currentIndex + 1) % salesmen.length;
    await saveCurrentIndex(currentIndex);

    // Return selected salesman
    res.json({
      salesmanName: salesman.name,
      salesmanPhone: salesman.phone
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/admin/leads", async (req, res) => {

  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(500).json(error);
  }

  res.json(data);

});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});