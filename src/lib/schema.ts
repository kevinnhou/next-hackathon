import { z } from "zod";

export const formSchema = z.object({
  groupName: z.string().min(1, "Group name is required"),
  budget: z.number().min(10).max(300),
  radius: z.number().min(1).max(25),
  locationType: z.enum(["current", "custom"]),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
});

export type FormValues = z.infer<typeof formSchema>;
