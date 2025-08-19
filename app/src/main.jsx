import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import DefaultLayout from "./layout/Default.jsx";
import HomePage from "./pages/Home.jsx";
import UserPage from "./pages/Users.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <DefaultLayout>
      <UserPage />
    </DefaultLayout>
  </StrictMode>,
);
