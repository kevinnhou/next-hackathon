"use client";
import { Poppins } from "next/font/google";

import Providers from "~/providers";

import "@/app/globals.css";
import Image from "next/image";

import {
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  Navbar,
  NavbarButton,
  NavbarLogo,
  NavBody,
  NavItems,
} from "@/components/ui/nav";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";

import { useState } from "react";
import { CircleUserRound, LogOut, Settings, Users } from "lucide-react";

import { cn } from "@/lib/utils";

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
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const navItems = [
    {
      name: "Features",
      link: "#features",
    },
    {
      name: "Pricing",
      link: "#pricing",
    },
    {
      name: "Contact",
      link: "#contact",
    },
  ];
  const sidebarItems = [
    {
      label: "Groups",
      href: "/groups",
      icon: (
        <Users className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Profile",
      href: "/profile",
      icon: (
        <CircleUserRound className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Settings",
      href: "/settings",
      icon: (
        <Settings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Logout",
      href: "/logout",
      icon: (
        <LogOut className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];
  const loggedIn = true; // change when hook login done
  const [open, setOpen] = useState(false);
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
              loggedIn ? "lg:flex lg:h-screen lg:flex-row" : "relative",
            )}
          >
            {loggedIn ? (
              <Sidebar open={open} setOpen={setOpen}>
                <SidebarBody className="justify-between gap-10">
                  <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
                    {open ? (
                      <div className="flex flex-row items-center gap-2">
                        <Image
                          src="https://assets.aceternity.com/logo-dark.png"
                          alt="logo"
                          width={30}
                          height={30}
                        />
                        <span className="font-medium text-black dark:text-white">
                          Tavolo
                        </span>
                      </div>
                    ) : (
                      <Image
                        src="https://assets.aceternity.com/logo-dark.png"
                        alt="logo"
                        width={28}
                        height={28}
                      />
                    )}
                    <div className="mt-8 flex flex-col gap-2">
                      {sidebarItems.map((link, idx) => (
                        <SidebarLink key={idx} link={link} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <SidebarLink
                      link={{
                        label: "Username",
                        href: "#",
                        icon: (
                          <Image
                            src="https://assets.aceternity.com/profile.png"
                            className="h-7 w-7 shrink-0 rounded-full"
                            width={50}
                            height={50}
                            alt="Avatar"
                          />
                        ),
                      }}
                    />
                  </div>
                </SidebarBody>
              </Sidebar>
            ) : (
              <Navbar>
                {/* Desktop Navigation */}
                <NavBody>
                  <NavbarLogo />
                  <NavItems items={navItems} />
                  <div className="flex items-center gap-4">
                    <NavbarButton href="/login" variant="secondary">
                      Login
                    </NavbarButton>
                    <NavbarButton href="/create" variant="primary">
                      Create a Group
                    </NavbarButton>
                  </div>
                </NavBody>

                {/* Mobile Navigation */}
                <MobileNav>
                  <MobileNavHeader>
                    <NavbarLogo />
                    <MobileNavToggle
                      isOpen={isMobileNavOpen}
                      onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                    />
                  </MobileNavHeader>

                  <MobileNavMenu
                    isOpen={isMobileNavOpen}
                    onClose={() => setIsMobileNavOpen(false)}
                  >
                    {navItems.map((item, idx) => (
                      <a
                        key={`mobile-link-${idx}`}
                        href={item.link}
                        onClick={() => setIsMobileNavOpen(false)}
                        className="relative text-neutral-600 dark:text-neutral-300"
                      >
                        <span className="block">{item.name}</span>
                      </a>
                    ))}
                    <div className="flex w-full flex-col gap-4">
                      <NavbarButton
                        onClick={() => setIsMobileNavOpen(false)}
                        variant="primary"
                        className="w-full"
                      >
                        Login
                      </NavbarButton>
                      <NavbarButton
                        onClick={() => setIsMobileNavOpen(false)}
                        variant="primary"
                        className="w-full"
                      >
                        Book a call
                      </NavbarButton>
                    </div>
                  </MobileNavMenu>
                </MobileNav>
              </Navbar>
            )}
            <div className="w-full">{children}</div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
