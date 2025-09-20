import React, { useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // ✅ for redirect
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/AuthPage.css";

const BASE_URL = "https://jyotisika.in/jyotisika_test/User_Api_Controller";

export default function AuthPage() {
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);
  const [mobile, setMobile] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false); // ✅ track OTP status

  // Extra fields for signup
  const [userName, setUserName] = useState("");
  const [userGender, setUserGender] = useState("male");
  const [userDob, setUserDob] = useState("");

  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  // Helper to safely parse response
  const parseResponse = (res) => {
    if (!res || !res.data) return {};
    if (typeof res.data === "object") return res.data;
    try {
      return JSON.parse(res.data);
    } catch {
      return { status: "error", message: res.data };
    }
  };

  // 🔹 Send OTP
  const handleGetOtp = async () => {
    if (!mobile) {
      setStatus("danger");
      setMessage("Please enter mobile number");
      return;
    }
    try {
      const payload = {
        mobile_number: mobile,
        action: isSignup ? "signup" : "signin",
      };

      const res = await axios.post(`${BASE_URL}/sendOtpmobile`, payload, {
        headers: { "Content-Type": "application/json" },
        responseType: "text",
      });

      const response = parseResponse(res);

      if (response.status === "success") {
        setOtpSent(true);
        setStatus("success");
        setMessage("OTP sent successfully!");
      } else {
        setStatus("danger");
        setMessage(response.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      setStatus("danger");
      setMessage("Error sending OTP");
    }
  };

  // 🔹 Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp) {
      setStatus("warning");
      setMessage("Please enter OTP");
      return;
    }

    try {
      const payload = {
        mobile_number: mobile,
        otp: otp,
      };

      const res = await axios.post(`${BASE_URL}/VerifyOtp`, payload, {
        headers: { "Content-Type": "application/json" },
        responseType: "text",
      });

      const response = parseResponse(res);

      if (response.status === "success") {
        setStatus("success");
        setMessage("OTP Verified ✅");

        if (isSignup) {
          // For signup → show registration form
          setOtpVerified(true);
        } else {
          // For login → redirect
        localStorage.setItem("user_id", response.user_id || response.data?.user_id);
        if (response.session_id || response.data?.session_id) {
          localStorage.setItem("session_id", response.session_id || response.data?.session_id);
        }
          localStorage.setItem("mobile_number", mobile);
          navigate("/"); // ✅ redirect to home
        }
      } else {
        setStatus("danger");
        setMessage(response.message || "Invalid OTP ❌");
      }
    } catch (err) {
      console.error(err);
      setStatus("danger");
      setMessage("Error verifying OTP");
    }
  };

  // 🔹 Register new user (after OTP verified)
  const handleRegisterUser = async () => {
    if (!otp || !userName || !userDob) {
      setStatus("warning");
      setMessage("Please fill all fields");
      return;
    }

    try {
      const payload = {
        mobile_number: mobile,
        otp: otp,
        user_name: userName,
        user_gender: userGender,
        user_dob: userDob,
      };

      const res = await axios.post(`${BASE_URL}/reg_user`, payload, {
        headers: { "Content-Type": "application/json" },
        responseType: "text",
      });

      const response = parseResponse(res);

      if (response.status === "success") {
        setStatus("success");
        setMessage("Signup Successful 🎉 Please login");

        // ✅ Reset to login screen
        setIsSignup(false);
        setOtpSent(false);
        setOtpVerified(false);
        setOtp("");
        setUserName("");
        setUserDob("");
      } else {
        setStatus("danger");
        setMessage(response.message || "Signup failed ❌");
      }
    } catch (err) {
      console.error(err);
      setStatus("danger");
      setMessage("Error during signup");
    }
  };

  return (
    <Container fluid className="auth-container">
      <Row className="min-vh-100">
        {/* Left Side */}
        <Col md={6} className="d-flex flex-column justify-content-center align-items-start px-5 auth-left">
          <h2 className="fw-bold mb-4">
            Why {isSignup ? "Sign Up?" : "Log In?"}
          </h2>
          <ul className="list-unstyled fs-5">
            <li>✔ Get personalized information</li>
            <li>✔ Save charts (Kundli) on cloud</li>
            <li>✔ Write notes & comments</li>
            <li>✔ Access anywhere: mobile & web</li>
          </ul>
        </Col>

        {/* Right Side */}
        <Col md={6} className="d-flex justify-content-center align-items-center bg-light">
          <Card className="p-4 shadow-lg" style={{ width: "100%", maxWidth: "380px" }}>
            <Card.Body>
              <h3 className="text-center mb-4">
                {isSignup ? "Sign Up" : "Login"} to Continue
              </h3>

              {/* Step 1: Mobile number */}
              {!otpSent && (
                <Form>
                  <Form.Group controlId="mobile" className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Enter Mobile Number"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                    />
                  </Form.Group>
                  <Button variant="warning" className="w-100 fw-bold" onClick={handleGetOtp}>
                    Get OTP
                  </Button>
                </Form>
              )}

              {/* Step 2: OTP (for both login & signup) */}
              {otpSent && !otpVerified && (
                <Form>
                  <Form.Group controlId="otp" className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                  </Form.Group>
                  <Button
                    variant={isSignup ? "primary" : "success"}
                    className="w-100 fw-bold"
                    onClick={handleVerifyOtp}
                  >
                    Verify OTP
                  </Button>
                </Form>
              )}

              {/* Step 3: Registration form (signup only) */}
              {isSignup && otpVerified && (
                <Form>
                  <Form.Group controlId="name" className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Enter Full Name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group controlId="gender" className="mb-3">
                    <Form.Select value={userGender} onChange={(e) => setUserGender(e.target.value)}>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group controlId="dob" className="mb-3">
                    <Form.Control
                      type="date"
                      value={userDob}
                      onChange={(e) => setUserDob(e.target.value)}
                    />
                  </Form.Group>

                  <Button variant="primary" className="w-100 fw-bold" onClick={handleRegisterUser}>
                    Complete Signup
                  </Button>
                </Form>
              )}

              {message && (
                <Alert variant={status} className="mt-3 text-center">
                  {message}
                </Alert>
              )}

              <p className="text-center mt-3">
                {isSignup ? (
                  <>
                    Already have an account?{" "}
                    <span
                      className="text-primary fw-bold"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setIsSignup(false);
                        setOtpSent(false);
                        setOtpVerified(false);
                        setOtp("");
                        setMessage("");
                      }}
                    >
                      Login
                    </span>
                  </>
                ) : (
                  <>
                    Don’t have an account?{" "}
                    <span
                      className="text-primary fw-bold"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setIsSignup(true);
                        setOtpSent(false);
                        setOtpVerified(false);
                        setOtp("");
                        setMessage("");
                      }}
                    >
                      Sign Up
                    </span>
                  </>
                )}
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
