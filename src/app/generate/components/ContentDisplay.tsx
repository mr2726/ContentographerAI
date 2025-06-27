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
    // @ts-ignore
    return <ScriptDisplay data={data} />;
  }

  if (data.type === "posts") {
    if (plan === "ultimate") {
      // @ts-ignore
      return <CalendarDisplay data={data} />;
    }
    // @ts-ignore
    return <PostCards data={data} />;
  }

  return <p>Could not display the generated content.</p>;
}
