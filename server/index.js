import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, UNSAFE_withComponentProps, Link, Outlet, UNSAFE_withErrorBoundaryProps, isRouteErrorResponse, Meta, Links, ScrollRestoration, Scripts, redirect } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { useState, useEffect } from "react";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    let timeoutId = setTimeout(
      () => abort(),
      streamTimeout + 1e3
    );
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough({
            final(callback) {
              clearTimeout(timeoutId);
              timeoutId = void 0;
              callback();
            }
          });
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          pipe(body);
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
const links = () => [{
  rel: "preconnect",
  href: "https://fonts.googleapis.com"
}, {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
}];
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = UNSAFE_withComponentProps(function App() {
  const [times, setTimes] = useState({
    date: "00:00",
    weekday: "",
    localTime: "00:00",
    easternTime: "00:00",
    utcTime: "00:00",
    localTime24: "00:00",
    easternTime24: "00:00",
    utcTime24: "00:00"
  });
  useEffect(() => {
    const updateTimes = () => {
      const now = /* @__PURE__ */ new Date();
      setTimes({
        date: now.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric"
        }),
        weekday: now.toLocaleDateString("en-US", {
          weekday: "long"
        }),
        localTime: now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          timeZoneName: "short"
        }),
        easternTime: now.toLocaleTimeString("en-US", {
          timeZone: "America/New_York",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          timeZoneName: "short"
        }),
        utcTime: now.toLocaleTimeString("en-US", {
          timeZone: "UTC",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          timeZoneName: "short"
        }),
        localTime24: now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZoneName: "shortOffset"
        }),
        easternTime24: now.toLocaleTimeString("en-US", {
          timeZone: "America/New_York",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZoneName: "shortOffset"
        }),
        utcTime24: now.toLocaleTimeString("en-US", {
          timeZone: "UTC",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZoneName: "shortOffset"
        })
      });
    };
    updateTimes();
    const interval = setInterval(updateTimes, 1e3);
    return () => clearInterval(interval);
  }, []);
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [/* @__PURE__ */ jsxs("div", {
      className: "headerBar",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "timeBar",
        children: [/* @__PURE__ */ jsxs("div", {
          children: [times.utcTime, ", ", times.utcTime24, "-0"]
        }), /* @__PURE__ */ jsxs("div", {
          children: [times.easternTime, ", ", times.easternTime24]
        }), /* @__PURE__ */ jsxs("div", {
          children: [times.localTime, ", ", times.localTime24]
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "dateBar",
        children: [/* @__PURE__ */ jsxs("div", {
          children: [times.weekday, ","]
        }), /* @__PURE__ */ jsx("div", {
          children: times.date
        })]
      }), /* @__PURE__ */ jsx("nav", {
        className: "navbar",
        children: /* @__PURE__ */ jsx(Link, {
          to: "/",
          className: "hover:underline",
          children: "Home"
        })
      }), /* @__PURE__ */ jsx("div", {
        className: "fillBar"
      })]
    }), /* @__PURE__ */ jsx("div", {
      className: "pagebody",
      children: /* @__PURE__ */ jsx(Outlet, {})
    })]
  });
});
const ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "pt-16 p-4 container mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      children: message
    }), /* @__PURE__ */ jsx("p", {
      children: details
    }), stack]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: root,
  links
}, Symbol.toStringTag, { value: "Module" }));
function Home() {
  return /* @__PURE__ */ jsxs("div", { className: "home-content", children: [
    /* @__PURE__ */ jsx("p", { children: "Hello, my name is Joe Thomas" }),
    /* @__PURE__ */ jsx("p", { children: "I have been working in the software industry for six years. My experience is primarily in infrastructure, tooling, CICD, monitoring, and incident response. I have also written backend applications, built UIs, and worked with relational databases through work and personal projects." }),
    /* @__PURE__ */ jsx("p", { children: "The aspects of my work I enjoy the most are debugging outages and development blocking issues. I like working across the software stack and ensuring systems are both functional and useful to end-users. I am a strong believer in doing things in a 'simple as possible' way that others can understand. If something does not make sense to a coworker or end-user, I find there is usually a better approach to take." }),
    /* @__PURE__ */ jsx("p", { children: "At the most basic level, I am passionate about building and supporting software that creates meaningful impact - applications that solve real problems and make people's lives more productive or enjoyable." })
  ] });
}
function meta$2({}) {
  return [{
    title: "Home"
  }, {
    name: "description",
    content: "Home"
  }];
}
const home = UNSAFE_withComponentProps(function HomePage() {
  return /* @__PURE__ */ jsx(Home, {});
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: home,
  meta: meta$2
}, Symbol.toStringTag, { value: "Module" }));
const createNote = (text = "", completed = false, completedDate = "") => ({
  text,
  completed,
  completedDate,
  id: Date.now() + Math.random()
});
const NotesSection = ({ title, sectionKey }) => {
  const [notes2, setNotes] = useState([createNote()]);
  const today = (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  useEffect(() => {
    const savedNotes = localStorage.getItem(`${sectionKey}-userNotes`);
    if (savedNotes) {
      let parsed = JSON.parse(savedNotes);
      if (sectionKey === "recurring") {
        parsed = parsed.map((note) => ({
          ...note,
          completed: note.completedDate === today ? note.completed : false
        }));
      }
      setNotes(parsed.length > 0 ? parsed : [createNote()]);
    }
  }, [sectionKey, today]);
  useEffect(() => {
    localStorage.setItem(`${sectionKey}-userNotes`, JSON.stringify(notes2));
  }, [notes2, sectionKey]);
  const addNewRow = () => {
    setNotes([createNote(), ...notes2]);
  };
  const deleteRow = (id) => {
    setNotes(notes2.filter((note) => note.id !== id));
  };
  const clearAll = () => {
    if (window.confirm("Are you sure you want to clear all objectives?")) {
      setNotes([createNote()]);
    }
  };
  const toggleComplete = (id) => {
    setNotes(notes2.map(
      (note) => note.id === id ? { ...note, completed: !note.completed, completedDate: today } : note
    ));
  };
  const updateText = (id, text) => {
    setNotes(notes2.map(
      (note) => note.id === id ? { ...note, text } : note
    ));
  };
  return /* @__PURE__ */ jsxs("div", { style: styles.notesSection, children: [
    /* @__PURE__ */ jsx("h2", { children: title }),
    /* @__PURE__ */ jsxs("div", { style: styles.buttonContainer, children: [
      /* @__PURE__ */ jsx("button", { style: styles.addRowBtn, onClick: addNewRow, children: "+ Add Row" }),
      /* @__PURE__ */ jsx("button", { style: styles.clearAllBtn, onClick: clearAll, children: "Clear All" })
    ] }),
    /* @__PURE__ */ jsx("div", { children: notes2.map((note) => /* @__PURE__ */ jsxs("div", { style: styles.textRow, children: [
      /* @__PURE__ */ jsx("div", { style: styles.checkboxContainer, children: /* @__PURE__ */ jsx(
        "input",
        {
          type: "checkbox",
          style: styles.checkbox,
          checked: note.completed,
          onChange: () => toggleComplete(note.id)
        }
      ) }),
      /* @__PURE__ */ jsx(
        "textarea",
        {
          style: {
            ...styles.textBox,
            ...note.completed ? styles.textBoxCompleted : {}
          },
          placeholder: "Type your objective here...",
          value: note.text,
          onChange: (e) => updateText(note.id, e.target.value)
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          style: styles.deleteBtn,
          onClick: () => deleteRow(note.id),
          children: "Delete"
        }
      )
    ] }, note.id)) })
  ] });
};
function ObjectivesTracker() {
  return /* @__PURE__ */ jsxs("div", { style: styles.body, children: [
    /* @__PURE__ */ jsx(NotesSection, { title: "Day Objectives", sectionKey: "short" }),
    /* @__PURE__ */ jsx(NotesSection, { title: "Daily, Recurring Objectives (resets daily)", sectionKey: "recurring" }),
    /* @__PURE__ */ jsx(NotesSection, { title: "Long Term Objectives", sectionKey: "long" })
  ] });
}
const styles = {
  body: {
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    marginLeft: "25%",
    marginRight: "25%",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f0f0f0"
  },
  notesSection: {
    marginTop: "40px",
    padding: "20px",
    backgroundColor: "rgb(227, 227, 227)",
    borderRadius: "8px"
  },
  buttonContainer: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px"
  },
  addRowBtn: {
    backgroundColor: "#718eac",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    fontSize: "14px",
    cursor: "pointer"
  },
  clearAllBtn: {
    backgroundColor: "#b58e92",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    fontSize: "14px",
    cursor: "pointer"
  },
  textRow: {
    marginBottom: "15px",
    display: "flex",
    alignItems: "flex-start",
    gap: "10px"
  },
  checkboxContainer: {
    paddingTop: "18px"
  },
  checkbox: {
    width: "20px",
    height: "20px",
    cursor: "pointer",
    accentColor: "rgb(119, 125, 171)"
  },
  textBox: {
    flex: 1,
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontFamily: "Arial, sans-serif",
    fontSize: "14px",
    boxSizing: "border-box",
    resize: "vertical",
    minHeight: "40px"
  },
  textBoxCompleted: {
    opacity: 0.4
  },
  deleteBtn: {
    background: "rgb(208, 206, 206)",
    color: "white",
    padding: "6px 6px",
    border: "none",
    borderRadius: "5px",
    fontSize: "14px",
    cursor: "pointer",
    whiteSpace: "nowrap"
  }
};
function meta$1({}) {
  return [{
    title: "Notes"
  }, {
    name: "description",
    content: "Notes"
  }];
}
const notes = UNSAFE_withComponentProps(function NotesPage() {
  return /* @__PURE__ */ jsx(ObjectivesTracker, {});
});
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: notes,
  meta: meta$1
}, Symbol.toStringTag, { value: "Module" }));
function About() {
  return /* @__PURE__ */ jsx("p", { children: "Not quite ready...yet" });
}
function meta({}) {
  return [{
    title: "About"
  }, {
    name: "description",
    content: "About"
  }];
}
const about = UNSAFE_withComponentProps(function AboutPage() {
  return /* @__PURE__ */ jsx(About, {});
});
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: about,
  meta
}, Symbol.toStringTag, { value: "Module" }));
async function loader() {
  throw redirect("/");
}
const catchAll = UNSAFE_withComponentProps(function CatchAllPage() {
  return null;
});
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: catchAll,
  loader
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-CNpyyXXQ.js", "imports": ["/assets/jsx-runtime-D_zvdyIk.js", "/assets/chunk-OIYGIGL5-ClTiR4dw.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": true, "module": "/assets/root-BJw4On_D.js", "imports": ["/assets/jsx-runtime-D_zvdyIk.js", "/assets/chunk-OIYGIGL5-ClTiR4dw.js"], "css": ["/assets/root-DCJ_D_9i.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/home": { "id": "routes/home", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/home-DoHIFqrm.js", "imports": ["/assets/chunk-OIYGIGL5-ClTiR4dw.js", "/assets/jsx-runtime-D_zvdyIk.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/notes": { "id": "routes/notes", "parentId": "root", "path": "notes", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/notes-usFhmhh3.js", "imports": ["/assets/chunk-OIYGIGL5-ClTiR4dw.js", "/assets/jsx-runtime-D_zvdyIk.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/about": { "id": "routes/about", "parentId": "root", "path": "about", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/about-BhC84MCY.js", "imports": ["/assets/chunk-OIYGIGL5-ClTiR4dw.js", "/assets/jsx-runtime-D_zvdyIk.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/catch-all": { "id": "routes/catch-all", "parentId": "root", "path": "*", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/catch-all-CjFDsoZ5.js", "imports": ["/assets/chunk-OIYGIGL5-ClTiR4dw.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-3cfaeccc.js", "version": "3cfaeccc", "sri": void 0 };
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "v8_middleware": false, "unstable_optimizeDeps": false, "unstable_splitRouteModules": false, "unstable_subResourceIntegrity": false, "unstable_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/home": {
    id: "routes/home",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  },
  "routes/notes": {
    id: "routes/notes",
    parentId: "root",
    path: "notes",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/about": {
    id: "routes/about",
    parentId: "root",
    path: "about",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/catch-all": {
    id: "routes/catch-all",
    parentId: "root",
    path: "*",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};
