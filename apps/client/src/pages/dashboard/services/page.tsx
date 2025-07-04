import { Button, Pagination } from "@heroui/react";
import { LucideFilter } from "lucide-react";
import { useLoaderData, useNavigate, useSearchParams } from "react-router";

import DataTable from "~/components/data-table";
import { http } from "~/lib/http";
import { type Paginated, type Service } from "~/types";

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
  const navigate = useNavigate();
  const { services } = useLoaderData<typeof clientLoader>();
  const [, setSearchParams] = useSearchParams();

  const columns = [
    { key: "name", label: "Hizmet Adı" },
    { key: "price", label: "Fiyat" },
    { key: "duration", label: "Süre (dakika)" },
    { key: "business.name", label: "İşletme" }
  ];

  const items = services.items.map((s) => ({
    "business.name": s.business?.name ?? "-",
    duration: s.duration,
    key: s.id,
    name: s.name,
    price: `${s.price}₺`
  }));

  return (
    <div className='grid gap-5'>
      <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
        <h2 className='text-xl font-semibold'>Hizmetler</h2>
        <div className='flex justify-end gap-2'>
          <Button
            onPress={() => navigate("/dashboard/services/create")}
            variant='flat'
          >
            Yeni Hizmet Ekle
          </Button>

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
        onRowAction={(key) => navigate(`/dashboard/services/${key}`)}
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
