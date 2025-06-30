import { Button } from "@heroui/react";
import { LucideFilter } from "lucide-react";
// routes/admin/managers.tsx
import { useLoaderData, useNavigate } from "react-router";

import type { BusinessManager, Pagination } from "~/types";

import DataTable from "~/components/data-table";
import { http } from "~/lib/http";

export const clientLoader = async () => {
  const { data: managers } = await http.get<Pagination<BusinessManager>>(
    "/managers",
    {
      params: { include: "user,business" }
    }
  );

  return { managers };
};

export default function Managers() {
  const navigate = useNavigate();
  const { managers } = useLoaderData<typeof clientLoader>();

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
        onRowAction={(row) => navigate(`/admin/managers/${row}`)}
      />
    </div>
  );
}
