import { lazy, Suspense } from "react";
import { type RouteObject } from "react-router";

const Index = lazy(() => import("@/pages/index"));
const Notfound = lazy(() => import("@/pages/404"));

export const routes: Array<RouteObject> = [
  {
    index: true,
    element: (
      <Suspense>
        <Index />
      </Suspense>
    ),
  },
  {
    path: "atencio-primaria",
    lazy: async () => {
      const { default: AtencioPrimaria, loader } =
        await import("@/pages/atencio-primaria/atencio-primaria");
      return { Component: AtencioPrimaria, loader };
    },
  },
  {
    path: "participacio-ciutadana",
    lazy: async () => {
      const { default: ParticipacioCiutadana, loader } =
        await import("@/pages/participacio-ciutadana/participacio-ciutadana");
      return { Component: ParticipacioCiutadana, loader };
    },
  },
  {
    path: "*",
    element: (
      <Suspense>
        <Notfound />
      </Suspense>
    ),
  },
];

export default routes;
