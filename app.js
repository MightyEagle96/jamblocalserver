import express from "express";
import morgan from "morgan";
import router from "./routes.js";
import cors from "cors";
import { originUrl } from "./data.js";

const app = express();

app.use(express.json());
app.use(cors({ origin: originUrl, credentials: true }));
app.use(morgan("dev"));

app.use("/", router);

app.listen(5000, () => {
  console.log("App is listening");
});
