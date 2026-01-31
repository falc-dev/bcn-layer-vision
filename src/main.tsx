import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import proj4list from "proj4-list";
import routes from "@/routes";
import App from "@/App";
import { register } from "ol/proj/proj4";
import proj4 from "proj4";

import "react-openlayers/dist/index.css";

proj4.defs([proj4list["EPSG:25831"]]);
register(proj4);

const container = document.getElementById("root") as HTMLElement;

const root = createRoot(container);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: routes,
    errorElement: <div>error</div>,
  },
]);

root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
