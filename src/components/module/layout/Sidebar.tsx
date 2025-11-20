"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { LogOut, User, Archive, BookOpen, ClipboardList } from "lucide-react";
import { usePathname } from "next/navigation";

const DashboardSidebar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  // ✅ Sidebar links
  const links = [
    { label: "Dashboard", href: "/dashboard", icon: ClipboardList },
    { label: "Logs", href: "/dashboard/logs", icon: BookOpen },
    { label: "Inventory", href: "/dashboard/inventory", icon: Archive },
    { label: "Resources", href: "/dashboard/resources", icon: BookOpen },
    { label: "Profile", href: "/dashboard/profile", icon: User },
  ];

  const isActive = (href: string) => pathname === href;

  // ✅ Logout handler
  const handleLogout = () => signOut({ callbackUrl: "/" });

  return (
    <Sidebar collapsible="icon" className="h-screen bg-white dark:bg-gray-900">
      {/* Header / Logo */}
      <SidebarHeader className="py-4 px-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/eco-bite-logo.png"
                  alt="EcoBite"
                  width={30}
                  height={30}
                />
                <span className="text-lg font-bold text-green-600">
                  EcoBite
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      {/* Sidebar content */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {links.map((item) => (
                <SidebarMenuItem
                  key={item.label}
                  className={
                    isActive(item.href) ? "bg-green-100 dark:bg-green-900" : ""
                  }
                >
                  <SidebarMenuButton asChild>
                    <Link href={item.href} className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* Logout */}
              <SidebarMenuItem
                onClick={handleLogout}
                className="text-red-600 hover:bg-red-100 dark:hover:bg-red-900"
              >
                <SidebarMenuButton asChild>
                  <button className="flex items-center gap-2">
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer / User Avatar */}
      <SidebarFooter className="px-2 py-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 w-full">
              <Avatar>
                <AvatarImage
                  src={session?.user?.image || "/default-avatar.png"}
                />
                <AvatarFallback>
                  {session?.user?.name?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm">{session?.user?.name || "User"}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleLogout}>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
