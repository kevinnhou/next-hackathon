"use client";

import { ArrowRight, SlidersHorizontal, User } from "lucide-react";
import Link from "next/link";
import type React from "react";

import { Button } from "~/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/ui/card";

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
      <Card className="relative inline-flex h-full grow flex-col overflow-hidden rounded-xl border-0 bg-card p-[1px]">
        <span className="absolute inset-[-1000%] animate-[spin_5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#34D399_0%,#ffffff_50%,#34D399_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,#34D399_0%,#000000_50%,#34D399_100%)]" />
        <span className="flex h-full w-full flex-col rounded-xl bg-card py-4 text-card-foreground backdrop-blur-3xl">
          <CardHeader className="flex flex-row justify-between">
            <CardTitle className="text-2xl font-bold">{name}</CardTitle>
            <Button
              asChild
              className="bg-emerald-500 text-card-foreground hover:bg-emerald-600"
            >
              <Link href="/create">
                <User strokeWidth={3} />
                {users} members
              </Link>
            </Button>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-foreground/40">${budget} budget</p>
            <p className="text-sm text-foreground/40">
              {location} - {radius}km
            </p>
            <p className="text-sm text-foreground/40">
              {date.toLocaleDateString()}
            </p>
          </CardContent>
        </span>
      </Card>
    );
  }
  return (
    <Card className="flex flex-col rounded-xl border bg-card p-[1px]">
      <div className="py-4">
        <CardHeader className="flex flex-row justify-between">
          <CardTitle className="text-2xl font-bold">{name}</CardTitle>
          <div className="flex gap-2">
            <Button asChild variant="secondary" size="icon">
              <Link href="/create">
                <SlidersHorizontal strokeWidth={2} />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="icon">
              <Link href="/results">
                <ArrowRight strokeWidth={2} />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground/40">{users} members</p>
          <p className="text-sm text-foreground/40">${budget} budget</p>
          <p className="text-sm text-foreground/40">
            {location} - {radius}km
          </p>
          <p className="text-sm text-foreground/40">
            {date.toLocaleDateString()}
          </p>
        </CardContent>
      </div>
    </Card>
  );
}
