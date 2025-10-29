import { useState } from "react";
import { ObjectiveGroup } from "./Group";
import "../../../../app.css";

import "./Objective.css";

export function ObjectiveSection() {
  const [isExpanded, setIsExpanded] = useState(true);
  return (
    <div className="objectives-section">
      <button
        className="toggle-button expand"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* {isExpanded ? "-" : "+"} */}
      </button>
      {!isExpanded && <h1>Objectives</h1>}
      <div
        className={`objectives-panel ${isExpanded ? "expanded" : "collapsed"}`}
      >
        <ObjectiveGroup title="Short Term" sectionKey="short" />
        <ObjectiveGroup title="Recurring" sectionKey="recurring" />
        <ObjectiveGroup title="Long Term" sectionKey="long" />
      </div>
    </div>
  );
}
