"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { restaurants } from "@/data/restaurants";
import { cn } from "@/lib/utils";

export function Results() {
  const [vetoed, setVetoed] = useState<string[]>([]);

  // Get top 3 restaurants that haven't been vetoed
  const topThree = restaurants
    .filter((restaurant: any) => !vetoed.includes(restaurant.id))
    .slice(0, 3);

  const handleVeto = (id: string) => {
    setVetoed((prev) => [...prev, id]);
  };

  const resetResults = () => {
    setVetoed([]);
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="grid gap-6">
        <AnimatePresence mode="popLayout">
          {topThree.map((restaurant: any, index: number) => (
            <motion.div
              key={restaurant.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{
                opacity: 0,
                x: -300,
                transition: { duration: 0.3 },
              }}
              layout
              layoutId={restaurant.id}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                opacity: { duration: 0.2 },
              }}
            >
              <ResultCard
                restaurant={restaurant}
                position={index + 1}
                onVeto={() => handleVeto(restaurant.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {vetoed.length > 0 && (
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button onClick={resetResults} variant="outline">
              Reset Results
            </Button>
          </motion.div>
        </motion.div>
      )}

      {vetoed.length > 0 && topThree.length === 0 && (
        <motion.div
          className="mt-8 rounded-lg border p-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-lg text-muted-foreground">
            You've vetoed all available options. Reset to see results again.
          </p>
        </motion.div>
      )}
    </div>
  );
}

interface ResultCardProps {
  restaurant: any; // Using 'any' to accommodate your existing data structure
  position: number;
  onVeto: () => void;
}

function ResultCard({ restaurant, position, onVeto }: ResultCardProps) {
  const positionColors = {
    1: "bg-amber-100 border-amber-200 dark:bg-amber-950 dark:border-amber-900",
    2: "bg-slate-100 border-slate-200 dark:bg-slate-900 dark:border-slate-800",
    3: "bg-orange-100 border-orange-200 dark:bg-orange-950 dark:border-orange-900",
  };

  const positionLabels = {
    1: "🥇 First Choice",
    2: "🥈 Second Choice",
    3: "🥉 Third Choice",
  };

  return (
    <Card
      className={cn(
        "overflow-hidden border-2",
        positionColors[position as keyof typeof positionColors],
      )}
    >
      <div className="relative">
        <img
          src={restaurant.imageUrl || "/placeholder.svg"}
          alt={restaurant.name}
          className="h-48 w-full object-cover"
        />
        <motion.div
          className="absolute top-2 right-2"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            variant="destructive"
            size="icon"
            onClick={onVeto}
            aria-label={`Veto ${restaurant.name}`}
          >
            <X className="h-4 w-4" />
          </Button>
        </motion.div>
        <motion.div
          className="absolute top-2 left-2 rounded-full bg-black/70 px-3 py-1 text-sm font-medium text-white"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {positionLabels[position as keyof typeof positionLabels]}
        </motion.div>
      </div>
      <CardContent className="p-4">
        <h2 className="text-xl font-bold">{restaurant.name}</h2>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {restaurant.cuisine}
          </span>
          <span className="text-sm font-medium">⭐ {restaurant.rating}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-4 pt-0">
        <span className="text-sm text-muted-foreground">
          {restaurant.votes} votes
        </span>
        <span className="text-sm text-muted-foreground">
          {restaurant.distance}
        </span>
      </CardFooter>
    </Card>
  );
}
