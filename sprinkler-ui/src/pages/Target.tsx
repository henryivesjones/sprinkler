import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { wFetch } from "../libs/requests";
import { TargetMetadataType, TaskType } from "../types";

const Target = () => {
  const { target } = useParams();

  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [targetMetadata, setTargetMetadata] = useState<TargetMetadataType>({});
  const [error, setError] = useState<null | string>(null);
  const [buildLogs, setBuildLogs] = useState<null | string>(null);
  const [buildStatus, setBuildStatus] = useState<null | boolean>(null);
  const [building, setBuilding] = useState<boolean>(false);

  useEffect(() => {
    wFetch(`/targets/${target}`)
      .then((res) => {
        setTasks(res.tasks);
        setTargetMetadata({
          os: res.os,
          version: res.version,
          runtime: res.runtime,
        });
        setError(null);
      })
      .catch((e: Error) => setError(e.message));
  }, [target]);

  useEffect(() => {
    if (error) {
      return;
    }
    getBuildLogs();
  }, [tasks, error]);

  const buildTarget = () => {
    setBuilding(true);
    wFetch(`/targets/${target}/build`, { method: "POST" }).then((res) => {
      setBuildStatus(res.success);
      if (!res.success) {
        setBuildLogs(res.logs);
      } else {
        setBuildLogs(null);
        getBuildLogs();
      }
      setBuilding(false);
    });
  };

  const getBuildLogs = () => {
    wFetch(`/targets/${target}/build-logs`).then((res) => {
      setBuildStatus(res.build_success);
      setBuildLogs(res.logs);
    });
  };

  return (
    <>
      <div className="row mt-2">
        <div className="col-12 text-center">
          <span className="h2">{target}</span>
          <span className="alert alert-primary p-2 m-2 float-end">
            {targetMetadata.runtime} {targetMetadata.version}{" "}
            {targetMetadata.os}
          </span>
        </div>
        <div className="col-12">
          <hr />
        </div>
        {error ? (
          <div className="col-12">
            <div className="alert alert-danger">{error}</div>
          </div>
        ) : (
          tasks.length > 0 && (
            <>
              <div className="col-12 h3">Tasks:</div>
              {tasks.map((task, i) => (
                <div key={i} className="col-12 mt-2">
                  <div className="card">
                    <div className="card-header">
                      <span className="h6">{task.task}</span> -{" "}
                      {task.entrypoint}
                      <Link
                        className="btn btn-secondary btn-sm float-end"
                        to={`/target/${target}/task/${task.task}/`}
                      >
                        Task Details
                      </Link>
                    </div>
                    <div className="card-body">
                      <div>Type: {task.type}</div>
                      <div>Schedule: {task.schedule || "None"}</div>
                      <div>
                        Timeout:{" "}
                        {task.timeout ? `${task.timeout} seconds.` : "None"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="col-12">
                <hr />
              </div>

              <div className="col-12 mt-3">
                <span className="h3">Target Build</span>
                <span
                  className={`alert p-1 m-2 ${
                    buildStatus ? "alert-success" : "alert-danger"
                  }`}
                >
                  {buildStatus ? "success" : "failure"}
                </span>
                <button
                  className="btn btn-primary float-end"
                  onClick={buildTarget}
                  disabled={building}
                >
                  {building ? "Building" : "Build Target"}
                </button>
              </div>
              {buildLogs && (
                <div className="col-12 mt-2">
                  <div className="card">
                    <div className="card-body font-monospace">
                      <pre>{buildLogs}</pre>
                    </div>
                  </div>
                </div>
              )}
            </>
          )
        )}
      </div>
    </>
  );
};

export default Target;
