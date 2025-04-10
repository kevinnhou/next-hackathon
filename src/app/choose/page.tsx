"use client";

import { restaurants } from "@/data/restaurants";
import { SwipeCards } from "~/swipe/stacked";

export default function Swipe() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <SwipeCards restaurants={restaurants} />
    </div>
  );
}
