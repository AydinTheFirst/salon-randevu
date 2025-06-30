import { Button } from "@heroui/react";
import { LucideFilter } from "lucide-react";
import { useLoaderData } from "react-router";

import type { Pagination, Service } from "~/types";

import DataTable from "~/components/data-table";
import { http } from "~/lib/http";

export const clientLoader = async () => {
  const { data: services } = await http.get<Pagination<Service>>("/services", {
    params: { include: "business" }
  });

  return { services };
};

export default function Services() {
  const { services } = useLoaderData<typeof clientLoader>();

  const columns = [
    { key: "name", label: "Hizmet Adı" },
    { key: "price", label: "Fiyat" },
    { key: "business.name", label: "İşletme" }
  ];

  const items = services.items.map((s) => ({
    "business.name": s.business?.name ?? "-",
    key: s.id,
    name: s.name,
    price: `${s.price}₺`
  }));

  return (
    <div className='grid gap-5'>
      <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
        <h2 className='text-xl font-semibold'>Hizmetler</h2>
        <div className='flex justify-end'>
          <Button
            isIconOnly
            variant='light'
          >
            <LucideFilter />
          </Button>
        </div>
      </div>
      <DataTable
        columns={columns}
        items={items}
      />
    </div>
  );
}
