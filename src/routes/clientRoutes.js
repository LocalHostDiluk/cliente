import express from "express";
import {
  getClients,
  createClient,
  updateClient,
  deleteClient,
} from "../controllers/clientController.js";

const router = express.Router(); // Router para crear rutas de nuestro servicio

router.get("/all", getClients);
router.post("/create", createClient);
router.patch("/update/:id", updateClient);
router.delete("/delete/:id", deleteClient);

export default router;
