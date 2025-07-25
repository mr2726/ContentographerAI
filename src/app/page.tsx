"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Camera, Video, Sparkles, Star } from "lucide-react";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

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

const testimonials = [
  {
    quote: "Contentographer AI has completely transformed my workflow. I can generate a month's worth of content in a single afternoon!",
    name: "Jessica Miller",
    title: "Wedding Photographer",
  },
  {
    quote: "As a videographer, coming up with fresh TikTok ideas was a constant struggle. This tool is a lifesaver. The script generation is pure gold.",
    name: "David Chen",
    title: "Travel Videographer",
  },
  {
    quote: "I was skeptical at first, but the quality of the content ideas is outstanding. It understands my niche perfectly.",
    name: "Sophia Rodriguez",
    title: "Food Photographer",
  },
  {
    quote: "The calendar view in the Ultimate plan helps me stay organized and consistent. My engagement has skyrocketed since I started using it.",
    name: "Michael Adams",
    title: "Lifestyle Blogger",
  },
  {
    quote: "Simple to use, powerful results. It's the best investment I've made for my social media presence.",
    name: "Emily White",
    title: "Product Photographer",
  },
];

const faqItems = [
    {
        question: "What kind of content can I generate?",
        answer: "You can generate a wide range of content, including Instagram post ideas with captions and hashtags, and full TikTok video scripts with scene descriptions and audio suggestions. Our AI is tailored to various photography and videography niches."
    },
    {
        question: "How does the monthly subscription work?",
        answer: "Your subscription is valid for 30 days from the date of purchase. It gives you access to the features of your chosen plan. After 30 days, your plan will automatically revert to 'Free' unless you purchase it again. We do not store payment information or auto-renew subscriptions."
    },
    {
        question: "Can I cancel my plan at any time?",
        answer: "Since we do not have auto-renewal, there's no need to cancel. Your paid plan will simply expire after 30 days, and you can decide if you want to purchase it again. You can switch plans at any time by going to the pricing page."
    },
    {
        question: "Is my data secure?",
        answer: "Yes, security is our top priority. Your account is secured through Firebase Authentication, and all your generated content is stored securely in our database, linked only to your user ID."
    }
]

export default function Home() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Message from ${name} via Contentographer AI`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );
    window.location.href = `mailto:aru.aram99@gmail.com?subject=${subject}&body=${body}`;
  };

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
              <Link href="/pricing">Choose Your Plan</Link>
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

      <section className="py-20 lg:py-32 bg-background px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-headline tracking-tight">
            Loved by Creators Everywhere
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            See what our users are saying about their experience with Contentographer AI.
          </p>
          <Carousel
            plugins={[
              Autoplay({
                delay: 3000,
                stopOnInteraction: true,
              }),
            ]}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-5xl mx-auto mt-12"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1 h-full">
                    <Card className="flex flex-col justify-between h-full text-left shadow-lg">
                      <CardContent className="p-6 space-y-4">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                          ))}
                        </div>
                        <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                      </CardContent>
                      <CardFooter className="p-6 pt-0">
                        <div>
                          <p className="font-semibold font-headline">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                        </div>
                      </CardFooter>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
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
                    <Link href={'/pricing'}>{plan.cta}</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="py-20 lg:py-32 bg-background/50 px-4">
        <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-headline tracking-tight">
                Frequently Asked Questions
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
                Have questions? We've got answers.
            </p>
            <Accordion type="single" collapsible className="w-full mt-12 text-left">
                {faqItems.map((item, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                        <AccordionTrigger className="font-headline text-lg">{item.question}</AccordionTrigger>
                        <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                            {item.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
      </section>

      <section id="contact" className="py-20 lg:py-32 px-4">
        <div className="container mx-auto max-w-2xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-headline tracking-tight">
                Get in Touch
            </h2>
            <p className="mt-4 text-lg text-muted-foreground mb-12">
                Have a question or feedback? We'd love to hear from you.
            </p>
            <form className="text-left space-y-6" onSubmit={handleContactSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="Your message..." rows={6} value={message} onChange={(e) => setMessage(e.target.value)} required />
                </div>
                <div className="text-center">
                    <Button type="submit" size="lg" className="font-bold">Send Message</Button>
                </div>
            </form>
        </div>
      </section>
      
      <footer className="py-8 border-t bg-background">
        <div className="container mx-auto text-center text-muted-foreground text-sm">
            <p>&copy; {new Date().getFullYear()} Contentographer AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
