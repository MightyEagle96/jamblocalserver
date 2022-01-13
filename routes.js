import express from "express";

import {
  ApplicationClosed,
  connectedDevices,
  connectionStatus,
  ConnectToCentralServer,
  connectToServer,
  GetCenterDetails,
  GetExaminationStatus,
  makeBackup,
  performNetworkTest,
  viewNetworkTest,
  GetMyReport,
  PacketsCount,
  ViewProgress,
  isConnectedToServer,
  ShutDownApplication,
  UploadTestResult,
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
  .post("/getMyTestResult", GetMyReport)
  .post("/packetsCount", PacketsCount)
  .get("/viewProgress", ViewProgress)
  .get("/serverConnected", isConnectedToServer)
  .post("/makeBackup", makeBackup)
  .post("/connectionStatus", connectionStatus)
  .get("/examinationStatus", GetExaminationStatus)
  .post("/applicationClosed", ApplicationClosed)
  .post("/connectToCentralServer", ConnectToCentralServer)
  .post("/shutDownApplication", ShutDownApplication)
  .get("/centerDetails", GetCenterDetails)
  .get("/fetchTestResult", UploadTestResult);

export default router;
