"use client";

import Link from "next/link";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";

import { login } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.email || !formData.password) {
        toast.error("Please fill in all fields");
        setIsLoading(false);
        return;
      }

      const data = new FormData();
      data.append("email", formData.email);
      data.append("password", formData.password);

      const result = await login(data);

      if (result?.error) {
        toast.error("Login failed");
      }
      // eslint-disable-next-line ts/no-unused-vars
    } catch (error) {
      toast.error("Please try again later");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-8rem)] w-full items-center justify-center">
      <div className="w-full max-w-2xl space-y-8 rounded-lg bg-background p-10 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Login</h1>
          <p className="text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
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
                value={formData.password}
                onChange={handleChange}
                required
                className="h-12 text-base"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="h-12 w-full text-base"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Log in"}
          </Button>

          <div className="text-center">
            <p className="text-base text-muted-foreground">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-primary underline underline-offset-4 hover:text-primary/90"
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
