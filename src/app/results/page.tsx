/**
 * Results page component
 * Displays restaurant recommendations to the user
 */
"use client";

import JsConfetti from "js-confetti";
import { useEffect } from "react";

import { Results } from "@/components/result_page/results";

export default function Home() {
  useEffect(() => {
    const confetti = new JsConfetti();
    confetti.addConfetti();
  }, []);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-8">
      <div className="mx-auto w-full max-w-md">
        <h1 className="mb-8 text-center text-3xl font-bold">Top Picks</h1>
        {/* Results component displays restaurant recommendations */}
        <Results />
      </div>
    </main>
  );
}
