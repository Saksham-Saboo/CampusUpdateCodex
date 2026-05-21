import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/colleges")({
  component: CollegesLayout,
});

function CollegesLayout() {
  return <Outlet />;
}