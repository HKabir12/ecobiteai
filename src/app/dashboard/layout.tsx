"use client";

import { ReactNode, useEffect } from "react";
import DashboardSidebar from "@/components/module/layout/Sidebar";
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/module/utilities/Loader";
import { SidebarIcon } from "lucide-react";
// Make sure you have a Loader component

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <Loader />; // show loading state while session is checked
  }

  if (!session) return null; // prevent rendering if not logged in

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider defaultOpen={true}>
        <DashboardSidebar />

        <main className="w-full ">
          <SidebarIcon></SidebarIcon>
          <div className="px-4">{children}</div>
        </main>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default DashboardLayout;
