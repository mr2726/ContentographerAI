import type { GeneratedDataType } from "../page";
import CalendarDisplay from "./CalendarDisplay";
import PostCards from "./PostCards";
import ScriptDisplay from "./ScriptDisplay";

type ContentDisplayProps = {
  data: GeneratedDataType;
  plan: string;
};

export default function ContentDisplay({ data, plan }: ContentDisplayProps) {
  if (!data) return null;

  if (data.type === "script") {
    return <ScriptDisplay data={data} />;
  }

  if (data.type === "posts") {
    if (plan === "ultimate") {
      return <CalendarDisplay data={data} />;
    }
    return <PostCards data={data} />;
  }

  return <p>Could not display the generated content.</p>;
}
