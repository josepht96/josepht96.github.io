import { useState } from "react";

export function SummarySection() {
  const [isExpanded, setIsExpanded] = useState(true);
  return (
    <div className="section">
      <button
        className="toggle-button"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* {isExpanded ? "-" : "+"} */}
      </button>
      <div className="summary">
        <h1>{isExpanded ? "Hello, my name is Joe Thomas" : "Summary"}</h1>
        <div className={`details ${isExpanded ? "expanded" : "collapsed"}`}>
          <p>
            I have been working in the software industry for six years. My
            experience is primarily in infrastructure, tooling, CICD,
            monitoring, and incident response. I have also written backend
            applications, built UIs, and worked with relational databases
            through work and personal projects.
          </p>
          <p>
            The aspects of my work I enjoy the most are debugging outages and
            development blocking issues. I like working across the software
            stack and ensuring systems are both functional and useful to
            end-users. I am a strong believer in doing things in a 'simple as
            possible' way that others can understand. If something does not make
            sense to a coworker or end-user, I find there is usually a better
            approach to take.
          </p>
          <p>
            At the most basic level, I am passionate about building and
            supporting software that creates meaningful impact - applications
            that solve real problems and make people's lives more productive or
            enjoyable.
          </p>
        </div>
      </div>
    </div>
  );
}