import { useEffect, useState } from "react";
import { wFetch } from "../libs/requests";
import { NewSecretType } from "../types";

const Secrets = () => {
  const [secrets, setSecrets] = useState<string[]>([]);
  const [editedSecrets, setEditedSecrets] = useState<Record<string, string>>(
    {}
  );

  const [newSecret, setNewSecret] = useState<NewSecretType>({
    secret: "",
    value: "",
  });

  const [error, setError] = useState<string | null>(null);

  const fetchSecrets = () => {
    wFetch("/secrets")
      .then((res) => {
        setSecrets(res);
        setError(null);
      })
      .catch((e: Error) => setError(e.message));
  };

  const deleteSecret = (key: string) => {
    wFetch(`/secrets/${key}`, { method: "DELETE" }).then((res) =>
      setSecrets(res)
    );
  };

  const setSecret = (key: string, value: string | undefined = undefined) => {
    wFetch(`/secrets/${key}`, {
      method: "POST",
      body: value ? value : editedSecrets[key],
    })
      .then((res) => {
        setError(null);
        setSecrets(res);
        setNewSecret({ secret: "", value: "" });
        setEditedSecrets((editedSecrets) => {
          const tempEditedSecrets = { ...editedSecrets };
          delete editedSecrets[key];
          return tempEditedSecrets;
        });
      })
      .catch((e: Error) => {
        setError(e.message);
      });
  };

  useEffect(() => {
    fetchSecrets();
  }, []);

  return (
    <>
      <div className="row">
        <div className="col-12 h2 mt-2">Secrets</div>
        <div className="col-12 mt-2">
          <div className="card">
            <div className="card-body">
              <ul className="list-group list-group-flush">
                {secrets.map((secret) => (
                  <li className="list-group-item" key={secret}>
                    <div className="d-flex">
                      <div className="h5 flex-grow-1">{secret}</div>
                      <div className="p-2">
                        <input
                          style={{ minWidth: 400 }}
                          className="form-control"
                          value={editedSecrets[secret] || ""}
                          onChange={(e) =>
                            setEditedSecrets((editedSecrets) => ({
                              ...editedSecrets,
                              [secret]: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="p-2">
                        <button
                          className="btn btn-danger"
                          onClick={() => deleteSecret(secret)}
                        >
                          Delete Secret
                        </button>
                      </div>
                      <div className="p-2">
                        <button
                          className="btn btn-primary"
                          onClick={() => setSecret(secret)}
                          disabled={!(secret in editedSecrets)}
                        >
                          Set Value
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
                <li className="list-group-item">
                  {error && <div className="alert alert-danger">{error}</div>}
                  <h4>Add a secret.</h4>
                  <div className="d-flex mt-2">
                    <div className="form-floating me-auto">
                      <input
                        style={{ minWidth: 400 }}
                        id="new-secret"
                        type="text"
                        className="form-control"
                        value={newSecret.secret}
                        onChange={(e) =>
                          setNewSecret((newSecret) => ({
                            ...newSecret,
                            secret: e.target.value,
                          }))
                        }
                      />
                      <label htmlFor="new-secret">Secret</label>
                    </div>
                    <div className="form-floating">
                      <input
                        style={{ minWidth: 400 }}
                        id="new-secret-value"
                        type="text"
                        className="form-control"
                        value={newSecret.value}
                        onChange={(e) =>
                          setNewSecret((newSecret) => ({
                            ...newSecret,
                            value: e.target.value,
                          }))
                        }
                      />
                      <label htmlFor="new-secret">Secret Value</label>
                    </div>

                    <div className="p-2">
                      <button
                        className="btn btn-primary"
                        onClick={() =>
                          setSecret(newSecret.secret, newSecret.value)
                        }
                      >
                        Set Value
                      </button>
                    </div>
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

export default Secrets;
