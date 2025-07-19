import React, { useState } from "react";
import { ButtonPrimary } from "../modules/chapter-3/widgets/components/ButtonUI";
import dotenv from "dotenv";
import axios from "axios";

export default function Login() {
  const uname = "febry.fairuz";
  const pwd = "PWL@302";

  const [username, setUsername] = useState(uname);
  const [password, setPassword] = useState(pwd);

  const middlewareURL = process.env.REACT_APP_MIDDLEWARE_URL;

  const [signIn, setSignIn] = useState({
    loading: false,
    data: [],
    message: "",
  });

  const POST_SIGN_IN = (param) => {
    setSignIn({ loading: true, data: [], message: "" });
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: middlewareURL + "/api/users/signin",
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify(param),
    };

    axios
      .request(config)
      .then((response) => {
        const result = response.data.data;

        if (!result) {
          setSignIn({
            loading: false,
            data: [],
            message:
              "Invalid Grant (Incorrect Credential. Please check username & password)",
          });
        }

        localStorage.setItem("user-account", JSON.stringify(result));
        setSignIn({
          loading: false,
          data: response.data,
          message: "Successfully sign in, please wait for a moment..",
        });
        setTimeout(() => {
          window.location.replace("/");
        }, 1000);
      })
      .catch((error) => {
        setSignIn({ loading: false, data: [], message: error.message });
      });
  };

  const HandlerSignIn = (e) => {
    e.preventDefault();
    setSignIn({ loading: true, data: [], message: "" });

    if (username && password) {
      POST_SIGN_IN({ username: username, password: password });
    } else {
      alert("Please fill up the field with correctly");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-5">
      <div className="card" style={{ width: "32rem" }}>
        <div className="card-body">
          <h2 className="card-title text-center">Login</h2>
          <div class="mb-3">
            <label for="username" class="form-label">
              Username
            </label>
            <input
              type="email"
              class="form-control"
              id="username"
              autoComplete="off"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">
              Password
            </label>
            <input
              type="password"
              class="form-control"
              id="password"
              autoComplete="off"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <ButtonPrimary
              items={{ btn_class: "btn-primary", type: "button" }}
              actions={(e) => onclick(HandlerSignIn(e))}
            >
              Login
            </ButtonPrimary>
          </div>
        </div>
      </div>
    </div>
  );
}
