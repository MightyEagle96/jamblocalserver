import express from "express";
import morgan from "morgan";
import router from "./routes.js";
import cors from "cors";
import { originUrl } from "./data.js";

const app = express();

app.use(express.json({ limit: "100mb" }));
app.use(cors({ origin: originUrl, credentials: true }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/", router);

app.listen(5000, () => {
  console.log("Jamb Local Server is listening");
});
