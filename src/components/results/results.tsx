"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, X } from "lucide-react";
import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { restaurants } from "@/data/restaurants"; // Import from your existing file
import { cn } from "@/lib/utils";

export function Results() {
  const [vetoed, setVetoed] = useState<string[]>([]);
  const [chosenRestaurant, setChosenRestaurant] = useState<any | null>(null);
  const [restaurantToConfirm, setRestaurantToConfirm] = useState<any | null>(
    null,
  );

  // Get top 3 restaurants that haven't been vetoed
  const topThree = restaurants
    .filter((restaurant) => !vetoed.includes(restaurant.id))
    .slice(0, 3);

  const handleVeto = (id: string) => {
    setVetoed((prev) => [...prev, id]);
  };

  const handleChoose = (restaurant: any) => {
    setRestaurantToConfirm(restaurant);
  };

  const confirmChoice = () => {
    setChosenRestaurant(restaurantToConfirm);
    setRestaurantToConfirm(null);
  };

  const resetResults = () => {
    setVetoed([]);
    setChosenRestaurant(null);
  };

  const goBack = () => {
    // Not sure if we should have this in the Database Implementation - confirm later.
    setChosenRestaurant(null);
  };

  // If a restaurant has been chosen, show the final result
  if (chosenRestaurant) {
    return (
      <div className="mx-auto w-full max-w-3xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <div className="mb-4 flex items-center">
            <motion.div whileHover={{ x: -3 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={goBack}
                className="mr-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </motion.div>
            <h2 className="text-2xl font-bold">Final Decision</h2>
          </div>

          <Card className="overflow-hidden border-2 border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
            <div className="relative">
              <img
                src={chosenRestaurant.imageUrl || "/placeholder.svg"}
                alt={chosenRestaurant.name}
                className="h-64 w-full object-cover"
              />
              <div className="absolute top-0 right-0 bottom-0 left-0 bg-gradient-to-t from-black/60 to-transparent" />
              <motion.div
                className="absolute top-4 left-4 flex items-center gap-1 rounded-full bg-green-500 px-4 py-2 text-sm font-medium text-white"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Check className="h-4 w-4" /> Final Choice
              </motion.div>
            </div>
            <CardContent className="p-6">
              <h2 className="mb-2 text-2xl font-bold">
                {chosenRestaurant.name}
              </h2>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cuisine:</span>
                  <span className="font-medium">
                    {chosenRestaurant.cuisine}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rating:</span>
                  <span className="font-medium">
                    ⭐ {chosenRestaurant.rating}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Votes:</span>
                  <span className="font-medium">{chosenRestaurant.votes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Distance:</span>
                  <span className="font-medium">
                    {chosenRestaurant.distance}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center p-6 pt-0">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button onClick={resetResults} variant="outline">
                  Start Over
                </Button>
              </motion.div>
            </CardFooter>
          </Card>

          <motion.div
            className="mt-6 text-center text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Enjoy your meal at {chosenRestaurant.name}!
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="grid gap-6">
        <AnimatePresence mode="popLayout">
          {topThree.map((restaurant, index) => (
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
                onChoose={() => handleChoose(restaurant)}
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

      {/* Confirmation Dialog */}
      <AlertDialog
        open={!!restaurantToConfirm}
        onOpenChange={(open) => !open && setRestaurantToConfirm(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Your Choice</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to choose {restaurantToConfirm?.name}? This
              will be your final decision.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmChoice}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

interface ResultCardProps {
  restaurant: any; // Using 'any' to accommodate your existing data structure
  position: number;
  onVeto: () => void;
  onChoose: () => void;
}

function ResultCard({
  restaurant,
  position,
  onVeto,
  onChoose,
}: ResultCardProps) {
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
        <div className="absolute top-2 right-2 flex gap-2">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="destructive"
              size="icon"
              onClick={onVeto}
              aria-label={`Veto ${restaurant.name}`}
            >
              <X className="h-4 w-4" />
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="default"
              size="icon"
              onClick={onChoose}
              className="bg-green-600 hover:bg-green-700"
              aria-label={`Choose ${restaurant.name}`}
            >
              <Check className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
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
