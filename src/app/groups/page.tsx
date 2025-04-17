// src/app/groups/page.tsx
import { Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getUserGroups } from "../actions/groups";

import checkUser from "@/hooks/check-user";
import { GroupCard } from "~/groups/card";
import { Button } from "~/ui/button";

interface Group {
  id: string;
  name: string;
  budget: number;
  radius: number;
  location: { lat: number; lng: number } | null;
  users: number;
  active: boolean;
  createdAt: Date;
}

export default async function Groups() {
  const loggedIn = await checkUser();
  if (!loggedIn) {
    redirect("/login");
  }

  const groups = (await getUserGroups()) as Group[];

  return (
    <div className="mx-4 my-12 max-w-5xl lg:mx-auto">
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
            id={group.id}
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
  );
}
