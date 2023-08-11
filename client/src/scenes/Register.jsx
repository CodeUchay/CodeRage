import React from "react";
import { GiFireDash } from "react-icons/gi";
import { ThemeContext } from "../theme";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const { isDarkMode, baseURL } = useContext(ThemeContext);
  const bgColor = isDarkMode ? "slate-950" : "white";
  const textColor = isDarkMode ? "white" : "black";

  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const navigate = useNavigate();

  function checkUsernameErrors(username) {
    const isValid = /^[a-zA-Z0-9_]+$/.test(username); // Test if username contains only letters, numbers, and underscores
    const minLength = 3;
    const maxLength = 15;

    if (!isValid) {
      return "Username can only contain letters, numbers, and underscores.";
    }
    if (username.length < minLength) {
      return `Username must be at least ${minLength} characters long.`;
    }
    if (username.length > maxLength) {
      return `Username can't exceed ${maxLength} characters.`;
    }

    return null; // No errors
  }

  function checkPasswordErrors(password) {
    const minLength = 8;

    if (password.length < minLength) {
      return `Password must be at least ${minLength} characters long.`;
    }
    if (password !== confirmPassword){
      return `Passwords do not match`;
    }
    return null; // No errors
  }

  function handleUsernameChange(e) {
    const newUsername = e.target.value;
    setUsername(newUsername);
    const error = checkUsernameErrors(newUsername);
    setUsernameError(error);
  }

  function handlePasswordChange(e) {
    const newPassword = e.target.value;
    setPassword(newPassword);
    const error = checkPasswordErrors(newPassword);
    setPasswordError(error);
  }

  async function handleRegisteration(e) {
    e.preventDefault();

    // Check for username errors
    const usernameError = checkUsernameErrors(username);
    setUsernameError(usernameError);

     // Check for password errors
     const passwordError = checkPasswordErrors(password);
     setPasswordError(passwordError);

    if (!usernameError && !passwordError && password === confirmPassword) {
      setPasswordError(false); // Reset password error state

      const res = await fetch(baseURL + "/register", {
        method: "POST",
        body: JSON.stringify({ username, email, password }),
        headers: { "Content-Type": "application/json" },
      });
      if (res.status === 200) {
        alert("registration successful, please login");
        navigate('/login'); // Trigger the redirect after registeration
      } else {
        alert("registration failed, you already have an account, please login");
      }
    } 
  }
  
  return (
    <div
      className={`bg-${bgColor} flex flex-col gap-5 pt-24 p-16 text-${textColor}`}
    >
      <div className="border mx-auto mt-10  flex flex-col gap-2 rounded p-7 w-full max-w-sm shadow-xl">
        <div className="flex justify-center items-center text-lg mb-3">
          <h1>Sign Up for CodeRage </h1> <GiFireDash size={20} />{" "}
        </div>
        <hr className="mb-3" />
        <form onSubmit={handleRegisteration} className="">
          <div className="mb-6">
            <label htmlFor="username" className="block text-sm leading-6 ">
              Username
            </label>
            <input
              type="username"
              id="username"
              className={`mt-2 text-black rounded-md block w-full px-3 h-10 shadow-sm sm:text-sm focus:outline-none placeholder:text-slate-400 focus:ring-2 ring-purple-100 focus:ring-purple-300 ring-1 `}
              onChange={handleUsernameChange}
              value={username}
              required
            />
            {usernameError && <p className="text-red-500 text-sm mt-2 flex">{usernameError}</p>}
          </div>
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm leading-6 ">
              Email address
            </label>
            <input
              type="email"
              id="email"
              className={`mt-2 text-black rounded-md block w-full px-3 h-10 shadow-sm sm:text-sm focus:outline-none placeholder:text-slate-400 focus:ring-2 ring-purple-100 focus:ring-purple-300 ring-1 `}
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm leading-6 ">
              Password
            </label>
            <input
              type="password"
              className="mt-2 appearance-none text-black rounded-md block w-full px-3 h-10 shadow-sm sm:text-sm focus:outline-none placeholder:text-slate-400 focus:ring-2 ring-purple-100 focus:ring-purple-200  ring-1 "
              onChange={handlePasswordChange}
              value={password}
              required
            />
             {passwordError && <p className="text-red-500 text-sm mt-2 flex">{passwordError}</p>}
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm leading-6 ">
              Confirm Password
            </label>
            <input
              type="password"
              className="mt-2 appearance-none text-black rounded-md block w-full px-3 h-10 shadow-sm sm:text-sm focus:outline-none placeholder:text-slate-400 focus:ring-2 ring-purple-100 focus:ring-purple-200  ring-1 "
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="inline-flex justify-center rounded-lg text-sm py-2.5 px-4 bg-purple-600 hover:bg-purple-700 w-full"
          >
            <span className="text-white">Sign up for CodeRage</span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
