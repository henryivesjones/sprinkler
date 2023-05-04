import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { wFetch } from "../libs/requests";
import { TargetType } from "../types";

const Home = () => {
  const [targets, setTargets] = useState<TargetType[]>([]);

  const [config, setConfig] = useState<Record<string, string>>({});

  const [gitHash, setGitHash] = useState<string>("");
  const [gitError, setGitError] = useState<string | null>(null);
  const [branch, setBranch] = useState<string>("");

  const load = () => {
    wFetch("/targets").then((res) => setTargets(res));
    wFetch("/git/hash")
      .then((res) => setGitHash(res))
      .catch((e) => setGitError(e.message));
    wFetch("/config").then((res) => setConfig(res));
  };

  const pull = () => {
    wFetch("/git/pull", { method: "POST" })
      .then(() => load())
      .catch((e) => setGitError(e.message));
  };

  const checkout = () => {
    wFetch("/git/checkout", { method: "POST", body: branch }).then(() => {
      load();
      setBranch("");
    });
  };

  useEffect(() => {
    load();
  }, []);
  return (
    <>
      <div className="row">
        <div className="col-12 mt-2">
          <div className="card">
            <div className="card-header pb-0 d-flex">
              <div className="h2 flex-grow-1">git</div>
              {gitError ? (
                <div>
                  <div className="alert alert-danger p-1">
                    {gitError} <Link to="/setup/">Enter Setup</Link>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <div className="alert alert-primary p-1">
                      {config.GIT_BRANCH} - {gitHash}
                    </div>
                  </div>
                  <div>
                    <button className="btn btn-primary mx-2 p-1" onClick={pull}>
                      Pull
                    </button>
                  </div>
                  <div>
                    <input
                      className="form-control"
                      placeholder="branch"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                    />
                  </div>
                  <div>
                    <button
                      className="btn btn-primary mx-2 p-1"
                      onClick={checkout}
                      disabled={branch === ""}
                    >
                      Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="col-12 mt-2">
          <div className="card">
            <div className="card-header h2">Targets</div>
            <div className="card-body">
              <div className="row">
                {targets.map((target) => (
                  <div className={`col-12`} key={target.target}>
                    <div
                      className={`alert ${
                        target.error ? "alert-danger" : "alert-success"
                      }`}
                    >
                      {target.error ? (
                        <>
                          <span className="h4">{target.target}</span>
                          <span className="float-end">{target.error}</span>
                        </>
                      ) : (
                        <Link to={`/target/${target.target}/`} className="h4">
                          {target.target}
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
