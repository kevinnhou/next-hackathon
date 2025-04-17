"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { restaurants } from "@/data/restaurants"; // Import from your existing file
import { cn } from "@/lib/utils";

export function Results() {
  const [vetoed, setVetoed] = useState<string[]>([]);
  const [chosenRestaurant, setChosenRestaurant] = useState<any | null>(null);

  // Get top 3 restaurants that haven't been vetoed
  const topThree = restaurants
    .filter((restaurant: any) => !vetoed.includes(restaurant.id))
    .slice(0, 3);

  // Get remaining restaurants (not in top 3 and not vetoed)
  const remainingRestaurants = restaurants.filter(
    (restaurant) =>
      !topThree.some((top) => top.id === restaurant.id) &&
      !vetoed.includes(restaurant.id),
  );

  const handleVeto = (id: string) => {
    setVetoed((prev) => {
      // If the ID is already in the vetoed list, remove it (unveto)
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      // Otherwise, add it to the vetoed list
      return [...prev, id];
    });
  };

  const handleChoose = (restaurant: any) => {
    setChosenRestaurant(restaurant);
  };

  const resetResults = () => {
    setVetoed([]);
    setChosenRestaurant(null);
  };

  const goBack = () => {
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
                src={chosenRestaurant.imageUrl || "/sample.webp"}
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
    <div className="mx-auto w-full max-w-5xl">
      {/* Podium Title */}
      <div className="mb-8 text-center">
        <p className="text-muted-foreground">
          Choose your favorite or veto to see more options
        </p>
      </div>

      {/* Podium layout */}
      <div className="flex w-full flex-col items-center">
        {/* Desktop Podium */}
        <div className="hidden w-full items-end justify-center sm:flex">
          {/* Second Place */}
          <div
            className="mx-4 flex flex-col items-center"
            style={{ width: "300px" }}
          >
            <AnimatePresence mode="wait">
              {topThree[1] && (
                <motion.div
                  key={topThree[1].id}
                  className="mb-2 w-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: 0.1 }}
                >
                  <ResultCard
                    restaurant={topThree[1]}
                    position={2}
                    onVeto={() => handleVeto(topThree[1].id)}
                    onChoose={() => handleChoose(topThree[1])}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <div className="h-20 w-full rounded-t-lg bg-slate-400"></div>
          </div>

          {/* First Place */}
          <div
            className="z-10 mx-4 flex flex-col items-center"
            style={{ width: "300px" }}
          >
            <AnimatePresence mode="wait">
              {topThree[0] && (
                <motion.div
                  key={topThree[0].id}
                  className="mb-2 w-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                >
                  <ResultCard
                    restaurant={topThree[0]}
                    position={1}
                    onVeto={() => handleVeto(topThree[0].id)}
                    onChoose={() => handleChoose(topThree[0])}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <div className="h-30 w-full rounded-t-lg bg-amber-500"></div>
          </div>

          {/* Third Place */}
          <div
            className="mx-4 flex flex-col items-center"
            style={{ width: "300px" }}
          >
            <AnimatePresence mode="wait">
              {topThree[2] && (
                <motion.div
                  key={topThree[2].id}
                  className="mb-2 w-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: 0.2 }}
                >
                  <ResultCard
                    restaurant={topThree[2]}
                    position={3}
                    onVeto={() => handleVeto(topThree[2].id)}
                    onChoose={() => handleChoose(topThree[2])}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <div className="h-10 w-full rounded-t-lg bg-orange-400"></div>
          </div>
        </div>

        {/* Mobile view - stacked cards */}
        <div className="mb-8 w-full space-y-6 sm:hidden">
          {topThree.map((restaurant: any, index: number) => (
            <motion.div
              key={`mobile-${restaurant.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ResultCard
                restaurant={restaurant}
                position={index + 1}
                onVeto={() => handleVeto(restaurant.id)}
                onChoose={() => handleChoose(restaurant)}
              />
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="my-12 w-full border-t" />

        {/* All other restaurants */}
        <div className="hidden w-full sm:block">
          <h3 className="mb-4 text-xl font-semibold">All Restaurants</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {remainingRestaurants.map((restaurant) => (
              <motion.div
                key={restaurant.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <RestaurantListItem
                  restaurant={restaurant}
                  onVeto={() => handleVeto(restaurant.id)}
                  onChoose={() => handleChoose(restaurant)}
                />
              </motion.div>
            ))}
            {vetoed.length > 0 && (
              <div className="col-span-1 mt-4 md:col-span-2">
                <h4 className="mb-2 text-lg font-medium">Vetoed Restaurants</h4>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {restaurants
                    .filter((restaurant) => vetoed.includes(restaurant.id))
                    .map((restaurant) => (
                      <motion.div
                        key={`vetoed-${restaurant.id}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <RestaurantListItem
                          restaurant={restaurant}
                          isVetoed={true}
                          onVeto={() => handleVeto(restaurant.id)}
                          onChoose={() => handleChoose(restaurant)}
                        />
                      </motion.div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reset Button */}
        {vetoed.length > 0 && (
          <motion.div
            className="mt-4 text-center"
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

        {/* No results message */}
        {vetoed.length > 0 && topThree.length === 0 && (
          <motion.div
            className="mt-8 w-full max-w-md rounded-lg border p-8 text-center"
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
    </div>
  );
}

interface ResultCardProps {
  restaurant: any;
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
    1: "bg-amber-100 border-amber-300 dark:bg-amber-950 dark:border-amber-800",
    2: "bg-slate-100 border-slate-300 dark:bg-slate-900 dark:border-slate-700",
    3: "bg-orange-100 border-orange-300 dark:bg-orange-950 dark:border-orange-800",
  };

  const positionLabels = {
    1: "🥇 First Place",
    2: "🥈 Second Place",
    3: "🥉 Third Place",
  };

  return (
    <Card
      className={cn(
        "overflow-hidden border-2 shadow-lg",
        positionColors[position as keyof typeof positionColors],
      )}
    >
      <div className="relative">
        <img
          src={restaurant.imageUrl || "/sample.webp"}
          alt={restaurant.name}
          className="h-48 w-full object-cover"
        />
        <div className="absolute top-2 right-2 flex gap-2">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="destructive"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onVeto();
              }}
              aria-label={`Veto ${restaurant.name}`}
            >
              <X className="h-4 w-4" />
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="default"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onChoose();
              }}
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

interface RestaurantListItemProps {
  restaurant: any;
  isVetoed?: boolean;
  onVeto?: () => void;
  onChoose: () => void;
}

function RestaurantListItem({
  restaurant,
  isVetoed = false,
  onVeto,
  onChoose,
}: RestaurantListItemProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border p-3",
        isVetoed
          ? "border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900"
          : "",
      )}
    >
      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
        <img
          src={restaurant.imageUrl || "/placeholder.svg"}
          alt={restaurant.name}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="min-w-0 flex-grow">
        <h3 className="truncate font-medium">{restaurant.name}</h3>
        <div className="flex items-center text-sm text-muted-foreground">
          <span className="truncate">{restaurant.cuisine}</span>
          <span className="mx-1">•</span>
          <span>⭐ {restaurant.rating}</span>
          <span className="mx-1">•</span>
          <span>{restaurant.distance}</span>
        </div>
      </div>
      <div className="flex flex-shrink-0 gap-2">
        {/* Veto and Choose Button - only show if the restaurant is not vetoed */}
        {!isVetoed && onVeto && (
          <>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="destructive"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onVeto();
                }}
                aria-label={`Veto ${restaurant.name}`}
                className="h-8 w-8"
              >
                <X className="h-3 w-3" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="default"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onChoose();
                }}
                className={cn("h-8 w-8", "bg-green-600 hover:bg-green-700")}
                aria-label={`Choose ${restaurant.name}`}
              >
                <Check className="h-3 w-3" />
              </Button>
            </motion.div>
          </>
        )}
        {/* Unveto Button - only show if the restaurant is vetoed */}
        {isVetoed && (
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="default"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                if (onVeto) {
                  onVeto();
                }
              }}
              className="h-8 w-8 bg-blue-500 hover:bg-blue-600"
              aria-label={`Unveto ${restaurant.name}`}
            >
              <ArrowLeft className="h-3 w-3" />
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
