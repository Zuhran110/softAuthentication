import express, { Request, Response } from "express";
import registerRoutes from "./routes/register.routes";

const cors = require("cors");
import connectDB from "./config/db";

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
app.use("/api", registerRoutes);

// test routes
app.get("/", (req: Request, res: Response) => {
  res.send("API is running...");
});

const PORT: number = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
