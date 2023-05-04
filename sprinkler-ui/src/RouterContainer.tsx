import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { wFetch } from "./libs/requests";
import APIKeys from "./pages/APIKeys";
import Config from "./pages/Config";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Secrets from "./pages/Secrets";
import Setup from "./pages/Setup";
import Target from "./pages/Target";
import TargetTask from "./pages/TargetTask";
import TaskInstance from "./pages/TaskInstance";

const RouterContainer = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);
  useEffect(() => {
    wFetch("/access_check").then((res) => {
      setHasChecked(true);
      if (res.is_authorized) {
        setLoggedIn(true);
      }
    });
  }, []);
  if (!hasChecked) {
    return <></>;
  }
  return (
    <>
      <Router>
        <nav
          className="navbar navbar-expand-lg navbar-dark bg-secondary"
          hidden={!loggedIn}
        >
          <div className="container-fluid">
            <Link to="/" className="navbar-brand">
              Sprinkler
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNavAltMarkup"
              aria-controls="navbarNavAltMarkup"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link to="/config/" className="nav-link">
                    Config
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/secrets/" className="nav-link">
                    Secrets
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/api_keys/" className="nav-link">
                    API Keys
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <div className="container-fluid">
          <Routes>
            {loggedIn ? (
              <>
                <Route path="/" element={<Home />} />
                <Route path="/config/" element={<Config />} />
                <Route path="/api_keys/" element={<APIKeys />} />
                <Route path="/secrets/" element={<Secrets />} />
                <Route path="/setup/" element={<Setup />} />
                <Route path="/target/:target/" element={<Target />} />
                <Route
                  path="/target/:target/task/:task/"
                  element={<TargetTask />}
                />
                <Route path="/task_instance/:id/" element={<TaskInstance />} />
              </>
            ) : (
              <>
                <Route path="*" element={<Login setLoggedIn={setLoggedIn} />} />
              </>
            )}
          </Routes>
        </div>
      </Router>
    </>
  );
};

export default RouterContainer;
