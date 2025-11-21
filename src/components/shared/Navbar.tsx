"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { ModeToggle } from "../theme/theme-btn";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import UserProfileDropdown from "../module/auth/UserProfileDropdown";
import Image from "next/image";
// import LogoImg from "@/assets/images/EcobitLogo.png"

export default function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/inventory", label: "Inventory" },
    { href: "/resources", label: "Resources" },
    {
      href: "/nourishbot",
      label: "NourishBot",
    },
    {
      href: "/risk",
      label: "InventoryRisk",
    },
    {
      href: "/scan",
      label: "Scanning",
    },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <header className="w-full border-b dark:bg-background sticky top-0 z-50 bg-green-50">
      {/* <LoadingBar color="#933ce6" progress={progress} onLoaderFinished={() => setProgress(0)} /> */}
      <nav className="max-w-7xl mx-auto flex justify-between items-center px-4 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center ">
          <Image
            src="https://i.ibb.co/6d5BnPb/Ecobit-Logo.png"
            alt="Logo"
            width={40}
            height={40}
          />
          <span className="text-xl font-extrabold tracking-tight">EcoBite</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-transform duration-200 ${
                isActive(link.href)
                  ? "font-semibold text-primary border-b-2 border-primary pb-1 scale-105"
                  : "hover:scale-105 hover:font-semibold"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {session?.user ? (
            <UserProfileDropdown session={session} />
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/register">Sign Up</Link>
              </Button>
            </div>
          )}

          <ModeToggle />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {/* Mobile Sheet Menu */}
      <div className="md:hidden flex items-center px-4 pb-2">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <div />
          </SheetTrigger>

          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle className="font-bold my-2">EcoBite Menu</SheetTitle>
            </SheetHeader>

            <div className="flex flex-col gap-4 mt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${
                    isActive(link.href)
                      ? "text-primary font-semibold"
                      : "hover:text-primary"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {session?.user ? (
                <UserProfileDropdown session={session} />
              ) : (
                <div className="flex flex-col gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    asChild
                  >
                    <Link href="/login">Login</Link>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    asChild
                  >
                    <Link href="/register">Sign Up</Link>
                  </Button>
                </div>
              )}

              <div className="mt-2">
                <ModeToggle />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
