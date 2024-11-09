import { Router } from "express";
import * as taskController from "../controllers/tasksController.js";
const taskRouter = Router();
taskRouter.post("/", taskController.addTask);
taskRouter.get("/", taskController.getAllTasks);
taskRouter.get("/:id", taskController.getTaskById);
taskRouter.delete("/:id", taskController.deleteTask);
taskRouter.put("/:id", taskController.editTaskById);
export default taskRouter;
