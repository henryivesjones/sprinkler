import { useEffect, useState } from "react";
import { wFetch } from "../libs/requests";

const Config = () => {
  const [currentConfig, setCurrentConfig] = useState<Record<string, string>>(
    {}
  );
  const [editedConfig, setEditedConfig] = useState<Record<string, string>>({});

  const [error, setError] = useState<string | null>(null);

  const fetchConfig = () => {
    wFetch("/config")
      .then((res) => {
        setCurrentConfig(res);
        setError(null);
      })
      .catch((e: Error) => setError(e.message));
  };

  const getConfigValue = (key: string) => {
    if (key in editedConfig) {
      return editedConfig[key];
    }
    return currentConfig[key];
  };

  const resetConfigKey = (key: string) => {
    wFetch(`/config/${key}`, { method: "DELETE" }).then((res) =>
      setCurrentConfig(res)
    );
  };

  const setConfigKey = (key: string) => {
    wFetch(`/config/${key}`, { method: "POST", body: editedConfig[key] }).then(
      (res) => {
        setCurrentConfig(res);
        setEditedConfig((editedConfig) => {
          const tempEditedConfig = { ...editedConfig };
          delete editedConfig[key];
          return tempEditedConfig;
        });
      }
    );
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  return (
    <>
      <div className="row">
        <div className="col-12 h2 mt-2">Configuration</div>
        <div className="col-12 mt-2">
          <div className="card">
            <div className="card-body">
              <ul className="list-group list-group-flush">
                {Object.keys(currentConfig).map((configKey) => (
                  <li className="list-group-item" key={configKey}>
                    <div className="d-flex">
                      <div className="h5 flex-grow-1">{configKey}</div>
                      <div className="p-2">
                        <input
                          style={{ minWidth: 400 }}
                          className="form-control"
                          value={getConfigValue(configKey)}
                          onChange={(e) =>
                            setEditedConfig((editedConfig) => ({
                              ...editedConfig,
                              [configKey]: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="p-2">
                        <button
                          className="btn btn-danger"
                          onClick={() => resetConfigKey(configKey)}
                        >
                          Reset Value
                        </button>
                      </div>
                      <div className="p-2">
                        <button
                          className="btn btn-primary"
                          onClick={() => setConfigKey(configKey)}
                          disabled={
                            !(configKey in editedConfig) ||
                            editedConfig[configKey] === currentConfig[configKey]
                          }
                        >
                          Set Value
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Config;
