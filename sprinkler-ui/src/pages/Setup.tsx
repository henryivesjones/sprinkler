import { useEffect, useState } from "react";
import { wFetch } from "../libs/requests";

const Setup = () => {
  const [config, setConfig] = useState<Record<string, string>>({});
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [gitHash, setGitHash] = useState<string | null>(null);
  //init fields
  const [branch, setBranch] = useState<string>("");
  const [directory, setDirectory] = useState<string>("");
  const [remote, setRemote] = useState<string>("");
  const [force, setForce] = useState(false);

  const [initLogs, setInitLogs] = useState("");

  const getPublicKey = () => {
    wFetch("/git/get_key")
      .then((res) => setPublicKey(res))
      .catch((e) => {
        console.error(e);
        setPublicKey(null);
      });
  };

  const createPublicKey = () => {
    wFetch("/git/generate_key?force=1", { method: "POST" }).then((res) =>
      setPublicKey(res)
    );
  };

  const gitInit = () => {
    if (remote === "") {
      return;
    }
    const initBody: {
      git_remote: string;
      branch?: string;
      force: boolean;
      directory?: string;
    } = {
      git_remote: remote,
      force: force,
    };
    if (branch !== "") {
      initBody.branch = branch;
    }
    if (directory !== "") {
      initBody.directory = directory;
    }
    wFetch("/git/init", {
      method: "POST",
      body: JSON.stringify(initBody),
    })
      .then((res) => {
        setInitLogs(res);
        getConfig();
        getGitHash();
      })
      .catch((e) => {
        setInitLogs(e.message);
        getConfig();
        getGitHash();
      });
  };

  const getGitHash = () => {
    wFetch("/git/hash")
      .then((res) => setGitHash(res))
      .catch((e) => {
        setGitHash(e.message);
      });
  };

  const getConfig = () => {
    wFetch("/config").then((res) => setConfig(res));
  };

  useEffect(() => {
    getPublicKey();
    getConfig();
    getGitHash();
  }, []);

  return (
    <>
      <div className="row">
        <div className="col-12 mt-2 h2">Setup</div>
        <div className="col-12 mt-2">
          GIT HASH: <code>{gitHash}</code>
        </div>
        <div className="col-12 mt-2">
          GIT Branch: <code>{config.GIT_BRANCH}</code>
        </div>
        <div className="col-12 mt-2">
          SSH Public Key: <code>{publicKey}</code>
        </div>
        <div className="col-12 mt-2">
          <button className="btn btn-primary" onClick={createPublicKey}>
            Generate new ssh key
          </button>
        </div>
        <div className="col-12 mt-2">
          <div className="card">
            <div className="card-header h2">Init</div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4">
                  <label htmlFor="init-remote">Git Remote*</label>
                  <input
                    type="text"
                    id="init-remote"
                    className="form-control"
                    value={remote}
                    onChange={(e) => setRemote(e.target.value)}
                    placeholder="git@github.com:organization/repo.git"
                  />
                </div>
                <div className="col-md-3">
                  <label htmlFor="init-branch">Git Branch (optional)</label>
                  <input
                    id="init-branch"
                    type="text"
                    className="form-control"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    placeholder={config.GIT_BRANCH}
                  />
                </div>
                <div className="col-md-3">
                  <label htmlFor="init-directory">Directory (optional)</label>
                  <input
                    id="init-directory"
                    type="text"
                    className="form-control"
                    value={directory}
                    onChange={(e) => setDirectory(e.target.value)}
                    placeholder="~/.sprinkler/"
                  />
                </div>
                <div className="col-md-2">
                  <label htmlFor="init-force" className="">
                    Force (overwrite)
                  </label>
                  <div className="form-check form-switch">
                    <input
                      id="init-force"
                      type="checkbox"
                      className="form-check-input"
                      checked={force}
                      onChange={(e) => setForce((f) => !f)}
                      placeholder="main"
                    />
                  </div>
                </div>
                <div className="col-12 mt-2">
                  <button className="btn btn-primary w-100" onClick={gitInit}>
                    Initialize Sprinkler
                  </button>
                </div>
                {initLogs !== "" && (
                  <div className="col-12 mt-2">
                    <code>
                      <pre>{initLogs}</pre>
                    </code>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Setup;
