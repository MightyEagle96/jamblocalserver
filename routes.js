import express from "express";
import { PacketsCount, ViewProgress } from "./networkTestController.js";
import { isConnectedToServer } from "./realTimeController.js";
import {
  ApplicationClosed,
  beginExamination,
  connectedDevices,
  connectionStatus,
  connectToServer,
  GetExaminationStatus,
  makeBackup,
  networkDownload,
  networkUpload,
  performNetworkTest,
  viewNetworkTest,
} from "./serverController.js";

const router = express.Router();

router
  .get("/", (req, res) => {
    res.json({ message: "Hello from this side" });
  })
  .post("/test", connectToServer)
  .get("/connectedDevices", connectedDevices)
  .post("/networkTest", performNetworkTest)
  .get("/networkTest", viewNetworkTest)
  .post("/packetsCount", PacketsCount)
  .get("/viewProgress", ViewProgress)
  .post("/testUpload", networkUpload)
  .get("/testDownload", networkDownload)
  .get("/serverConnected", isConnectedToServer)
  .post("/makeBackup", makeBackup)
  .post("/connectionStatus", connectionStatus)
  .post("/beginExamination", beginExamination)
  .get("/examinationStatus", GetExaminationStatus)
  .post("/applicationClosed", ApplicationClosed);

export default router;
