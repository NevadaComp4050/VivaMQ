import express from "express";
import dotenv from "dotenv";
import { startMessageProcessor } from "./rabbitMQProcessor";

dotenv.config();

const app = express();
<<<<<<< HEAD
const port = process.env.PORT ?? 5009;
=======
const port = process.env.PORT ?? 5001;
>>>>>>> upstream/main

app.get("/", (req, res) => {
  res.send("AI processor is running");
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  startMessageProcessor();
});