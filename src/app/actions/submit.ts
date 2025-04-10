"use server";

import type { FormValues } from "@/lib/schema";
import { formSchema } from "@/lib/schema";

export async function submit(formData: FormValues) {
  const result = formSchema.safeParse(formData);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  // eslint-disable-next-line no-console
  console.info("Processing group settings:", result.data);

  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    success: true,
    message: "Created successfully!",
  };
}
