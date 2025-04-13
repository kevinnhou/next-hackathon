import Link from "next/link";
import { signup } from "@/app/actions/auth";

import { Button } from "~/ui/button";
import { Input } from "~/ui/input";
import { Label } from "~/ui/label";

export default function RegisterPage() {
  return (
    <div className="container mx-auto flex h-screen w-full items-center justify-center">
      <div className="w-full max-w-2xl space-y-8 rounded-lg bg-background p-10 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Register</h1>
          <p className="text-muted-foreground">
            Create a new account to get started
          </p>
        </div>

        <form action={signup} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                className="h-12 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-base">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="h-12 text-base"
              />
            </div>
          </div>

          <Button type="submit" className="h-12 w-full text-base">
            Sign up
          </Button>

          <div className="text-center">
            <p className="text-base text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary underline underline-offset-4 hover:text-primary/90"
              >
                Log in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
