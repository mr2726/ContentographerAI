import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Camera, Video, Sparkles } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Get a taste of AI-powered content creation.",
    features: ["7 post ideas per month", "Content ideas", "Captions", "Hashtags"],
    cta: "Get Started for Free",
    planId: "free",
  },
  {
    name: "Pro",
    price: "$5/mo",
    description: "For creators who want to post consistently.",
    features: [
      "30 post ideas per month",
      "Content ideas",
      "Captions & Hashtags",
      "Priority support",
    ],
    cta: "Go Pro",
    planId: "pro",
    featured: true,
  },
  {
    name: "Ultimate",
    price: "$10/mo",
    description: "The ultimate toolkit for content domination.",
    features: [
      "Everything in Pro",
      "Visual content calendar",
      "Post timing suggestions",
      "Story ideas",
    ],
    cta: "Go Ultimate",
    planId: "ultimate",
  },
];

export default function Home() {
  return (
    <div className="w-full">
      <section className="text-center py-20 lg:py-32 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-semibold font-headline mb-4">
            AI-Powered Content Creation
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tighter text-foreground">
            Never Run Out of Content Ideas Again
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Contentographer AI is your personal assistant for creating engaging social media posts. Generate a month's worth of content in minutes.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild size="lg" className="font-bold">
              <Link href="#pricing">Choose Your Plan</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background/50 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Camera className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-headline font-semibold">For Photographers</h3>
              <p className="text-muted-foreground mt-2">Get tailored post ideas for your niche, from weddings to lifestyle portraits.</p>
            </div>
            <div className="flex flex-col items-center">
              <Video className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-headline font-semibold">For Videographers</h3>
              <p className="text-muted-foreground mt-2">Generate engaging TikTok scripts and video concepts that capture attention.</p>
            </div>
            <div className="flex flex-col items-center">
              <Sparkles className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-headline font-semibold">Powered by AI</h3>
              <p className="text-muted-foreground mt-2">Leverage cutting-edge AI to create unique and relevant content for your audience.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 lg:py-32 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline tracking-tight">
              Flexible Plans for Every Creator
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Start for free, then upgrade as you grow.
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {plans.map((plan) => (
              <Card key={plan.name} className={`flex flex-col h-full ${plan.featured ? "border-primary shadow-2xl scale-105" : "shadow-lg"}`}>
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-headline">{plan.name}</CardTitle>
                  <CardDescription className="text-4xl font-bold text-foreground font-headline pt-4">{plan.price}</CardDescription>
                  <p className="pt-2">{plan.description}</p>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full font-bold" variant={plan.featured ? "default" : "outline"}>
                    <Link href={`/generate?plan=${plan.planId}`}>{plan.cta}</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
