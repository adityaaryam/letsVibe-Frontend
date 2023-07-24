import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerRoute,sendVerificationCodeRoute } from "../utils/APIRoutes";

export default function Register() {
  const navigate = useNavigate();
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [veriCode, setVeriCode]=useState(false);
  const [genCode, setGenCode]=useState("");
  const [userCode, setUserCode]=useState("");
  
  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/");
    }
  }, []);

  const handleChange = (event) => {
    console.log(values)
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleValidation = () => {
    const { password, confirmPassword, username, email } = values;
    if (password !== confirmPassword) {
      toast.error(
        "Password and confirm password should be same.",
        toastOptions
      );
      return false;
    } else if (username.length < 3) {
      toast.error(
        "Username should be greater than 3 characters.",
        toastOptions
      );
      return false;
    } else if (password.length < 8) {
      toast.error(
        "Password should be equal or greater than 8 characters.",
        toastOptions
      );
      return false;
    } else if (email === "") {
      toast.error("Email is required.", toastOptions);
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    // event.preventDefault();
    if (handleValidation()) {
      const { email, username, password } = values;
      const { data } = await axios.post(registerRoute, {
        username,
        email,
        password,
      });
      // console.log(data);
      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(data.user)
        );
        navigate("/");
      }
    }
  };
  const handleSentCode=async ()=>{
    if(handleValidation()){
      if(userCode==genCode)
      {
        handleSubmit();
      }
      else
      {
        toast.error('Incorrect Code',toastOptions);
      }
    }
  }
  const handleSendCode=async (event)=>{
    event.preventDefault();
    if(handleValidation()){
      let randCode = "";
      randCode = await Math.floor(Math.random() * 16777215).toString(16);
      if (randCode.length === 5)
          randCode += '0';
      setGenCode(randCode);
      let {data}=await axios.post(sendVerificationCodeRoute,{code:randCode,email:values.email});
      setVeriCode(true);
      if(data.status===true)
      {
        toast.success('Code has been sent to your Email',toastOptions);
      }
      else
      toast.error('Error404, Please Request Code Again',toastOptions);
    }
  }
  const handleVeriChange=(event)=>{
    setUserCode(event.target.value);
    console.log(event.target.value);
  }
  return (
    <>
    
        <FormContainer >
        <form className={veriCode==true?"veriBox":""} action="" onSubmit={(event) => handleSendCode(event)}>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h1>letsVibe</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            onChange={(e) => handleChange(e)}
          />
          <button type="submit">Register</button>
          <span>
            Already have an account ? <Link to="/login">Login.</Link>
          </span>
        </form>
        <div className={veriCode==false?"veriBox":"likeForm"} action="" >
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h1>letsVibe</h1>
          </div>
          <input
            type="text"
            placeholder="Verification Code"
            name="verificationCode"
            onChange={(e) => handleVeriChange(e)}
          />
          <button type="submit" onClick={handleSentCode}>Create User</button>

        </div>
      </FormContainer>
      <ToastContainer />
    </>
  );
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }
  .veriBox{
    display: none;
  }
  form,.likeForm {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
  button {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;
