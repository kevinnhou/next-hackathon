import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";
import Providers from "~/providers";

import "./globals.css";

const poppins = Poppins({
  display: "swap",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={poppins.className}
      dir="ltr"
      lang="en"
      suppressHydrationWarning
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
