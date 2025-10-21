import type { Route } from "./+types/home";
import ObjectivesTracker from "../pages/notes/notes";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Notes" },
    { name: "description", content: "Notes" },
  ];
}

export default function NotesPage() {
  return <ObjectivesTracker />;
}
