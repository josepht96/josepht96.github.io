import type { Route } from "./+types/home";
import { Home } from "../pages/home/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home" },
    { name: "description", content: "Home" },
  ];
}

export default function HomePage() {
  return <Home />;
}
