const express = require("express");
require("dotenv").config();

const server = express();
server.use(express.json());
const PORT = process.env.PORT || 5001;

server.get("/ci-cd", async (_, res, ___) => {
  res.status(200).json({
    status: 200,
    message: "CI-CD By Devtran Ok ok🤖",
  });
});

server.listen(PORT, async () => {
  console.log(`Server running http://localhost:${PORT}`);
});
