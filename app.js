import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import EmployeeRouter from "./src/routes/Employe.route.js";
import TowerRouter from "./src/routes/TowerRoute.js";
import AdminRouter from "./src/routes/Admin.route.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/employee", EmployeeRouter);
app.use("/api/v1/tower", TowerRouter);
app.use("/api/v1/admin", AdminRouter);

export { app };
