import { Results } from "@/components/results/results";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <h1 className="mb-8 text-3xl font-bold">Top Picks</h1>
      <Results />
    </main>
  );
}
