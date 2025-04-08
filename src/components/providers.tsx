"use client";

import { ThemeProvider, useTheme } from "next-themes";
import type { ReactNode } from "react";
import { Toaster } from "sonner";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" disableTransitionOnChange enableSystem>
      <ToasterProvider />
      {children}
    </ThemeProvider>
  );
}

function ToasterProvider() {
  const { theme } = useTheme() as {
    theme: "dark" | "light" | "system";
  };
  return <Toaster position="bottom-center" richColors theme={theme} />;
}
