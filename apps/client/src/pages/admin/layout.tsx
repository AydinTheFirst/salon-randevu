import { Divider, Navbar, NavbarContent } from "@heroui/react";
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
    <div className='flex h-screen overflow-hidden'>
      <aside
        className='bg-content2 flex h-full w-full flex-col gap-5 p-3'
        style={{
          marginLeft: isSidebarOpen ? 0 : -SIDEBAR_WIDTH,
          transition: "margin-left 0.3s ease-in-out",
          width: SIDEBAR_WIDTH
        }}
      >
        <div className='flex items-center justify-between'>
          <h1 className='text-lg font-semibold'>Yönetim Paneli</h1>
        </div>
        <div className='flex-1'>
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
        </div>
        <div>footer</div>
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
