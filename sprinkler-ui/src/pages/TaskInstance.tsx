import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { wFetch } from "../libs/requests";
import { TaskInstanceType } from "../types";

const TaskInstance = () => {
  const { id } = useParams();

  const [task, setTask] = useState<TaskInstanceType>();
  const [logs, setLogs] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    wFetch(`/task_instance/${id}`)
      .then((res) => {
        setTask(res);
        setError(null);
      })
      .catch((e) => setError(e.message));
    getLogs();
  }, [id]);

  const getLogs = () => {
    wFetch(`/task_instance/${id}/logs`).then((res) => setLogs(res));
  };

  let taskStatusClassName = "alert-secondary";
  if (task?.status === "complete") {
    taskStatusClassName = "alert-success";
  } else if (task?.status === "timeout" || task?.status === "failed") {
    taskStatusClassName = "alert-danger";
  } else if (task?.status === "running") {
    taskStatusClassName = "alert-primary";
  }
  return (
    <>
      <div className="row">
        <div className="col-12 mt-2 text-center h2">{id}</div>
        {error && (
          <div className="col-12 mt-2">
            <div className="alert alert-danger text-center h4">{error}</div>
          </div>
        )}
        {!error && (
          <>
            <div className="col-12 mt-3">
              <div className="card">
                <div className="card-header h3 pb-0">
                  Task Instance Details
                  <span
                    className={`float-end alert p-1 h4 ${taskStatusClassName}`}
                  >
                    {task?.status}
                  </span>
                </div>
                <div className="card-body">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      <span className="h6">Target: </span>
                      <span className="float-end h6">{task?.target}</span>
                    </li>
                    <li className="list-group-item">
                      <span className="h6">Task: </span>
                      <span className="float-end h6">{task?.task}</span>
                    </li>
                    <li className="list-group-item">
                      <span className="h6">Task Type: </span>
                      <span className="float-end h6">{task?.task_type}</span>
                    </li>
                    <li className="list-group-item">
                      <span className="h6">Entrypoint: </span>
                      <span className="float-end h6">
                        {task?.entrypoint_file}
                      </span>
                    </li>
                    <li className="list-group-item">
                      <span className="h6">Runtime: </span>
                      <span className="float-end h6">{task?.runtime}</span>
                    </li>
                    <li className="list-group-item">
                      <span className="h6">Version: </span>
                      <span className="float-end h6">{task?.version}</span>
                    </li>
                    <li className="list-group-item">
                      <span className="h6">OS: </span>
                      <span className="float-end h6">{task?.os}</span>
                    </li>
                    <li className="list-group-item">
                      <span className="h6">Git Hash: </span>
                      <span className="float-end h6">{task?.git_hash}</span>
                    </li>
                    <li className="list-group-item">
                      <span className="h6">Container ID: </span>
                      <span className="float-end h6">{task?.container_id}</span>
                    </li>

                    <li className="list-group-item">
                      <span className="h6">Trigger Type: </span>
                      <span className="float-end h6">{task?.trigger_type}</span>
                    </li>
                    <li className="list-group-item">
                      <span className="h6">Created At: </span>
                      <span className="float-end h6">
                        {task?.created_at_time &&
                          new Date(
                            task?.created_at_time * 1000
                          ).toLocaleString()}
                      </span>
                    </li>
                    <li className="list-group-item">
                      <span className="h6">Started At: </span>
                      <span className="float-end h6">
                        {task?.start_time &&
                          new Date(task?.start_time * 1000).toLocaleString()}
                      </span>
                    </li>
                    <li className="list-group-item">
                      <span className="h6">Ended At: </span>
                      <span className="float-end h6">
                        {task?.end_time &&
                          new Date(task?.end_time * 1000).toLocaleString()}
                      </span>
                    </li>
                    <li className="list-group-item">
                      <span className="h6">Duration: </span>
                      <span className="float-end h6">
                        {task?.start_time &&
                          task?.end_time &&
                          (task.end_time - task.start_time).toFixed(2) +
                            " Seconds"}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-12 mt-2">
              <div className="card">
                <div className="card-header h3">
                  Task Instance Logs
                  <button
                    className="btn btn-secondary float-end"
                    onClick={getLogs}
                  >
                    Refresh
                  </button>
                </div>
                <div className="card-body font-monospace">
                  <pre>{logs}</pre>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default TaskInstance;
