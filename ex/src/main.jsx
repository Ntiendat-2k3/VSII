// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store/store";
import App from "./App";
import "./index.css";

// 1. Import Agentation
import { Agentation } from "agentation";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />

      {/* 2. Chèn Agentation và kiểm tra môi trường */}
      {import.meta.env.DEV && <Agentation />}
    </Provider>
  </React.StrictMode>,
);
