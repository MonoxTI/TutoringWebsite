import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import router from "./Routes/Route.js";
import connectDB from "./Config/DBconnect.js";



if (!process.env.MONGO_URI) {
  throw new Error("MONGODB_URI environment variable is required");
}

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:5173'
}));
app.use(express.json());

connectDB();

app.use("/api", router);

// Catch-all for 404
app.use((req, res) => {
  console.log("Unhandled route:", req.method, req.originalUrl);
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on localhost:${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});
