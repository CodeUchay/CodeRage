import React from "react";
import { GiFireDash } from "react-icons/gi";
import { ThemeContext } from "../theme";
import { useState, useContext } from "react";

function Register() {
  const { isDarkMode, baseURL } = useContext(ThemeContext);
  const bgColor = isDarkMode ? "slate-950" : "white";
  const textColor = isDarkMode ? "white" : "black";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  async function handleRegisteration(e) {
    e.preventDefault();

    if (password === confirmPassword) {
      passwordError && setPasswordError(!passwordError);
      const res = await fetch(baseURL + "/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });
      if (res.status === 200) {
        alert("registration successful");
      } else {
        alert("registration failed");
      }
    } else {
      setPasswordError(true);
      setTimeout(() => {
        setPasswordError(false);
      }, 1000);
    }
  }
  console.log(email + password + confirmPassword);
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
            <label for="email" className="block text-sm leading-6 ">
              Email address
            </label>
            <input
              type="email"
              id="email"
              className={`mt-2 text-black rounded-md block w-full px-3 h-10 shadow-sm sm:text-sm focus:outline-none placeholder:text-slate-400 focus:ring-2 ring-purple-100 focus:ring-purple-300 ring-1 `}
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required="true"
            />
          </div>
          <div className="mb-6">
            <label for="password" className="block text-sm leading-6 ">
              Password
            </label>
            <input
              type="password"
              className="mt-2 appearance-none text-black rounded-md block w-full px-3 h-10 shadow-sm sm:text-sm focus:outline-none placeholder:text-slate-400 focus:ring-2 ring-purple-100 focus:ring-purple-200  ring-1 "
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required="true"
            />
          </div>
          <div className="mb-6">
            <label for="password" className="block text-sm leading-6 ">
              Confirm Password
            </label>
            <input
              type="password"
              className="mt-2 appearance-none text-black rounded-md block w-full px-3 h-10 shadow-sm sm:text-sm focus:outline-none placeholder:text-slate-400 focus:ring-2 ring-purple-100 focus:ring-purple-200  ring-1 "
              onChange={(e) => setConfirmPassword(e.target.value)}
              required="true"
            />
          </div>
          <button
            type="submit"
            className="inline-flex justify-center rounded-lg text-sm py-2.5 px-4 bg-purple-600 text-${textColor} hover:bg-purple-700 w-full"
          >
            <span className="text-white">Sign up for CodeRage</span>
          </button>
          {passwordError && (
            <p className="text-red-500 text-sm mt-2 flex">
              Passwords do not match
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default Register;
