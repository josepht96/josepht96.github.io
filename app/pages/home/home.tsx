import { ObjectiveSection } from "./components/Objective/Page";
import { SummarySection } from "./summary";

export function Home() {
  return (
    <div className="home-content">
      <SummarySection />
      <div className="divider"></div>
      <ObjectiveSection />
    </div>
  );
}
