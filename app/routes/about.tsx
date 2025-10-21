import type { Route } from "./+types/home";
import { About } from "../pages/about/about";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "About" },
    { name: "description", content: "About" },
  ];
}

export default function AboutPage() {
  return <About />;
}
