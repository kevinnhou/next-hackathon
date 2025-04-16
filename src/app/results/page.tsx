import { Results } from "@/components/results/results";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 pb-12">
      <h1 className="mt-6 mb-8 text-3xl font-bold">Voting Results</h1>
      <Results />
    </main>
  );
}
