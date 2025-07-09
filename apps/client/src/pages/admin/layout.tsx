import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Link,
  Navbar,
  NavbarContent
} from "@heroui/react";
import {
  LucideBuilding2,
  LucideCalendar,
  LucideDollarSign,
  LucideIdCard,
  LucidePaperclip,
  LucidePieChart,
  LucideUser2
} from "lucide-react";
import React from "react";
import { useLocation } from "react-router";
import { Outlet } from "react-router";

import SidebarGroup from "~/components/sidebar/sidebar-group";
import SidebarItem from "~/components/sidebar/sidebar-item";
import SidebarToggler from "~/components/sidebar/sidebar-toggler";
import { useSidebarStore } from "~/store/sidebar-store";

const SIDEBAR_WIDTH = 280;

const adminMenuItems = [
  { href: "/admin", icon: LucidePieChart, label: "Anasayfa" },
  { href: "/admin/users", icon: LucideUser2, label: "Kullanıcılar" },
  { href: "/admin/profiles", icon: LucideIdCard, label: "Profiller" },
  { href: "/admin/businesses", icon: LucideBuilding2, label: "İşletmeler" },
  { href: "/admin/services", icon: LucidePaperclip, label: "Hizmetler" },
  { href: "/admin/appointments", icon: LucideCalendar, label: "Randevular" },
  { href: "/admin/payments", icon: LucideDollarSign, label: "Ödemeler" },
  { href: "/admin/managers", icon: LucideUser2, label: "Yöneticiler" }
];

export default function Layout() {
  const isSidebarOpen = useSidebarStore((s) => s.isSidebarOpen);
  const { pathname } = useLocation();

  return (
    <div className='flex h-screen overflow-hidden'>
      <Card
        as={"aside"}
        className='flex h-full w-full'
        style={{
          marginLeft: isSidebarOpen ? 0 : -SIDEBAR_WIDTH,
          transition: "margin-left 0.3s ease-in-out",
          width: SIDEBAR_WIDTH
        }}
      >
        <CardHeader>
          <div className='flex items-center justify-between'>
            <h1 className='text-lg font-semibold'>Admin Paneli</h1>
          </div>
        </CardHeader>
        <CardBody>
          <SidebarGroup title='Menü'>
            {adminMenuItems.map(({ href, icon, label }) => (
              <SidebarItem
                as={Link}
                href={href}
                isDisabled={pathname === href}
                key={href}
                startContent={React.createElement(icon, {
                  className: "h-4 w-4"
                })}
              >
                {label}
              </SidebarItem>
            ))}
          </SidebarGroup>
        </CardBody>
      </Card>

      <Divider orientation='vertical' />
      <main className='flex-1 overflow-auto'>
        <Navbar
          className=''
          maxWidth='full'
        >
          <NavbarContent>
            <SidebarToggler />
          </NavbarContent>
        </Navbar>
        <div className='container py-10'>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
