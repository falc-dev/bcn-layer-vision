import { Fragment } from "react";
import { Outlet, ScrollRestoration } from "react-router";

import MainMenu from "./components/main-menu/main-menu";

export default function App() {
  return (
    <Fragment>
      <MainMenu />
      <Outlet />
      <ScrollRestoration />
    </Fragment>
  );
}
