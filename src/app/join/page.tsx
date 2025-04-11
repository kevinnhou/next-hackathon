"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast, Toaster } from "sonner"; // Import from sonner instead of hooks

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function JoinGroupPage() {
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleJoinGroup = async () => {
    if (code.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    try {
      // Replace with actual API call to join group
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("You've joined the group successfully");

      // Navigate to group page
      router.push(`/group/${code}`);
      // eslint-disable-next-line ts/no-unused-vars
    } catch (error) {
      toast.error("Failed to join group. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Add Sonner Toaster component */}
      <Toaster position="top-center" />

      {/* Header with hamburger menu */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="mx-6 text-xl font-semibold">Join Group</h1>
        </div>
      </header>

      {/* Main content */}
      <main className="container py-8">
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Enter Group Code
            </CardTitle>
            <CardDescription className="text-center">
              Enter the 6-digit code provided by the group creator
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <InputOTP maxLength={6} value={code} onChange={setCode}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button
              className="w-full"
              onClick={handleJoinGroup}
              disabled={code.length !== 6 || isSubmitting}
            >
              {isSubmitting ? "Joining..." : "Join Group"}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/")}
            >
              Cancel
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
