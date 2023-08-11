import React from "react";
import { GiFireDash } from "react-icons/gi";
import { ThemeContext } from "../theme";
import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

function Login() {
  const { isDarkMode, baseURL } = useContext(ThemeContext);
  const bgColor = isDarkMode ? "slate-950" : "white";
  const textColor = isDarkMode ? "white" : "black";
  const inputColor = "black";
  const shadowColor = isDarkMode ? "purple-500" : "white";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const { setUserInfo } = useContext(UserContext);

  async function login(e) {
    e.preventDefault();
    const res = await fetch(baseURL+"/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        'Content-Type': 'application/json', // Set the content type header
      },
      credentials: 'include',
    });

    if (res.ok) {
      res.json().then(data => {
        setUserInfo(data)
      })
      setRedirect(true);
    } else {
      setLoginError(true);
      setTimeout(() => {
        setLoginError(false);
      }, 3500);
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }
  return (
    <div
      className={`bg-${bgColor} flex flex-col gap-5 pt-24 p-16 text-${textColor}`}
    >
      <div className="border mx-auto mt-10  flex flex-col gap-2 rounded p-7 w-full max-w-sm shadow-xl">
        <div className="flex justify-center items-center text-lg">
          <h1>CodeRage Login </h1> <GiFireDash />
        </div>
        <hr />
        <form onSubmit={login} >
          <div className="mb-6">
            <label for="email" className="block text-sm leading-6 ">
              <div>
                {loginError && (
                  <span className="text-red-500">
                    Invalid email or password
                  </span>
                )}
              </div>
              Email address
            </label>
            <input
              type="email"
              id="email"
              className={`mt-2 text-black rounded-md block w-full px-3 h-10 shadow-sm sm:text-sm focus:outline-none placeholder:text-slate-400 focus:ring-2 ring-purple-100 focus:ring-purple-300 ring-1 `}
              onChange={(e) => setEmail(e.target.value)}
              required={true}
              value={email}
            />
          </div>
          <div className="mb-6">
            <label for="password" className="block text-sm leading-6 ">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-2 appearance-none text-black rounded-md block w-full px-3 h-10 shadow-sm sm:text-sm focus:outline-none placeholder:text-slate-400 focus:ring-2 ring-purple-100 focus:ring-purple-200  ring-1 "
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required={true}
            />
          </div>
          <button
            type="submit"
            className="inline-flex justify-center rounded-lg text-sm py-2.5 px-4 bg-purple-600 text-${textColor} hover:bg-purple-700 w-full"
          >
            <span className="text-white">Sign in to account</span>
          </button>
          <input type="hidden" name="remember" value="true" />
          <p className="mt-8 text-center">
            <a href="/register" className="text-sm hover:underline">
              Forgot password?
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
