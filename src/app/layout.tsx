import "@/app/globals.css";

import { Poppins } from "next/font/google";
import type React from "react";

import checkUser from "@/hooks/check-user";
import { cn } from "@/lib/utils";
import Providers from "~/providers";
import Navigation from "~/ui/navigation";

const poppins = Poppins({
  display: "swap",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isLoggedIn = await checkUser();

  return (
    <html
      className={poppins.className}
      dir="ltr"
      lang="en"
      suppressHydrationWarning
    >
      <body>
        <Providers>
          <div
            className={cn(
              "w-full",
              isLoggedIn ? "lg:flex lg:h-screen lg:flex-row" : "relative",
            )}
          >
            <Navigation loggedIn={isLoggedIn} />
            <div className="w-full">{children}</div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
