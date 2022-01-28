import ping from "ping";

let connectedComputers = [];
let centerDetails = null;
let shutDown = false;
let timer = 0;
let beginExam = { mainExamination: false, networkTest: false, duration: 0 };
let networkedComputers = [];

let networkTest = { isActive: false, duration: 0 };

let downloadedQuestions = [];

let downloadedCandidates = [];

let savedProgress = [];

let loggedInCandidates = [];

export const SaveCandidatesProgress = (req, res) => {
  // savedProgress.findIndex((c=>c.cand))

  const index = savedProgress.findIndex(
    (c) => c.candidateData._id === req.body.candidateData._id
  );

  if (index >= 0) {
    savedProgress[index] = req.body;
  } else {
    savedProgress.push(req.body);
  }

  res.json({ message: "Saved" });
};

export const ViewCandidateProgress = (req, res) => {
  //structure this data for proper presentation

  res.json({ savedProgress });
};

// export const ViewStructured = (req, res) => {
//   let structuredData = [];

//   for (let i = 0; i < savedProgress.length; i++) {
//     const data = {};

//     const { candidateData } = savedProgress[i];

//     const { subjectCombinations } = candidateData;

//     const { candidateAnswers } = savedProgress[i];

//     //loop through the candidate answers
//     for (let j = 0; j < candidateAnswers.length; j++) {
//       for (let k = 0; k < subjectCombinations.length; k++) {
//         if (
//           candidateAnswers[j].subject === subjectCombinations[k].subject.slug
//         ) {
//           data[subjectCombinations[k].subject.title] = {
//             questionsAnswered: k++,
//           };
//         }
//       }
//     }
//     structuredData.push(data);
//   }

//   res.json({ structuredData });
// };

export const DownloadCandidates = (req, res) => {
  downloadedCandidates = req.body.candidates;
  res.json({ message: "Candidates Downloaded" });
};

export const ViewCandidates = (req, res) => {
  res.json({ downloadedCandidates });
};

export const CandidateLogin = (req, res) => {
  const { registrationNumber } = req.body;

  const candidate = downloadedCandidates.find(
    (d) => d.registrationNumber === registrationNumber.toLowerCase()
  );

  if (candidate) {
    const isLoggedIn = loggedInCandidates.find((c) => c._id === candidate._id);

    if (isLoggedIn) {
      res.status(403).json({ message: "Candidate already logged in" });
    } else {
      loggedInCandidates.push(candidate);
      res.json({ message: "Logged In", candidate });
    }
  } else res.status(401).json({ message: "Candidate not found" });
};

export const DownloadQuestions = (req, res) => {
  downloadedQuestions = req.body;
  res.json({ message: "Questions Downloaded" });
};

export const FetchQuestions = (req, res) => {
  res.json({ questions: downloadedQuestions });
};

export const ConnectToCentralServer = (req, res) => {
  centerDetails = req.body;
  res
    .status(201)
    .json({ message: "Local Server is now connected to the central server." });
};

export const CentralServerMiddleWare = (req, res, next) => {
  if (centerDetails === null) {
    res.status(403).json({
      message: "Local Server is not connected to the central server.",
    });
  } else next();
};

export const GetCenterDetails = (req, res) => {
  res.json({ centerDetails });
};

export const performNetworkTest = (req, res) => {
  networkTest.isActive = !networkTest.isActive;
  networkTest.duration = req.body.duration;
  networkTest.timeStarted = new Date().toTimeString();
  res.json({ message: "Network test started", networkTest });
  StopTheTimer();
};

function StopTheTimer() {
  const timeBegan = new Date();
  timeBegan.setMinutes(timeBegan.getMinutes() + networkTest.duration);

  const timer = setInterval(() => {
    const currentTime = new Date();
    if (timeBegan.toTimeString() === currentTime.toTimeString()) {
      clearInterval(timer);
      networkTest.timeStopped = currentTime.toTimeString();
      networkTest.isActive = false;
    }
  }, 1000);
}

export const deactivateNetworkTest = (req, res) => {
  networkTest.isActive = !networkTest.isActive;
  networkTest.duration = 0;
  res.json({ message: "Network test deactivated" });
};
export const viewNetworkTest = (req, res) => {
  res.json({ networkTest });
};

export const connectToServer = (req, res) => {
  //do this to prevent computers being connected when the local server is not yet connected to the main server

  req.body.isBackup = false;
  req.body.connectionStatus = "connected";
  req.body.appClosed = false;

  const index = connectedComputers.findIndex((c) => {
    return c.ipAddress == req.body.ipAddress;
  });

  if (index < 0) {
    connectedComputers.push(req.body);
  } else connectedComputers[index] = req.body;
  res.json({ message: "Connected" });
};

export const connectedDevices = (req, res) => {
  res.json({
    count: connectedComputers.length,
    connectedComputers: connectedComputers.sort((a, b) => {
      let fa = a.ipAddress,
        fb = b.ipAddress;

      if (fa < fb) return -1;
      if (fa > fb) return 1;
      return 0;
    }),
  });
};

export const makeBackup = (req, res) => {
  const index = connectedComputers.findIndex(
    (d) => d.ipAddress === req.body.ipAddress
  );

  if (index >= 0) {
    connectedComputers[index].isBackup = true;

    res.json({ message: "Process successful" });
  } else res.json({ message: "something occured" });
};

export const connectionStatus = (req, res) => {
  try {
    const index = connectedComputers.findIndex(
      (d) => d.ipAddress === req.body.ipAddress
    );
    connectedComputers[index].connectionStatus = "connected";
  } catch (error) {}

  res.json({ message: "running" });
};

function GetConnectionStatus() {
  setInterval(() => {
    for (let i = 0; i < connectedComputers.length; i++) {
      ping.sys.probe(connectedComputers[i].ipAddress, function (isAlive) {
        if (isAlive) {
          connectedComputers[i].connectionStatus = "connected";
          connectedComputers[i].pingRate = "1ms";
        } else {
          connectedComputers[i].connectionStatus = "disconnected";
          connectedComputers[i].pingRate = "0ms";
        }
      });
    }
  }, 5000);
}

GetConnectionStatus();

export const GetExaminationStatus = (req, res) => {
  res.json({ beginExam });
};

export const ApplicationClosed = (req, res) => {
  //when the app is closed
  const index = connectedComputers.findIndex(
    (d) => d.ipAddress === req.body.ipAddress
  );

  connectedComputers[index].appClosed = true;
  res.send("done");
};

//what we want here is the IP Address and the number of packets recieved

export const PacketsCount = (req, res) => {
  const index = networkedComputers.findIndex(
    (d) => d.ipAddress === req.body.ipAddress
  );
  if (index >= 0) {
    if (networkedComputers[index].ackPackets < networkTest.duration) {
      networkedComputers[index].ackPackets = networkedComputers[
        index
      ].ackPackets += 1;
      networkedComputers[index].percentage = Math.floor(
        (networkedComputers[index].ackPackets / networkTest.duration) * 100
      );
    }
  } else {
    networkedComputers.push({
      ipAddress: req.body.ipAddress,
      ackPackets: 1,
      percentage: Math.floor((1 / networkTest.duration) * 100),
    });
  }

  res.json({ message: "Saved" });
};

export const ViewProgress = (req, res) => {
  res.json({
    networkedComputers: networkedComputers.sort((a, b) => {
      let fa = a.ipAddress,
        fb = b.ipAddress;

      if (fa < fb) return -1;
      if (fa > fb) return 1;
      return 0;
    }),
  });
};

export const GetMyReport = (req, res) => {
  const index = networkedComputers.findIndex(
    (d) => d.ipAddress === req.body.ipAddress
  );

  const computer = networkedComputers[index];
  res.json({ computer });
};

export const ShutDownApplication = (req, res) => {
  shutDown = !shutDown;
  connectedComputers = [];
  networkedComputers = [];
  res.json({ shutDown });
  ReverseShutdown();
};

export const isConnectedToServer = (req, res) => {
  res.json({ connected: true, shutDown });
};

function ReverseShutdown() {
  setTimeout(() => {
    shutDown = !shutDown;
  }, 10000);
}

export const UploadTestResult = (req, res) => {
  let performance = 0;
  networkedComputers.forEach((nc) => {
    performance += nc.percentage;
  });
  const testReport = {
    center: centerDetails._id,
    connectedComputers,
    dateConducted: new Date().toDateString(),
    networkTestDuration: networkTest.duration,
    timeStarted: networkTest.timeStarted,
    timeStopped: networkTest.timeStopped,
    overallTestPerformance: (performance / networkedComputers.length).toFixed(
      2
    ),
  };

  res.json({ testReport });
  networkedComputers = [];
  networkTest = { isActive: false, duration: 0 };
};
