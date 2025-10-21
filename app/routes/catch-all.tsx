// routes/catch-all.tsx
import { redirect } from "react-router";

export async function loader() {
  // Immediately redirect to home
  throw redirect("/");
}

export default function CatchAllPage() {
  // This won't render because loader redirects
  return null;
}