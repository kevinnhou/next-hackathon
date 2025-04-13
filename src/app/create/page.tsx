"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Locate, MapPin } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { submit } from "@/app/actions/submit";
import type { FormValues } from "@/lib/schema";
import { formSchema } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { Button } from "~/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/ui/form";
import { Input } from "~/ui/input";
import { Slider } from "~/ui/slider";
import { redirect } from "next/navigation";
import checkUser from "@/hooks/check-user";

export default function Create() {
  //const loggedIn = await checkUser();
  const loggedIn = false;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      groupName: "",
      budget: 150,
      radius: 5,
      locationType: "custom",
      location: { lat: 40.7128, lng: -74.006 }, // Default to New York
    },
  });

  function handleLocationSelect(type: "current" | "custom") {
    form.setValue("locationType", type);

    if (type === "current") {
      form.setValue("location", { lat: 37.7749, lng: -122.4194 }); // San Francisco
    } else {
      form.setValue("location", { lat: 40.7128, lng: -74.006 }); // New York
    }
  }

  async function onSubmit(data: FormValues) {
    try {
      setIsSubmitting(true);
      const result = await submit(data);

      if (result.success) {
        toast.success(result.message);
        // router.push("/groups")
        if (!loggedIn) {
          redirect("/login");
        } else {
          redirect("/groups");
        }
      } else {
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, errors]) => {
            if (errors && errors.length > 0) {
              form.setError(field as any, {
                type: "server",
                message: errors[0],
              });
            }
          });
        }

        toast.error("An error occurred while creating the group.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-background">
      <main className="mx-auto w-full max-w-2xl px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">Create Your Group</h2>
          <p className="text-muted-foreground">Configure your group settings</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="groupName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter group name"
                      {...field}
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Budget</FormLabel>
                    <span className="text-sm font-medium">${field.value}</span>
                  </div>
                  <FormControl>
                    <Slider
                      min={10}
                      max={300}
                      step={5}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  </FormControl>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>$10</span>
                    <span>$300</span>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="radius"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Radius</FormLabel>
                    <span className="text-sm font-medium">
                      {field.value} km
                    </span>
                  </div>
                  <FormControl>
                    <Slider
                      min={1}
                      max={25}
                      step={1}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  </FormControl>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1 km</span>
                    <span>25 km</span>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="locationType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <div className="mt-2 grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "flex h-auto flex-col items-center justify-center border py-3",
                        field.value === "current"
                          ? "border-primary bg-primary/10"
                          : "",
                      )}
                      onClick={() => handleLocationSelect("current")}
                    >
                      <Locate className="mb-1 h-5 w-5" />
                      <span className="text-sm">Current Location</span>
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "flex h-auto flex-col items-center justify-center border py-3",
                        field.value === "custom"
                          ? "border-primary bg-primary/10"
                          : "",
                      )}
                      onClick={() => handleLocationSelect("custom")}
                    >
                      <MapPin className="mb-1 h-5 w-5" />
                      <span className="text-sm">Pick on Map</span>
                    </Button>
                  </div>

                  {field.value === "custom" && (
                    <div className="mt-3 flex h-[120px] items-center justify-center rounded-md border bg-muted/20">
                      <MapPin className="mr-2 h-5 w-5 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Map placeholder
                      </p>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full"
                disabled={!form.formState.isValid || isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Group"}
              </Button>
            </div>
          </form>
        </Form>
      </main>
    </div>
  );
}
