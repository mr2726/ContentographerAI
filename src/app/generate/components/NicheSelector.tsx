"use client";

import {
  Camera,
  Heart,
  Shirt,
  Utensils,
  Video,
  Grape,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const niches = [
  { name: "Food Photographer", icon: Utensils, key: "food" },
  { name: "Lifestyle / Portrait", icon: Camera, key: "lifestyle" },
  { name: "Wedding Photographer", icon: Heart, key: "wedding" },
  { name: "Videographer", icon: Video, key: "Videographer" },
  { name: "Fashion Photographer", icon: Shirt, key: "fashion" },
  { name: "Product Photographer", icon: Grape, key: "product" },
];

type NicheSelectorProps = {
  onNicheSelect: (niche: string) => void;
};

export default function NicheSelector({ onNicheSelect }: NicheSelectorProps) {
  return (
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-3xl md:text-4xl font-bold font-headline mb-4">
        Choose Your Niche
      </h1>
      <p className="text-muted-foreground text-lg mb-12">
        Select your area of expertise to get tailored content ideas.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {niches.map((niche) => (
          <Card
            key={niche.key}
            onClick={() => onNicheSelect(niche.name)}
            className="group cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-transform duration-300 ease-in-out hover:border-primary"
          >
            <CardHeader>
              <niche.icon className="w-16 h-16 mx-auto text-primary group-hover:scale-110 transition-transform" />
            </CardHeader>
            <CardContent>
              <CardTitle className="text-xl font-headline">
                {niche.name}
              </CardTitle>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
