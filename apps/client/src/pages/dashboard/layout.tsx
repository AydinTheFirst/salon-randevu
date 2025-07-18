import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Link,
  Navbar,
  NavbarContent
} from "@heroui/react";
import { Icon } from "@iconify/react";
import {
  LucideBuilding2,
  LucideCalendar,
  LucideDollarSign,
  LucidePaperclip,
  LucidePieChart,
  LucideUser2
} from "lucide-react";
import React from "react";
import { useLocation } from "react-router";
import { Outlet } from "react-router";

import AcmeLogo from "~/components/logo";
import SidebarGroup from "~/components/sidebar/sidebar-group";
import SidebarItem from "~/components/sidebar/sidebar-item";
import SidebarToggler from "~/components/sidebar/sidebar-toggler";
import { useSidebarStore } from "~/store/sidebar-store";

const SIDEBAR_WIDTH = 280;

const adminMenuItems = [
  { href: "/dashboard", icon: LucidePieChart, label: "Anasayfa" },
  { href: "/dashboard/businesses", icon: LucideBuilding2, label: "İşletmeler" },
  { href: "/dashboard/services", icon: LucidePaperclip, label: "Hizmetler" },
  {
    href: "/dashboard/appointments",
    icon: LucideCalendar,
    label: "Randevular"
  },
  { href: "/dashboard/payments", icon: LucideDollarSign, label: "Ödemeler" },
  { href: "/dashboard/managers", icon: LucideUser2, label: "Yöneticiler" }
];

export default function Layout() {
  const isSidebarOpen = useSidebarStore((s) => s.isSidebarOpen);
  const { pathname } = useLocation();

  return (
    <div className='flex h-screen overflow-hidden'>
      <Card
        as={"aside"}
        className='h-full w-full'
        radius='none'
        style={{
          marginLeft: isSidebarOpen ? 0 : -SIDEBAR_WIDTH,
          transition: "margin-left 0.3s ease-in-out",
          width: SIDEBAR_WIDTH
        }}
      >
        <CardHeader>
          <AcmeLogo className='h-10 w-10' />
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
        <CardFooter>
          <SidebarItem startContent={<Icon icon='lucide:log-out' />}>
            Çıkış Yap
          </SidebarItem>
        </CardFooter>
      </Card>
      <main className='flex-1 overflow-auto'>
        <Navbar
          className='shadow'
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
