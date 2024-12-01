import React, { useEffect, useState } from "react";
import "../styles/Register.scss";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiUpload } from "react-icons/fi";
import { server } from "../server";
import { toast } from "react-toastify";
import { RxAvatar } from "react-icons/rx";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileImage: null,
  });
  const [passwordMatch, setPasswordMatch] = useState(true);

  useEffect(() => {
    setPasswordMatch(
      formData.password === formData.confirmPassword || !formData.confirmPassword
    );
  }, [formData.password, formData.confirmPassword]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prevData) => ({
          ...prevData,
          profileImage: reader.result,
        }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!passwordMatch) {
      toast.error("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      const registerForm = new FormData();
      for (const key in formData) {
        if (formData[key]) {
          registerForm.append(key, formData[key]);
        }
      }

      const response = await axios.post(
        `${server}/auth/register`,
        registerForm,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response?.status === 201) {
        toast.success(response.data.message || "Registration successful!");
        navigate("/login");
      } else {
        toast.error(response.data.message || "Registration failed!");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register">
      <Link to="/">
        <img src="/assets/logo.png" alt="logo" />
      </Link>
      <div className="register_content">
        <form className="register_content_form" onSubmit={handleSubmit}>
          <input
            placeholder="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            placeholder="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <input
            placeholder="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            placeholder="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            placeholder="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          {!passwordMatch && (
            <p style={{ color: "red", marginTop: "-10px" }}>
              Passwords do not match!
            </p>
          )}
          <input
            id="image"
            type="file"
            name="profileImage"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleChange}
          />
          <label htmlFor="image" className="image-upload-label">
            <FiUpload size={30} />
            <p>Upload Your Photo</p>
          </label>
          {formData.profileImage ? (
            <img
              src={formData.profileImage}
              alt="Profile Preview"
              style={{ borderRadius: "50%", maxWidth: "70px", maxHeight: "80px" }}
            />
          ) : (
            <RxAvatar
              style={{
                width: "60px",
                height: "60px",
                color: "white",
                margin: "10px 0",
              }}
            />
          )}
          <button type="submit" disabled={loading || !passwordMatch}>
            {loading ? "Please Wait..." : "Register"}
          </button>
        </form>
        <Link to="/login">Already have an account? Log in Here</Link>
      </div>
    </div>
  );
};

export default RegisterPage;
