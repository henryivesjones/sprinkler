import { useState } from "react";
import { makeURL } from "../libs/requests";
import { useNavigate } from "react-router-dom";

const Login = ({
  setLoggedIn,
}: {
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [invalid, setInvalid] = useState(false);

  const login = () => {
    setInvalid(false);
    fetch(makeURL("/login"), {
      method: "POST",
      body: JSON.stringify({ user_name: username, password: password }),
    })
      .then((res) => res.json())
      .then((res) => (res.success ? setLoggedIn(true) : setInvalid(true)));
  };

  return (
    <>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-6">
            <div className="card card-body mt-3">
              <h1>Sprinkler</h1>
              {invalid && (
                <div className="alert alert-danger p-2">
                  Invalid Username/Password
                </div>
              )}
              <div className="form-floating">
                <input
                  id="username"
                  className="form-control mt-1"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <label htmlFor="api">Username</label>
              </div>
              <div className="form-floating">
                <input
                  id="password"
                  className="form-control mt-1"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label htmlFor="password">Password</label>
              </div>
              <button className="btn btn-primary w-100 mt-3" onClick={login}>
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
