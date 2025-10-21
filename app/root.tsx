import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  Link,
} from "react-router";
import { useState, useEffect } from "react";

import type { Route } from "./+types/root";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const [times, setTimes] = useState({
    date: "00:00",
    weekday: "",
    localTime: "00:00",
    easternTime: "00:00",
    utcTime: "00:00",
    localTime24: "00:00",
    easternTime24: "00:00",
    utcTime24: "00:00",
  });

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();

      setTimes({
        date: now.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        weekday: now.toLocaleDateString("en-US", {
          weekday: "long",
        }),
        localTime: now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          timeZoneName: "short",
        }),
        easternTime: now.toLocaleTimeString("en-US", {
          timeZone: "America/New_York",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          timeZoneName: "short",
        }),
        utcTime: now.toLocaleTimeString("en-US", {
          timeZone: "UTC",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          timeZoneName: "short",
        }),
        localTime24: now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZoneName: "shortOffset",
        }),
        easternTime24: now.toLocaleTimeString("en-US", {
          timeZone: "America/New_York",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZoneName: "shortOffset",
        }),
        utcTime24: now.toLocaleTimeString("en-US", {
          timeZone: "UTC",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZoneName: "shortOffset",
        }),
      });
    };

    updateTimes(); // Set initial time
    const interval = setInterval(updateTimes, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <>
      <div className="headerBar">
        <div className="timeBar">
          <div>
            {times.utcTime}, {times.utcTime24}-0
          </div>
          <div>
            {times.easternTime}, {times.easternTime24}
          </div>
          <div>
            {times.localTime}, {times.localTime24}
          </div>
        </div>
        <div className="dateBar">
          <div>{times.weekday},</div>
          <div>{times.date}</div>
        </div>
        <nav className="navbar">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          {/* <Link to="/notes" className="hover:underline">
            Notes
          </Link>
          <Link to="/about" className="hover:underline">
            About
          </Link> */}
        </nav>
        <div className="fillBar"></div>
      </div>

      <div className="pagebody">
        <Outlet />
      </div>
    </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
