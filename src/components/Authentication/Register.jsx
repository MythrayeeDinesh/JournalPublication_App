import React, { useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../vendors/typicons/typicons.css";
import "../../vendors/css/vendor.bundle.base.css";
import "../../css/vertical-layout-light/style.css";
import logo from "../../../public/CINfo.png"

const Register = () => {
  const refEmail = useRef(null);
  const refName = useRef(null);
  const refAffiliation = useRef(null);
  const refCountry = useRef(null);
  const refInterest = useRef(null);
  const refUsername = useRef(null);
  const refPassword = useRef(null);
  const refRole = useRef(null); // Added role reference
  const navigate = useNavigate();

  // Function to handle registration
  const register_fn = async (event) => {
    event.preventDefault();
    try {
      // Send registration request to the API
      const res = await axios.post("http://localhost:8097/api/auth/register", {
        email_id: refEmail.current.value,
        name: refName.current.value,
        affliation: refAffiliation.current.value,
        country: refCountry.current.value,
        area_of_research: refInterest.current.value,
        username: refUsername.current.value,
        password: refPassword.current.value,
        role: refRole.current.value, // Added role to the payload
      });

      if (res.status === 201 || res.status === 200) {
        alert("Registration successful!");
        navigate("/login");
      } else {
        alert("Registration failed. Please try again.");
      }
    } catch (error) {
      if (error.response) {
        // Extract and display the error message from the server response
        console.error("Error details:", error.response.data);
        alert(`Registration failed: ${error.response.data.message || "An error occurred. Please try again."}`);
      } else {
        console.error("Error details:", error);
        alert("Registration failed. Please try again.");
      }
    }
  };

  return (
    <>
      <div className="container-scroller">
        <div className="container-fluid page-body-wrapper full-page-wrapper">
          <div className="content-wrapper d-flex align-items-center auth px-0">
            <div className="row w-100 mx-0">
              <div className="col-lg-6 mx-auto">            
                <div className="auth-form-light text-left py-5 px-4 px-sm-5">
                <div className="text-center mb-4">
                    <img
                      src={logo}
                      alt="Logo"
                      style={{ width: "130px", height: "auto" }}
                    />
                  </div>
                  <h4>Create a new account</h4>
                  <form className="pt-3">
                    <div className="form-group">
                      <input
                        type="email"
                        className="form-control form-control-lg"
                        ref={refEmail}
                        placeholder="Email ID"
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        ref={refName}
                        placeholder="Name"
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        ref={refAffiliation}
                        placeholder="Affiliation"
                      />
                    </div>
                    <div className="form-group">
                      <select
                        className="form-control form-control-lg"
                        ref={refCountry}
                      >
                        <option value="">Select Country</option>
                        <option value="USA">United States</option>
                        <option value="UK">United Kingdom</option>
                        <option value="India">India</option>
                        <option value="Germany">Germany</option>
                        <option value="Argentina">Argentina</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        ref={refInterest}
                        placeholder="Area of Interest"
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        ref={refUsername}
                        placeholder="Username"
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="password"
                        className="form-control form-control-lg"
                        ref={refPassword}
                        placeholder="Password"
                      />
                    </div>
                    <div className="form-group">
                      <select
                        className="form-control form-control-lg"
                        ref={refRole} // Role selection added
                      >
                        <option value="">Select Role</option>
                        <option value="Author">Author</option>
                        <option value="Reviewer">Reviewer</option>
                        <option value="Editor">Editor</option>
                      </select>
                    </div>
                    <div className="mt-3">
                      <button
                        className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                        onClick={register_fn}
                      >
                        REGISTER
                      </button>
                    </div>
                    <div className="text-center mt-4 font-weight-light">
                      Already have an account?{" "}
                      <a href="/login" className="text-primary">
                        Login
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

export default Register;
