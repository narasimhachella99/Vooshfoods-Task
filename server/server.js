import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import taskRouter from "./router/taskRouter.js";
import userRouter from "./router/userRouter.js";

const app = express();
app.use(cors());
app.use(express.json());
const database_url = "mongodb://127.0.0.1:27017/narasimha";
const port = 5000;
function startServer() {
  try {
    mongoose.connect(database_url);
    console.log("Database connected successfully");
    app.listen(port, () => {
      console.log(`server running on port :${port}`);
    });
  } catch (error) {
    console.log(error);
  }
}
startServer();

app.get("/taskmanager/api", (req, res) => {
  res.status(200).send("Welcome to taskmanager api!");
});
app.use("/taskmanager/api/tasks", taskRouter);
app.use("/taskmanager/api/users",userRouter);
