import { Router } from "express";

import { adminLogin } from "../controllers/AdminController.js";

const router = Router();

router.post("/registerAdmin", adminLogin);

export default router;
