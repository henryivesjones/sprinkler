import { useEffect, useState } from "react";
import { wFetch } from "../libs/requests";

const APIKeys = () => {
  const [apiKeys, setApiKeys] = useState<string[]>([]);
  const [apiKeyName, setAPIKeyName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);

  const fetchAPIKeys = () => {
    wFetch(`/api_keys`).then((res) => setApiKeys(res));
  };

  const createAPIKey = () => {
    wFetch(`/api_keys/${apiKeyName}`, { method: "POST" })
      .then((res) => {
        setSecret(res);
        setError(null);
        fetchAPIKeys();
      })
      .catch((e) => setError(e.message));
  };

  const deleteAPIKey = (key: string) => {
    wFetch(`/api_keys/${key}`, { method: "DELETE" })
      .then((res) => {
        setError(null);
        fetchAPIKeys();
      })
      .catch((e) => setError(e.message));
  };

  useEffect(() => {
    fetchAPIKeys();
  }, []);

  return (
    <>
      <div className="row">
        <div className="col-12 mt-2 h3">API Keys</div>
        <div className="col-12 mt-2">
          <div className="card">
            <div className="card-body">
              <ul className="list-group list-group-flush">
                {apiKeys.map((apiKey) => (
                  <li className="list-group-item h3 p-2" key={apiKey}>
                    {apiKey}
                    <button
                      className="btn btn-danger float-end"
                      onClick={() => deleteAPIKey(apiKey)}
                    >
                      Delete
                    </button>
                  </li>
                ))}

                <li className="list-group-item">
                  <div className="row">
                    {error && (
                      <div className="col-12 mt-2">
                        <div className="alert alert-danger">{error}</div>
                      </div>
                    )}
                    <div className="col">
                      <div className="form-floating">
                        <input
                          id="new-api-key"
                          type="text"
                          className="form-control"
                          value={apiKeyName}
                          onChange={(e) => setAPIKeyName(e.target.value)}
                        />
                        <label htmlFor="new-api-key">API Key Name</label>
                      </div>
                    </div>
                    <div className="col-auto float-end">
                      <button
                        className="btn btn-success"
                        onClick={createAPIKey}
                      >
                        Create an API Key
                      </button>
                    </div>

                    {secret && (
                      <div className="col-12 mt-2">
                        <div className="alert alert-primary">
                          API Key Secret: <code>{secret}</code>. Keep this
                          somewhere safe as you will not be able to retrieve it
                          again.
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default APIKeys;
