import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Navbar,
  NavbarContent
} from "@heroui/react";
import { Outlet } from "react-router";

import SidebarGroup from "~/components/sidebar/sidebar-group";
import SidebarItem from "~/components/sidebar/sidebar-item";
import SidebarToggler from "~/components/sidebar/sidebar-toggler";
import { useSidebarStore } from "~/store/sidebar-store";

const SIDEBAR_WIDTH = 280;

const adminMenuItems = [
  { href: "/admin", label: "Anasayfa" },
  { href: "/admin/users", label: "Kullanıcılar" },
  { href: "/admin/profiles", label: "Profiller" },
  { href: "/admin/businesses", label: "İşletmeler" },
  { href: "/admin/services", label: "Hizmetler" },
  { href: "/admin/appointments", label: "Randevular" },
  { href: "/admin/payments", label: "Ödemeler" },
  { href: "/admin/managers", label: "Yöneticiler" }
];

export default function Layout() {
  const isSidebarOpen = useSidebarStore((s) => s.isSidebarOpen);

  return (
    <div className='flex overflow-hidden'>
      <aside
        style={{
          marginLeft: isSidebarOpen ? 0 : -SIDEBAR_WIDTH,
          transition: "margin-left 0.3s ease-in-out",
          width: SIDEBAR_WIDTH
        }}
      >
        <Card
          className='bg-content2 h-screen w-full'
          radius='none'
          shadow='none'
        >
          <CardHeader>
            <h1 className='text-xl font-bold'>Admin Paneli</h1>
          </CardHeader>
          <CardBody>
            <SidebarGroup title='Menü'>
              {adminMenuItems.map(({ href, label }) => (
                <SidebarItem
                  href={href}
                  key={href}
                >
                  {label}
                </SidebarItem>
              ))}
            </SidebarGroup>
          </CardBody>
        </Card>
      </aside>
      <Divider orientation='vertical' />
      <main className='flex-1 overflow-auto'>
        <Navbar
          className='bg-content2'
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
