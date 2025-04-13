import { Plus } from "lucide-react";
import Link from "next/link";

import { GroupCard } from "@/components/groups/card";
import { Button } from "@/components/ui/button";
import { groups } from "@/data/groups";
import { redirect } from "next/navigation";
import checkUser from "@/hooks/check-user";

export default async function Groups() {
  const loggedIn = await checkUser();
  if (!loggedIn) {
    redirect("/login");
  }

  return (
    <>
      <div className="mx-4 my-12 lg:mx-48">
        <div className="flex flex-row justify-between">
          <h1 className="text-4xl font-bold">My Groups</h1>
          <Button asChild>
            <Link href="/create">
              <Plus strokeWidth={3} />
              Create Group
            </Link>
          </Button>
        </div>
        <div className="my-4 grid grid-cols-1 gap-4 lg:my-2 lg:grid-cols-2">
          {groups.map((group) => (
            <GroupCard
              key={group.id}
              name={group.name}
              budget={group.budget}
              radius={group.radius}
              location={group.location}
              users={group.users}
              active={group.active}
              date={group.createdAt}
            />
          ))}
        </div>
      </div>
    </>
  );
}
