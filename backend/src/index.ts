import express from "express";
import routes from "./routes";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors({}));

app.use(express.json());
connectDB();

app.listen(PORT, () => {
  console.log(`Rodando na porta ${PORT}`);
});

app.use(routes);
