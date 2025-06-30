import { Button } from "@heroui/react";
import { LucidePanelLeft } from "lucide-react";
import React from "react";

import { useSidebarStore } from "~/store/sidebar-store";

interface SidebarTogglerProps {
  className?: string;
}
export default function SidebarToggler({ className }: SidebarTogglerProps) {
  const toggleSidebar = useSidebarStore((s) => s.toggleSidebar);

  return (
    <Button
      className={className}
      isIconOnly
      onPress={toggleSidebar}
      variant='light'
    >
      <LucidePanelLeft />
    </Button>
  );
}
