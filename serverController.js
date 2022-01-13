import NetworkSpeedCheck from "network-speed";
import ping from "ping";

const connectedComputers = [];

let centerDetails = null;
let timer = 0;
let beginExam = { mainExamination: false, networkTest: false, duration: 0 };
const networkedComputers = [];

let networkTest = { isActive: false, duration: 0 };

const networkSpeed = new NetworkSpeedCheck();
const baseUrl = "http://localhost:4000";
const fileSizeInBytes = 50000;

export const ConnectToCentralServer = (req, res) => {
  centerDetails = req.body;
  res.status(201).json({ message: "Welcome" });
};

export const GetCenterDetails = (req, res) => {
  res.json({ centerDetails });
};

export const performNetworkTest = (req, res) => {
  networkTest.isActive = !networkTest.isActive;
  networkTest.duration = req.body.duration;
  networkTest.beganAt = new Date();
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
      networkTest.stoppedAt = currentTime;
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
  if (centerDetails === null) {
    return res.status(403).json({
      message:
        "The Local Server is not linked up with the central Jamb server.",
    });
  }
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
  console.log(networkTest);
  const index = networkedComputers.findIndex(
    (d) => d.ipAddress === req.body.ipAddress
  );

  if (index >= 0) {
    networkedComputers[index].ackPackets++;
    networkedComputers[index].percentage = Math.floor(
      (networkedComputers[index].ackPackets / networkTest.duration) * 100
    );
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
  res.json({ networkedComputers });
};

export const GetMyReport = (req, res) => {
  const index = networkedComputers.findIndex(
    (d) => d.ipAddress === req.body.ipAddress
  );

  const computer = networkedComputers[index];
  res.json({ computer });
};
