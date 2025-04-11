"use client";

import { Button } from "@/components/ui/button";
import { User, SlidersHorizontal } from "lucide-react";
import type React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Slider } from "@radix-ui/react-slider";

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
  if (active) {
    return (
      <div className="relative inline-flex h-full flex-col overflow-hidden rounded-xl bg-neutral-900 p-[1px] focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 focus:outline-none">
        <span className="absolute inset-[-1000%] animate-[spin_5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#34D399_0%,#000000_50%,#34D399_100%)]" />
        <span className="flex h-full w-full flex-col rounded-xl bg-neutral-900 p-4 text-white backdrop-blur-3xl">
          <div className="flex flex-row justify-between">
            <h2 className="text-2xl font-bold">{name}</h2>
            <Button
              asChild
              className="bg-emerald-500 text-white hover:bg-emerald-600"
            >
              <Link href="/choose">
                <User strokeWidth={3} />
                {users} members
              </Link>
            </Button>
          </div>

          <p className="text-sm text-foreground/40">${budget} budget</p>
          <p className="text-sm text-foreground/40">
            {location} - {radius}km
          </p>
          <p className="text-sm text-foreground/40">
            {date.toLocaleDateString()}
          </p>
        </span>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col rounded-xl border border-neutral-800 bg-neutral-900 p-4">
        <div className="flex flex-row justify-between">
          <h2 className="text-2xl font-bold">{name}</h2>
          <Button variant="ghost" size="icon">
            <SlidersHorizontal strokeWidth={2} />
          </Button>
        </div>
        {/*<p className="text-sm text-foreground/40">{users} members</p>*/}
        <p className="text-sm text-foreground/40">${budget} budget</p>
        <p className="text-sm text-foreground/40">
          {location} - {radius}km
        </p>
        <p className="text-sm text-foreground/40">
          {date.toLocaleDateString()}
        </p>
      </div>
    );
  }
}
