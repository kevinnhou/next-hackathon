"use client";

import { Star } from "lucide-react";
import type React from "react";

import { cn } from "@/lib/utils";

interface GroupCardProps {
  name: string;
  budget: number;
  radius: number;
  location: string;
  users: number;
  active: boolean;
  date: Date;
}

export function GroupCard({
  name,
  budget,
  radius,
  location,
  users,
  active,
  date,
}: GroupCardProps) {
  return (
    <div className="flex flex-col rounded-xl border border-neutral-800 bg-neutral-900 p-4">
      <h2 className="text-2xl font-bold">{name}</h2>
      <p className="text-sm text-foreground/40">{users} members</p>
      <p className="text-sm text-foreground/40">${budget} budget</p>
      <p className="text-sm text-foreground/40">
        {location} - {radius}km
      </p>
    </div>
  );
}
