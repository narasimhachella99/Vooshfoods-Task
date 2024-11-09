import "./home.css";
import axios from "axios";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { envi } from "../../environment";
import { Link } from "react-router-dom";
function Home() {
  const [tasks, setTasks] = useState([]);
  const [editData, setEditData] = useState({});
  const addForm = useForm();
  const editForm = useForm();
  const getEditData = (data) => {
    console.log(data);
    setEditData(data);
    editForm.setValue("title", data.title);
    editForm.setValue("description", data.description);
    editForm.setValue("status",data.status);
  };
  const getAllTasks = async () => {
    try {
      const res = await axios.get(`${envi.api_url}tasks`);
      if (res.status === 200) {
        setTasks(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllTasks();
  }, []);
  return (
    <div>
       <center>    <h1 className="fs-2">Task Manager Application</h1></center>
      <div className="text-end me-5" >
      <button className="btn btn-danger mt-3 mr-2 text-end" type="submit">
        <Link className="text-black" to={"/"}>
          {" "}
          Logout
        </Link>
      </button>
      </div>
      <div className="card mt-3">
        <div className="card-body">
          <div className="h5">Create Task</div>
          <div className="row">
            <div className="col-lg-4 col-md-4 col-sm-6 col-12">
              <label htmlFor="title" className="form-label">
                Title
              </label>
              <input
                type="text"
                maxLength={35}
                className="form-control"
                placeholder="Title"
                id="title"
                {...addForm.register("title", {
                  required: "Title is Required",
                })}
              />
              {addForm.formState.errors.title && (
                <p style={{ color: "red" }}>
                  {addForm.formState.errors.title.message}
                </p>
              )}
            </div>
            <div className="col-lg-4 col-md-4 col-sm-6 col-12">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <div className="form-floating">
                <textarea
                  {...addForm.register("description", {
                    required: "description is required",
                  })}
                  className="form-control"
                  placeholder="Leave a comment here"
                  id="floatingTextarea"
                ></textarea>
                <label htmlFor="floatingTextarea">Description</label>
                {addForm.formState.errors.description && (
                  <p style={{ color: "red" }}>
                    {addForm.formState.errors.description.message}
                  </p>
                )}
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-6 col-12">
              <button
                className="btn btn-primary mt-5"
                type="submit"
                onClick={addForm.handleSubmit(async (data) => {
                  try {
                    const res = await axios.post(`${envi.api_url}tasks`, data);
                    if (res.status === 200) {
                      getAllTasks();
                      addForm.reset();
                      toast.success("Task created successfully");
                    }
                  } catch (error) {
                    toast.error("Something went wrong");
                  }
                })}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="card mt-5">
        <div className="card-body">
          <div className="h5">Tasks</div>
          <div style={{ overflowX: "auto" }}>
            <table className="table table-bordered text-center mt-3">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task, index) => (
                  <tr key={task._id}>
                    <td>{index + 1}</td>
                    <td>{task.title}</td>
                    <td>{task.description}</td>
                    <td>
                      {task.status === "pending" && (
                        <button
                          className="btn btn-danger"
                          type="button"
                          onClick={async () => {
                            try {
                              let data = {
                                status: "complete",
                              };
                              const res = await axios.put(
                                `${envi.api_url}tasks/${task._id}`,
                                data
                              );
                              if (res.status === 200) {
                                getAllTasks();
                                toast.success(
                                  "Task status updated successfully"
                                );
                              }
                            } catch (error) {
                              toast.error("Something went wrong");
                            }
                          }}
                        >
                          Mark as Completed
                        </button>
                      )}
                      {task.status === "complete" && (
                        <p style={{ color: "green" }}>
                          <i className="fa-regular fa-circle-check"></i>
                        </p>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary"
                        type="button"
                        data-bs-toggle="modal"
                        data-bs-target="#editModal"
                        onClick={() => getEditData(task)}
                      >
                        <i className="fa-regular fa-pen-to-square"></i>
                      </button>
                      <button
                        className="btn btn-danger"
                        style={{ marginLeft: "6px" }}
                        type="button"
                        onClick={async () => {
                          try {
                            const res = await axios.delete(
                              `${envi.api_url}tasks/${task._id}`
                            );
                            if (res.status === 200) {
                              getAllTasks();
                              toast.success("Task Deleted successfully");
                            }
                          } catch (error) {
                            toast.error("Something went wrong");
                          }
                        }}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Toaster />
      <div
        className="modal fade"
        id="editModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Edit Task
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="row">
                  <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                    <label htmlFor="title" className="form-label">
                      Title
                    </label>
                    <input
                      type="text"
                      maxLength={35}
                      className="form-control"
                      placeholder="Title"
                      id="title"
                      {...editForm.register("title", {
                        required: "Title is Required",
                      })}
                    />
                    {editForm.formState.errors.title && (
                      <p style={{ color: "red" }}>
                        {editForm.formState.errors.title.message}
                      </p>
                    )}
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                    <label htmlFor="description" className="form-label">
                      Description
                    </label>
                    <div className="form-floating">
                      <textarea
                        {...editForm.register("description", {
                          required: "description is required",
                        })}
                        className="form-control"
                        placeholder="Leave a comment here"
                        id="floatingTextarea"
                      ></textarea>
                      <label htmlFor="floatingTextarea">Description</label>
                      {editForm.formState.errors.description && (
                        <p style={{ color: "red" }}>
                          {editForm.formState.errors.description.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-12 text-center">
                    <button
                      className="btn btn-primary mt-3"
                      type="submit"
                      onClick={editForm.handleSubmit(async (data) => {
                        try {
                          const res = await axios.put(
                            `${envi.api_url}tasks/${editData._id}`,
                            data
                          );
                          if (res.status === 200) {
                            getAllTasks();
                            editForm.reset();
                            toast.success("Task updated successfully");
                          }
                        } catch (error) {
                          toast.error("somthing went wrong");
                        }
                      })}
                    >
                      Update
                    </button>
                  </div>
                </div>
              </form>
            </div>
        
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
