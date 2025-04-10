"use client";

import { Locate, MapPin, Menu } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export default function GroupSettingsPage() {
  const [groupName, setGroupName] = useState("");
  const [budget, setBudget] = useState(150);
  const [radius, setRadius] = useState(5);
  const [locationType, setLocationType] = useState<"current" | "custom">(
    "custom",
  );
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null,
  );

  const handleLocationSelect = (type: "current" | "custom") => {
    setLocationType(type);

    if (type === "current") {
      // Simulate setting current location without actually using geolocation API
      // This avoids the permissions error in preview environments
      setLocation({ lat: 37.7749, lng: -122.4194 }); // Example coordinates (San Francisco)
    } else {
      // For custom location, we'd normally wait for map selection
      // For now, we'll simulate it
      setLocation({ lat: 40.7128, lng: -74.006 }); // Example coordinates (New York)
    }
  };

  const handleCreateGroup = () => {
    // Handle group creation logic here
    // Navigate to next page or show confirmation
  };

  return (
    <div className="min-h-screen w-full bg-background">
      {/* Header with hamburger menu */}
      <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center justify-between px-4 md:px-6">
          <h1 className="text-xl font-semibold">Group Settings</h1>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <Button variant="ghost" className="justify-start">
                  Home
                </Button>
                <Button variant="ghost" className="justify-start">
                  My Groups
                </Button>
                <Button variant="ghost" className="justify-start">
                  Profile
                </Button>
                <Button variant="ghost" className="justify-start">
                  Settings
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 lg:px-8">
        <Card className="mx-auto w-full max-w-4xl">
          <CardHeader>
            <CardTitle>Create Your Group</CardTitle>
            <CardDescription>
              Configure your group settings before creating it
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Group Name */}
            <div className="space-y-2">
              <Label htmlFor="group-name">Group Name</Label>
              <Input
                id="group-name"
                placeholder="Enter group name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </div>

            {/* Budget Slider */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="budget">Budget</Label>
                <span className="text-sm font-medium">${budget}</span>
              </div>
              <Slider
                id="budget"
                min={10}
                max={300}
                step={5}
                value={[budget]}
                onValueChange={(value) => setBudget(value[0])}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>$10</span>
                <span>$300</span>
              </div>
            </div>

            {/* Radius Slider */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="radius">Radius</Label>
                <span className="text-sm font-medium">{radius} km</span>
              </div>
              <Slider
                id="radius"
                min={1}
                max={25}
                step={1}
                value={[radius]}
                onValueChange={(value) => setRadius(value[0])}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1 km</span>
                <span>25 km</span>
              </div>
            </div>

            {/* Location Selection */}
            <div className="space-y-4">
              <Label>Location</Label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant={locationType === "current" ? "default" : "outline"}
                  className={cn(
                    "flex h-auto flex-col items-center justify-center border-2 py-6",
                    locationType === "current"
                      ? "border-primary"
                      : "border-transparent",
                  )}
                  onClick={() => handleLocationSelect("current")}
                >
                  <Locate className="mb-2 h-8 w-8" />
                  <span>Use Current Location</span>
                </Button>

                <Button
                  type="button"
                  variant={locationType === "custom" ? "default" : "outline"}
                  className={cn(
                    "flex h-auto flex-col items-center justify-center border-2 py-6",
                    locationType === "custom"
                      ? "border-primary"
                      : "border-transparent",
                  )}
                  onClick={() => handleLocationSelect("custom")}
                >
                  <MapPin className="mb-2 h-8 w-8" />
                  <span>Pick on Map</span>
                </Button>
              </div>

              {/* Map placeholder (only shown when custom location is selected) */}
              {locationType === "custom" && (
                <div className="mt-2">
                  <div className="flex h-[200px] flex-col items-center justify-center rounded-md border bg-muted/30 p-4">
                    <MapPin className="mb-2 h-8 w-8 text-muted-foreground" />
                    <p className="text-center text-sm text-muted-foreground">
                      Map placeholder - In a real app, this would be an
                      interactive map
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              size="lg"
              onClick={handleCreateGroup}
              disabled={!groupName.trim() || !location}
            >
              Create Group
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
