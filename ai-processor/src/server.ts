import express from "express";
import dotenv from "dotenv";
import { messageProcessor } from "./rabbitMQProcessor";

dotenv.config();

const app = express();
const port = process.env.PORT ?? 5001;

app.get("/", (req, res) => {
  res.send("AI processor is running");
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  const messageProcess = new messageProcessor();
  messageProcess.startMessageProcessor();
});