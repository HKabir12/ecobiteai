"use client";
import { ModeToggle } from "@/components/theme/theme-btn";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";


const SidebarIcon = () => {
  return (
    <div className="p-2 flex items-center justify-between sticky top-0 bg-background z-10">
      <SidebarTrigger></SidebarTrigger>

      <div>
        <DropdownMenu>
          <ModeToggle />
        </DropdownMenu>
      </div>
    </div>
  );
};

export default SidebarIcon;
