import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { wFetch } from "../libs/requests";
import { TaskInstanceType } from "../types";

const PAGE_SIZE = 20;

const TargetTask = () => {
  const { target, task } = useParams();
  if (!target || !task) {
    return <></>;
  }

  const [taskInstances, setTaskInstances] = useState<TaskInstanceType[]>([]);
  const [requestBody, setRequestBody] = useState("");
  const [response, setResponse] = useState<null | string>(null);
  const [page, setPage] = useState(0);

  useEffect(() => {
    fetchTaskInstances();
  }, [page, target, task]);

  const fetchTaskInstances = () => {
    const queryString = new URLSearchParams();
    queryString.append("target", target);
    queryString.append("task", task);
    queryString.append("offset", `${page * PAGE_SIZE}`);
    queryString.append("limit", `${PAGE_SIZE}`);
    queryString.append("sort_by", "start_time");
    wFetch(`/task_instance?${queryString.toString()}`).then((res) =>
      setTaskInstances(res)
    );
  };

  const triggerTask = () => {
    wFetch(`/target/${target}/task/${task}/trigger`, {
      method: "POST",
      body: requestBody,
    })
      .then((res) => {
        setResponse(res);
        fetchTaskInstances();
      })
      .catch((e) => setResponse(e.message));
  };

  return (
    <>
      <div className="row mt-2">
        <div className="col-12 h2 text-center">
          <Link to={`/target/${target}/`}>{target}</Link> | {task}
        </div>
        <div className="col-12">
          <hr />
        </div>
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <span className="h4">Recent Task Instances</span>
              <button
                className="btn btn-secondary float-end"
                onClick={fetchTaskInstances}
              >
                Refresh
              </button>
            </div>
            <div className="card-body">
              <table className="table">
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Duration (s)</th>
                    <th>ID</th>
                    <th>Logs</th>
                  </tr>
                </thead>
                <tbody>
                  {taskInstances.map((taskInstance) => (
                    <tr key={taskInstance.id}>
                      <td>{taskInstance.status}</td>
                      <td>
                        {taskInstance.start_time &&
                          new Date(
                            taskInstance.start_time * 1000
                          ).toLocaleString()}
                      </td>
                      <td>
                        {taskInstance.end_time &&
                          new Date(
                            taskInstance.end_time * 1000
                          ).toLocaleString()}
                      </td>
                      <td>
                        {taskInstance.end_time &&
                          taskInstance.start_time &&
                          (
                            taskInstance.end_time - taskInstance.start_time
                          ).toFixed(2)}
                      </td>
                      <td>{taskInstance.id}</td>
                      <td>
                        <Link to={`/task_instance/${taskInstance.id}/`}>
                          Detail
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="float-end">
                <button
                  className="btn btn-primary"
                  disabled={page === 0}
                  onClick={() => setPage((page) => page - 1)}
                >
                  -
                </button>
                <span className=" mx-2">{page + 1}</span>
                <button
                  className="btn btn-primary"
                  onClick={() => setPage((page) => page + 1)}
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div className="col-12">
            <hr />
          </div>

          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <span className="h3">Trigger Task</span>
                <button
                  className="btn btn-primary float-end"
                  onClick={triggerTask}
                >
                  Trigger
                </button>
              </div>
              <div className="card-body">
                <div className="form-floating">
                  <textarea
                    id="task-trigger-body"
                    className="font-monospace form-control"
                    style={{ minHeight: 200 }}
                    value={requestBody}
                    onChange={(e) => setRequestBody(e.target.value)}
                  />
                  <label htmlFor="task-trigger-body">Request Body</label>
                </div>
                {response !== null && (
                  <div className="form-floating mt-2">
                    <textarea
                      disabled={true}
                      id="task-trigger-response"
                      className="font-monospace form-control"
                      style={{ minHeight: 200 }}
                      value={JSON.stringify(response)}
                    />
                    <label htmlFor="task-trigger-response">Response</label>
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

export default TargetTask;
