import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

import "./index.css";

const router = createRouter({ routeTree });

const rootElement = document.getElementById("root");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <RouterProvider router={router} />
      </div>
    </StrictMode>,
  );
}
