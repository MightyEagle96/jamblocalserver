const networkedComputers = [];

//what we want here is the IP Address and the number of packets recieved

export const PacketsCount = (req, res) => {
  const index = networkedComputers.findIndex(
    (d) => d.ipAddress === req.body.ipAddress
  );

  if (index >= 0) {
    networkedComputers[index].recievedPackets++;
  } else {
    networkedComputers.push({
      ipAddress: req.body.ipAddress,
      recievedPackets: 1,
    });
  }

  res.json({ message: "Saved" });
};

export const ViewProgress = (req, res) => {
  res.json({ networkedComputers });
};
