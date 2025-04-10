"use client";
import { MapPin, Star, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

/**
 * Restaurant interface defining the structure of restaurant data
 */
interface Restaurant {
  id: number;
  name: string;
  cuisine: string;
  rating: number;
  votes: number;
  distance: string;
  image: string;
  priceRange: string;
}

/**
 * Props for the RestaurantCard component
 */
interface RestaurantCardProps {
  restaurant: Restaurant;
  position: number; // Position in the list (1st, 2nd, 3rd)
  onVeto: (id: number) => void; // Callback function when restaurant is vetoed
}

/**
 * RestaurantCard component displays information about a restaurant
 * and allows users to veto it from consideration
 */
export function RestaurantCard({
  restaurant,
  position,
  onVeto,
}: RestaurantCardProps) {
  // State to track if the veto button is being hovered
  const [isVetoHovered, setIsVetoHovered] = useState(false);

  // Color mapping for different positions
  const positionColors = {
    1: "bg-amber-100 border-amber-300 text-amber-800",
    2: "bg-slate-100 border-slate-300 text-slate-800",
    3: "bg-orange-100 border-orange-300 text-orange-800",
  };

  // Label mapping for different positions
  const positionLabels = {
    1: "1st Choice",
    2: "2nd Choice",
    3: "3rd Choice",
  };

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <div className="relative">
        {/* Position badge */}
        <div className="absolute top-2 left-2 z-10">
          <Badge
            className={`${positionColors[position as keyof typeof positionColors]} px-3 py-1 text-xs font-semibold`}
          >
            {positionLabels[position as keyof typeof positionLabels]}
          </Badge>
        </div>

        {/* Veto button */}
        <div className="absolute top-2 right-2 z-10">
          <Button
            variant="destructive"
            size="icon"
            className={`h-8 w-8 rounded-full transition-opacity ${isVetoHovered ? "opacity-100" : "opacity-70"}`}
            onClick={() => onVeto(restaurant.id)}
            onMouseEnter={() => setIsVetoHovered(true)}
            onMouseLeave={() => setIsVetoHovered(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Veto {restaurant.name}</span>
          </Button>
        </div>

        {/* Restaurant image */}
        <div className="relative h-48 w-full">
          <Image
            src={restaurant.image || "/placeholder.svg"}
            alt={restaurant.name}
            fill
            className="object-cover"
            priority={position === 1}
          />
        </div>
      </div>

      {/* Restaurant details */}
      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between">
          <h3 className="text-lg font-bold">{restaurant.name}</h3>
          <div className="flex items-center">
            <Star className="mr-1 h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium">{restaurant.rating}</span>
            <span className="ml-1 text-xs text-muted-foreground">
              ({restaurant.votes})
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {restaurant.cuisine}
          </div>
          <div className="text-sm font-medium">{restaurant.priceRange}</div>
        </div>
      </CardContent>

      {/* Restaurant footer with distance and action button */}
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="mr-1 h-3 w-3" />
          {restaurant.distance}
        </div>
        <Button variant="outline" size="sm">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
