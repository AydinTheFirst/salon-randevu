import { Button, Link, Pagination } from "@heroui/react";
import { LucideFilter } from "lucide-react";
import { useLoaderData, useNavigate, useSearchParams } from "react-router";

import type { BusinessManager, Paginated } from "~/types";

import DataTable from "~/components/data-table";
import { http } from "~/lib/http";

import type { Route } from "./+types/page";

export const clientLoader = async ({
  params,
  request
}: Route.ClientLoaderArgs) => {
  const { searchParams } = new URL(request.url);

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const offset = (page - 1) * limit;

  const { data: managers } = await http.get<Paginated<BusinessManager>>(
    "/managers",
    {
      params: {
        businessId: params.bizId,
        include: "user,business",
        limit,
        offset
      }
    }
  );

  return { managers };
};

export default function Managers() {
  const navigate = useNavigate();
  const { managers } = useLoaderData<typeof clientLoader>();
  const [, setSearchParams] = useSearchParams();

  const columns = [
    { key: "user.email", label: "Yönetici" },
    { key: "business.name", label: "İşletme" },
    { key: "createdAt", label: "Atanma Tarihi" }
  ];

  const items = managers.items.map((m) => ({
    "business.name": m.business?.name ?? "-",
    createdAt: new Date(m.createdAt).toLocaleString(),
    key: m.id,
    "user.email": m.user?.email ?? "-"
  }));

  return (
    <div className='grid gap-5'>
      <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
        <h2 className='text-xl font-semibold'>Yöneticiler</h2>
        <div className='flex justify-end gap-2'>
          <Button
            as={Link}
            href='/dashboard/managers/create'
            variant='flat'
          >
            Ekle
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
        onRowAction={(row) => navigate(`/dashboard/managers/${row}`)}
      />
      <div className='flex justify-end'>
        <Pagination
          onChange={(page) =>
            setSearchParams((prev) => {
              prev.set("page", String(page));
              return prev;
            })
          }
          page={managers.meta.page}
          total={managers.meta.pageCount}
        />
      </div>
    </div>
  );
}
