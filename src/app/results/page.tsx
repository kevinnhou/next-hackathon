/**
 * Results page component
 * Displays restaurant recommendations to the user
 */
import { Results } from "@/components/results";

export default function Home() {
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
