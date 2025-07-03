import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Navbar,
  NavbarContent
} from "@heroui/react";
import { Outlet } from "react-router-dom";


import SidebarGroup from "~/components/sidebar/sidebar-group";
import SidebarItem from "~/components/sidebar/sidebar-item";
import SidebarToggler from "~/components/sidebar/sidebar-toggler";
import { useSidebarStore } from "~/store/sidebar-store";

const SIDEBAR_WIDTH = 280;

export default function CustomerLayout() {
  const isSidebarOpen = useSidebarStore((s) => s.isSidebarOpen);

  return (
    <div className='flex overflow-hidden h-screen'>
      <aside
        className="h-full"
        style={{
          marginLeft: isSidebarOpen ? 0 : -SIDEBAR_WIDTH,
          transition: "margin-left 0.3s ease-in-out",
          width: SIDEBAR_WIDTH
        }}
      >
        <Card
          className='bg-content2 h-full w-full'
          radius='none'
          shadow='none'
        >
          <CardHeader>
            <h1 className='text-xl font-bold'>Yönetim Paneli</h1>
          </CardHeader>
          <CardBody>
            <SidebarGroup title='Menü'>
              <SidebarItem href='/dashboard'>Anasayfa</SidebarItem>
              {/* Active link for customers can be added here if needed, or managed by active route highlighting */}
              <SidebarItem href='/customers'>Müşteriler</SidebarItem>
              <SidebarItem href='/businesses'>İşletmeler</SidebarItem>
            </SidebarGroup>
          </CardBody>
        </Card>
      </aside>
      <Divider orientation='vertical' />
      <main className='flex-1 overflow-auto'>
        <Navbar
          className='bg-content2 sticky top-0 z-10' // Added sticky and z-index for navbar
          maxWidth='full'
        >
          <NavbarContent>
            <SidebarToggler />
          </NavbarContent>
        </Navbar>
        {/* Main content area for the customer page */}
        <div className="p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
