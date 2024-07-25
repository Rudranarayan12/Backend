import { Router } from "express";
import { registerTower } from "../controllers/TowerController.js";

const router = Router();

router.post("/registerTower", registerTower);

export default router;
