import mongoose from "mongoose";
const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: { type: String, default: "pending" },
});
const tasks = mongoose.model("tasks", taskSchema);
export default tasks;
