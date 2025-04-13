"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "~/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "~/ui/input-otp";

export default function Join() {
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function handleJoinGroup() {
    if (code.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    setIsSubmitting(true);

    try {
      toast.success("You've joined the group successfully");
      router.push(`/group/${code}`);
      // eslint-disable-next-line ts/no-unused-vars
    } catch (error) {
      toast.error("Failed to join group. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">Enter Group Code</h1>
          <p className="text-muted-foreground">
            Enter the 6-digit code provided by the group creator
          </p>
        </div>

        <div className="flex justify-center py-6">
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

        <div className="space-y-3">
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
        </div>
      </div>
    </div>
  );
}
