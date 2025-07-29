import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Link,
  Navbar,
  NavbarContent
} from "@heroui/react";
import { Home, LogOut, LucideCalendar, LucideChevronLeft } from "lucide-react";
import { Outlet, useLoaderData } from "react-router";

import SidebarToggler from "~/components/sidebar/sidebar-toggler";
import { UserCard } from "~/components/user-card";
import { useAuth } from "~/hooks/use-auth";
import { logout } from "~/lib/auth";
import { http } from "~/lib/http";
import { useSidebarStore } from "~/store/sidebar-store";

import type { Route } from "./+types/page";

const SIDEBAR_WIDTH = 280;

const menuItems = [
  {
    badge: null,
    href: "/dashboard",
    icon: Home,
    label: "Dashboard"
  },
  {
    badge: null,
    href: "/manage/{bizId}/appointments",
    icon: LucideCalendar,
    label: "Randevular"
  }
];

export const clientLoader = async ({ params }: Route.ClientLoaderArgs) => {
  const { data: business } = await http.get(`/businesses/${params.bizId}`);
  return { business };
};

export default function DashboardLayout() {
  const { business } = useLoaderData<typeof clientLoader>();

  const isOpen = useSidebarStore((state) => state.isSidebarOpen);
  const { user } = useAuth();

  return (
    <div className='flex h-screen overflow-hidden bg-gray-50'>
      <Card
        className='border-0 shadow-lg'
        radius='none'
        style={{
          transition: "width 0.3s ease-in-out",
          width: isOpen ? SIDEBAR_WIDTH : 0
        }}
      >
        <CardHeader className='gap-3 border-b border-gray-100 px-6 py-4'>
          <Button
            as={Link}
            href='/dashboard/businesses'
            isIconOnly
            variant='light'
          >
            <LucideChevronLeft />
          </Button>
          <div>
            <h2 className='text-lg font-semibold text-gray-900'>
              {business?.name}
            </h2>
            <p className='text-xs text-gray-500'>Glow Point</p>
          </div>
        </CardHeader>
        <CardBody className='px-6 py-4'>
          <div className='space-y-1'>
            {menuItems.map((item) => (
              <Link
                className='flex items-center gap-3 rounded-lg p-3 text-gray-700 transition-all hover:bg-gray-50 hover:text-gray-900'
                href={item.href.replace("{bizId}", business?.id || "")}
                key={item.href}
              >
                <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-colors group-hover:bg-gray-200'>
                  <item.icon className='h-4 w-4' />
                </div>
                <span className='flex-1 font-medium'>{item.label}</span>
                {item.badge && (
                  <Chip
                    className='border border-blue-200 bg-blue-50 text-blue-600'
                    size='sm'
                    variant='flat'
                  >
                    {item.badge}
                  </Chip>
                )}
              </Link>
            ))}
          </div>
        </CardBody>
        <CardFooter className='border-t border-gray-100 px-6 py-4'>
          <Button
            className='w-full bg-gray-100 text-gray-600 hover:bg-gray-200'
            onPress={logout}
            size='sm'
            startContent={<LogOut className='h-4 w-4' />}
            variant='flat'
          >
            Çıkış Yap
          </Button>
        </CardFooter>
      </Card>
      <div className='flex-1 overflow-auto'>
        <Navbar
          className='border-b border-gray-100 bg-white shadow-sm'
          maxWidth='full'
        >
          <NavbarContent>
            <SidebarToggler />
          </NavbarContent>
          <NavbarContent justify='end'>
            <UserCard
              avatarProps={{
                name: user?.profile?.displayName
              }}
              description={user?.email}
              name={user?.profile?.displayName}
            />
          </NavbarContent>
        </Navbar>
        <main className='px-6 py-8'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
