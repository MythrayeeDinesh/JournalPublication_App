import React, { useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../vendors/typicons/typicons.css";
import "../../vendors/css/vendor.bundle.base.css";
import "../../css/vertical-layout-light/style.css";
import logo from "../../../public/CINfo.png"

const Login = () => {
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  // Function to handle login
  const login_fn = async (event) => {
    event.preventDefault();
    try {
      // Send login request to the API
      const res = await axios.post("http://localhost:8097/api/auth/login", {
        username: ref1.current.value,
        password: ref2.current.value,
        role: role,
      });

      console.log(role, "role selected");
      const data = res.data;

      if (role === "Editor" && data.isEditor === 1) {
        console.log(544);
        sessionStorage.setItem("role", data.role);
        sessionStorage.setItem("user_id", data.user_id);
        navigate("/dashboard");
      } else if (data && data.role) {
        sessionStorage.setItem("role", data.role);
        sessionStorage.setItem("user_id", data.user_id);
        navigate("/dashboard");
      } else {
        alert("Invalid login credentials!");
      }
    } catch (error) {
      console.error("Login failed", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <>
      <div className="container-scroller">
        <div className="container-fluid page-body-wrapper full-page-wrapper">
          <div className="content-wrapper d-flex align-items-center auth px-0">
            <div className="row w-100 mx-0">
              <div className="col-lg-4 mx-auto">
                <div className="auth-form-light text-left py-5 px-4 px-sm-5">
                  {/* Add Logo Here */}
                  <div className="text-center mb-4">
                    <img
                      src={logo}
                      alt="Logo"
                      style={{ width: "130px", height: "auto" }}
                    />
                  </div>
                  <h4>Sign in to continue.</h4>
                  <form className="pt-3">
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        ref={ref1}
                        id="exampleInputEmail1"
                        placeholder="Username"
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="password"
                        className="form-control form-control-lg"
                        ref={ref2}
                        id="exampleInputPassword1"
                        placeholder="Password"
                      />
                    </div>
                    <div className="form-group">
                      <select
                        className="form-control form-control-lg"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                      >
                        <option value="">Login As</option>
                        <option value="Author">Author</option>
                        <option value="Reviewer">Reviewer</option>
                        <option value="Editor">Editor</option>
                      </select>
                    </div>
                    <div className="mt-3">
                      <button
                        className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                        onClick={login_fn}
                      >
                        SIGN IN
                      </button>
                    </div>
                    <div className="text-center mt-4 font-weight-light">
                      Don't have an account?{" "}
                      <a href="/register" className="text-primary">
                        Create
                      </a>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
