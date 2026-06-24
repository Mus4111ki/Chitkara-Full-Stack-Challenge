const express = require("express");
const cors = require("cors");

const { processHierarchy } = require("./utils/hierarchy");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server Running");
});

app.post("/bfhl", (req, res) => {
  const data = req.body.data || [];

  const result = processHierarchy(data);

  res.json({
    user_id: "muskan_24062026", // baad me change karenge
    email_id: "YOUR_CHITKARA_EMAIL",
    college_roll_number: "YOUR_ROLL_NUMBER",
    ...result
  });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});