import tasks from "../models/tasks.js";

// create task
export const addTask = async (req, res) => {
  try {
    const dataToSave = req.body;
    const existingTask = await tasks.findOne({
      title: dataToSave.title,
      status: "pending",
    });
    if (
      dataToSave.title === "" ||
      dataToSave.description === "" ||
      Object.entries(dataToSave).length === 0
    ) {
      res.status(400).send({ msg: "Please enter valid details" });
    } else if (existingTask) {
      res.status(400).send({ msg: "Task already exists" });
    } else {
      const add = new tasks(dataToSave);
      await add.save();
      res.status(200).send({ msg: "Task created successfully" });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// getAllTasks
export const getAllTasks = async (req, res) => {
  try {
    const allTasks = await tasks.find();
    res.status(200).send(allTasks);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// get TaskByID
export const getTaskById = async (req, res) => {
  try {
    const task = await tasks.findById(req.params.id);
    if (task) {
      res.status(200).send(task);
    } else {
      res.status(404).send({ msg: "NO task found on that ID" });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// delete taskById
export const deleteTask = async (req, res) => {
  try {
    const removeTask = await tasks.findByIdAndDelete(req.params.id);
    if (removeTask) {
      res.status(200).send({ msg: "Task deleted successfully" });
    } else {
      res.status(404).send({ msg: "No task found to delete on that ID" });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// update task by id
export const editTaskById = async (req, res) => {
  try {
    const editTask = await tasks.findByIdAndUpdate(req.params.id, req.body);
    if (editTask) {
      res.status(200).send({ msg: "Task updated successfully" });
    } else {
      res.status(404).send({
        msg: "No task found to update on that ID",
      });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
