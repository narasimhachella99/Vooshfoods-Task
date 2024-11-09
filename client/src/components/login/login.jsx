import { useForm } from "react-hook-form";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { envi } from "../../environment";
import { GoogleLogin } from '@react-oauth/google';

function Login() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const handleGoogleLogin = async (response) => {
    try {
  
      const res = await axios.post(`${envi.api_url}users/google-login`, {
        token: response.credential, 
      });

      toast.success("Login with Google successful");
      navigate("/home");
    } catch (error) {
      toast.error("Google login failed");
    }
  };

  return (
    <div>
      <div className="row m-0 mt-5 align-items-center justify-content-center">
        <div className="col-lg-4 col-md-4 col-sm-6 col-12">
        <h1 className="fs-2">Task Manager Application</h1>
          <div className="card mt-5">
            <div className="card-body m-0">
              <div className="h5 text-center">Login</div>
              <form
                onSubmit={handleSubmit(async (data) => {
                  try {
                    console.log(data);
                    const res = await axios.post(
                      `${envi.api_url}users/login`,
                      data
                    );
                    toast.success("Login successfully");
                    navigate("/home");
                  } catch (error) {          
                    toast.error(error.response.data.msg, {});
                  }
                })}
              >
                <div className="row">
                  <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                    <label htmlFor="username" className="form-label">
                      Username
                    </label>
                    <input
                      {...register("email", { required: "This is required" })}
                      type="email"
                      maxLength={35}
                      className="form-control"
                      placeholder="Username"
                      id="username"
                    />
                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                    <label htmlFor="password" className="form-label mt-4">
                      Password
                    </label>
                    <input
                      {...register("password", {
                        required: "This is required",
                      })}
                      type="password"
                      maxLength={50}
                      className="form-control"
                      placeholder="Password"
                      id="password"
                    />
                  </div>
                  <button className="btn btn-primary mt-3" type="submit">
                    Submit
                  </button>
                  <a className=" col-md-6 col-sm-6 col-6 mt-3 text-end">
                    <Link to={"/register"}>Register here</Link>
                  </a>
                </div>
              </form>

              {/* Google Login Button */}
              <div className="mt-4">
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={() => toast.error("Google login failed")}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
