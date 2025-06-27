import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 gap-4">
      <LoaderCircle className="w-16 h-16 animate-spin text-primary" />
      <h2 className="text-2xl font-headline font-semibold">
        Generating your content...
      </h2>
      <p className="text-muted-foreground max-w-md">
        Our AI is brewing up some creative ideas for you. This might take a moment.
      </p>
    </div>
  );
}
