import { Router } from "express";
import { registerEmployee } from "../controllers/EmployeController.js";
import { loginEmployee } from "../controllers/EmployeController.js";
const route = Router();

route.post("/registeremployee", registerEmployee);
route.get("/loginemployee", loginEmployee);

export default route;
