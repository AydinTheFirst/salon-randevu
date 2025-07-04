import { Tab, Tabs } from "@heroui/react";
import { Outlet, useLocation, useParams } from "react-router";

export default function Layout() {
  const { bizId } = useParams<{ bizId: string }>();
  const { pathname } = useLocation();

  const items = [
    {
      href: `/dashboard/businesses/${bizId}`,
      title: "İşletmeyi Düzenle"
    },
    {
      href: `/dashboard/businesses/${bizId}/managers`,
      title: "Yöneticiler"
    },
    {
      href: `/dashboard/businesses/${bizId}/services`,
      title: "Hizmetler"
    },
    {
      href: `/dashboard/businesses/${bizId}/appointments`,
      title: "Randevular"
    },
    {
      href: `/dashboard/businesses/${bizId}/payments`,
      title: "Ödemeler"
    },
    {
      href: `/dashboard/businesses/${bizId}/reports`,
      title: "Raporlar"
    }
  ];

  return (
    <div className='grid gap-5'>
      <Tabs
        items={items}
        selectedKey={pathname}
      >
        {(item) => (
          <Tab
            href={item.href}
            key={item.href}
            title={item.title}
          />
        )}
      </Tabs>
      <Outlet />
    </div>
  );
}
