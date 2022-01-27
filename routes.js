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
  CentralServerMiddleWare,
  DownloadQuestions,
  FetchQuestions,
  DownloadCandidates,
} from "./serverController.js";

const router = express.Router();

router

  .get("/", (req, res) => {
    res.json({ message: "Hello from this side" });
  })
  .post("/connectToCentralServer", ConnectToCentralServer)
  .get("/centerDetails", GetCenterDetails)
  .use(CentralServerMiddleWare)
  .post("/connectToServer", connectToServer)
  .get("/connectedDevices", connectedDevices)
  .post("/networkTest", performNetworkTest)
  .get("/networkTest", viewNetworkTest)
  .post("/getMyTestResult", GetMyReport)
  .post("/packetsCount", PacketsCount)
  .get("/viewProgress", ViewProgress)
  .get("/serverConnected", isConnectedToServer)
  .post("/makeBackup", makeBackup)
  .post("/downloadQuestions", DownloadQuestions)
  .get("/getQuestions", FetchQuestions)
  .post("/connectionStatus", connectionStatus)
  .get("/examinationStatus", GetExaminationStatus)
  .post("/applicationClosed", ApplicationClosed)
  .post("/shutDownApplication", ShutDownApplication)
  .post("/downloadCandidates", DownloadCandidates)
  .get("/fetchTestResult", UploadTestResult);

export default router;
