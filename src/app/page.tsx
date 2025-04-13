import Link from "next/link";

import { navigationLinks } from "@/config/site";
import { Button } from "~/ui/button";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background via-muted/60 to-muted">
      <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        <div className="mx-auto mt-24 max-w-3xl space-y-12">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Find the Perfect Restaurant Together
          </h1>

          <p className="mx-auto max-w-xl text-lg">
            Create or join a group to discover and decide on restaurants that
            everyone will love.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/create">
              <Button size="lg" className="px-8 py-6 text-lg">
                Create Group
              </Button>
            </Link>
            <Link href="/join">
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg">
                Join Group
              </Button>
            </Link>
          </div>
          <div className="h-[1000px]">hello huzz</div>
        </div>
      </main>
    </div>
  );
}
