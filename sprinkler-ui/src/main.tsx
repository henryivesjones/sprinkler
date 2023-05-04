import React from "react";
import ReactDOM from "react-dom/client";
import RouterContainer from "./RouterContainer";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterContainer />
  </React.StrictMode>
);
