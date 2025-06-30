import { Button, Pagination } from "@heroui/react";
import { LucideFilter } from "lucide-react";
import { useLoaderData, useSearchParams } from "react-router";

import type { Paginated, Service } from "~/types";

import DataTable from "~/components/data-table";
import { http } from "~/lib/http";

export const clientLoader = async ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page")) || 1;
  const limit = Number(url.searchParams.get("limit")) || 10;
  const offset = (page - 1) * limit;

  const { data: services } = await http.get<Paginated<Service>>("/services", {
    params: {
      include: "business",
      limit,
      offset
    }
  });

  return { services };
};

export default function Services() {
  const { services } = useLoaderData<typeof clientLoader>();
  const [, setSearchParams] = useSearchParams();

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

      <div className='flex justify-end'>
        <Pagination
          onChange={(page) => {
            setSearchParams((prev) => {
              prev.set("page", String(page));
              return prev;
            });
          }}
          page={services.meta.page}
          total={services.meta.pageCount}
        />
      </div>
    </div>
  );
}
