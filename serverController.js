import NetworkSpeedCheck from "network-speed";
import ping from "ping";

const connectedComputers = [];
let timer = 0;
let beginExam = { mainExamination: false, networkTest: false, duration: 0 };

let networkTest = { isActive: false, duration: 0 };

const networkSpeed = new NetworkSpeedCheck();
const baseUrl = "http://localhost:4000";
const fileSizeInBytes = 50000;

export const performNetworkTest = (req, res) => {
  if (networkTest.isActive) {
    networkTest.isActive = !networkTest.isActive;
    networkTest.duration = 0;
    res.json({ message: "Network test stopped", networkTest });
  } else {
    networkTest.isActive = !networkTest.isActive;
    networkTest.duration = req.body.duration;
    res.json({ message: "Network test started", networkTest });
  }
};
export const viewNetworkTest = (req, res) => {
  res.json({ networkTest });
};

export const connectToServer = (req, res) => {
  req.body.isBackup = false;
  req.body.connectionStatus = "connected";
  const existing = connectedComputers.find((c) => {
    return c.ipAddress == req.body.ipAddress;
  });

  if (!existing) {
    connectedComputers.push(req.body);
  }
  res.json({ message: "Connected" });
};

export const connectedDevices = (req, res) => {
  res.json({ count: connectedComputers.length, connectedComputers });
};

export const networkDownload = (req, res) => {
  networkSpeed
    .checkDownloadSpeed(baseUrl, fileSizeInBytes)
    .then((result) => {
      res.json({ downloadSpeed: result });
    })
    .catch((e) => console.error(e));
};

export const networkUpload = (req, res) => {
  const options = {
    hostName: baseUrl,
    port: 5000,
    path: "/upload",
    method: "POST",
    headers: { "Content-Type": "application/json" },
  };
  networkSpeed
    .checkUploadSpeed(options, fileSizeInBytes)
    .then((result) => res.json({ uploadSpeed: result }))
    .catch((e) => console.error(e));
};

export const makeBackup = (req, res) => {
  const index = connectedComputers.findIndex(
    (d) => d.ipAddress === req.body.ipAddress
  );
  console.log(index);

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
        } else connectedComputers[i].connectionStatus = "disconnected";
      });
    }
  }, 5000);
}

GetConnectionStatus();

export const beginExamination = (req, res) => {
  console.log(req.body);
  const { duration } = req.body;
  timer = duration;
  if (req.body.mainExamination) {
    beginExam = {
      mainExamination: req.body.mainExamination,
      networkTest: false,
      duration,
    };

    res.json({ message: "Examination Started" });
  } else if (req.body.networkTest) {
    beginExam = {
      mainExamination: false,
      networkTest: req.body.networkTest,
      duration,
    };
    res.json({ message: "Network Test Started" });
  } else if (!req.body.mainExamination) {
    beginExam = {
      mainExamination: false,
      networkTest: false,
    };
    res.json({ message: "Examination Stopped" });
  } else if (!req.body.networkTest) {
    beginExam = {
      mainExamination: false,
      networkTest: false,
    };
    res.json({ message: "Network Stopped" });
  }
};

export const GetExaminationStatus = (req, res) => {
  res.json({ beginExam });
};

export const ApplicationClosed = (req, res) => {
  if (req.body.ipAddress) {
    const index = connectedComputers.findIndex(
      (d) => d.ipAddress === req.body.ipAddress
    );
    connectedComputers.splice(index, 1);
  }
  res.send("done");
};
