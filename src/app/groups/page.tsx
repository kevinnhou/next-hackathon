import { GroupCard } from "@/components/groups/card";
import { groups } from "@/data/groups";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function Groups() {
  return (
    <>
      <div className="mx-48 my-12">
        <div className="flex flex-row justify-between">
          <h1 className="text-4xl font-bold">My Groups</h1>
          <Button asChild>
            <Link href="/config">
              <Plus strokeWidth={3} />
              Create Group
            </Link>
          </Button>
        </div>
        <div className="my-2 grid grid-cols-2 gap-4">
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
