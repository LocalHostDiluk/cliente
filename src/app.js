//config express
import express from "express";
import bodyParser from "body-parser";
import clientRoutes from "./routes/clientRoutes.js";

const app = express();

app.use(bodyParser.json());
app.use("/app/client", clientRoutes);

export default app;