'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import Link from "next/link";
import { useAuth } from '@/context/AuthContext';
import { cn } from "@/lib/utils";

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

export default function PricingPage() {
  const { userData } = useAuth();

  return (
    <div className="w-full py-20 lg:py-32 px-4">
       <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold font-headline tracking-tight">
              Flexible Plans for Every Creator
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Start for free, then upgrade as you grow.
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {plans.map((plan) => (
              <Card 
                key={plan.name} 
                className={cn(
                  "flex flex-col h-full shadow-lg",
                  plan.featured && "border-primary shadow-2xl scale-105",
                  userData?.plan === plan.planId && "border-2 border-primary"
                )}
              >
                {userData?.plan === plan.planId && (
                   <div className="py-2 text-center bg-primary text-primary-foreground font-semibold text-sm">
                        Current Plan
                   </div>
                )}
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
                  <Button 
                    asChild 
                    className="w-full font-bold" 
                    variant={plan.featured ? "default" : "outline"}
                    disabled={userData?.plan === plan.planId}
                  >
                    <Link href={`/generate?plan=${plan.planId}`}>
                      {userData?.plan === plan.planId ? 'Currently Active' : plan.cta}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
    </div>
  );
}
