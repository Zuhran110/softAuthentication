const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

require("dotenv").config();

const app = express();
connectDB();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.use(express.json());

//  route
app.use("/api", require("./routes/register.routes"));

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
