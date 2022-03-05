import express from "express";

import {
  ApplicationClosed,
  connectedDevices,
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
  ViewCandidates,
  CandidateLogin,
  SaveCandidatesProgress,
  ViewCandidateProgress,
  SubmitExamination,
  GetTimeRemaining,
  TrashNetworkTest,
  ReadmitCandidate,
  GetCandidateProgress,
  RestoreBackup,
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
  .post("/serverConnected", isConnectedToServer)
  .post("/makeBackup", makeBackup)
  .post("/downloadQuestions", DownloadQuestions)
  .get("/getTimeLeft", GetTimeRemaining)
  .get("/getQuestions", FetchQuestions)
  .post("/readmitCandidate", ReadmitCandidate)
  .get("/getProgress/:id", GetCandidateProgress)
  .get("/examinationStatus", GetExaminationStatus)
  .post("/applicationClosed", ApplicationClosed)
  .post("/shutDownApplication", ShutDownApplication)
  .post("/downloadCandidates", DownloadCandidates)
  .get("/getCandidates", ViewCandidates)
  .get("/fetchTestResult", UploadTestResult)
  .post("/candidateLogin", CandidateLogin)
  .post("/trashSim", TrashNetworkTest)
  .post("/saveCandidateProgress", SaveCandidatesProgress)
  .get("/getCandidatesProgress", ViewCandidateProgress)
  .post("/submitExamination", SubmitExamination)
  .get("/restoreBackup", RestoreBackup);

export default router;
