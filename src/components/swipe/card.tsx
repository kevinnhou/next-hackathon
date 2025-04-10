"use client";

import { Star } from "lucide-react";
import type React from "react";

import { cn } from "@/lib/utils";

interface RestaurantCardProps {
  className?: string;
  name: string;
  address: string;
  phoneNumber: string;
  openingHours: string;
  photos: string[];
  rating: number;
  reviews: number;
  children?: React.ReactNode;
}

export function Card({
  className,
  name,
  address,
  phoneNumber,
  openingHours,
  photos,
  rating,
  reviews,
  children,
}: RestaurantCardProps) {
  return (
    <div
      className={cn(
        "h-[450px] w-[350px] overflow-hidden rounded-2xl border border-foreground/80 bg-background shadow-[0_0_10px_rgba(0,0,0,0.08)]",
        className,
      )}
    >
      {photos && photos.length > 0 && (
        <div className="relative mx-2 mt-2 h-72 w-[calc(100%-1rem)] overflow-hidden rounded-xl shadow-lg">
          <img
            src={photos[0]}
            alt={name}
            className="pointer-events-none mt-0 h-full w-full object-cover"
          />
        </div>
      )}
      <div className="flex flex-col gap-y-2 p-2 px-4">
        <div className="flex items-start justify-between">
          <h2 className="truncate text-lg font-semibold text-foreground">
            {name}
          </h2>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{rating}</span>
            <span className="text-xs text-foreground">({reviews})</span>
          </div>
        </div>
        <p className="truncate text-xs text-foreground/40">{address}</p>
        <p className="text-xs text-foreground/40">{phoneNumber}</p>
        <p className="text-xs text-foreground/40">{openingHours}</p>
        {children}
      </div>
    </div>
  );
}
