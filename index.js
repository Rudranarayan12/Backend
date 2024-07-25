import dotenv from "dotenv";
import DbConnect from "./src/db/DbConnect.js";
import { app } from "./app.js";

dotenv.config();

DbConnect()
  .then(() => {
    app.listen(process.env.PORT || 9000, () => {
      console.log(`app is succssfully running on ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoConnection failed", err);
  });
