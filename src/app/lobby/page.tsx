"use client";

import { AnimatePresence, motion } from "framer-motion";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Mock data for demonstration
const mockUsers = [
  {
    id: 1,
    name: "Alex Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  { id: 2, name: "Jamie Smith", avatar: "/placeholder.svg?height=40&width=40" },
  {
    id: 3,
    name: "Taylor Brown",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    name: "Jordan Wilson",
    avatar: "/placeholder.svg?height=40&width=40",
  },
];

export default function GroupLobbyPage() {
  const router = useRouter();
  const [users, setUsers] = useState<
    Array<{ id: number; name: string; avatar: string }>
  >([]);
  const [isHost, setIsHost] = useState(true); // For demo purposes, set to true
  const [groupCode] = useState("XK42P9"); // Example group code

  // Simulate users joining over time
  useEffect(() => {
    const addUser = (index: number) => {
      if (index < mockUsers.length) {
        setUsers((prev) => [...prev, mockUsers[index]]);
        setTimeout(() => addUser(index + 1), 1500);
      }
    };

    // Start adding users after a short delay
    const timer = setTimeout(() => addUser(0), 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleStart = () => {
    // Navigate to the next page when the host starts the choosing process
    router.push("/choose");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/60 to-muted">
      <main className="container mx-auto flex max-w-md flex-col items-center px-4 py-8">
        <Card className="mb-8 w-full bg-white p-6 text-center shadow-md">
          <h2 className="mb-2 text-lg font-medium">Join Code</h2>
          <div className="flex items-center justify-center">
            <div className="rounded-lg bg-slate-100 px-6 py-3 text-4xl font-bold tracking-wider">
              {groupCode}
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-500">
            Share this code with friends to join your group
          </p>
        </Card>

        <div className="mb-8 w-full">
          <h2 className="mb-4 text-center text-xl font-semibold">
            Waiting for members ({users.length})
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <AnimatePresence>
              {users.map((user) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-3 rounded-lg bg-white p-4 shadow"
                >
                  <div className="rounded-full bg-slate-100 p-1">
                    <User className="h-6 w-6 text-slate-600" />
                  </div>
                  <span className="truncate font-medium">{user.name}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {users.length === 0 && (
            <div className="py-8 text-center text-slate-500">
              Waiting for people to join...
            </div>
          )}
        </div>

        {isHost && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="w-full"
          >
            <Button
              onClick={handleStart}
              className="w-full py-6 text-lg"
              disabled={users.length === 0}
            >
              Start Choosing
            </Button>
            <p className="mt-2 text-center text-sm text-slate-500">
              {users.length === 0
                ? "Wait for members to join before starting"
                : "Everyone ready? Let's go!"}
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
}
